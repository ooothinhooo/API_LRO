const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const { StatusCode } = require("../utils/constants.js");
const { jsonGenerate } = require("../utils/helpers.js");

exports.Login = async (req, res) => {
  const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET;

  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.json(
        jsonGenerate(
          StatusCode.UNPROCESSABLE_ENTITY,
          "Username or password is incorrect"
        )
      );
    }

    const verified = bcrypt.compareSync(password, user.password);

    if (!verified) {
      return res.json(
        jsonGenerate(
          StatusCode.UNPROCESSABLE_ENTITY,
          "Username or password is incorrect"
        )
      );
    }

    const token = Jwt.sign({ userId: user._id }, JWT_TOKEN_SECRET);

    return res.json(
      jsonGenerate(StatusCode.SUCCESS, "Login Successful", {
        userId: user._id,
        uid: user.uid,
        username: username,
        email: user.email,
        photoURL: user.photoURL,
        access: user.access,
        token: token,
      })
    );
  }

  res.json(
    jsonGenerate(
      StatusCode.VALIDATION_ERROR,
      "Validatiion error",
      errors.mapped()
    )
  );
};

exports.Register = async (req, res) => {
  const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET;
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const { uid, form, username, email, password, photoURL } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const userExist = await User.findOne({
      $or: [
        {
          email: email,
        },
        {
          username: username,
        },
      ],
    });

    //!User or Email already exists
    if (userExist) {
      return res.json(
        jsonGenerate(
          StatusCode.UNPROCESSABLE_ENTITY,
          "User or Email already exists"
        )
      );
    }
    //! save to db
    try {
      const result = await User.create({
        uid: uid,
        form: form,
        username: username,
        email: email,
        password: hashPassword,
        photoURL: photoURL,
      });

      const token = Jwt.sign({ userId: result._id }, JWT_TOKEN_SECRET);
      //! Registration successful
      res.json(
        jsonGenerate(StatusCode.SUCCESS, "Registration successful", {
          userId: result._id,
          token: token,
        })
      );
    } catch (error) {
      console.log(error);
    }
  } else {
    res.json(
      jsonGenerate(
        StatusCode.VALIDATION_ERROR,
        "Validation error",
        errors.mapped()
      )
    );
  }
};
