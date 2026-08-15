import { academicSearchAgent } from "./agents/academicSearchAgent.js";

const query =
  "What is React and how do React hooks work?";

const result =
  await academicSearchAgent(query);

console.log("\n===== FINAL ANSWER =====\n");

console.log(result.answer);

console.log("\n===== SOURCES =====\n");

result.documents.forEach((doc, index) => {
  console.log(
    `${index + 1}. ${doc.metadata.title}`
  );

  console.log(doc.metadata.url);
});