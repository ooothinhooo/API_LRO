const docRoutes = require("express").Router();
const FindOneDoc = require("../controllers/Docs/FindOneDoc.controller.js");
const FindOnePost = require("../controllers/Posts/FindOnePost.controller.js");
const LikeOneDoc = require("../controllers/Docs/LikeOneDoc.controller.js");

const GetAllPostList = require("../controllers/Posts/GetAllPost.ctroller.js");
const PaginationDoc = require("../controllers/Docs/PaginationDoc.controller.js");
const PaginationPost = require("../controllers/Posts/PaginationPost.controller.js");
const Doc = require("../models/docs.models.js");
const User = require("../models/User.js");
const P = require("../controllers/posts.controller.js");
const D = require("../controllers/docs.controller.js");

// Get all songs
docRoutes.get("/alldocs", async (req, res) => {
  try {
    const dataDocs = await Doc.find();
    res.status(200).send({ data: dataDocs });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});
docRoutes.get("/alluser", async (req, res) => {
  try {
    const dataDocs = await User.find().select("-password").exec();
    res.status(200).send({ data: dataDocs });
    // res.send({ data: dataDocs });
  } catch (error) {
    res.status(503).send({ message: "Internal Server Error" });
  }
});
docRoutes.get("/allpost", P.GetAllPostList);

docRoutes.post("/findonedocs", D.FindOneDoc);
docRoutes.post("/findonepost", P.FindOnePost);

//get pagination doc
docRoutes.get("/pagedoc", D.PaginationDoc);
docRoutes.get("/pagepost", P.PaginationPost);


docRoutes.get("/dochight", D.GetAllDOC_Highlight_Article);
docRoutes.get("/posthight", P.GetAllPOST_Highlight_Article);
module.exports = docRoutes;
