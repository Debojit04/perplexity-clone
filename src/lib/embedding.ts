import { pipeline } from "@huggingface/transformers";

let extractor: any;

async function getExtractor() {
  if (!extractor) {
    extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }

  return extractor;
}

export const embeddings = {
  async embedQuery(text: string): Promise<number[]> {
    const model = await getExtractor();

    const output = await model(text, {
      pooling: "mean",
      normalize: true,
    });

    return Array.from(output.data);
  },

  async embedDocuments(
    texts: string[]
  ): Promise<number[][]> {
    const model = await getExtractor();

    const vectors: number[][] = [];

    for (const text of texts) {
      const output = await model(text, {
        pooling: "mean",
        normalize: true,
      });

      vectors.push(Array.from(output.data));
    }

    return vectors;
  },
};
