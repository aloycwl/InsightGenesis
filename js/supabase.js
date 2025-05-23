import { createClient as cc } from "@supabase/supabase-js";
import { su } from "./config.js";

const sb = cc(su, process.env.SB);

export const dbAuth = async (rq, re, next) => {
  const { data } = await sb
    .from("keys")
    .select("addr")
    .eq("key", rq.headers.authorization);

  if (data.length === 0) return re.sendStatus(401);

  rq.addr = data[0].addr;
  next();
};

export async function dbIGAI(ci, ad, ty) {
  await sb.from("igai").insert([{ cid: ci, addr: ad, type: ty }]);
}

export async function dbNew(ad) {
  const { data } = await sb
    .from("igai")
    .select("cid")
    .eq("addr", ad)
    .limit(1)
    .single();
  return !data;
}

export async function dbTo(rt) {
  const { data } = await sb
    .from("ref")
    .select("to")
    .eq("to", rt)
    .limit(1)
    .single();
  return !data;
}

export async function dbRef(rt, rf) {
  await sb.from("ref").insert([{ to: rt, from: rf }]);
}
