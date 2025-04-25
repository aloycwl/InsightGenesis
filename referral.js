import { ci, pv } from "./global.js";
import { ethers } from "ethers";

export async function setReferral(re) {
  console.log(re.body.referee);
  console.log(re.body.referral);

  const co = new ethers.Contract(
    ci,
    ["function setReferral(address, address) external"],
    pv,
  );

  const wl = new ethers.Wallet(process.env.PK, pv);
  const tx = await co
    .connect(wl)
    .setReferral(re.body.referee, re.body.referral);
  await tx.wait();
}
