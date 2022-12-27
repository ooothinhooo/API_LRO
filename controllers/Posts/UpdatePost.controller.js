const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const User = require("../../models/User.js");
const Posts = require("../../models/posts.models.js");
const { StatusCode } = require("../../utils/constants.js");
const { jsonGenerate } = require("../../utils/helpers.js");

const UpdatePost = async (req, res) => {
  const newPost = ({ post_id, title, desc, tag, nameTag } = req.body);
  try {
    const result = await Posts.findByIdAndUpdate(post_id, newPost);
    return res.json(
      jsonGenerate(StatusCode.SUCCESS, "Update Succssfully", newPost)
    );
  } catch (error) {
    return res.status(500).json("Internal server error ");
  }
};
module.exports = UpdatePost;
