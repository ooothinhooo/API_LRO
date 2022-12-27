const express = require("express");
const CountViewDoc = require("../controllers/Docs/CountViewDoc.controller.js");
const CreateDoc = require("../controllers/Docs/CreateDoc.controller.js");
const DocsList = require("../controllers/Docs/DocsList.controller.js");
const LikeOneDoc = require("../controllers/Docs/LikeOneDoc.controller.js");
const RemoveDoc = require("../controllers/Docs/RemoveDoc.controller.js");

const Doc = require("../controllers/docs.controller.js");
//! router

const apiProtected = express.Router();

//* docs
apiProtected.post("/adddoc", Doc.CreateDoc);
apiProtected.post("/deletedoc", Doc.RemoveDoc);
apiProtected.get("/getdoc", Doc.DocsList);
apiProtected.post("/likedoc", Doc.LikeOneDoc);
apiProtected.post("/viewdoc", Doc.CountViewDoc);
module.exports = apiProtected;
