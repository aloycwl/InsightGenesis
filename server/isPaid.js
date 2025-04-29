import { ci, pv } from "./global.js";
import { ethers as et } from "ethers";

export async function isPaid(re) {
  const co = new et.Contract(
    ci,
    ["function paid(address) view returns (bool)"],
    pv,
  );

  return await co.paid(re);
}
