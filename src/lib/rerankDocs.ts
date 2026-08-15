import { Document } from "@langchain/core/documents";
import { embeddings } from "./embedding.js";
import { cosineSimilarity } from "./cosineSimilarity.js";

export async function rerankDocs(
  query: string,
  docs: Document[]
): Promise<Document[]> {
  const queryVector = await embeddings.embedQuery(query);

  const documentVectors = await embeddings.embedDocuments(
    docs.map((doc) => doc.pageContent)
  );

  const scoredDocs = docs.map((doc, index) => ({
    doc,
    score: cosineSimilarity(
      queryVector,
      documentVectors[index]
    ),
  }));

  console.log("\nSimilarity scores:");

scoredDocs.forEach(({ doc, score }) => {
  console.log(
    score.toFixed(4),
    "-",
    doc.pageContent
  );
});

const filteredDocs = scoredDocs.filter(
  ({ score }) => score > 0.5
);

  filteredDocs.sort((a, b) => b.score - a.score);

  const topDocs = filteredDocs.slice(0, 15);

  return topDocs.map(({ doc }) => doc);
}
