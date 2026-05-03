import axios from "axios";
import { NVIDIA_API_KEY, QDRANT_API, QDRANT_URL } from "./config.js";

// Uses NVIDIA's google/gemma-3n-e2b-it as a guardrail to check if the query is health-related
export async function guardrailCheck(query) {
  try {
    const prompt = `You are a strict guardrail classifier. Determine if the following user query is related to health, wellness, medicine, physiology, or biometric data (such as heart rate, blood pressure, etc.). Answer ONLY with "YES" if it is health-related, or "NO" if it is not. \n\nQuery: "${query}"`;

    const response = await axios.post(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        model: "google/gemma-3n-e2b-it",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 10,
        temperature: 0.0, // Low temperature for deterministic classification
      },
      {
        headers: {
          Authorization: `Bearer ${NVIDIA_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const answer = response.data.choices[0].message.content.trim().toUpperCase();
    return answer.includes("YES");
  } catch (error) {
    console.error("Guardrail API error:", error.response?.data || error.message);
    throw new Error("Failed to perform guardrail check");
  }
}

// Queries the remote Qdrant database using free inference
export async function queryQdrant(queryText) {
  try {
    // Qdrant base URL from config, default if not provided
    const qdrantBase = QDRANT_URL || "https://a3a732eb-6d72-42c2-bbab-3f2f930183b4.us-west-1-0.aws.cloud.qdrant.io:6333";
    const url = `${qdrantBase}/collections/health_embeddings/points/query`;

    const response = await axios.post(
      url,
      {
        query: {
          text: queryText,
          model: "sentence-transformers/all-minilm-l6-v2"
        },
        limit: 5 // get top 5 results
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": QDRANT_API,
        },
      }
    );

    return response.data.result;
  } catch (error) {
    console.error("Qdrant Query Error:", error.response?.data || error.message);
    throw new Error("Failed to query Qdrant vectors");
  }
}

// Uses NVIDIA's z-ai/glm4.7 to generate a response based on Qdrant context
export async function generateResponse(query, context) {
  try {
    const contextStr = JSON.stringify(context, null, 2);
    const prompt = `You are an AI assistant helping a user with a health-related question based on their personal biometric data.
Context Data (From Vector DB):
${contextStr}

User Question: ${query}

Provide a helpful, accurate, and supportive response using ONLY the information from the Context Data. If the answer is not contained in the Context Data, say so clearly. Do not invent information.`;

    const response = await axios.post(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        model: "z-ai/glm4.7",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1024,
      },
      {
        headers: {
          Authorization: `Bearer ${NVIDIA_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("LLM API error:", error.response?.data || error.message);
    throw new Error("Failed to generate response from LLM");
  }
}
