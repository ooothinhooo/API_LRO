const Posts = require("../../models/posts.models.js");

const GetAllPostList = async (req, res) => {
  try {
    const post = await Posts.find();
    res.status(200).send({ data: post });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};
module.exports = GetAllPostList;
