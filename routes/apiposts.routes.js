const express = require("express");

const Post = require("../controllers/posts.controller.js");
//! router

const apiPost = express.Router();

apiPost.post("/addpost", Post.CreatePost);
apiPost.post("/deletepost", Post.RemovePost);
apiPost.post("/updatepost", Post.UpdatePost);
apiPost.get("/getpost", Post.PostsList);
apiPost.post("/isPrivatepost", Post.isPrivatePost);
apiPost.post("/likepost", Post.LikeOnePost);
apiPost.post("/viewpost", Post.CountViewPost);
apiPost.get("/postlist", Post.PostsListPagination);

module.exports = apiPost;
