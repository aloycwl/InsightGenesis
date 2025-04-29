import { ci, pv } from "./global.js";
import { ethers as et } from "ethers";

export async function setReferral(re, rl) {
  const co = new et.Contract(
    ci,
    ["function setReferral(address, address) external"],
    pv,
  );

  const tx = await co
    .connect(new et.Wallet(process.env.PK, pv))
    .setReferral(re, rl);
  await tx.wait();
}
