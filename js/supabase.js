import { createClient as cc } from "@supabase/supabase-js";
import { su, SB } from "./config.js";

const s = cc(su, SB);

export const dbAuth = async (q, r, next) => {
  const k = q.headers.auth,
    { data } = await s.from("keys").select("credit").eq("k", k).single();
  if (!data || data.credit <= 0) return r.sendStatus(401);
  await s
    .from("keys")
    .update({ credit: data.credit - 1 })
    .eq("k", k);
  next();
};

export async function dbIGAI(a, b, c) {
  await s.from("igai").insert([{ cid: a, addr: b, type: c }]);
}

export async function dbNew(a, t) {
  const q = s.from("igai").select("cid").eq("addr", a);
  return !(await (t > 2 ? q.gt("type", 2) : q.eq("type", t)).limit(1).single()
    .data);
}

export async function dbTo(a) {
  return !(await s.from("ref").select("to").eq("to", a).limit(1).single()).data;
}

export async function dbV(a) {
  return (await s.from("vtype").select("type").eq("id", a).single()).data.type;
}

export async function dbRef(a, b) {
  await s.from("ref").insert([{ to: a, from: b }]);
}
