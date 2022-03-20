const userService = require('../service/user-service');

class UserControllers {
  async registration(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.registration(email, password);

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      console.log('controllers error:', e.message);
    }
  }

  async login(req, res, next) {
    try {
    } catch (e) {
      console.log('controllers error:', e.message);
    }
  }

  async logout(req, res, next) {
    try {
    } catch (e) {
      console.log('controllers error:', e.message);
    }
  }

  async activate(req, res, next) {
    try {
    } catch (e) {
      console.log('controllers error:', e.message);
    }
  }

  async refresh(req, res, next) {
    try {
    } catch (e) {
      console.log('controllers error:', e.message);
    }
  }

  async getUsers(req, res, next) {
    try {
    } catch (e) {
      console.log('controllers error:', e.message);
    }
  }
}

module.exports = new UserControllers();
