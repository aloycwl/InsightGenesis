import { ci, pg, pv, PJ, PK } from "./global.js";
import { dbIGAI as di } from "./supabase.js";
import { ethers as et } from "ethers";
import { PinataSDK as ps } from "pinata";

export async function setReferral(re, rl) {
  const co = new et.Contract(
    ci,
    ["function setRef(address, address) external"],
    pv,
  );

  const tx = await co.connect(new et.Wallet(PK, pv)).setRef(re, rl);
  await tx.wait();
}

export async function upload(rd, ra, rt, aa) {
  const { cid } = await new ps({
    pinataJwt: PJ,
    pinataGateway: pg,
  }).upload.public.file(
    new Blob([JSON.stringify(rd)], { type: "application/json" }),
  );

  di(cid, ra, rt);

  const co = new et.Contract(
    ci,
    ["function store(address, address) external"],
    pv,
  );
  const tx = await co.connect(new et.Wallet(PK, pv)).store(ra, aa);
  await tx.wait();
}
