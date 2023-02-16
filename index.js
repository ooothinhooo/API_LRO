require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");

const AuthMiddleware = require("./middlewares/AuthMidleware.js");
const apiRoute = require("./routes/api.js");

const docsRoutes = require("./routes/apidocs.routes.js");
const artRoutes = require("./routes/apiArt.routes.js");
const authRoutes = require("./routes/apiAuth.routes.js");

// Database Connection
connection();
// dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
//Router login and register
app.use("/api/", apiRoute);

app.use("/apiart/", AuthMiddleware, artRoutes);
//router handler for docs model
app.use("/apidocs/", AuthMiddleware, docsRoutes);
//
app.use("/apipla/", AuthMiddleware, authRoutes);
//Server runing
const PORT = process.env.PORT;

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);

app.get("/", (req, res) => {
  res.send(`Server running on PORT ${PORT}...`);
});
