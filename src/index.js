import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { problems, docVectors, preprocess, idf } from "./tfidfIndex.js";
import { cosineSim } from "../utils/cosineSim.js";

const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors(), express.json());

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

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

app.listen(PORT, () => {
  console.log(`🔍 Search API listening on http://localhost:${PORT}`);
});
