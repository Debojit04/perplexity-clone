import { EventEmitter } from "events";

import {
  youtubeSearchPrompt,
  youtubeAnswerPrompt,
} from "../prompts/youtubePrompt.js";

import { llm } from "../lib/llm.js";
import { searchSearxng } from "../lib/searxng.js";
import { searchResultsToDocs } from "../lib/searchToDocs.js";
import { rerankDocs } from "../lib/rerankDocs.js";
import { processDocs } from "../lib/processDocs.js";
import { processSources } from "../lib/processSources.js";

export function handleYoutubeSearch(
  query: string
) {
  const emitter = new EventEmitter();

  void (async () => {
    try {
      // --------------------------------
      // 1. Rewrite search query
      // --------------------------------

      const rewriteChain =
        youtubeSearchPrompt.pipe(llm);

      const rewrittenResponse =
        await rewriteChain.invoke({
          query,
        });

      const rewrittenQuery =
        rewrittenResponse.content
          .toString()
          .trim();

      console.log(
        "YouTube search query:",
        rewrittenQuery
      );

      // --------------------------------
      // 2. Search YouTube with SearXNG
      // --------------------------------

      const searchData =
        await searchSearxng(
          rewrittenQuery,
          ["youtube"]
        );

      const results =
        searchData.results ?? [];

      console.log(
        `YouTube results: ${results.length}`
      );

      // --------------------------------
      // 3. Convert results to Documents
      // --------------------------------

      const docs =
        searchResultsToDocs(results);

      console.log(
        `Documents created: ${docs.length}`
      );

      // --------------------------------
      // 4. Rerank documents
      // --------------------------------

      const rankedDocs =
        await rerankDocs(
          rewrittenQuery,
          docs
        );

      console.log(
        `Documents after reranking: ${rankedDocs.length}`
      );

      // --------------------------------
      // 5. Send sources
      // --------------------------------

      const sources =
        processSources(rankedDocs);

      emitter.emit(
        "sources",
        sources
      );

      // --------------------------------
      // 6. Create context
      // --------------------------------

      const context =
        processDocs(rankedDocs);

      // --------------------------------
      // 7. Generate streaming answer
      // --------------------------------

      const answerChain =
        youtubeAnswerPrompt.pipe(llm);

      const stream =
        await answerChain.streamEvents(
          {
            query,
            context,
          },
          {
            version: "v2",
          }
        );

      for await (
        const event of stream
      ) {
        if (
          event.event ===
          "on_chat_model_stream"
        ) {
          const chunk =
            event.data.chunk;

          if (chunk?.content) {
            emitter.emit(
              "response",
              chunk.content.toString()
            );
          }
        }
      }

      // --------------------------------
      // 8. Finished
      // --------------------------------

      emitter.emit("end");

    } catch (error) {
      console.error(
        "YouTube search agent error:",
        error
      );

      emitter.emit(
        "error",
        error
      );
    }
  })();

  return emitter;
}
