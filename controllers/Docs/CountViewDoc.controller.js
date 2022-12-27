const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const User = require("../../models/User.js");
const Docs = require("../../models/docs.models.js");
const { StatusCode } = require("../../utils/constants.js");
const { jsonGenerate } = require("../../utils/helpers.js");

const CountViewDoc = async (req, res) => {
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
module.exports = CountViewDoc;
