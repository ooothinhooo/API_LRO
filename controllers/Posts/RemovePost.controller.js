const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const User = require("../../models/User.js");
const Posts = require("../../models/posts.models.js");

const { StatusCode } = require("../../utils/constants.js");
const { jsonGenerate } = require("../../utils/helpers.js");

const RemovePost = async (req, res) => {
  try {
    const result = await Posts.findOneAndDelete({
      userId: req.userId,
      _id: req.body.post_id,
    });

    if (result) {
      const user = await User.findOneAndUpdate(
        { _id: req.userId },
        { $pull: { docs: req.body.post_id } }
      );

      return res.json(
        jsonGenerate(StatusCode.SUCCESS, "Post deleted Successfully", null)
      );
    }
  } catch (error) {
    return res.json(
      jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Could not delete", null)
    );
  }
};

module.exports = RemovePost;
