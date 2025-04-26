function cosineSim(vecA, vecB) {
  let dot = 0,
    magA = 0,
    magB = 0;

  for (const [t, wA] of Object.entries(vecA)) {
    magA += wA * wA;
    dot += wA * (vecB[t] || 0);
  }

  for (const wB of Object.values(vecB)) {
    magB += wB * wB;
  }

  return dot / (Math.sqrt(magA) * Math.sqrt(magB) + 1e-9);
}

export { cosineSim };
