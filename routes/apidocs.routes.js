const express = require("express");

const CountViewDoc = require("../controllers/Docs/CountViewDoc.controller.js");
const CreateDoc = require("../controllers/Docs/CreateDoc.controller.js");
const DocsList = require("../controllers/Docs/DocsList.controller.js");
const LikeOneDoc = require("../controllers/Docs/LikeOneDoc.controller.js");
const RemoveDoc = require("../controllers/Docs/RemoveDoc.controller.js");

const Doc = require("../controllers/docs.controller.js");
//! router

const apiDocs = express.Router();

//* docs
apiDocs.post("/adddoc", Doc.CreateDoc);
apiDocs.post("/deletedoc", Doc.RemoveDoc);
apiDocs.get("/getdoc", Doc.DocsList);
apiDocs.post("/isPrivatedoc", Doc.isPrivateDoc);
apiDocs.post("/likedoc", Doc.LikeOneDoc);
apiDocs.post("/viewdoc", Doc.CountViewDoc);
apiDocs.get("/doclist", Doc.DocsListPagination);
module.exports = apiDocs;
