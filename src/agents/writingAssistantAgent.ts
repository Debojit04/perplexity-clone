import { EventEmitter } from "events";

import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

import { llm } from "../lib/llm.js";
import { writingAssistantPrompt } from "../prompts/writingAssistantPrompt.js";

const createWritingAssistantChain = () => {
  return ChatPromptTemplate.fromMessages([
    [
      "system",
      writingAssistantPrompt,
    ],

    new MessagesPlaceholder("chat_history"),

    [
      "user",
      "{query}",
    ],
  ])
    .pipe(llm)
    .pipe(new StringOutputParser())
    .withConfig({
      runName: "FinalResponseGenerator",
    });
};

export function writingAssistant(
  query: string,
  chat_history: any[] = []
) {
  const emitter = new EventEmitter();

  const chain =
    createWritingAssistantChain();

  const run = async () => {
    try {
      const stream =
        await chain.streamEvents(
          {
            query,
            chat_history,
          },
          {
            version: "v2",
          }
        );

      for await (const event of stream) {
        // Streaming response chunks
        if (
          event.event ===
            "on_chain_stream" &&
          event.name ===
            "FinalResponseGenerator"
        ) {
          emitter.emit(
            "response",
            event.data?.chunk ?? ""
          );
        }

        // Finished
        if (
          event.event ===
            "on_chain_end" &&
          event.name ===
            "FinalResponseGenerator"
        ) {
          emitter.emit("end");
        }
      }
    } catch (error) {
      emitter.emit(
        "error",
        error
      );
    }
  };

  run();

  return emitter;
}
