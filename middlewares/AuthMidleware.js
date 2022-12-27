const { StatusCode } = require("../utils/constants.js");
const { jsonGenerate } = require("../utils/helpers.js");
const Jwt = require("jsonwebtoken");
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const AuthMiddleware = (req, res, next) => {
  const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET;

  if (req.headers["auth"] === undefined) {
    return res.json(jsonGenerate(StatusCode.AUTH_ERROR, "Access Denied"));
  }

  const token = req.headers["auth"];

  try {
    const decoded = Jwt.verify(token, JWT_TOKEN_SECRET);
    console.log(decoded);

    req.userId = decoded.userId;

    return next();
  } catch (error) {
    return res.json(
      jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Invalid Token")
    );
  }
};

// export default AuthMiddleware;
module.exports = AuthMiddleware;
