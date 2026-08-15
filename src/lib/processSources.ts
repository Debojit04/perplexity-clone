import { Document } from "@langchain/core/documents";

export function processSources(
  docs: Document[]
) {
  return docs.map((doc, index) => ({
    id: index + 1,
    title:
      doc.metadata?.title ?? "Untitled",
    url:
      doc.metadata?.url ?? "",
  }));
}
