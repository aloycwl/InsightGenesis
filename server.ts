import express from "express";
import fs from "fs/promises";
import multer from "multer";
import { ethers } from "ethers";
import { PinataSDK } from "pinata";
import * as dotenv from "dotenv";

dotenv.config();

const ap = express();
const pv = new ethers.JsonRpcProvider(
  "https://data-seed-prebsc-1-s1.bnbchain.org:8545/",
);

ap.post(
  "/upload",
  multer({ dest: "uploads/" }).single("file"),
  async (req, res) => {
    try {
      const tx = await new ethers.Contract(
        "0xF70068E66527294f6073bF7a39414E2B12a03C8f",
        ["function store(string calldata, address) external"],
        pv,
      )
        .connect(new ethers.Wallet(process.env.PK!, pv))
        .store(
          (
            await new PinataSDK({
              pinataJwt: process.env.PJ!,
              pinataGateway: "amber-implicit-jay-463.mypinata.cloud",
            }).upload.public.file(
              new Blob([await fs.readFile(req.file.path)], {
                type: req.file.mimetype,
              }),
            )
          ).cid,
          req.body.addr,
        );
      await tx.wait();
      res.send("200");
    } catch (err) {
      res.status(500).send(err);
    }
  },
);

ap.listen(80, () => {
  console.log("Started");
});
