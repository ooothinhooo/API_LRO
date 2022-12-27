const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const User = require("../../models/User.js");
const Docs = require("../../models/docs.models.js");
const { StatusCode } = require("../../utils/constants.js");
const { jsonGenerate } = require("../../utils/helpers.js");

const RemoveDoc = async (req, res) => {
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

module.exports = RemoveDoc;
