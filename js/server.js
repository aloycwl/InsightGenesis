import cors from "cors";
import express from "express";
import multer from "multer";
import path from "path";
import { aa, MA, GH } from "./config.js";
import { fileURLToPath as P } from "url";
import { iframe as F, print as G, voice as V } from "./ig.js";
import { Magic as M } from "@magic-sdk/admin";
import { ref as R, store as S } from "./onchain.js";

const e = express(),
  u = multer({ dest: "tmp/" });
e.use(cors());
e.use(express.json());
e.use(
  express.static(
    path.join(path.dirname(P(import.meta.url)), "../frontend/build"),
  ),
);

e.get("/github", async (_, r) => {
  r.send(GH);
});

e.get("/iframe", async (q, r) => {
  r.send(await F(q.query.g, q.query.y));
});

e.get("/foot", async (q, r) => {
  r.send(await G(q.query.e, q.query.c, q.query.n));
});

e.get("/ref", async (q, r) => {
  await R(q.headers.t, q.headers.f);
  r.sendStatus(200);
});

e.get("/les", async (q, r) => {
  r.send((await new M(MA).users.getMetadataByToken(q.headers.m)).publicAddress);
});

e.post("/store", async (q, r) => {
  await S(q.body, q.headers.addr, q.headers.type, aa);
  r.sendStatus(200);
});

e.post("/v", u.single("audio"), async (q, r) => {
  V(q.file, q.body.v, q.body.a, r);
});

e.get("/example", (_, r) => {
  r.sendFile(path.join(path.dirname(P(import.meta.url)), "../example.html"));
});

e.get("*", (_, r) => {
  r.sendFile(
    path.join(path.dirname(P(import.meta.url)), "../frontend/build/index.html"),
  );
});

e.listen(80, () => {});
