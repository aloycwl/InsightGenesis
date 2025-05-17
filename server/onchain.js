import { ci, pg, pr, PJ, PK } from "./config.js";
import { dbIGAI, dbNew, dbTo, dbRef } from "./supabase.js";
import { ethers as et } from "ethers";
import { PinataSDK as ps } from "pinata";

const pv = new et.JsonRpcProvider(pr);

export async function ref(rt, rf) {
  if (await dbTo(rt)) {
    await dbRef(rt, rf);
    const co = new et.Contract(
      ci,
      ["function setRef(address, address)"],
      pv,
    );
    const tx = await co.connect(new et.Wallet(PK, pv)).setRef(rt, rf);
    await tx.wait();
  }
}

export async function store(rd, ra, rt, aa) {
  const { cid } = await new ps({
    pinataJwt: PJ,
    pinataGateway: pg,
  }).upload.public.file(
    new Blob([JSON.stringify(rd)], { type: "application/json" }),
  );

  if (await dbNew(ra)) {
    const co = new et.Contract(
      ci,
      ["function deduct(address, address)"],
      pv,
    );
    const tx = await co.connect(new et.Wallet(PK, pv)).deduct(ra, aa);
    await tx.wait();
  }

  dbIGAI(cid, ra, rt);
}
