import axios from "axios";
import pkg from "pg";
import { DU, QK, QU, NK, HF } from "./config.js";

const { Pool } = pkg,
  pool = new Pool({ connectionString: DU }),
  cache = new Map();

export async function embed(text) {
  const key = text.trim().toLowerCase();
  if (cache.has(key)) return cache.get(key);

  const res = await axios.post(
    "https://router.huggingface.co/hf-inference/models/BAAI/bge-small-en-v1.5",
    { inputs: text },
    {
      headers: {
        Authorization: `Bearer ${HF}`,
        "Content-Type": "application/json",
      },
    },
  );

  let vector = res.data;
  while (Array.isArray(vector) && Array.isArray(vector[0])) vector = vector[0];
  if (!Array.isArray(vector) || vector.length !== 384)
    throw new Error("Invalid embedding returned");
  cache.set(key, vector);
  return vector;
}

export async function runQdrant(query) {
  const vector = await embed(query),
    res = await axios.post(
      `${QU}/collections/health_embeddings/points/search`,
      {
        vector: { name: "embedding", vector: vector },
        limit: 5,
        with_payload: true,
      },
      {
        headers: { "api-key": QK, "Content-Type": "application/json" },
      },
    );
  return res.data.result;
}

async function runNeon(query) {
  const q = query.toLowerCase();
  if (q.includes("average heart")) {
    const res = await pool.query(
      "SELECT AVG(heart_rate) AS avg_heart_rate FROM public.health_records",
    );
    return {
      metric: "average_heart_rate",
      value: res.rows[0].avg_heart_rate,
    };
  }
  if (q.includes("average stress")) {
    const res = await pool.query(
      "SELECT AVG(stress_score) AS avg_stress FROM public.health_records",
    );
    return { metric: "average_stress", value: res.rows[0].avg_stress };
  }
  if (q.includes("correlation")) {
    const res = await pool.query(`
      SELECT corr(heart_rate, general_wellness) AS correlation
      FROM public.health_records
      WHERE heart_rate IS NOT NULL
      AND general_wellness IS NOT NULL
    `);
    return {
      metric: "heart_vs_wellness_correlation",
      value: res.rows[0].correlation,
    };
  }
  if (q.includes("how many")) {
    const res = await pool.query("SELECT COUNT(*) FROM public.health_records");
    return { metric: "total_records", value: res.rows[0].count };
  }
  return { message: "No matching analytics query" };
}

async function explainWithLLM(query, data) {
  const prompt = `
User query: ${query}
Data:
${JSON.stringify(data)}
Explain clearly (non-medical advice): 1. what this means 2. key insight 3. any pattern
`;
  const res = await axios.post(
    "https://integrate.api.nvidia.com/v1/chat/completions",
    {
      model: "z-ai/glm4.7",
      messages: [{ role: "user", content: prompt }],
      temperature: 1,
      top_p: 1,
      max_tokens: 1000,
      stream: false,
      chat_template_kwargs: { enable_thinking: false, clear_thinking: true },
    },
    {
      headers: {
        Authorization: `Bearer ${NK}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  );

  const msg = res.data?.choices?.[0]?.message;
  return msg.content;
}

export async function infer(route, query) {
  return await explainWithLLM(
    query,
    route === "qdrant" ? await runQdrant(query) : await runNeon(query),
  );
}
