(() => {
  const cardSelector = "._tableBody_1d2cm_379";

  const cards = Array.from(document.querySelectorAll(cardSelector));

  const data = cards.map((card) => {
    const titleEl = card.querySelector("a").textContent;
    const href = card.querySelector("a").getAttribute("href");

    return {
      title: titleEl,
      url: href,
    };
  });

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "codechef_problems.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  console.log(`✅ Exported ${data.length} problems to codechef_problems.json`);
})();
