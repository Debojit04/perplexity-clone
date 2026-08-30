/// <reference types="node" />

import "dotenv/config";

import { writingAssistant } from "./src/agents/writingAssistantAgent.js";

async function test() {
  console.log("Testing Writing Assistant...");

  const query =
    "Write a professional introduction for a Computer Science student interested in AI and cybersecurity.";

  const chat_history: any[] = [];

  const emitter = writingAssistant(
    query,
    chat_history
  );

  emitter.on(
    "response",
    (chunk: unknown) => {
      process.stdout.write(
        String(chunk)
      );
    }
  );

  emitter.on(
    "end",
    () => {
      console.log(
        "\n\nWriting assistant finished."
      );
    }
  );

  emitter.on(
    "error",
    (error: unknown) => {
      console.error(
        "\n\nWRITING ASSISTANT ERROR:"
      );

      console.error(error);
    }
  );
}

test();
