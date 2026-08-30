import {
  RunnableMap,
  RunnableSequence,
} from "@langchain/core/runnables";

import { PromptTemplate } from "@langchain/core/prompts";

import { StringOutputParser } from "@langchain/core/output_parsers";

import { llm } from "../lib/llm.js";

import { suggestionGeneratorPrompt } from "../prompts/suggestionGeneratorPrompt.js";

import { ListLineOutputParser } from "../lib/ListLineOutputParser.js";

// --------------------------------
// Format chat history
// --------------------------------

const formatChatHistory = (
  chatHistory: any[]
): string => {
  return chatHistory
    .map((message) => {
      const role =
        message.role ||
        message.type ||
        "user";

      const content =
        message.content || "";

      return `${role}: ${content}`;
    })
    .join("\n");
};

// --------------------------------
// Create suggestion generator chain
// --------------------------------

const createSuggestionGeneratorChain =
  () => {

    const prompt =
      PromptTemplate.fromTemplate(
        suggestionGeneratorPrompt
      );

    return RunnableSequence.from([
      RunnableMap.from({
        chat_history: (input: {
          chat_history: any[];
        }) =>
          formatChatHistory(
            input.chat_history
          ),
      }),
      prompt,
      llm,
      new StringOutputParser(),
      new ListLineOutputParser(),
    ]);
  };

// --------------------------------
// Generate suggestions
// --------------------------------

export const suggestionGeneratorAgent =
  async (input: {
    chat_history: any[];
  }): Promise<string[]> => {

    // Suggestions should be deterministic.
    (llm as any).temperature = 0;

    const chain =
      createSuggestionGeneratorChain();

    const suggestions =
      await chain.invoke(input);

    return suggestions
      .filter(Boolean)
      .slice(0, 5);
  };
