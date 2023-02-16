const express = require("express");
// const Login = require("../controllers/Account/Login.controller.js");
// const Register = require("../controllers/Account/Register.controller.js");
const { LoginSchema } = require("../validatonSchema/LoginSchema.js");
const { RegisterSchema } = require("../validatonSchema/RegisterSchema.js");
const auth = require("../controllers/auth.controller.js");
const D = require("../controllers/docs.controller.js");
const A = require("../controllers/art.controller.js");
//! router
const apiRoute = express.Router();
//* acc
apiRoute.post("/register", RegisterSchema, auth.Register);
apiRoute.post("/login", LoginSchema, auth.Login);

apiRoute.get("/findonedoc", D.FindOneDoc);
apiRoute.get("/pagedocs", D.PaginationDoc);
apiRoute.get("/docshight", D.HighLightDoc);

apiRoute.get("/findoneart", A.FindOneArt);
apiRoute.get("/pagearts", A.PaginationArt);
apiRoute.get("/artshight", A.HighLightArt);

apiRoute.post("/search", auth.SearchData);

module.exports = apiRoute;

