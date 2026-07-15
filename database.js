"use strict";

/*
  Published Google Sheets CSV.
  Replace this only if the published sheet URL changes.
*/
const spreadsheetUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRgE91s9ud9oFDhpllHUaBb0yVGOFwjyXCX0lwrKrnK8BQJTMKWc2g-5g4LdAd45zCXI-Ehduaschnm/pub?gid=0&single=true&output=csv";

/*
  Page elements
*/
const resultsContainer =
  document.querySelector("#database-results");

const resultCount =
  document.querySelector("#result-count");

const searchInput =
  document.querySelector("#search-input");

const sourceTypeFilter =
  document.querySelector("#source-type-filter");

const domainFilter =
  document.querySelector("#domain-filter");

const autonomyFilter =
  document.querySelector("#autonomy-filter");

const ipFilter =
  document.querySelector("#ip-filter");

const jurisdictionFilter =
  document.querySelector("#jurisdiction-filter");

const yearFilter =
  document.querySelector("#year-filter");

const clearFiltersButton =
  document.querySelector("#clear-filters");

/*
  This array will contain the cleaned spreadsheet records.
*/
let sources = [];

/*
  Download and parse the spreadsheet.
*/
function loadSources() {
  resultCount.textContent = "Loading sources...";

  Papa.parse(spreadsheetUrl, {
    download: true,
    header: true,
    skipEmptyLines: "greedy",

    complete(results) {
      if (results.errors.length > 0) {
        console.warn("CSV parsing warnings:", results.errors);
      }

      sources = results.data
        .map(cleanSource)
        .filter((source) => source.title);

      sortSources(sources);
      populateFilters();
      displaySources(sources);
    },

    error(error) {
      console.error("Database loading error:", error);

      resultCount.textContent =
        "The database could not be loaded.";

      resultsContainer.innerHTML = `
        <div class="source-card">
          <h2>Database unavailable</h2>

          <p>
            The published spreadsheet could not be retrieved.
            Check the Google Sheets publication settings and CSV URL.
          </p>
        </div>
      `;
    }
  });
}

/*
  Convert every spreadsheet cell into a clean,
  predictable JavaScript value.
*/
function cleanSource(row) {
  return {
    id: cleanText(row.id),
    title: cleanText(row.title),
    authors: cleanText(row.authors),
    year: cleanText(row.year),
    publication: cleanText(row.publication),
    sourceType: cleanText(row.sourceType),
    aerospaceDomain: cleanText(row.aerospaceDomain),
    autonomyType: cleanText(row.autonomyType),
    ipIssue: cleanText(row.ipIssue),
    jurisdiction: cleanText(row.jurisdiction),
    summary: cleanText(row.summary),
    relevance: cleanText(row.relevance),
    url: cleanText(row.url),
    doi: cleanText(row.doi),

    /*
      Separate keywords in Google Sheets with semicolons.

      Example:
      inventorship; adaptive control; patent law
    */
    keywords: cleanText(row.keywords)
      .split(";")
      .map((keyword) => keyword.trim())
      .filter(Boolean)
  };
}

function cleanText(value) {
  return String(value ?? "").trim();
}

/*
  Sort newest publications first.
  Items with the same year are sorted alphabetically.
*/
function sortSources(sourceList) {
  sourceList.sort((first, second) => {
    const firstYear = Number(first.year) || 0;
    const secondYear = Number(second.year) || 0;

    if (secondYear !== firstYear) {
      return secondYear - firstYear;
    }

    return first.title.localeCompare(second.title);
  });
}

