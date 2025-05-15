import { dbIGAI } from "./supabase.js";
import { PinataSDK as ps } from "pinata";

export async function upload(re) {
  const pn = new ps({
    pinataJwt: process.env.PJ,
    pinataGateway: "amber-implicit-jay-463.mypinata.cloud",
  });

  const { cid } = await pn.upload.public.file(
    new Blob([JSON.stringify(re.body)], { type: "application/json" }),
  );

  dbIGAI(cid, re.headers.addr);
}
