import { ci, pg, pr, PJ, PK } from "./config.js";
import { dbIGAI as di, dbNew as dn } from "./supabase.js";
import { ethers as et } from "ethers";
import { PinataSDK as ps } from "pinata";

const pv = new et.JsonRpcProvider(pr);

export async function ref(re, rl) {
  // check if referral exists
  
  const co = new et.Contract(
    ci,
    ["function setRef(address, address) external"],
    pv,
  );

  const tx = await co.connect(new et.Wallet(PK, pv)).setRef(re, rl);
  await tx.wait();
}

export async function store(rd, ra, rt, aa) {
  const { cid } = await new ps({
    pinataJwt: PJ,
    pinataGateway: pg,
  }).upload.public.file(
    new Blob([JSON.stringify(rd)], { type: "application/json" }),
  );

  if (await dn(ra)) {
    const co = new et.Contract(
      ci,
      ["function deduct(address, address) external"],
      pv,
    );
    const tx = await co.connect(new et.Wallet(PK, pv)).deduct(ra, aa);
    await tx.wait();
  }

  di(cid, ra, rt);
}
