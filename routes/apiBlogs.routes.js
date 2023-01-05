const express = require("express");

const Blog = require("../controllers/blogs.controller.js");

const apiBlogs = express.Router();

//Create Blogs
apiBlogs.post("/addblog", Blog.CreateBlog);
apiBlogs.post("/updateblog", Blog.UpdateBlog);
apiBlogs.post("/deleteblog", Blog.RemoveBlog);
apiBlogs.post("/isPrivateblog", Blog.isPrivateBlog);
apiBlogs.post("/likeblog", Blog.LikeOneBlog);
apiBlogs.post("/viewblog", Blog.CountViewBlog);
apiBlogs.get("/bloglist", Blog.BlogsListPagination);

// apiBlogs.get("/getblog", Blog.BlogsList);
module.exports = apiBlogs;
