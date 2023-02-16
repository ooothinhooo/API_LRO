const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const Article = require("../models/articles.models.js");
const { StatusCode } = require("../utils/constants.js");
const { jsonGenerate } = require("../utils/helpers.js");

//* Create Post
exports.CreateArt = async (req, res) => {
  const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET;

  try {
    const result = await Article.create({
      userId: req.userId,
      title: req.body.title,
      tag: req.body.tag,
      content: req.body.content,
      creatorsName: req.body.creatorsName,
      creatorsId: req.body.creatorsId,
      creatorsPhoto: req.body.creatorsPhoto,
      isPrivate: req.body.isPrivate,
    });

    if (result) {
      const user = await User.findOneAndUpdate(
        { _id: req.userId },
        {
          $push: { articles: result },
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
exports.UpdateArt = async (req, res) => {
  const newPost = ({ _id, title, content, tag, isPrivate } = req.body);
  try {
    const result = await Article.findByIdAndUpdate(_id, newPost);
    return res.json(
      jsonGenerate(StatusCode.SUCCESS, "Update Succssfully", newPost)
    );
  } catch (error) {
    return res.status(500).json("Internal server error ");
  }
};
//* Remove post
exports.RemoveArt = async (req, res) => {
  try {
    const result = await Article.findOneAndDelete({
      userId: req.userId,
      _id: req.body._id,
    });

    if (result) {
      const user = await User.findOneAndUpdate(
        { _id: req.userId },
        { $pull: { docs: req.body._id } }
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
exports.InteractArt = async (req, res) => {
  try {
    const { _id, photoURL } = req.body;
    try {
      const list = await Article.findById(_id);
      if (!list.like.includes(photoURL)) {
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

//* isPrivate post
exports.SetIsPrivateArt = async (req, res) => {
  try {
    const { _id } = req.body;
    try {
      const list = await Article.findById(_id);
      if (list.isPrivate == true) {
        await list.updateOne({ isPrivate: false });
        return res.json(jsonGenerate(StatusCode.SUCCESS, "Like Succssfully"));
      } else {
        await list.updateOne({ isPrivate: true });
        return res.json(jsonGenerate(StatusCode.SUCCESS, "UnLike Succssfully"));
      }
    } catch (error) {
      return res.status(500).json("Internal server error ");
    }
  } catch (error) {}
};

//* count view post
exports.CountViewArt = async (req, res) => {
  try {
    const { _id } = req.body;
    const art = await Article.findById(_id);
    const updatedPost = await Article.findByIdAndUpdate(
      { _id: _id },
      { view: art.view + 1 },
      { new: true }
    );
    return res.json(jsonGenerate(StatusCode.SUCCESS, "View Succssfully"));
  } catch (error) {
    return res.status(500).json("Internal server error ");
  }
};

//* find one post
exports.FindOneArt = async (req, res) => {
  try {
    const { _id } = req.body;
    const list = await Article.findById({
      _id: _id,
    });

    return res.json(jsonGenerate(StatusCode.SUCCESS, "All Posts List", list));
  } catch (error) {
    return res.json(
      jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Error", error)
    );
  }
};
//* Pagination post => phân trang
exports.PaginationArt = async (req, res) => {
  const PAGE_SIZE = 10;
  try {
    var page = req.query.page;
    if (page) {
      page = parseInt(page);
      if (page < 1) page = 1;
      var skip = (page - 1) * PAGE_SIZE;
      Article.find({})
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

//* Get All HIGHLIGHTS ARTICLE
//! hiện thị tất cả HIGHLIGHTS ARTICLE không cần auth
exports.HighLightArt = async (req, res) => {
  try {
    var SIZE = req.query.s;
    const doc = await Article.find();
    const arr = doc.sort(function (a, b) {
      if (a.view > b.view) return -1;
      return 1;
    });
    const data = arr.slice(0, SIZE);
    res.status(200).send({ data: data });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

//* Get post list pagination
//! Trả về kết quả theo page do user đăng tải
exports.ArtListForUserId = async (req, res) => {
  const PAGE_SIZE = 10;
  try {
    var page = req.query.page;
    page = parseInt(page);
    if (page) {
      if (page < 1) page = 1;
      var skip = (page - 1) * PAGE_SIZE;
      const infoCreators = await User.findById(req.userId)
        .select("-password")
        .exec();
      const count = infoCreators.articles.length;
      const id = infoCreators._id;
      const ArtList = await Article.find({ userId: id })
        .skip(skip)
        .limit(PAGE_SIZE);

      res.json(
        jsonGenerate(StatusCode.SUCCESS, `Articles List for UserId ${id}`, {
          count,
          infoCreators,
          result: ArtList,
        })
      );
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
