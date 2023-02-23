// import mongoose from "mongoose";
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  form: { type: String },
  first_name: { type: String },
  last_name: { type: String },
  username: {
    type: String,
    min: 6,
    // max: 32,
    required: true,
  },
  password: {
    type: String,
    min: 6,
    // max: 32,
    required: true,
  },
  email: {
    type: String,
    min: 6,
    // max: 32,
    required: true,
  },
  phone: {
    type: String,
  },
  avatar: {
    type: String,
  },
  access: {
    type: String,
    default: "user",
  },
  isSex: { type: String },
  docs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "docs",
    },
  ],
  articles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "articles",
    },
  ],
  disscussion: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blogs",
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

// module.exports = mongoose.model("user", userSchema);
const User = mongoose.model("User", userSchema);
module.exports = User;
