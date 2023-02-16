const express = require("express");

const Auth = require("../controllers/auth.controller.js");

const apiAuth = express.Router();

//Create Blogs
apiAuth.post("/updateinfo", Auth.UpdatePersonalInformation);

// apiBlogs.get("/getblog", Blog.BlogsList);
module.exports = apiAuth;
