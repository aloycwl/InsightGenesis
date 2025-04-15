var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import fs from "fs/promises";
import multer from "multer";
import { ethers } from "ethers";
import { PinataSDK } from "pinata";
import * as dotenv from "dotenv";
dotenv.config();
const ap = express();
const pv = new ethers.JsonRpcProvider("https://data-seed-prebsc-1-s1.bnbchain.org:8545/");
ap.post("/upload", multer({ dest: "uploads/" }).single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tx = yield new ethers.Contract("0xF70068E66527294f6073bF7a39414E2B12a03C8f", ["function store(string calldata, address) external"], pv)
            .connect(new ethers.Wallet(process.env.PK, pv))
            .store((yield new PinataSDK({
            pinataJwt: process.env.PJ,
            pinataGateway: "amber-implicit-jay-463.mypinata.cloud",
        }).upload.public.file(new Blob([yield fs.readFile(req.file.path)], {
            type: req.file.mimetype,
        }))).cid, req.body.addr);
        yield tx.wait();
        res.send("200");
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
ap.listen(80, () => {
    console.log("Started");
});
