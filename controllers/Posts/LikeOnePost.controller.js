const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const User = require("../../models/User.js");
const Posts = require("../../models/posts.models.js");

const { StatusCode } = require("../../utils/constants.js");
const { jsonGenerate } = require("../../utils/helpers.js");

const LikeOnePost = async (req, res) => {
  try {
    const { post_id, photoURL } = req.body;
    try {
      const list = await Posts.findById(post_id);
      if (!list.like.includes(photoURL)) {
        // if (post.dislike.includes(photoURL)) {
        //   await post.updateOne({ $pull: { dislike: photoURL } });
        // }
        await list.updateOne({ $push: { like: photoURL } });

        return res.json(jsonGenerate(StatusCode.SUCCESS, "Like Succssfully"));
      } else {
        await list.updateOne({ $pull: { like: photoURL } });
        return res.json(jsonGenerate(StatusCode.SUCCESS, "UnLike Succssfully"));
      }
    } catch (error) {
      return res.status(500).json("Internal server error ");
    }
  } catch (error) {}
};
module.exports = LikeOnePost;
