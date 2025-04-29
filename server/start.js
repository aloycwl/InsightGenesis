import express from "express";
import multer from "multer";
import path from "path";
import { check } from "./check.js";
import { dbSelect, dbInsert, dbDelete } from "./supabase.js";
import { fileURLToPath as fp } from "url";
import { isPaid } from "./isPaid.js";
import { setReferral } from "./referral.js";
import { setPaid } from "./pay.js";
import { upload } from "./upload.js";

const ap = express();
const ul = multer({ dest: "uploads/" });
const dn = path.dirname(fp(import.meta.url));

ap.get("/pay", (_, rq) => {
  rq.sendFile(path.join(dn, "../public", "pay.html"));
});

ap.post("/upload", ul.single("file"), check, async (re, rs) => {
  await upload(re);
  rs.sendStatus(200);
});

ap.post("/setReferral", ul.none(), check, async (re, rs) => {
  await setReferral(re.body.referee, re.body.referral);
  rs.sendStatus(200);
});

ap.post("/setPaid", ul.none(), check, async (re, rs) => {
  await setPaid(re.body.addr);
  rs.sendStatus(200);
});

ap.post("/isPaid", ul.none(), check, async (re, rs) => {
  rs.send(await isPaid(re.body.addr));
});

ap.post("/dbSelect", ul.none(), check, async (re, rs) => {
  rs.send(await dbSelect(re.body.email));
});

ap.post("/dbInsert", ul.none(), check, async (re, rs) => {
  await dbInsert(re.body.cid, re.body.email);
  rs.sendStatus(200);
});

ap.post("/dbDelete", ul.none(), check, async (re, rs) => {
  await dbDelete(re.body.email);
  rs.sendStatus(200);
});

ap.listen(80, () => {
  console.log("Started");
});
