const autoBind = require("auto-bind");
const authService = require("./auth.service");
const { authMessage } = require("./auth.messages");
const NodeEnv = require("../../common/constant/env.enum");

class authController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = authService;
  }
  async sendOTP(req, res, next) {
    try {
      const { mobile } = req.body;
      await this.#service.sendOTP(mobile);
      return res.json({ message: authMessage.sendOtpSuccessfully });
    } catch (error) {
      next(error);
    }
  }

  async checkOTP(req, res, next) {
    try {
      const { mobile, code } = req.body;
      const token = await this.#service.checkOTP(mobile, code);
      return res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === NodeEnv.PRODUCTION,
        })
        .status(200)
        .json({ message: authMessage.loginSuccessfully, token });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new authController();
