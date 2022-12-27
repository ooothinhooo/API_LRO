const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const User = require("../../models/User.js");
const Docs = require("../../models/docs.models.js");
const { StatusCode } = require("../../utils/constants.js");
const { jsonGenerate } = require("../../utils/helpers.js");

const CreateDoc = async (req, res) => {
  const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET;

  try {
    const result = await Docs.create({
      userId: req.userId,
      title: req.body.title,
      tag: req.body.tag,
      nameTag: req.body.nameTag,
      dataURL: req.body.dataURL,
      creater: req.body.creater,
      createrId: req.body.createrId,
      createrPhoto: req.body.createrPhoto,
      isPrivate: req.body.isPrivate,
    });

    if (result) {
      const user = await User.findOneAndUpdate(
        { _id: req.userId },
        {
          $push: { docs: result },
        }
      );
      return res.json(
        jsonGenerate(StatusCode.SUCCESS, "Docs created Succssfully", result)
      );
    }
  } catch (error) {
    return res.json(
      jsonGenerate(
        StatusCode.UNPROCESSABLE_ENTITY,
        "Something went wrong",
        error
      )
    );
  }
};
module.exports = CreateDoc;
