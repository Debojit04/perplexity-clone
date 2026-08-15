import { searchSearxng } from "./lib/searxng.js";
import { searchResultsToDocs } from "./lib/searchToDocs.js";
import { rerankDocs } from "./lib/rerankDocs.js";
import { processDocs } from "./lib/processDocs.js";

const query = "What is React?";

console.log("Searching SearXNG...\n");

const searchData = await searchSearxng(query);

const results = searchData.results ?? [];

console.log(
  `SearXNG returned ${results.length} results.`
);

if (results.length === 0) {
  console.log("No search results found.");
  process.exit(0);
}

const docs = searchResultsToDocs(results);

console.log(
  `Converted ${docs.length} results into Documents.`
);

if (docs.length === 0) {
  console.log("No usable documents found.");
  process.exit(0);
}

const rankedDocs = await rerankDocs(query, docs);

console.log(
  `After reranking: ${rankedDocs.length} documents.`
);

const context = processDocs(rankedDocs);

console.log("\n===== FINAL CONTEXT =====\n");

console.log(context);
