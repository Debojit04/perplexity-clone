import { ChatPromptTemplate } from "@langchain/core/prompts";

export const academicSearchPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are an academic search query optimizer.

Convert the user's question into a concise web search query.

Rules:
- Return only the search query.
- Do not explain your reasoning.
- Preserve important technical terms.
- Remove unnecessary conversational words.`,
  ],
  ["human", "{query}"],
]);

export const academicAnswerPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a helpful research assistant.

Answer the user's question using the provided context.

Rules:
- Use the context as your primary source of information.
- Do not invent facts that are not supported by the context.
- Give a clear and useful answer.
- If the context is insufficient, say so.

Context:
{context}`,
  ],
  ["human", "{query}"],
]);
  