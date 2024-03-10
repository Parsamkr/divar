const createHttpError = require("http-errors");
const authrizationMessage = require("../messages/auth.message");
const jwt = require("jsonwebtoken");
const UserModel = require("../../modules/user/user.model");
const { AccessToken } = require("../constant/cookie.enum");

require("dotenv").config();

const authorization = async (req, res, next) => {
  try {
    const token = req?.cookies?.[AccessToken];
    if (!token) {
      throw new createHttpError.Unauthorized(authrizationMessage.login);
    }
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (typeof data === "object" && "id" in data) {
      const user = await UserModel.findById(data.id, {
        otp: 0,
        verifiedMobile: 0,
        __v: 0,
        updatedAt: 0,
      }).lean();
      if (!user) {
        throw new createHttpError.Unauthorized(
          authrizationMessage.notFoundAccount
        );
      }
      req.user = user;
      return next();
    }
    throw new createHttpError.Unauthorized(authrizationMessage.invalidToken);
  } catch (error) {
    next(error);
  }
};
module.exports = authorization;
