export function guardrailRoute(query) {
  if (!query || typeof query !== "string")
    return { route: "none", reason: "invalid query" };

  const q = query.toLowerCase();

  if (
    q.includes("average") ||
    q.includes("correlation") ||
    q.includes("count") ||
    q.includes("how many")
  )
    return { route: "neon" };

  if (
      q.includes("high") ||
      q.includes("low") ||
      q.includes("similar") ||
      q.includes("pattern") ||
      q.includes("risk") ||
      q.includes("stress") ||
      q.includes("heart")
    )
    return { route: "qdrant" };

  return { route: "none" };
}
