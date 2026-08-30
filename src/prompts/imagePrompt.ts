import { ChatPromptTemplate } from "@langchain/core/prompts";

export const imageSearchPrompt =
  ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are an image search query optimizer.

Convert the user's request into a concise query suitable for finding relevant images.

Rules:
- Return only the search query.
- Do not explain your reasoning.
- Preserve important technical terms.
- Remove unnecessary conversational words.
- Focus on the main topic the user wants to find images about.`,
    ],
    ["human", "{query}"],
  ]);
  