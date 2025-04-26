(() => {
  const tableBody = document.querySelector("tbody");

  const problemData = [];
  const rows = tableBody.querySelectorAll("tr");

  rows.forEach((row) => {
    const firstTd = row.querySelector("td:nth-child(1)");
    const secondTd = row.querySelector("td:nth-child(2)");

    if (firstTd && secondTd) {
      const problemId = firstTd.querySelector("a").textContent.trim();

      const problemName = secondTd.querySelector("a").textContent.trim();
      const problemLink = secondTd
        .querySelector("a")
        .getAttribute("href")
        .trim();

      problemData.push({
        title: `${problemId} ${problemName}`,
        href: `https://codeforces.com${problemLink}`,
      });
    }
  });

  const blob = new Blob([JSON.stringify(problemData, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "codeforces_problems.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  console.log(
    `✅ Exported ${problemData.length} problems to codeforces_problems.json`
  );
})();
