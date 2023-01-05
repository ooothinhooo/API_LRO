const mongoose = require("mongoose");

var today = new Date();
var day =
  today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
var time =
  today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

const BLOGSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  tag: {
    type: Array,
    required: true,
  },
  thumbnail: { type: String },
  isPrivate: { type: Boolean, required: true },
  like: {
    type: Array,
  },
  view: {
    type: Number,
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

const Blogs = mongoose.model("Blogs", BLOGSchema);
module.exports = Blogs;
