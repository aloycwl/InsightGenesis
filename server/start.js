import express from "express";
import multer from "multer";
import path from "path";
import { dbSelect, dbInsert, dbDelete, dbAuth } from "./supabase.js";
import { fileURLToPath as fp } from "url";
import { isPaid } from "./isPaid.js";
import { setReferral } from "./referral.js";
import { setPaid } from "./pay.js";
import { upload } from "./upload.js";
import { digiPrint, getIframe } from "./ig.js";

const ap = express();
const ul = multer({ dest: "uploads/" });
const dn = path.dirname(fp(import.meta.url));

ap.use(express.json());

ap.get("/pay", (_, rq) => {
  rq.sendFile(path.join(dn, "../public", "pay.html"));
});

ap.post("/upload", dbAuth, async (re, rs) => {
  await upload(re);
  rs.sendStatus(200);
});

ap.post("/setReferral", dbAuth, async (re, rs) => {
  await setReferral(re.body.referee, re.body.referral);
  rs.sendStatus(200);
});

ap.post("/setPaid", dbAuth, async (re, rs) => {
  await setPaid(re.body.addr);
  rs.sendStatus(200);
});

ap.post("/isPaid", dbAuth, async (re, rs) => {
  rs.send(await isPaid(re.body.addr));
});

ap.post("/dbSelect", dbAuth, async (re, rs) => {
  rs.send(await dbSelect(re.body.email));
});

ap.post("/dbInsert", dbAuth, async (re, rs) => {
  await dbInsert(re.body.cid, re.body.email);
  rs.sendStatus(200);
});

ap.post("/dbDelete", dbAuth, async (re, rs) => {
  await dbDelete(re.body.email);
  rs.sendStatus(200);
});

ap.post("/digiPrint", dbAuth, async (_, rs) => {
  rs.send(await digiPrint());
});

ap.post("/getIframe", dbAuth, async (_, rs) => {
  rs.send(await getIframe());
});

ap.listen(80, () => {});
