import { Document } from "@langchain/core/documents";

export function searchResultsToDocs(results: any[]): Document[] {
  return results
    .filter((result) => result.content)
    .map(
      (result) =>
        new Document({
          pageContent: result.content,
          metadata: {
            title: result.title,
            url: result.url,
            engine: result.engine,
          },
        })
    );
}
