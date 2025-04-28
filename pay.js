import { ci, pv } from "./global.js";
import { ethers } from "ethers";

export async function setPaid(re) {
  const co = new ethers.Contract(
    ci,
    ["function setPaid(address) external"],
    pv,
  );

  const wl = new ethers.Wallet(process.env.PK, pv);
  const tx = await co.connect(wl).setPaid(re.body.addr);
  await tx.wait();
}
