const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const User = require("../../models/User.js");
const Posts = require("../../models/posts.models.js");

const { StatusCode } = require("../../utils/constants.js");
const { jsonGenerate } = require("../../utils/helpers.js");

const FindOnePost = async (req, res) => {
  try {
    const { post_id } = req.body;
    const list = await Posts.findById({
      _id: post_id,
    });

    return res.json(jsonGenerate(StatusCode.SUCCESS, "All Posts List", list));
  } catch (error) {
    return res.json(
      jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Error", error)
    );
  }
};

module.exports = FindOnePost;
