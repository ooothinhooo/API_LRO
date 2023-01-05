const mongoose = require("mongoose");
const { randomABC } = require("../ran.js");

var today = new Date();
var day =
  today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
var time =
  today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
const DOCSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  dataURL: {
    type: String,
    required: true,
  },
  nameTag: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },

  isPrivate: { type: Boolean, required: true },
  like: {
    type: Array,
  },
  view: {
    type: Number,
    default: 0,
  },
  creatorsName: {
    type: String,
    required: true,
  },
  creatorsId: {
    type: String,
    required: true,
  },
  creatorsPhoto: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: day,
  },
  time: {
    type: String,
    default: time,
  },
});

const Docs = mongoose.model("docs", DOCSchema);
module.exports = Docs;