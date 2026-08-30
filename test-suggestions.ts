import "dotenv/config";

import {
  suggestionGeneratorAgent,
} from "./src/agents/suggestionGeneratorAgent.js";

async function test() {
  console.log("Testing Suggestion Generator...\n");

  const chat_history = [
    {
      role: "user",
      content: "What is React?",
    },
    {
      role: "assistant",
      content:
        "React is a JavaScript library for building user interfaces.",
    },
  ];

  try {
    const suggestions =
      await suggestionGeneratorAgent({
        chat_history,
      });

    console.log("\nSUGGESTIONS:\n");

    console.log(
      JSON.stringify(
        suggestions,
        null,
        2
      )
    );

    console.log(
      `\nTotal suggestions: ${suggestions.length}`
    );

    console.log(
      "\nSuggestion generator finished."
    );
  } catch (error) {
    console.error(
      "\nSUGGESTION GENERATOR ERROR:"
    );

    console.error(error);
  }
}

test();
