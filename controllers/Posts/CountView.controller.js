const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const User = require("../../models/User.js");
const Posts = require("../../models/posts.models.js");
const { StatusCode } = require("../../utils/constants.js");
const { jsonGenerate } = require("../../utils/helpers.js");

const CountViewPost = async (req, res) => {
  try {
    const { post_id } = req.body;
    const post = await Posts.findById(post_id);
    const updatedPost = await Posts.findByIdAndUpdate(
      { _id: post_id },
      { view: post.view + 1 },
      { new: true }
    );
    return res.json(jsonGenerate(StatusCode.SUCCESS, "View Succssfully"));
  } catch (error) {
    return res.status(500).json("Internal server error ");
  }
};
module.exports = CountViewPost;
