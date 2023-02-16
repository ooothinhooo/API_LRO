// import { check } from "express-validator";
const { check } = require("express-validator");

const LoginSchema = [
  check("password", "password more than 6 degits").isLength({ min: 6 }),
];

module.exports = { LoginSchema };
