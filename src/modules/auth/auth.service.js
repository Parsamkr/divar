const createHttpError = require("http-errors");
const UserModel = require("../user/user.model");
const { authMessage } = require("./auth.messages");
const { randomInt } = require("crypto");
const autoBind = require("auto-bind");
const jwt = require("jsonwebtoken");

class authService {
  #model;
  constructor() {
    autoBind(this);
    this.#model = UserModel;
  }

  async sendOTP(mobile) {
    const now = Date.now();
    const otp = {
      code: randomInt(10000, 99999),
      expiresIn: now + 1000 * 60 * 2,
    };

    const user = await this.#model.findOne({ mobile });
    if (!user) {
      const newUser = await this.#model.create({ mobile, otp });
      return newUser;
    }
    if (user.otp && user.otp.expiresIn > now) {
      throw new createHttpError.BadRequest(authMessage.otpCodeNotExpired);
    }

    user.otp = otp;
    await user.save();
    return user;
  }

  async checkOTP(mobile, code) {
    const user = await this.checkExistByMobile(mobile);
    const now = Date.now();
    if (user?.otp?.expiresIn < now)
      throw new createHttpError.Unauthorized(authMessage.otpCodeExpired);
    if (user?.otp?.code !== code)
      throw new createHttpError.Unauthorized(authMessage.otpCodeIsIncorrect);
    if (!user?.verifiedMobile) {
      user.verifiedMobile = true;
      await user.save();
    }
    const accessToken = this.signToken({ mobile, id: user._id });
    return accessToken;
  }

  async checkExistByMobile(mobile) {
    const user = await this.#model.findOne({ mobile });
    if (!user) throw new createHttpError.NotFound(authMessage.notFound);
    return user;
  }

  signToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1y" });
  }
}

module.exports = new authService();
