import { createClient as cc } from "@supabase/supabase-js";
import { su, SB } from "./config.js";

const s = cc(su, SB);

export const dbAuth = async (q, r, next) => {
  try {
    const k = q.headers.auth,
      { data } = await s.from("keys").select("credit").eq("k", k).single();
    if (!data || typeof data.credit !== "number" || data.credit <= 0)
      return r.sendStatus(401);
    await s
      .from("keys")
      .update({ credit: data.credit - 1 })
      .eq("k", k);
    next();
  } catch (e) {
    console.log(e);
  }
};

export async function dbIGAI(a, b, c) {
  try {
    await s.from("igai").insert([{ cid: a, addr: b, type: c }]);
  } catch (e) {
    console.log(e);
  }
}

export async function dbRef(a, b) {
  try {
    await s.from("ref").insert([{ to: a, from: b }]);
  } catch (e) {
    console.log(e);
  }
}

export async function dbNew(a, t) {
  try {
    const q = s.from("igai").select("cid").eq("addr", a);
    return !(await (t > 2 ? q.gt("type", 2) : q.eq("type", t)).limit(1).single()
      .data);
  } catch (e) {
    return e;
  }
}

export async function dbTo(a) {
  try {
    return !(await s.from("ref").select("to").eq("to", a).limit(1).single())
      .data;
  } catch (e) {
    return e;
  }
}

export async function dbV(a) {
  try {
    return (await s.from("vtype").select("type").eq("id", a).single()).data
      .type;
  } catch (e) {
    return e;
  }
}

export async function dbCID() {
  try {
    const cid = (
      await s
        .from("igai")
        .select("cid")
        .or("m.is.null,m.neq.true")
        .order("id", { ascending: true })
        .limit(1)
        .maybeSingle()
    ).data.cid;

    await s.from("igai").update({ m: true }).eq("cid", cid);
    
    return cid;
  } catch (e) {
    return e;
  }
}

export async function dbGetRef(a) {
  try {
    const [b, c] = await Promise.all([
      s.from("ref").select("from").ilike("to", a).limit(1).single(),
      s.from("ref").select("to").ilike("from", a),
    ]);

    return {
      from: b.data?.from || null,
      to: c.data ? c.data.map((row) => row.to) : [],
    };
  } catch (e) {
    return e;
  }
}
