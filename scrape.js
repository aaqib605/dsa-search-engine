import puppeteer from "puppeteer";
import fs from "fs";

const scrapeLeetcodeProblems = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--disable-blink-features=AutomationControlled"],
  });

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
        title: el
          .querySelector(".ellipsis.line-clamp-1")
          ?.textContent.trim()
          .split(". ")[1],
        url: el.href,
      }));
    }, problemSelector);

    prevCount = allProblems.length;
  }

  console.log(allProblems);

  fs.writeFileSync(
    "./problems/leetcode_problems.json",
    JSON.stringify(allProblems, null, 2)
  );

  await browser.close();
};

const scrapeCodeforcesProblems = async (pages = 3) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--disable-blink-features=AutomationControlled"],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
      "AppleWebKit/537.36 (KHTML, like Gecko) " +
      "Chrome/114.0.5735.199 Safari/537.36"
  );

  const allProblems = [];

  for (let p = 1; p <= pages; p++) {
    const url = `https://codeforces.com/problemset/page/${p}/`;

    await page.goto(url);

    await page.waitForSelector("table.problems");

    const problemsOnThisPage = await page.evaluate(() => {
      const tableBody = document.querySelector("tbody");
      const rows = Array.from(tableBody.querySelectorAll("tr"));

      return rows
        .map((row) => {
          const firstTd = row.querySelector("td:nth-child(1)");
          const secondTd = row.querySelector("td:nth-child(2)");

          if (firstTd && secondTd) {
            const problemId = firstTd.querySelector("a").textContent.trim();

            const problemName = secondTd.querySelector("a").textContent.trim();
            const problemLink = secondTd
              .querySelector("a")
              .getAttribute("href")
              .trim();

            return {
              title: `${problemId} ${problemName}`,
              url: `https://codeforces.com${problemLink}`,
            };
          }
        })
        .filter(Boolean);
    });

    console.log(`Scraped problems from page ${p}`);

    allProblems.push(...problemsOnThisPage);
  }

  console.log(allProblems);

  fs.writeFileSync(
    "./problems/codeforces_problems.json",
    JSON.stringify(allProblems, null, 2)
  );

  await browser.close();
};

scrapeLeetcodeProblems();
scrapeCodeforcesProblems();
