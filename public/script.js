const form = document.getElementById("search-form");
const input = document.getElementById("query-input");
const resultsDiv = document.getElementById("results");
const spinner = document.getElementById("spinner");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = input.value.trim();
  if (!query) return;

  resultsDiv.innerHTML = "";
  spinner.classList.remove("hidden");

  try {
    const res = await fetch("/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const { results } = await res.json();

    spinner.classList.add("hidden");

    if (results.length === 0) {
      resultsDiv.innerHTML = "<p>No matches found.</p>";
      return;
    }

    resultsDiv.innerHTML = results
      .map((r, i) => {
        const snippet = r.description ? r.description.slice(0, 120) + "…" : "";
        return `
            <div class="card${i === 0 ? " featured" : ""}">
            <div class="card-header">
                <img src="logos/${r.platform.toLowerCase()}.png"
                    alt="${r.platform} logo"
                    class="platform-logo"/>
                <a href="${r.url}" target="_blank" class="card-title">
                [${r.platform}] ${r.title}
                </a>
            </div>
            ${snippet ? `<div class="card-snippet">${snippet}</div>` : ""}
            </div>
        `;
      })
      .join("");
  } catch (err) {
    spinner.classList.add("hidden");
    console.error(err);
    resultsDiv.innerHTML = `<p>Error: ${err.message}</p>`;
  }
});
