import axios from "axios";

const QDRANT_URL = process.env.QDRANT_URL;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;

// --- QDRANT QUERY ---
async function runQdrant(query) {
  const res = await axios.post(
    `${QDRANT_URL}/collections/health_embeddings/points/query`,
    {
      query: {
        text: query,
        model: "sentence-transformers/all-minilm-l6-v2",
      },
      limit: 5,
    },
    {
      headers: {
        "api-key": QDRANT_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data.result.points;
}

// --- NEON QUERY (placeholder) ---
async function runNeon(query) {
  // replace with real SQL later
  return {
    message: "Neon query placeholder",
    query,
  };
}

// --- MAIN INFERENCE ---
export async function infer(route, query) {
  if (route === "qdrant") {
    const data = await runQdrant(query);
    return { type: "qdrant", ...data };
  }

  if (route === "neon") {
    const data = await runNeon(query);
    return { type: "neon", data };
  }
}