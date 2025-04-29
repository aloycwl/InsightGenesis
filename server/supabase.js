import { createClient } from "@supabase/supabase-js";
import { su } from "./global.js";

const sb = createClient(su, process.env.SB);

export async function dbSelect(re) {
  const { data } = await sb.from("insight").select("cid").eq("email", re);
  return data;
}

export async function dbInsert(rc, re) {
  if ((await dbSelect(re)).length === 0)
    await sb.from("insight").insert([{ cid: rc, email: re }]);
  else await sb.from("insight").update({ cid: rc }).eq("email", re);
}

export async function dbDelete(re) {
  await sb.from("insight").delete().eq("email", re);
}
