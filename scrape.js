import puppeteer from "puppeteer";
import fs from "fs";

const scrapeLeetcodeProblems = async () => {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
      "AppleWebKit/537.36 (KHTML, like Gecko) " +
      "Chrome/114.0.5735.199 Safari/537.36"
  );

  await page.goto("https://leetcode.com/problemset/");

  const problemSelector =
    "a.group.flex.flex-col.rounded-\\[8px\\].duration-300";

  await page.waitForSelector('a[id="1"]');

  let allProblems = [];
  let prevCount = 0;
  const TARGET = 300;

  while (allProblems.length < TARGET) {
    await page.evaluate((sel) => {
      const currProblemsOnPage = document.querySelectorAll(sel);

      if (currProblemsOnPage.length) {
        currProblemsOnPage[currProblemsOnPage.length - 1].scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }, problemSelector);

    await page.waitForFunction(
      (sel, prev) => document.querySelectorAll(sel).length > prev,
      {},
      problemSelector,
      prevCount
    );

    allProblems = await page.evaluate((sel) => {
      const nodes = Array.from(document.querySelectorAll(sel));

      return nodes.map((el) => ({
        title: el.querySelector(".ellipsis.line-clamp-1")?.textContent.trim(),
        url: el.href,
      }));
    }, problemSelector);

    prevCount = allProblems.length;
  }

  console.log(allProblems);

  fs.writeFileSync(
    "leetcode_problems.json",
    JSON.stringify(allProblems, null, 2)
  );

  await browser.close();
};

scrapeLeetcodeProblems();
