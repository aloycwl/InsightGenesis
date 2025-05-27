import express from "express";
import path from "path";
import { aa, MA, GH } from "./config.js";
import { fileURLToPath as P } from "url";
import { getIframe as F } from "./ig.js";
import { Magic as M } from "@magic-sdk/admin";
import { ref as R, store as S } from "./onchain.js";

const ap = express();
ap.use(express.json());

ap.use(
  express.static(
    path.join(path.dirname(P(import.meta.url)), "../frontend/build"),
  ),
);

ap.get("/github", async (_, r) => {
  r.send(GH);
});

ap.get("/iframe", async (_, r) => {
  r.send(await F());
});

ap.post("/ref", async (q, r) => {
  await R(q.headers.to, q.headers.from);
  r.sendStatus(200);
});

ap.post("/les", async (q, r) => {
  r.send((await new M(MA).users.getMetadataByToken(q.headers.m)).publicAddress);
});

ap.post("/store", async (q, r) => {
  await S(q.body, q.headers.addr, q.headers.type, aa);
  r.sendStatus(200);
});

ap.get("*", (_, r) => {
  r.sendFile(
    path.join(path.dirname(P(import.meta.url)), "../frontend/build/index.html"),
  );
});

ap.listen(80, () => {});
