import { ci, pg, pr, PJ, PK } from "./config.js";
import { dbIGAI, dbNew, dbTo, dbRef } from "./supabase.js";
import { PinataSDK as P } from "pinata";
import ethers from "ethers";
const { providers, Contract, Wallet } = ethers;
const { JsonRpcProvider } = providers;

const pv = new JsonRpcProvider(pr);

export async function ref(rt, rf) {
  if (await dbTo(rt)) {
    await dbRef(rt, rf);
    const co = new Contract(ci, ["function setRef(address, address)"], pv),
      tx = await co.connect(new Wallet(PK, pv)).setRef(rt, rf);
    await tx.wait();
  }
}

export async function store(rd, ra, rt, aa) {
  const { cid } = await new P({
    pinataJwt: PJ,
    pinataGateway: pg,
  }).upload.public.file(
    new Blob([JSON.stringify(rd)], { type: "application/json" }),
  );

  if (await dbNew(ra)) {
    const co = new Contract(ci, ["function deduct(address, address)"], pv),
      tx = await co.connect(new Wallet(PK, pv)).deduct(ra, aa);
    await tx.wait();
  }

  dbIGAI(cid, ra, rt);
}
