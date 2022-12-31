const express = require("express");
const CountViewPost = require("../controllers/Posts/CountView.controller.js");
const CreatePost = require("../controllers/Posts/CreatePost.controller.js");
const PostsList = require("../controllers/Posts/PostList.controller.js");
const LikeOnePost = require("../controllers/Posts/LikeOnePost.controller.js");
const RemovePost = require("../controllers/Posts/RemovePost.controller.js");
const UpdatePost = require("../controllers/Posts/UpdatePost.controller.js");
const Post = require("../controllers/posts.controller.js");
//! router

const apiPost = express.Router();

apiPost.post("/addpost", Post.CreatePost);
apiPost.post("/deletepost", Post.RemovePost);
apiPost.post("/updatepost", Post.UpdatePost);
apiPost.get("/getpost", Post.PostsList);
apiPost.post("/likepost", Post.LikeOnePost);
apiPost.post("/viewpost", Post.CountViewPost);
apiPost.get("/postlist", Post.PostsListPagination);

module.exports = apiPost;
