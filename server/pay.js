import { ci, pv } from "./global.js";
import { ethers as et } from "ethers";

export async function setPaid(re) {
  const co = new et.Contract(ci, ["function setPaid(address) external"], pv);
  const tx = await co.connect(new et.Wallet(process.env.PK, pv)).setPaid(re);
  await tx.wait();
}
