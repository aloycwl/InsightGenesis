import express from "express";
import fs from "fs/promises";
import multer from "multer";
import { ethers } from "ethers";
import { PinataSDK } from "pinata";
import * as dotenv from "dotenv";

dotenv.config();

const ap = express(),
  ul = multer({ dest: "uploads/" }),
  pv = new ethers.JsonRpcProvider(
    "https://data-seed-prebsc-1-s1.bnbchain.org:8545/",
  );

ap.post("/upload", ul.single("file"), async (req, res) => {
  try {
    const fb = await fs.readFile(req.file.path);
    const pn = new PinataSDK({
      pinataJwt: process.env.PJ,
      pinataGateway: "amber-implicit-jay-463.mypinata.cloud",
    });

    const { cid } = await pn.upload.public.file(
      new Blob([fb], { type: req.file.mimetype }),
    );

    const co = new ethers.Contract(
      "0xF70068E66527294f6073bF7a39414E2B12a03C8f",
      ["function store(string calldata, address) external"],
      pv,
    );

    const wl = new ethers.Wallet(process.env.PK, pv);
    const tx = await co.connect(wl).store(cid, req.body.addr);
    await tx.wait();

    res.send("200");
  } catch (err) {
    res.status(500).send(err);
  }
});

ap.listen(80, () => {
  console.log("Started");
});
