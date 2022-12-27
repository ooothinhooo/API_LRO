const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const User = require("../../models/User.js");
const Posts = require("../../models/posts.models.js");
const { StatusCode } = require("../../utils/constants.js");
const { jsonGenerate } = require("../../utils/helpers.js");

const PostsList = async (req, res) => {
  try {
    const list = await User.findById(req.userId)
      .select("-password")
      .populate("posts")
      .exec();

    return res.json(jsonGenerate(StatusCode.SUCCESS, "All todo list", list));
  } catch (error) {
    return res.json(
      jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Error", error)
    );
  }
};

module.exports = PostsList;
