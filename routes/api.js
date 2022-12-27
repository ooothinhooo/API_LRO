const express = require("express");
// const Login = require("../controllers/Account/Login.controller.js");
// const Register = require("../controllers/Account/Register.controller.js");
const { LoginSchema } = require("../validatonSchema/LoginSchema.js");
const { RegisterSchema } = require("../validatonSchema/RegisterSchema.js");
const auth = require("../controllers/auth.controller.js");
//! router
const apiRoute = express.Router();
//* acc
apiRoute.post("/register", RegisterSchema, auth.Register);
apiRoute.post("/login", LoginSchema, auth.Login);
module.exports = apiRoute;
