import "dotenv/config";

import {
  videoSearchAgent,
} from "./src/agents/videoSearchAgent.js";

const videos =
  await videoSearchAgent(
    "best React tutorials for beginners"
  );

console.log("\nVIDEOS:\n");

console.log(
  JSON.stringify(
    videos,
    null,
    2
  )
);

console.log(
  `\nTotal videos: ${videos.length}`
);
