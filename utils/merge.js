import fs from "fs";

const lc = JSON.parse(
  fs.readFileSync("../scrapper/leetcode/leetcode_problems.json", "utf8")
);
const cf = JSON.parse(
  fs.readFileSync("../scrapper/codeforces/codeforces_problems.json", "utf8")
);
const cc = JSON.parse(
  fs.readFileSync("../scrapper/codechef/codechef_problems.json", "utf8")
);

let idCounter = 1;
const tag = (arr, name) =>
  arr.map((p) => ({
    id: idCounter++,
    platform: name,
    ...p,
  }));

const all = [
  ...tag(lc, "LeetCode"),
  ...tag(cf, "Codeforces"),
  ...tag(cc, "CodeChef"),
];

fs.writeFileSync("all_problems.json", JSON.stringify(all, null, 2));
