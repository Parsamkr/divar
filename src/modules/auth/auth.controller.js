const autoBind = require("auto-bind");
const authService = require("./auth.service");
const { authMessage } = require("./auth.messages");

class authController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = authService;
  }
  async sendOTP(req, res, next) {
    try {
      require("crypto").randomBytes(48, function (err, buffer) {
        var token = buffer.toString("hex");
        console.log(token);
      });
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
      return res.json({ message: authMessage.loginSuccessfully, token });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new authController();
