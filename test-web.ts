import "dotenv/config";

import { handleWebSearch } from "./src/agents/webSearchAgent.js";

const emitter = handleWebSearch(
  "What is artificial intelligence?"
);

emitter.on("sources", (sources) => {
  console.log("\n\nSOURCES:");
  console.log(sources);
});

emitter.on("response", (chunk) => {
  process.stdout.write(chunk);
});

emitter.on("end", () => {
  console.log("\n\nDONE");
  process.exit(0);
});

emitter.on("error", (error) => {
  console.error("\nERROR:", error);
  process.exit(1);
});