/*
  Generate dropdown options from the actual spreadsheet values.
*/
function populateFilters() {
  populateSelect(
    sourceTypeFilter,
    sources.map((source) => source.sourceType),
    "All source types"
  );

  populateSelect(
    domainFilter,
    sources.map((source) => source.aerospaceDomain),
    "All aerospace domains"
  );

  populateSelect(
    autonomyFilter,
    sources.map((source) => source.autonomyType),
    "All autonomy types"
  );

  populateSelect(
    ipFilter,
    sources.map((source) => source.ipIssue),
    "All IP issues"
  );

  populateSelect(
    jurisdictionFilter,
    sources.map((source) => source.jurisdiction),
    "All jurisdictions"
  );

  populateSelect(
    yearFilter,
    sources.map((source) => source.year),
    "All years",
    true
  );
}

function populateSelect(
  selectElement,
  values,
  defaultLabel,
  descending = false
) {
  const uniqueValues = [...new Set(
    values
      .map((value) => cleanText(value))
      .filter(Boolean)
  )];

  if (descending) {
    uniqueValues.sort((first, second) => {
      return Number(second) - Number(first);
    });
  } else {
    uniqueValues.sort((first, second) => {
      return first.localeCompare(second);
    });
  }

  selectElement.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = defaultLabel;

  selectElement.appendChild(defaultOption);

  uniqueValues.forEach((value) => {
    const option = document.createElement("option");

    option.value = value;
    option.textContent = value;

    selectElement.appendChild(option);
  });
}

/*
  Build a single searchable string from each source.
*/
function getSearchableText(source) {
  return normalize([
    source.id,
    source.title,
    source.authors,
    source.year,
    source.publication,
    source.sourceType,
    source.aerospaceDomain,
    source.autonomyType,
    source.ipIssue,
    source.jurisdiction,
    source.summary,
    source.relevance,
    source.doi,
    ...source.keywords
  ].join(" "));
}

function normalize(value) {
  return cleanText(value).toLowerCase();
}

/*
  Apply search and dropdown filters.
*/
function filterSources() {
  const searchTerm = normalize(searchInput.value);

  const selectedSourceType = sourceTypeFilter.value;
  const selectedDomain = domainFilter.value;
  const selectedAutonomy = autonomyFilter.value;
  const selectedIpIssue = ipFilter.value;
  const selectedJurisdiction = jurisdictionFilter.value;
  const selectedYear = yearFilter.value;

  const filteredSources = sources.filter((source) => {
    const matchesSearch =
      !searchTerm ||
      getSearchableText(source).includes(searchTerm);

    const matchesSourceType =
      !selectedSourceType ||
      source.sourceType === selectedSourceType;

    const matchesDomain =
      !selectedDomain ||
      source.aerospaceDomain === selectedDomain;

    const matchesAutonomy =
      !selectedAutonomy ||
      source.autonomyType === selectedAutonomy;

    const matchesIpIssue =
      !selectedIpIssue ||
      source.ipIssue === selectedIpIssue;

    const matchesJurisdiction =
      !selectedJurisdiction ||
      source.jurisdiction === selectedJurisdiction;

    const matchesYear =
      !selectedYear ||
      source.year === selectedYear;

    return (
      matchesSearch &&
      matchesSourceType &&
      matchesDomain &&
      matchesAutonomy &&
      matchesIpIssue &&
      matchesJurisdiction &&
      matchesYear
    );
  });

  displaySources(filteredSources);
}

/*
  Display all matching sources.
*/
function displaySources(sourceList) {
  const total = sourceList.length;

  resultCount.textContent =
    `${total} source${total === 1 ? "" : "s"} found`;

  if (total === 0) {
    resultsContainer.innerHTML = `
      <div class="source-card">
        <h2>No matching sources</h2>

        <p>
          Try removing a filter or using a broader search term.
        </p>
      </div>
    `;

    return;
  }

  resultsContainer.innerHTML = sourceList
    .map(createSourceCard)
    .join("");
}

