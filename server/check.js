import { createClient } from "@supabase/supabase-js";
import { su } from "./global.js";

export const check = async (rq, re, next) => {
  const sb = createClient(su, process.env.SB);
  const { data } = await sb.from("keys").select("num").eq("key", rq.body.key);

  if (data.length === 0) return re.sendStatus(401);
  next();
};
