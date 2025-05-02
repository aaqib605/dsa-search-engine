import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const lcPath = path.resolve(__dirname, "../problems/leetcode_problems.json");
const cfPath = path.resolve(__dirname, "../problems/codeforces_problems.json");

const lc = JSON.parse(fs.readFileSync(lcPath, "utf8"));
const cf = JSON.parse(fs.readFileSync(cfPath, "utf8"));

const tag = (arr, name) =>
  arr.map((p) => ({
    platform: name,
    ...p,
  }));

const all = [...tag(lc, "LeetCode"), ...tag(cf, "Codeforces")];

const allProblemsPath = path.resolve(
  __dirname,
  "../problems/all_problems.json"
);

fs.writeFileSync(allProblemsPath, JSON.stringify(all, null, 2));
