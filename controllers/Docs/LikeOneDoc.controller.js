const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const User = require("../../models/User.js");
const Docs = require("../../models/docs.models.js");
const { StatusCode } = require("../../utils/constants.js");
const { jsonGenerate } = require("../../utils/helpers.js");

const LikeOneDoc = async (req, res) => {
  try {
    const { docs_id, photoURL } = req.body;
    try {
      const post = await Docs.findById(docs_id);
      if (!post.like.includes(photoURL)) {
        // if (post.dislike.includes(photoURL)) {
        //   await post.updateOne({ $pull: { dislike: photoURL } });
        // }
        await post.updateOne({ $push: { like: photoURL } });

        return res.json(jsonGenerate(StatusCode.SUCCESS, "Like Succssfully"));
      } else {
        await post.updateOne({ $pull: { like: photoURL } });
        return res.json(jsonGenerate(StatusCode.SUCCESS, "UnLike Succssfully"));
      }
    } catch (error) {
      return res.status(500).json("Internal server error ");
    }

    // if (arr) {
    //   const user = await Docs.findOneAndUpdate(
    //     { _id: docs_id },
    //     {
    //       $push: { like: { photoURL } },
    //     }
    //   );
    //   return res.json(jsonGenerate(StatusCode.SUCCESS, "Like Succssfully"));
    // } else {
    //   const user = await Docs.findOneAndUpdate(
    //     { _id: docs_id },
    //     {
    //       $pull: { like: { photoURL } },
    //     }
    //   );
    //   return res.json(jsonGenerate(StatusCode.SUCCESS, "UnLike Succssfully"));
    // }
  } catch (error) {}
};
module.exports = LikeOneDoc;
