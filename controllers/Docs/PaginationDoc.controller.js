const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const User = require("../../models/User.js");
const Docs = require("../../models/docs.models.js");
const { StatusCode } = require("../../utils/constants.js");
const { jsonGenerate } = require("../../utils/helpers.js");

const PaginationDoc = async (req, res) => {
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

module.exports = PaginationDoc;
