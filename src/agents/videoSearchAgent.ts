import "dotenv/config";

import { llm } from "../lib/llm.js";
import { searchSearxng } from "../lib/searxng.js";
import { videoSearchPrompt } from "../prompts/videoPrompt.js";

export async function videoSearchAgent(
  query: string
) {
  // --------------------------------
  // 1. Rewrite search query
  // --------------------------------

  const rewriteChain =
    videoSearchPrompt.pipe(llm);

  const rewrittenResponse =
    await rewriteChain.invoke({
      query,
    });

  const rewrittenQuery =
    rewrittenResponse.content
      .toString()
      .trim();

  console.log(
    "Video search query:",
    rewrittenQuery
  );

  // --------------------------------
  // 2. Search YouTube with SearXNG
  // --------------------------------

  const searchData =
    await searchSearxng(
      rewrittenQuery,
      {
        engines: "youtube",
      }
    );

  const results =
    searchData.results ?? [];

  console.log(
    `Video results: ${results.length}`
  );

  // --------------------------------
  // 3. Validate video results
  // --------------------------------

  const videos = results
    .filter(
      (result: any) =>
        result.thumbnail &&
        result.url &&
        result.title &&
        result.iframe_src
    )
    .slice(0, 10)
    .map((result: any) => ({
      img_src: result.thumbnail,
      url: result.url,
      title: result.title,
      iframe_src: result.iframe_src,
    }));

  console.log(
    `Valid videos: ${videos.length}`
  );

  // --------------------------------
  // 4. Return videos
  // --------------------------------

  return videos;
}
