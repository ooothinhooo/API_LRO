const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const Docs = require("../models/docs.models.js");
const { StatusCode } = require("../utils/constants.js");
const { jsonGenerate } = require("../utils/helpers.js");

//* Create Doc
exports.CreateDoc = async (req, res) => {
  const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET;

  try {
    const result = await Docs.create({
      userId: req.userId,
      title: req.body.title,
      tag: req.body.tag,
      desc: req.body.desc,
      creatorsName: req.body.creatorsName,
      creatorsId: req.body.creatorsId,
      creatorsPhoto: req.body.creatorsPhoto,
      isPrivate: req.body.isPrivate,
      view: req.body.view,
    });

    if (result) {
      const user = await User.findOneAndUpdate(
        { _id: req.userId },
        {
          $push: { docs: result },
        }
      );
      return res.json(
        jsonGenerate(StatusCode.SUCCESS, "Docs created Succssfully", result)
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

//* Remove Doc
exports.RemoveDoc = async (req, res) => {
  try {
    const result = await Docs.findOneAndDelete({
      userId: req.userId,
      _id: req.body.docs_id,
    });

    if (result) {
      const user = await User.findOneAndUpdate(
        { _id: req.userId },
        { $pull: { docs: req.body.docs_id } }
      );

      return res.json(jsonGenerate(StatusCode.SUCCESS, "Todo deleted", null));
    }
  } catch (error) {
    return res.json(
      jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Could not delete", null)
    );
  }
};
//* isPrivate post
exports.isPrivateDoc = async (req, res) => {
  try {
    const { docs_id } = req.body;
    try {
      const list = await Docs.findById(docs_id);
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

//* Like Doc
exports.LikeOneDoc = async (req, res) => {
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
//*CountView Doc
exports.CountViewDoc = async (req, res) => {
  try {
    const { docs_id } = req.body;
    const post = await Docs.findById(docs_id);
    const updatedPost = await Docs.findByIdAndUpdate(
      { _id: docs_id },
      { view: post.view + 1 },
      { new: true }
    );
    return res.json(jsonGenerate(StatusCode.SUCCESS, "View Succssfully"));
  } catch (error) {
    return res.status(500).json("Internal server error ");
  }
};

//* Docs List
//! trả về danh sách đã tải lên của user đó thông qua auth
exports.DocsList = async (req, res) => {
  try {
    const list = await User.findById(req.userId)
      .select("-password")
      .populate("docs")
      .exec();

    return res.json(jsonGenerate(StatusCode.SUCCESS, "All todo list", list));
  } catch (error) {
    return res.json(
      jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Error", error)
    );
  }
};

//* Get All Doc List
//! hiện thị tất cả không cần auth
exports.GetAllDocList = async (req, res) => {
  try {
    const doc = await Docs.find();
    res.status(200).send({ data: doc });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

//* Get All HIGHLIGHTS ARTICLE
//! hiện thị tất cả HIGHLIGHTS ARTICLE không cần auth
exports.GetAllDOC_Highlight_Article = async (req, res) => {
  try {
    var SIZE = req.query.s
    const doc = await Docs.find();
    const arr = doc.sort(function(a,b){
      if(a.view > b.view ) return -1
      return 1
    });
    const data = arr.slice(0,SIZE)
    res.status(200).send({ data: data });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

//* Find one Doc
//! trả về kết quả 1 doc thông qua _id của doc không cần auth
exports.FindOneDoc = async (req, res) => {
  try {
    const { docs_id } = req.body;
    const list = await Docs.findById({
      _id: docs_id,
    });

    return res.json(jsonGenerate(StatusCode.SUCCESS, "All todo list", list));
  } catch (error) {
    return res.json(
      jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Error", error)
    );
  }
};

//* Pagination Doc
//! trả về kết quả theo page không thông qua auth
exports.PaginationDoc = async (req, res) => {
  const PAGE_SIZE = 10;
  try {
    var page = req.query.page;
    if (page) {
      page = parseInt(page);
      if (page < 1) page = 1;
      var skip = (page - 1) * PAGE_SIZE;
      Docs.find({})
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



//* Get doc list pagination
//! Trả về kết quả theo page do user đăng tải
exports.DocsListPagination = async (req,res)=>{
  const PAGE_SIZE = 10;
  try {
    var page = req.query.page;
    page = parseInt(page);
    if (page) {
      if (page < 1) page = 1;
      var skip = (page - 1) * PAGE_SIZE;
      const infoCreators =  await User.findById(req.userId)
      .select("-password")
      .select("-form")
      .select("-uid")
      .select("-posts")
      .select("-blog")
      .exec();
      const count =  infoCreators.docs.length;
      const id =  infoCreators._id;
      const docsList = await Docs.find({userId:id})
        .skip(skip)
        .limit(PAGE_SIZE)
        res.json(jsonGenerate(StatusCode.SUCCESS, `Docs List for UserId ${id}`, { id,count, infoCreators,result:docsList}));

      
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
}



//* Get doc list pagination
//! Trả về kết quả theo page do user đăng tải
exports.ViewDocsList = async (req,res)=>{
  const PAGE_SIZE = 10;
  try {
    var page = req.query.page;
    var uid = req.query.uid;
    page = parseInt(page);
    if (page) {
      if (page < 1) page = 1;
      var skip = (page - 1) * PAGE_SIZE;
      const infoCreators =  await User.findById({_id:uid})
      .select("-password")
      .select("-form")
      .select("-uid")
      .select("-posts")
      .select("-blog")
      .exec();
      const count =  infoCreators.docs.length;
      const id =  infoCreators._id;
      const docsList = await Docs.find({userId:id})
        .skip(skip)
        .limit(PAGE_SIZE)
        res.json(jsonGenerate(StatusCode.SUCCESS, `Docs List for UserId ${id}`, { id,count, infoCreators,result:docsList}));

      
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
}