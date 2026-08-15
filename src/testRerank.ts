import { Document } from "@langchain/core/documents";
import { rerankDocs } from "./lib/rerankDocs.js";

const query = "What is React?";

const docs = [
  new Document({
    pageContent:
      "React is a JavaScript library for building user interfaces.",
    metadata: {
      title: "React Introduction",
      url: "https://example.com/react",
    },
  }),

  new Document({
    pageContent:
      "React uses components to build interactive user interfaces.",
    metadata: {
      title: "React Components",
      url: "https://example.com/components",
    },
  }),

  new Document({
    pageContent:
      "Delhi is the capital city of India.",
    metadata: {
      title: "Delhi",
      url: "https://example.com/delhi",
    },
  }),

  new Document({
    pageContent:
      "The weather today is sunny with a temperature of 30 degrees.",
    metadata: {
      title: "Weather",
      url: "https://example.com/weather",
    },
  }),
];

const results = await rerankDocs(query, docs);

console.log("\nQuery:");
console.log(query);

console.log("\nReranked documents:\n");

results.forEach((doc, index) => {
  console.log(`${index + 1}. ${doc.pageContent}`);
});
