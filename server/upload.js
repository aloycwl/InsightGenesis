import { dbIGAI as di } from "./supabase.js";
import { pg, PJ } from "./global.js";
import { PinataSDK as ps } from "pinata";

export async function upload(rd, ra, rt, aa) {
  const { cid } = await new ps({
    pinataJwt: PJ,
    pinataGateway: pg,
  }).upload.public.file(
    new Blob([JSON.stringify(rd)], { type: "application/json" }),
  );

  di(cid, ra, rt);

  // Chain activities
}
