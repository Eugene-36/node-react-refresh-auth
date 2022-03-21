module.exports = class UserDto {
  email;
  id;
  isActivated;

  constructor(model) {
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;

    // console.log('model', model.isActivated);
    // 'this.isActivated' - у нас тут false
  }
};
