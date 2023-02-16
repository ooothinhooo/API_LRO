const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const Blogs = require("../models/disscussion.models.js");
const { StatusCode } = require("../utils/constants.js");
const { jsonGenerate } = require("../utils/helpers.js");

//* Create Post
exports.CreateBlog = async (req, res) => {
  const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET;

  try {
    const { view } = req.body;
    if (view == "") view = 0;
    const result = await Blogs.create({
      userId: req.userId,
      title: req.body.title,
      tag: req.body.tag,
      desc: req.body.desc,
      creatorsName: req.body.creatorsName,
      creatorsId: req.body.creatorsId,
      creatorsPhoto: req.body.creatorsPhoto,
      isPrivate: req.body.isPrivate,
      view: view,
    });

    if (result) {
      const user = await User.findOneAndUpdate(
        { _id: req.userId },
        {
          $push: { blog: result },
        }
      );

      // const check = user.blog.includes(result._id);
      return res.json(
        jsonGenerate(StatusCode.SUCCESS, "Posts created Succssfully", {
          user,
          result,
        })
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
exports.UpdateBlog = async (req, res) => {
  const newPost = ({ blog_id, title, desc, tag } = req.body);
  try {
    const result = await Blogs.findByIdAndUpdate(post_id, newPost);
    return res.json(
      jsonGenerate(StatusCode.SUCCESS, "Update Succssfully", newPost)
    );
  } catch (error) {
    return res.status(500).json("Internal server error ");
  }
};
//* Remove post
exports.RemoveBlog = async (req, res) => {
  try {
    const result = await Blogs.findOneAndDelete({
      userId: req.userId,
      _id: req.body.blog_id,
    });

    if (result) {
      const user = await User.findOneAndUpdate(
        { _id: req.userId },
        { $pull: { docs: req.body.blog_id } }
      );

      return res.json(
        jsonGenerate(StatusCode.SUCCESS, "Blog deleted Successfully", null)
      );
    }
  } catch (error) {
    return res.json(
      jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Could not delete", null)
    );
  }
};
//* isPrivate post
exports.isPrivateBlog = async (req, res) => {
  try {
    const { blog_id } = req.body;
    try {
      const list = await Blogs.findById(blog_id);
      if (list.isPrivate == true) {
        await list.updateOne({ isPrivate: false });
        return res.json(
          jsonGenerate(StatusCode.SUCCESS, "isPrivate flase Succssfully")
        );
      } else {
        await list.updateOne({ isPrivate: true });
        return res.json(
          jsonGenerate(StatusCode.SUCCESS, "isPrivate true Succssfully")
        );
      }
    } catch (error) {
      return res.status(500).json("Internal server error ");
    }
  } catch (error) {}
};

//* like post
exports.LikeOneBlog = async (req, res) => {
  try {
    const { post_id: blog_id, photoURL } = req.body;
    try {
      const list = await Blogs.findById(blog_id);
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
exports.CountViewBlog = async (req, res) => {
  try {
    const { blog_id } = req.body;
    const blog = await Blogs.findById(blog_id);
    const updatedPost = await Blogs.findByIdAndUpdate(
      { _id: blog_id },
      { view: blogs.view + 1 },
      { new: true }
    );
    return res.json(jsonGenerate(StatusCode.SUCCESS, "View Succssfully"));
  } catch (error) {
    return res.status(500).json("Internal server error ");
  }
};
//* post list => trả vể danh sách theo user đã tải lên
exports.BlogsList = async (req, res) => {
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
exports.GetAllBlogList = async (req, res) => {
  try {
    const post = await Blogs.find();
    res.status(200).send({ data: post });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};
//* find one post
exports.FindOneBlog = async (req, res) => {
  try {
    const { blog_id } = req.body;
    const list = await Blogs.findById({
      _id: blog_id,
    });

    return res.json(jsonGenerate(StatusCode.SUCCESS, "All Posts List", list));
  } catch (error) {
    return res.json(
      jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Error", error)
    );
  }
};
//* Pagination post => phân trang
exports.PaginationBlog = async (req, res) => {
  const PAGE_SIZE = 10;
  try {
    var page = req.query.page;
    if (page) {
      page = parseInt(page);
      if (page < 1) page = 1;
      var skip = (page - 1) * PAGE_SIZE;
      Blogs.find({})
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
exports.GetAllBLOG_Highlight_Article = async (req, res) => {
  try {
    var SIZE = req.query.s;
    const doc = await Blogs.find();
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
exports.BlogsListPagination = async (req, res) => {
  const PAGE_SIZE = 10;
  try {
    var page = req.query.page;
    page = parseInt(page);
    if (page) {
      if (page < 1) page = 1;
      var skip = (page - 1) * PAGE_SIZE;
      const infoCreators = await User.findById(req.userId)
        .select("-password")
        .select("-form")
        .select("-uid")
        .select("-docs")
        .select("-posts")
        .exec();
      const count = infoCreators.blog.length;
      const id = infoCreators._id;
      const docsList = await Blogs.find({ userId: id })
        .skip(skip)
        .limit(PAGE_SIZE);

      res.json(
        jsonGenerate(StatusCode.SUCCESS, `Blogs List for UserId ${id}`, {
          count,
          infoCreators,
          result: docsList,
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
