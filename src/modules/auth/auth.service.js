const createHttpError = require("http-errors");
const UserModel = require("../user/user.model");
const { authMessage } = require("./auth.messages");
const { randomInt } = require("crypto");
const autoBind = require("auto-bind");

class authService {
  #model;
  constructor() {
    autoBind(this);
    this.#model = UserModel;
  }

  async sendOTP(mobile) {
    const now = new Date.now();
    const otp = {
      code: randomInt(10000, 99999),
      expiresIn: now + 1000 * 60 * 20,
    };

    const user = await this.#model.findOne({ mobile });
    if (!user) {
      const newUser = await this.#model.create({ mobile, otp });
      return newUser;
    }
    if (user.otp && user.otp.expiresIn > now) {
      throw new createHttpError.BadRequest(authMessage.otpCodeNotexpired);
    }

    user.otp = otp;
    await user.save();
    return user;
  }

  async checkOTP(mobile, code) {}
  async checkExistByMobile(mobile) {
    const user = await this.#model.findOne({ mobile });
    if (!user) throw new createHttpError.NotFound(authMessage.notFound);
    return user;
  }
}

module.exports = new authService();
