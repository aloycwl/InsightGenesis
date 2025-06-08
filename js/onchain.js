import { ci, pr, PK, D, M } from "./config.js";
import { create } from "@web3-storage/w3up-client";
import { dbIGAI, dbNew, dbTo, dbRef } from "./supabase.js";
import { NonceManager as N } from "@ethersproject/experimental";
import ethers from "ethers";

const { providers, Contract, Wallet } = ethers,
  { JsonRpcProvider } = providers,
  w = new Wallet(PK, new JsonRpcProvider(pr)),
  s = new N(w),
  q = [];
let p = false;

export async function ref(t, f) {
  if ((await dbTo(t)) && t != f) {
    await dbRef(t, f);
    await new Contract(ci, ["function setRef(address, address)"], w.provider)
      .connect(w)
      .setRef(t, f);
  }
}

export async function processQueue() {
  if (p) return;
  p = true;

  while (q.length > 0) {
    const { d, ra, rt, aa } = q.shift();

    try {
      if (await dbNew(ra))
        await (
          await new Contract(
            ci,
            ["function deduct(address, address)"],
            w.provider,
          )
            .connect(s)
            .deduct(ra, aa)
        ).wait();

      const c = await create();
      await c.login(M);
      await c.setCurrentSpace(D);

      await dbIGAI(
        (await c.uploadFile(new File([JSON.stringify(d)], ""))).toString(),
        ra,
        rt,
      );
    } catch (e) {
      console.error("error encounter, retrying...");
      q.push({ d, ra, rt, aa });
      await delay(3000);
    }
    console.log("Queue left", q.length);
  }

  p = false;
}

export async function store(d, ra, rt, aa) {
  q.push({ d, ra, rt, aa });
  processQueue();
}
