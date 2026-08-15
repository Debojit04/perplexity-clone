import { Document } from "@langchain/core/documents";
import { processDocs } from "./lib/processDocs.js";

const docs = [
  new Document({
    pageContent: "React is a JavaScript library.",
    metadata: {
      title: "React Introduction",
      url: "https://example.com/react",
    },
  }),

  new Document({
    pageContent: "React uses reusable components.",
    metadata: {
      title: "React Components",
      url: "https://example.com/components",
    },
  }),

  new Document({
    pageContent: "React was created at Facebook.",
    metadata: {
      title: "React History",
      url: "https://example.com/history",
    },
  }),
];

const context = processDocs(docs);

console.log(context);
