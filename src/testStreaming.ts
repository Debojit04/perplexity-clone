import { academicAnswerPrompt } from "./prompts/academicPrompt.js";
import { llm } from "./lib/llm.js";

const answerChain =
  academicAnswerPrompt.pipe(llm);

const query =
  "What is React?";

const context = `
1. React is a JavaScript library for building user interfaces.

2. React uses components to create reusable UI elements.

3. React was originally developed by Facebook.
`;

const stream =
  await answerChain.streamEvents(
    {
      query,
      context,
    },
    {
      version: "v2",
    }
  );

for await (const event of stream) {
  if (event.event === "on_chat_model_stream") {
    const chunk = event.data.chunk;

    if (chunk?.content) {
      process.stdout.write(
        chunk.content.toString()
      );
    }
  }
}

console.log("\n");
