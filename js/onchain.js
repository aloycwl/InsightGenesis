import { ci, pr, PJ, PK } from "./config.js";
import { dbIGAI, dbNew, dbTo, dbRef } from "./supabase.js";
import axios from "axios";
import ethers from "ethers";
const { providers, Contract, Wallet } = ethers;
const { JsonRpcProvider } = providers;

const w = new Wallet(PK, new JsonRpcProvider(pr));

export async function ref(t, f) {
  if ((await dbTo(t)) && t != f) {
    await dbRef(t, f);
    await new Contract(ci, ["function setRef(address, address)"], w.provider)
      .connect(w)
      .setRef(t, f);
  }
}

export async function store(d, ra, rt, aa) {
  if (await dbNew(ra))
    await new Contract(ci, ["function deduct(address, address)"], w.provider)
      .connect(w)
      .deduct(ra, aa);

  dbIGAI(
    (
      await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        { pinataContent: d },
        {
          headers: {
            Authorization: `Bearer ${PJ}`,
            "Content-Type": "application/json",
          },
        },
      )
    ).data.IpfsHash,
    ra,
    rt,
  );
}
