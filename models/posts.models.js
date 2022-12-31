const mongoose = require("mongoose");

var today = new Date();
var day =
  today.getDate() +
  "/" +
  (today.getMonth() + 1) +
  "/" +
  today.getFullYear() +
  " " +
  today.getHours() +
  ":" +
  today.getMinutes() +
  ":" +
  today.getSeconds();
const POSTchema = new mongoose.Schema({
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
  },
  creater: {
    type: String,
  },
  createrId: {
    type: String,
  },
  createrPhoto: {
    type: String,
  },
  date: {
    type: String,
    default: day,
  },
});

const Posts = mongoose.model("posts", POSTchema);
module.exports = Posts;
