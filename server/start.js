import express from "express";
import path from "path";
import { dbAuth as da } from "./supabase.js";
import { fileURLToPath as fp } from "url";
import { isPaid } from "./isPaid.js";
import { setReferral as sr } from "./referral.js";
import { setPaid } from "./pay.js";
import { upload as up } from "./upload.js";
import { digiPrint, getIframe } from "./ig.js";

const ap = express();
ap.use(express.json());

ap.get("/topup", (_, rq) => {
  rq.sendFile(
    path.join(path.dirname(fp(import.meta.url)), "../public", "topup.html"),
  );
});

ap.post("/upload", da, async (rq, re) => {
  await up(rq.body, rq.headers.addr, rq.headers.type, rq.addr);
  re.sendStatus(200);
});

ap.post("/setReferral", da, async (rq, re) => {
  await sr(rq.headers.to, rq.headers.from);
  re.sendStatus(200);
});

/* FOR TESTING ONLY */
ap.post("/digiPrint", da, async (_, rs) => {
  rs.send(await digiPrint());
});

ap.post("/getIframe", da, async (_, rs) => {
  rs.send(await getIframe());
});

ap.listen(80, () => {});
