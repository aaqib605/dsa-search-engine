import puppeteer from "puppeteer";

const scrapeLeetcode = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://leetcode.com/problemset/");

  await page.waitForSelector('a[id="1"]');

  const problems = await page.evaluate(() => {
    const sel = [
      "a.group",
      "flex",
      "flex-col",
      "rounded-\\[8px\\]",
      "duration-300",
    ].join(".");

    const nodes = Array.from(document.querySelectorAll(sel));

    return nodes.map((el) => ({
      title: el.querySelector(".ellipsis.line-clamp-1")?.textContent.trim(),
      url: el.href,
    }));
  });

  console.log("Result:", problems);

  await browser.close();
};

scrapeLeetcode();
