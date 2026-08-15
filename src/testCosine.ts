import { embeddings } from "./lib/embedding.js";
import { cosineSimilarity } from "./lib/cosineSimilarity.js";

const query = "What is React?";

const document1 =
  "React is a JavaScript library for building user interfaces.";

const document2 =
  "Delhi is the capital city of India.";

const queryVector =
  await embeddings.embedQuery(query);

const documentVectors =
  await embeddings.embedDocuments([
    document1,
    document2,
  ]);

const similarity1 = cosineSimilarity(
  queryVector,
  documentVectors[0]
);

const similarity2 = cosineSimilarity(
  queryVector,
  documentVectors[1]
);

console.log("Query:", query);

console.log("\nDocument 1:");
console.log(document1);
console.log("Similarity:", similarity1);

console.log("\nDocument 2:");
console.log(document2);
console.log("Similarity:", similarity2);

