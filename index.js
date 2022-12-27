require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");

const AuthMiddleware = require("./middlewares/AuthMidleware.js");
const apiRoute = require("./routes/api.js");
const docsRoutes = require("./routes/apidocs.routes.js");
const getRoutes = require("./routes/get.routes.js");
const postsRoutes = require("./routes/apiposts.routes.js");

// Database Connection
connection();
// dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
//Router login and register
app.use("/api/", apiRoute);
// router get and getall not authmiddleware
app.use("/get/", getRoutes);
//router handler for post model
app.use("/post/", AuthMiddleware, postsRoutes);
//router handler for docs model
app.use("/docs/", AuthMiddleware, docsRoutes);

//Server runing
const PORT = process.env.PORT;
app.get("/", (req, res) => {
  res.send("Server Run");
});
const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);

