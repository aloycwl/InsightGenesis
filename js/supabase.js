import { createClient as cc } from "@supabase/supabase-js";
import { su, SB } from "./config.js";

const s = cc(su, SB);

// export const dbAuth = async (rq, re, next) => {
//   const { data } = await s
//     .from("keys")
//     .select("addr")
//     .eq("key", rq.headers.authorization);

//   if (data.length === 0) return re.sendStatus(401);

//   rq.addr = data[0].addr;
//   next();
// };

export async function dbIGAI(a, b, c) {
  await s.from("igai").insert([{ cid: a, addr: b, type: c }]);
}

export async function dbNew(a) {
  return !(await s.from("igai").select("cid").eq("addr", a).limit(1).single())
    .data;
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
