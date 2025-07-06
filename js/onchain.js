import { ci, cr, pr, PK, D, M } from "./config.js";
import { create as C } from "@web3-storage/w3up-client";
import { dbIGAI, dbNew, dbTo, dbRef, dbGetRef } from "./supabase.js";
import { NonceManager as O } from "@ethersproject/experimental";
import ethers from "ethers";

const { providers, Contract, Wallet } = ethers,
  { JsonRpcProvider } = providers,
  w = new Wallet(PK, new JsonRpcProvider(pr)),
  s = new O(w),
  q = [],
  c = await C(),
  r = new Contract(
    ci,
    ["function deduct(address, address)"],
    w.provider,
  ).connect(s),
  t = new Contract(
    cr,
    ["function balanceOf(address) view returns (uint256)"],
    w.provider,
  );
let p = false;

const b = async () => {
  if (!c.currentSpace()) {
    await c.login(M);
    await c.setCurrentSpace(D);
  }
};

export async function ref(t, f) {
  try {
    if ((await dbTo(t)) && t != f) {
      await dbRef(t, f);
      await new Contract(ci, ["function setRef(address, address)"], w.provider)
        .connect(s)
        .setRef(t, f);
    }
  } catch (e) {
    console.log(e);
  }
}

export async function getInfo(a) {
  try {
    const [b, c] = await Promise.all([t.balanceOf(a), dbGetRef(a)]);
    return { balance: b.toString(), to: c.from || null, from: c.to || [] };
  } catch (e) {
    return e;
  }
}

export async function processQueue() {
  if (p) return;
  p = true;

  while (q.length > 0) {
    const { d, ra, rt, aa } = q.shift();

    try {
      const p = (async () => {
        await b();
        const i = (
          await c.uploadFile(new File([JSON.stringify(d)], ""))
        ).toString();
        dbIGAI(i, ra, rt);
      })();

      let q = Promise.resolve();
      if (await dbNew(ra))
        q = (async () => {
          const t = await r.deduct(ra, aa);
          await t.wait(1);
          return t;
        })();

      await Promise.all([p, q]);
    } catch (e) {
      console.error(new Date().toISOString(), "Retrying...", e);
      q.push({ d, ra, rt, aa });
      await new Promise((r) => setTimeout(r, 3000));
    }
    console.log("Queue left", q.length);
  }
  p = false;
}

export async function store(d, ra, rt, aa) {
  q.push({ d, ra, rt, aa });
  processQueue();
}
