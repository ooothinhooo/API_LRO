const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const User = require("../../models/User.js");
const Docs = require("../../models/docs.models.js");
const { StatusCode } = require("../../utils/constants.js");
const { jsonGenerate } = require("../../utils/helpers.js");

const FindOneDoc = async (req, res) => {
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

module.exports = FindOneDoc;
