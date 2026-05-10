import cors from "cors";
import express from "express";
import multer from "multer";
import path from "path";
import { aa, MA, GH } from "./config.js";
import { dbAuth as A, dbLog as L, dbCredits as C, dbHistory as H } from "./supabase.js";
import { fileURLToPath as P } from "url";
import { iframe as F, print as G, voice as V } from "./ig.js";
import { ref as R, store as S, getInfo as I } from "./onchain.js";
import { Magic as M } from "@magic-sdk/admin";
import { mm } from "./migrate.js";
import { guardrailRoute } from "./guardrail.js";
import { infer } from "./infer.js";

const e = express(),
  u = multer({ dest: "tmp/" });
e.use(cors());
e.use(express.json());
e.use(L);
e.use(
  express.static(
    path.join(path.dirname(P(import.meta.url)), "../frontend/build"),
  ),
);

e.get("/github", async (_, r) => {
  r.send(GH);
});

e.get("/iframe", A, async (q, r) => {
  r.send(await F(q.query.g, q.query.y));
});

e.get("/foot", A, async (q, r) => {
  r.send(await G(q.query.e, q.query.c, q.query.n));
});

e.get("/ref", async (q, r) => {
  await R(q.headers.t, q.headers.f);
  r.sendStatus(200);
});

e.get("/les", async (q, r) => {
  r.send((await new M(MA).users.getMetadataByToken(q.headers.m)).publicAddress);
});

e.get("/info", async (q, r) => {
  r.send(await I(q.query.addr));
});

e.get("/m", async (_, r) => {
  await mm();
  r.sendStatus(200);
});

e.post("/store", async (q, r) => {
  await S(q.body, q.headers.addr, q.headers.type, aa);
  r.sendStatus(200);
});

e.post("/v", A, u.single("audio"), async (q, r) => {
  V(q.file, q.body.v, q.body.a, r);
});

e.post("/infer", A, async (q, r) => {
  try {
    const query = q.body.query,
      decision = guardrailRoute(query);
    if (decision.route === "none") return r.send("Query unrelated");
    const result = await infer(decision.route, query);
    r.send(result);
  } catch (err) {
    console.error(err);
    r.status(500).send("internal error");
  }
});

e.get("/credits", async (q, r) => {
  const k = q.headers.auth;
  if (!k) return r.status(400).json({ error: "Missing auth header" });
  const credit = await C(k);
  if (credit === null) return r.status(404).json({ error: "Key not found" });
  r.json({ credit });
});

e.get("/history", async (q, r) => {
  const k = q.headers.auth;
  if (!k) return r.status(400).json({ error: "Missing auth header" });
  const page = Math.max(1, parseInt(q.query.page) || 1);
  const result = await H(k, page);
  if (!result) return r.status(404).json({ error: "Key not found" });
  r.json({ page, data: result.data, hasMore: result.hasMore });
});

e.get("/example", (_, r) => {
  r.sendFile(path.join(path.dirname(P(import.meta.url)), "../example.html"));
});

e.get("*", (_, r) => {
  r.sendFile(
    path.join(path.dirname(P(import.meta.url)), "../frontend/build/index.html"),
  );
});

e.listen(5000, () => {
  console.log("Server running on port 5000");
});

e.use((err, _req, res, next) => {
  console.error("Unhandled error:", err);

  if (res.headersSent) return next(err);

  res.status(500).json({
    error: "Internal server error",
  });
});