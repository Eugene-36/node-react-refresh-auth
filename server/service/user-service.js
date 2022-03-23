const UserModel = require('../models/user-models.js');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service.js');
const tokenService = require('./token-srvice');
const UserDto = require('../dtos/user-dto.js');
const ApiError = require('../exceptions/api-error.js');

class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email });

    if (candidate) {
      throw ApiError.BadRequest(
        `Пользователь с почтовым адресом ${email} уже существует`
      );
    }

    const hashedPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();
    const user = await UserModel.create({
      email,
      password: hashedPassword,
      activationLink,
    });
    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`
    );

    const userDto = new UserDto(user); // id, email, isActivated

    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }
  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest('Некорректная ссылка активации');
    }

    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    //Находим пользователя и убеждаемся что он существует у нас в базе
    const user = await UserModel.findOne({ email });
    // Выдаём ошибку если пользователь не найден
    if (!user) {
      throw ApiError.BadRequest('Пользователь с таким email не найден');
    }

    // Сравниваем пароль который нам
    //отправил пользователь с паролем который у нас в базе
    const isPassEquals = await bcrypt.compare(password, user.password);

    //Проверка если пароли не верны
    if (!isPassEquals) {
      throw ApiError.BadRequest('Неверный пароль');
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromOb = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromOb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user); // id, email, isActivated

    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }
}

module.exports = new UserService();
