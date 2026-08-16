import "dotenv/config";

import {
  handleYoutubeSearch,
} from "./src/agents/youtubeSearchAgent.js";

const emitter =
  handleYoutubeSearch(
    "best React tutorials for beginners"
  );

emitter.on("sources", (sources) => {
  console.log("\n\nYOUTUBE SOURCES:");
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
