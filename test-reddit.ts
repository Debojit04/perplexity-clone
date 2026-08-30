import "dotenv/config";

import { handleRedditSearch } from "./src/agents/redditSearchAgent.js";

console.log("Testing Reddit Search Agent...");

const emitter = handleRedditSearch(
  "What do developers think about learning React in 2026?"
);

emitter.on("sources", (sources) => {
  console.log("\nREDDIT SOURCES:");
  console.log(JSON.stringify(sources, null, 2));
});

emitter.on("response", (chunk) => {
  process.stdout.write(chunk);
});

emitter.on("end", () => {
  console.log("\n\nREDDIT SEARCH FINISHED");
});

emitter.on("error", (error) => {
  console.error("\nREDDIT ERROR:", error);
});
