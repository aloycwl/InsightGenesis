import { ci, pr, PJ, PK, D, M } from "./config.js";
import { create } from "@web3-storage/w3up-client";
import { dbIGAI, dbNew, dbTo, dbRef } from "./supabase.js";
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
  if (await dbNew(ra)) {
    const t = await new Contract(
      ci,
      ["function deduct(address, address)"],
      w.provider,
    )
      .connect(w)
      .deduct(ra, aa);
    await t.wait();
  }

  const c = await create();
  await c.login(M);
  await c.setCurrentSpace(D);

  dbIGAI(
    (await c.uploadFile(new File([JSON.stringify(d)], ""))).toString(),
    ra,
    rt,
  );
}
