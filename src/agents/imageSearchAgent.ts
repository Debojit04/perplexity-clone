import "dotenv/config";

import { llm } from "../lib/llm.js";
import { searchSearxng } from "../lib/searxng.js";
import { imageSearchPrompt } from "../prompts/imagePrompt.js";

export async function imageSearchAgent(
  query: string
) {
  // --------------------------------
  // 1. Rewrite search query
  // --------------------------------

  const rewriteChain =
    imageSearchPrompt.pipe(llm);

  const rewrittenResponse =
    await rewriteChain.invoke({
      query,
    });

  const rewrittenQuery =
    rewrittenResponse.content
      .toString()
      .trim();

  console.log(
    "Image search query:",
    rewrittenQuery
  );

  // --------------------------------
  // 2. Search images with SearXNG
  // --------------------------------

  const searchData =
    await searchSearxng(
      rewrittenQuery,
      {
        engines: "google_images",
      }
    );

  const results =
    searchData.results ?? [];

  console.log(
    `Image results: ${results.length}`
  );

  // --------------------------------
  // 3. Validate image results
  // --------------------------------

  const images = results
  .filter(
    (result: any) =>
      result.thumbnail &&
      result.url &&
      result.title
  )
  .slice(0, 10)
  .map((result: any) => ({
    img_src: result.thumbnail,
    url: result.url,
    title: result.title,
  }));
  

    console.log(
  `Image results: ${results.length}`
);

console.log(
  "\nFIRST IMAGE RESULT:\n"
);

console.log(
  JSON.stringify(
    results[0],
    null,
    2
  )
);

  // --------------------------------
  // 4. Return images
  // --------------------------------

  return images;
}
