(() => {
  const cardSelector =
    ".group.flex.flex-col.rounded-\\[8px\\].duration-300.bg-fill-quaternary.dark\\:bg-fill-quaternary";

  const cards = Array.from(document.querySelectorAll(cardSelector));

  const data = cards.map((card) => {
    const titleEl = card.querySelector(".ellipsis.line-clamp-1");
    const href = card.getAttribute("href");

    return {
      title: titleEl?.textContent.trim() || "",
      url: href ? `https://leetcode.com${href.trim()}` : "",
    };
  });

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "leetcode_problems.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  console.log(`✅ Exported ${data.length} problems to leetcode_problems.json`);
})();
