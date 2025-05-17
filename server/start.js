import express from "express";
import path from "path";
import { ci, cr, mp, MA } from "./config.js";
import { dbAuth as da } from "./supabase.js";
import { Magic } from "@magic-sdk/admin";
import { upload as up, referral as sr } from "./onchain.js";
import { digiPrint, getIframe } from "./ig.js";

const ap = express();
ap.set("view engine", "ejs");
ap.set("views", path.join(process.cwd(), "views"));
ap.use(express.json());

ap.get("/", (_, re) => {
  re.render("example");
});

ap.get("/ml", (_, re) => {
  re.render("ml", { mp });
});

ap.get("/mm", (_, re) => {
  re.render("mm", { mp });
});

ap.get("/referral", da, async (rq, re) => {
  await sr(rq.headers.to, rq.headers.from);
  re.sendStatus(200);
});

ap.get("/scan", async (rq, re) => {
  const fr = await getIframe(rq.query.addr);
  re.render("scan", { fr });
});

ap.get("/topup", (_, re) => {
  re.render("topup", { ci, cr });
});

ap.post("/upload", da, async (rq, re) => {
  await up(rq.body, rq.headers.addr, rq.headers.type, rq.addr);
  re.sendStatus(200);
});

ap.post("/mls", async (rq, re) => {
  const md = await new Magic(MA).users.getMetadataByToken(
    rq.headers.m,
  );
  re.send(md.publicAddress);
});

/* FOR TESTING ONLY */
ap.post("/digiPrint", da, async (_, rs) => {
  rs.send(await digiPrint());
});

ap.post("/getIframe", da, async (_, rs) => {
  rs.send(await getIframe());
});

ap.listen(80, () => {});