/*
  Create one visible card for each spreadsheet row.
*/
function createSourceCard(source) {
  const titleMarkup = source.url
    ? `
      <a
        href="${escapeAttribute(source.url)}"
        target="_blank"
        rel="noopener noreferrer"
      >
        ${escapeHtml(source.title)}
      </a>
    `
    : escapeHtml(source.title);

  const keywordsMarkup = source.keywords
    .map((keyword) => {
      return `
        <span class="tag">
          ${escapeHtml(keyword)}
        </span>
      `;
    })
    .join("");

  const publicationLine = [
    source.sourceType,
    source.publication,
    source.year
  ]
    .filter(Boolean)
    .map(escapeHtml)
    .join(" · ");

  const doiUrl = createDoiUrl(source.doi);

  return `
    <article class="source-card">
      <p class="source-meta">
        ${publicationLine || "Source"}
      </p>

      <h2>${titleMarkup}</h2>

      ${
        source.authors
          ? `
            <p>
              <strong>Author${source.authors.includes(";") ? "s" : ""}:</strong>
              ${escapeHtml(source.authors)}
            </p>
          `
          : ""
      }

      <dl class="source-details">
        ${createDetail(
          "Aerospace domain",
          source.aerospaceDomain
        )}

        ${createDetail(
          "Autonomy type",
          source.autonomyType
        )}

        ${createDetail(
          "IP issue",
          source.ipIssue
        )}

        ${createDetail(
          "Jurisdiction",
          source.jurisdiction
        )}
      </dl>

      ${
        source.summary
          ? `
            <p>
              ${escapeHtml(source.summary)}
            </p>
          `
          : ""
      }

      ${
        source.relevance
          ? `
            <p>
              <strong>Relevance to the field:</strong>
              ${escapeHtml(source.relevance)}
            </p>
          `
          : ""
      }

      ${
        keywordsMarkup
          ? `<div class="tags">${keywordsMarkup}</div>`
          : ""
      }

      <div class="source-links">
        ${
          source.url
            ? `
              <a
                href="${escapeAttribute(source.url)}"
                target="_blank"
                rel="noopener noreferrer"
              >
                View source
              </a>
            `
            : ""
        }

        ${
          doiUrl
            ? `
              <a
                href="${escapeAttribute(doiUrl)}"
                target="_blank"
                rel="noopener noreferrer"
              >
                DOI: ${escapeHtml(cleanDoi(source.doi))}
              </a>
            `
            : ""
        }
      </div>
    </article>
  `;
}

function createDetail(label, value) {
  if (!value) {
    return "";
  }

  return `
    <div>
      <dt>${escapeHtml(label)}</dt>
      <dd>${escapeHtml(value)}</dd>
    </div>
  `;
}

/*
  Allow the DOI column to contain either a DOI alone
  or a complete doi.org URL.
*/
function cleanDoi(doi) {
  return cleanText(doi)
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "");
}

function createDoiUrl(doi) {
  const cleanedDoi = cleanDoi(doi);

  if (!cleanedDoi) {
    return "";
  }

  return `https://doi.org/${cleanedDoi}`;
}

/*
  Prevent spreadsheet text from being interpreted as HTML.
*/
function escapeHtml(value) {
  const element = document.createElement("div");

  element.textContent = cleanText(value);

  return element.innerHTML;
}

function escapeAttribute(value) {
  return cleanText(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/*
  Connect the webpage controls to the filtering function.
*/
searchInput.addEventListener("input", filterSources);

sourceTypeFilter.addEventListener(
  "change",
  filterSources
);

domainFilter.addEventListener(
  "change",
  filterSources
);

autonomyFilter.addEventListener(
  "change",
  filterSources
);

ipFilter.addEventListener(
  "change",
  filterSources
);

jurisdictionFilter.addEventListener(
  "change",
  filterSources
);

yearFilter.addEventListener(
  "change",
  filterSources
);

clearFiltersButton.addEventListener("click", () => {
  searchInput.value = "";
  sourceTypeFilter.value = "";
  domainFilter.value = "";
  autonomyFilter.value = "";
  ipFilter.value = "";
  jurisdictionFilter.value = "";
  yearFilter.value = "";

  displaySources(sources);
});

/*
  Start loading the spreadsheet when the page opens.
*/
loadSources();