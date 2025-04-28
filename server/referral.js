import { ci, pv } from "./global.js";
import { ethers } from "ethers";

export async function setReferral(re) {
  const co = new ethers.Contract(
    ci,
    ["function setReferral(address, address) external"],
    pv,
  );

  const tx = await co
    .connect(new ethers.Wallet(process.env.PK, pv))
    .setReferral(re.referee, re.referral);
  await tx.wait();
}
