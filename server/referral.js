import { ci, pv, PK } from "./global.js";
import { ethers as et } from "ethers";

export async function setReferral(re, rl) {
  const co = new et.Contract(
    ci,
    ["function setRef(address, address) external"],
    pv,
  );

  const tx = await co.connect(new et.Wallet(PK, pv)).setRef(re, rl);
  await tx.wait();
}
