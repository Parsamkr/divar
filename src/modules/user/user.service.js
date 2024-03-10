const createHttpError = require("http-errors");
const UserModel = require("./user.model");
const { userMessage } = require("./user.messages");
const autoBind = require("auto-bind");

class userService {
  #model;
  constructor() {
    autoBind(this);
    this.#model = UserModel;
  }
}

module.exports = new userService();
