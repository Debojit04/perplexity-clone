import "dotenv/config";

import { imageSearchAgent } from "./src/agents/imageSearchAgent.js";

async function test() {
  try {
    console.log("Testing Image Search...");

    const images =
      await imageSearchAgent(
        "React programming"
      );

    console.log("\nIMAGE RESULTS:\n");

    console.log(
      JSON.stringify(
        images,
        null,
        2
      )
    );

    console.log(
      `\nTotal images: ${images.length}`
    );

  } catch (error) {
    console.error(
      "\nIMAGE SEARCH ERROR:"
    );

    console.error(error);
  }
}

test();
