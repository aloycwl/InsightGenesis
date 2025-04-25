import { ci, pv } from "./global.js";
import { ethers } from "ethers";
import { PinataSDK } from "pinata";
import fs from "fs/promises";

export async function upload(re) {
  const fb = await fs.readFile(re.file.path);
  const pn = new PinataSDK({
    pinataJwt: process.env.PJ,
    pinataGateway: "amber-implicit-jay-463.mypinata.cloud",
  });

  const { cid } = await pn.upload.public.file(
    new Blob([fb], { type: re.file.mimetype }),
  );

  const co = new ethers.Contract(
    ci,
    ["function store(string calldata, address) external"],
    pv,
  );

  const wl = new ethers.Wallet(process.env.PK, pv);
  const tx = await co.connect(wl).store(cid, re.body.addr);
  await tx.wait();
}
