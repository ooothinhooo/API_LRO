const express = require("express");

const Auth = require("../controllers/auth.controller.js");
const Art = require("../controllers/art.controller.js");
//! router
const apiArt = express.Router();

//* docs
apiArt.post("/createart", Art.CreateArt);
apiArt.post("/updateart", Art.UpdateArt);
apiArt.post("/removeart", Art.RemoveArt);
apiArt.post("/setisprivateart", Art.SetIsPrivateArt);
apiArt.post("/interactart", Art.InteractArt);
apiArt.post("/viewart", Art.CountViewArt);
apiArt.get("/artlist", Art.ArtListForUserId);

apiArt.post("/updateinfo", Auth.UpdatePersonalInformation);
apiArt.post("/changepass", Auth.ChangeThePassword);
module.exports = apiArt;
