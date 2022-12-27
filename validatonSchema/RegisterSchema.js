// import { check } from "express-validator";
const { check } = require("express-validator");
// const RegisterSchema = [check("email", "email is required").exists().isEmail()];
// module.exports = RegisterSchema;
// let validateRegisterUser = () => {
//   return [
   
//   ];
// };
// let RegisterSchema = {
//   validateRegisterUser: validateRegisterUser,
//   // validateLogin: validateLogin
// };
const RegisterSchema =[
  check("username", "username does not Empty").not().isEmpty(),
  check("username", "username more than 6 degits").isLength({ min: 6 }),
  check("email", "Invalid does not Empty").not().isEmpty(),
  check("email", "Invalid email").isEmail(),
  check("password", "password more than 6 degits").isLength({ min: 6 }),
]
module.exports = { RegisterSchema };