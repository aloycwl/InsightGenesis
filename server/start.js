import express from "express";
import path from "path";
import { dbAuth as da } from "./supabase.js";
import { fileURLToPath as fp } from "url";
import { isPaid } from "./isPaid.js";
import { setReferral } from "./referral.js";
import { setPaid } from "./pay.js";
import { upload } from "./upload.js";
import { digiPrint, getIframe } from "./ig.js";

const ap = express();
ap.use(express.json());

ap.get("/pay", (_, rq) => {
  rq.sendFile(
    path.join(path.dirname(fp(import.meta.url)), "../public", "pay.html"),
  );
});

ap.post("/upload", da, async (rq, re) => {
  await upload(rq.body, rq.headers.addr, rq.headers.type, rq.addr);
  re.sendStatus(200);
});

ap.post("/setReferral", da, async (re, rq) => {
  await setReferral(re.headers.referee, re.headers.referral);
  rq.sendStatus(200);
});

ap.post("/setPaid", da, async (re, rs) => {
  await setPaid(re.headers.addr);
  rs.sendStatus(200);
});

ap.post("/isPaid", da, async (re, rs) => {
  rs.send(await isPaid(re.headers.addr));
});

/* FOR TESTING ONLY */
ap.post("/digiPrint", da, async (_, rs) => {
  rs.send(await digiPrint());
});

ap.post("/getIframe", da, async (_, rs) => {
  rs.send(await getIframe());
});

ap.listen(80, () => {});
