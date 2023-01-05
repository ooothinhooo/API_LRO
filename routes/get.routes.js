const express = require("express");

// const getRoutes = require("express").Router();
const { StatusCode } = require("../utils/constants.js");
const { jsonGenerate } = require("../utils/helpers.js");
const Doc = require("../models/docs.models.js");
const User = require("../models/User.js");
const Blogs = require("../models/blogs.models.js");
const P = require("../controllers/posts.controller.js");
const D = require("../controllers/docs.controller.js");
const B = require("../controllers/blogs.controller.js");
const Auth = require("../controllers/auth.controller.js");

const getRoutes = express.Router();

// Get all songs
getRoutes.get("/alldocs", async (req, res) => {
  try {
    const dataDocs = await Doc.find();
    res.status(200).send({ data: dataDocs });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});
getRoutes.get("/allblogs", async (req, res) => {
  try {
    const dataDocs = await Blogs.find();
    res.status(200).send({ data: dataDocs });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});
getRoutes.get("/userhight", async (req, res) => {
  try {
    const SIZE = req.query.S;
    const list = await User.find().select("-password").exec();

    const arr = list.sort(function (a, b) {
      if (a.posts.length + a.docs.length > b.posts.length + b.docs.length)
        return -1;
      return 1;
    });
    const data = arr.slice(0, SIZE);
    if (data) {
      return res.json(
        jsonGenerate(StatusCode.SUCCESS, "Succssfully", {
          data,
          // LenPosts,
        })
      );
    } else {
      return res.json(
        jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Something went wrong")
      );
    }

    // res.send({ data: dataDocs });
  } catch (error) {
    res.status(503).send({ message: "Internal Server Error" });
  }
});
getRoutes.get("/allpost", P.GetAllPostList);

//* trả về data của id đó
// dùng để xem
getRoutes.post("/findonedocs", D.FindOneDoc);
getRoutes.post("/findonepost", P.FindOnePost);
getRoutes.post("/findoneblog", B.FindOneBlog);

//get pagination doc
getRoutes.get("/pagedoc", D.PaginationDoc);
getRoutes.get("/pagepost", P.PaginationPost);
getRoutes.get("/pageblog", B.PaginationBlog);
//* trả về danh sách dữ liệu có số view cao
getRoutes.get("/dochight", D.GetAllDOC_Highlight_Article);
getRoutes.get("/posthight", P.GetAllPOST_Highlight_Article);
getRoutes.get("/bloghight", B.GetAllBLOG_Highlight_Article);
//* trả về
getRoutes.get("/viewuser", Auth.FindOneUser);
// getRoutes.get("/viewdoclist", D.ViewDocsList);
module.exports = getRoutes;
