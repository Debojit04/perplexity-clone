import { Document } from "@langchain/core/documents";
import { processSources } from "./lib/processSources.js";

const docs = [
  new Document({
    pageContent: "React is a JavaScript library.",
    metadata: {
      title: "React",
      url: "https://react.dev/",
    },
  }),

  new Document({
    pageContent: "JavaScript is a programming language.",
    metadata: {
      title: "MDN JavaScript",
      url: "https://developer.mozilla.org/",
    },
  }),
];

const sources = processSources(docs);

console.log(
  JSON.stringify(sources, null, 2)
);
