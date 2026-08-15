import { Document } from "@langchain/core/documents";

export function processDocs(docs: Document[]): string {
  return docs
    .map((doc, index) => {
      return `${index + 1}. ${doc.pageContent}`;
    })
    .join("\n\n");
}
