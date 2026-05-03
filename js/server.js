import cors from "cors";
import express from "express";
import multer from "multer";
import path from "path";
import { aa, MA, GH } from "./config.js";
import { dbAuth as A } from "./supabase.js";
import { fileURLToPath as P } from "url";
import { iframe as F, print as G, voice as V } from "./ig.js";
import { ref as R, store as S, getInfo as I } from "./onchain.js";
import { Magic as M } from "@magic-sdk/admin";
import { mm } from "./migrate.js";
import { guardrailCheck, queryQdrant, generateResponse } from "./qdrant.js";

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

e.post("/query-health", async (q, r) => {
  try {
    const { query } = q.body;
    if (!query) {
      return r.status(400).send({ error: "Query text is required" });
    }

    // 1. Guardrail Check
    const isHealthRelated = await guardrailCheck(query);
    if (!isHealthRelated) {
      return r.status(403).send({
        error: "Query rejected by guardrail: Only health-related queries are allowed."
      });
    }

    // 2. Query Qdrant Vector Database
    const qdrantResults = await queryQdrant(query);

    // 3. Generate Response based on Context
    const finalResponse = await generateResponse(query, qdrantResults);

    r.send({ response: finalResponse, context: qdrantResults });
  } catch (error) {
    console.error("Health Query Error:", error);
    r.status(500).send({ error: error.message || "Internal server error" });
  }
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
