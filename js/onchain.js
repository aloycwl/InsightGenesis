import { ci, cr, pr, PK, D, M } from "./config.js";
import { create as C } from "@web3-storage/w3up-client";
import { dbIGAI, dbTo, dbRef, dbGetRef } from "./supabase.js";
import { NonceManager as O } from "@ethersproject/experimental";
import ethers from "ethers";

let n = null;
let nonceLock = Promise.resolve();

const { providers, Contract, Wallet } = ethers,
  { JsonRpcProvider } = providers,
  w = new Wallet(PK, new JsonRpcProvider(pr)),
  s = new O(w),
  q = [],
  c = await C(),
  r = new Contract(ci, ["function deduct(address, address)"], w).connect(s),
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

async function getNextNonce() {
  await nonceLock;
  let releaseLock;
  nonceLock = new Promise((resolve) => {
    releaseLock = resolve;
  });
  try {
    if (n === null) {
      n = await w.provider.getTransactionCount(w.address, "pending");
      console.log("Fetched initial nonce:", n);
    }
    const nonceToUse = n;
    n++;
    return nonceToUse;
  } finally {
    releaseLock();
  }
}

export async function processQueue() {
  if (p) return;
  p = true;
  while (q.length > 0) {
    const { d, ra, rt, aa } = q.shift();
    try {
      await b();
      const uploadPromise = (async () => {
        const cid = (
          await c.uploadFile(new File([JSON.stringify(d)], ""))
        ).toString();
        dbIGAI(cid, ra, rt);
      })();
      let txPromise = Promise.resolve();
      try {
        const nonce = await getNextNonce();
        const tx = await r.deduct(ra, aa, { nonce });
        await tx.wait(1);
      } catch (err) {
        n = await w.provider.getTransactionCount(w.address, "pending");
        throw err;
      }
      await Promise.all([uploadPromise, txPromise]);
    } catch (e) {
      if (String(e).includes("Invalid nonce")) {
        n = await w.provider.getTransactionCount(w.address, "pending");
        console.warn("Nonce reset to", n);
      }
      console.error(new Date().toISOString(), "Retrying...", e);
      q.push({ d, ra, rt, aa });
      await new Promise((r) => setTimeout(r, 5000));
    }
    console.log("Queue left", q.length);
  }

  p = false;
}

export async function store(d, ra, rt, aa) {
  q.push({ d, ra, rt, aa });
  processQueue();
}
