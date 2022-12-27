const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const Posts = require("../models/posts.models.js");
const { StatusCode } = require("../utils/constants.js");
const { jsonGenerate } = require("../utils/helpers.js");

//* Create Post
exports.CreatePost = async (req, res) => {
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

//* update post
exports.UpdatePost = async (req, res) => {
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
//* Remove post
exports.RemovePost = async (req, res) => {
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
//* like post
exports.LikeOnePost = async (req, res) => {
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
//* count view post
exports.CountViewPost = async (req, res) => {
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
//* post list => trả vể danh sách theo user đã tải lên
exports.PostsList = async (req, res) => {
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
//* Get all post
exports.GetAllPostList = async (req, res) => {
  try {
    const post = await Posts.find();
    res.status(200).send({ data: post });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};
//* find one post
exports.FindOnePost = async (req, res) => {
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
//* Pagination post => phân trang
exports.PaginationPost = async (req, res) => {
  const PAGE_SIZE = 10;
  try {
    var page = req.query.page;
    if (page) {
      page = parseInt(page);
      if (page < 1) page = 1;
      var skip = (page - 1) * PAGE_SIZE;
      Posts.find({})
        .skip(skip)
        .limit(PAGE_SIZE)
        .then((data) => {
          res.json(data);
        });
    } else {
      return res.json(
        jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Lỗi Truy Vấn", error)
      );
    }
  } catch (error) {
    return res.json(
      jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Error", error)
    );
  }
};
