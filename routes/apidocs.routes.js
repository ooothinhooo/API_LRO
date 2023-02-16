const express = require("express");

const Doc = require("../controllers/docs.controller.js");
//! router
const apiDocs = express.Router();

//* docs
apiDocs.post("/createdoc", Doc.CreateDoc);
apiDocs.post("/removedoc", Doc.RemoveDoc);
apiDocs.post("/setisprivatedoc", Doc.SetIsPrivateDoc);
apiDocs.post("/interactdoc", Doc.InteractDoc);
apiDocs.post("/viewdoc", Doc.CountViewDoc);
apiDocs.get("/doclist", Doc.DocListForUserId);


module.exports = apiDocs;
