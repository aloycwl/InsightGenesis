import express from "express";
import fs from "fs/promises";
import multer from "multer";
import { createReadStream } from "fs";
import { PinataSDK } from "pinata";
import * as dotenv from "dotenv";

dotenv.config();

const ap = express();
const ul = multer({ dest: "uploads/" });

ap.post("/upload", ul.single("file"), async (req, res) => {
  try {
    res.send((
      await new PinataSDK({
        pinataJwt: process.env.PINATA_JWT!,
        pinataGateway: "amber-implicit-jay-463.mypinata.cloud",
      }).upload.public.file(
        new Blob([await fs.readFile(req.file.path)],
          { type: req.file.mimetype }))).cid);
  } catch (err) {
    res.status(500).send(err);
  }
});

ap.listen(80, () => { });