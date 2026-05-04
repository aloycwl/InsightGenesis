export function guardrailRoute(query) {
  if (!query || typeof query !== "string")
    return { route: "none", reason: "invalid query" };

  const q = query.toLowerCase();

  if (
    q.includes("average") ||
    q.includes("avg") ||
    q.includes("mean") ||
    q.includes("trend") ||
    q.includes("correlation") ||
    q.includes("count") ||
    q.includes("how many")
  )
    return { route: "neon" };

  if (
    q.includes("similar") ||
    q.includes("like") ||
    q.includes("pattern") ||
    q.includes("cluster") ||
    q.includes("anomaly")
  )
    return { route: "qdrant" };

  return { route: "none" };
}
