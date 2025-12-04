const chart = document.getElementById("chart");
const template = document.getElementById("countryRowTemplate");
const sortSelect = document.getElementById("sortSelect");
const femaleAdvantageCheckbox = document.getElementById("femaleAdvantage");
const searchInput = document.getElementById("searchInput");

const scale = (value, max) => `${(value / max) * 100}%`;

const renderRows = () => {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = lifeExpectancyData
    .map((row) => ({ ...row, gap: +(row.female - row.male).toFixed(1) }))
    .filter((row) => row.country.toLowerCase().includes(query))
    .filter((row) => (femaleAdvantageCheckbox.checked ? row.gap > 0 : true));

  if (filtered.length === 0) {
    chart.innerHTML = "<p class='empty'>No countries match that filter.</p>";
    return;
  }

  const maxValue = Math.max(...filtered.map((row) => Math.max(row.female, row.male)));

  const sorted = filtered.sort((a, b) => {
    switch (sortSelect.value) {
      case "female":
        return b.female - a.female;
      case "male":
        return b.male - a.male;
      case "alphabetical":
        return a.country.localeCompare(b.country);
      default:
        return b.gap - a.gap;
    }
  });

  chart.innerHTML = "";

  sorted.forEach((row) => {
    const clone = template.content.cloneNode(true);
    const root = clone.querySelector(".country-row");
    root.setAttribute("aria-label", `${row.country}: female ${row.female} years, male ${row.male} years`);

    clone.querySelector(".country-name").textContent = row.country;
    clone.querySelector(".country-gap").textContent =
      row.gap > 0
        ? `${row.gap.toFixed(1)} years longer for women`
        : `${Math.abs(row.gap).toFixed(1)} years longer for men`;

    const femaleBar = clone.querySelector(".female-bar");
    const maleBar = clone.querySelector(".male-bar");

    femaleBar.style.width = scale(row.female, maxValue);
    maleBar.style.width = scale(row.male, maxValue);

    femaleBar.querySelector(".bar-label").textContent = "Female";
    maleBar.querySelector(".bar-label").textContent = "Male";

    femaleBar.querySelector(".bar-value").textContent = `${row.female.toFixed(1)} yrs`;
    maleBar.querySelector(".bar-value").textContent = `${row.male.toFixed(1)} yrs`;

    chart.appendChild(clone);
  });
};

sortSelect.addEventListener("change", renderRows);
femaleAdvantageCheckbox.addEventListener("change", renderRows);
searchInput.addEventListener("input", renderRows);

renderRows();
