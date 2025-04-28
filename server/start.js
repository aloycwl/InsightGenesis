import express from "express";
import multer from "multer";
import path from "path";
import { dbSelect, dbInsert, dbDelete } from "./supabase.js";
import { fileURLToPath } from "url";
import { isPaid } from "./isPaid.js";
import { setReferral } from "./referral.js";
import { setPaid } from "./pay.js";
import { upload } from "./upload.js";

const ap = express();
const ul = multer({ dest: "uploads/" });
const dn = path.dirname(fileURLToPath(import.meta.url));

ap.get("/pay", (re, rq) => {
  rq.sendFile(path.join(dn, "../public", "pay.html"));
});

ap.post("/upload", ul.single("file"), async (re, rs) => {
  await upload(re);
  rs.send("200");
});

ap.post("/setReferral", ul.none(), async (re, rs) => {
  await setReferral(re.body);
  rs.send("200");
});

ap.post("/setPaid", ul.none(), async (re, rs) => {
  await setPaid(re.body);
  rs.send("200");
});

ap.post("/isPaid", ul.none(), async (re, rs) => {
  rs.send(await isPaid(re.body.addr));
});

ap.post("/dbSelect", ul.none(), async (re, rs) => {
  rs.send(await dbSelect(re.body.email));
});

ap.post("/dbInsert", ul.none(), async (re, rs) => {
  await dbInsert(re.body);
  rs.send("200");
});

ap.post("/dbDelete", ul.none(), async (re, rs) => {
  await dbDelete(re.body.email);
  rs.send("200");
});

ap.listen(80, () => {
  console.log("Started");
});
