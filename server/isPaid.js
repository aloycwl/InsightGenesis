import { ci, pv } from "./global.js";
import { ethers } from "ethers";

export async function isPaid(re) {
  const co = new ethers.Contract(
    ci,
    ["function paid(address) view returns (bool)"],
    pv,
  );

  return await co.paid(re.body.addr);
}
