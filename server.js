import express from "express";
import multer from "multer";
import { setReferral } from "./referral.js";
import { upload } from "./upload.js";

const ap = express();
const ul = multer({ dest: "uploads/" });

ap.post("/upload", ul.single("file"), async (re, rs) => {
  try {
    await upload(re);
    rs.send("200");
  } catch (err) {
    rs.status(500).send(err);
  }
});

ap.post("/setReferral", ul.none(), async (re, rs) => {
  try {
    await setReferral(re);
    rs.send("200");
  } catch (err) {
    rs.status(500).send(err);
  }
});

ap.listen(80, () => {
  console.log("Started");
});
