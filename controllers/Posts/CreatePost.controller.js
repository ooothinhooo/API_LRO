const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const User = require("../../models/User.js");
const Posts = require("../../models/posts.models.js");
const { StatusCode } = require("../../utils/constants.js");
const { jsonGenerate } = require("../../utils/helpers.js");

const CreatePost = async (req, res) => {
  const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET;

  try {
    const result = await Posts.create({
      userId: req.userId,
      title: req.body.title,
      tag: req.body.tag,
      nameTag: req.body.nameTag,
      desc: req.body.desc,
      creater: req.body.creater,
      createrId: req.body.createrId,
      createrPhoto: req.body.createrPhoto,
      isPrivate: req.body.isPrivate,
    });

    if (result) {
      const user = await User.findOneAndUpdate(
        { _id: req.userId },
        {
          $push: { posts: result },
        }
      );
      return res.json(
        jsonGenerate(StatusCode.SUCCESS, "Posts created Succssfully", result)
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
module.exports = CreatePost;
