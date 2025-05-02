import fs from "fs";
import stopword from "stopword";
import natural from "natural";

const problems = JSON.parse(
  fs.readFileSync(
    new URL("../problems/all_problems.json", import.meta.url),
    "utf8"
  )
);

export function preprocess(text) {
  return stopword
    .removeStopwords(
      text
        .toLowerCase()
        .replace(/[^a-z0-9 ]+/g, " ")
        .split(/\s+/)
    )
    .map((w) => natural.PorterStemmer.stem(w))
    .filter(Boolean);
}

const docTokens = problems.map((p) =>
  preprocess([p.title, p.description, ...(p.tags || [])].join(" "))
);

const N = docTokens.length;
const df = {};
docTokens.forEach((tokens) => {
  new Set(tokens).forEach((term) => (df[term] = (df[term] || 0) + 1));
});

export const idf = (term) => Math.log10(N / (df[term] + 1));

export const docVectors = docTokens.map((tokens) => {
  const tf = {};
  tokens.forEach((t) => (tf[t] = (tf[t] || 0) + 1));
  const len = tokens.length;
  return Object.fromEntries(
    Object.entries(tf).map(([t, count]) => [t, (count / len) * idf(t)])
  );
});

export { problems };
