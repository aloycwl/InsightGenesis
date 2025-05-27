import { ci, pg, pr, PJ, PK } from "./config.js";
import { dbIGAI, dbNew, dbTo, dbRef } from "./supabase.js";
import axios from "axios";
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

export async function store(d, ra, rt, aa) {
  const c = await axios.post(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    { pinataContent: d },
    {
      headers: {
        Authorization: `Bearer ${PJ}`,
        "Content-Type": "application/json",
      },
    },
  ).data.IpfsHash;

  if (await dbNew(ra)) {
    const co = new Contract(ci, ["function deduct(address, address)"], pv),
      tx = await co.connect(new Wallet(PK, pv)).deduct(ra, aa);
    await tx.wait();
  }

  dbIGAI(c, ra, rt);
}
