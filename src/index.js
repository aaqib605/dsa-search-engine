import express from "express";
import cors from "cors";

import { problems, docVectors, preprocess, idf } from "./tfidfIndex.js";

const app = express();
app.use(cors(), express.json());

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

app.post("/search", (req, res) => {
  const { query } = req.body;
  if (!query || !query.trim()) {
    return res.status(400).json({ error: "Query cannot be empty." });
  }

  const tokens = preprocess(query);
  const tfq = {};

  tokens.forEach((t) => (tfq[t] = (tfq[t] || 0) + 1));

  const qLen = tokens.length;

  const qVec = Object.fromEntries(
    Object.entries(tfq).map(([t, count]) => [t, (count / qLen) * idf(t)])
  );

  const results = problems
    .map((p, i) => ({
      id: p.id,
      platform: p.platform,
      title: p.title,
      url: p.url,
      score: cosineSim(qVec, docVectors[i]),
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  res.json({ results });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔍 Search API listening on http://localhost:${PORT}`);
});
