import express from "express";
import path from "path";
import { aa, ci, cr, mp, MA } from "./config.js";
import { Magic } from "@magic-sdk/admin";
import { store as up, ref as sr } from "./onchain.js";
import { getIframe } from "./ig.js";

const ap = express();
ap.set("view engine", "ejs");
ap.set("views", path.join(process.cwd(), "views"));
ap.use(express.json());

ap.get("/", (_, re) => {
  re.render("example");
});

ap.get("/ml", (rq, re) => {
  const rf = rq.query.ref || "",
    em = rq.query.ref || "";
  re.render("ml", { mp, rf, em });
});

ap.post("/mls", async (rq, re) => {
  re.send(
    (await new Magic(MA).users.getMetadataByToken(rq.headers.m)).publicAddress,
  );
});

ap.get("/mm", (rq, re) => {
  const rf = rq.query.ref || "";
  re.render("mm", { rf });
});

ap.post("/ref", async (rq, re) => {
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

ap.post("/store", async (rq, re) => {
  await up(rq.body, rq.headers.addr, rq.headers.type, aa);
  re.sendStatus(200);
});

ap.listen(80, () => {});
