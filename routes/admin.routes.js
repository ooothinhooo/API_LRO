const express = require("express");

const Auth = require("../controllers/auth.controller.js");
const Docs = require("../controllers/docs.controller.js");

const admin = express.Router();

//Create Blogs
admin.post("/alldocs", Docs.HighLightDoc);

module.exports = admin;
