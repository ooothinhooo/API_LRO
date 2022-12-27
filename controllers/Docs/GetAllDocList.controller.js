const Docs = require("../../models/docs.models.js");

const GetAllDocList = async (req, res) => {
  try {
    const doc = await Docs.find();
    res.status(200).send({ data: doc });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};
module.exports = GetAllDocList;
