import { EventEmitter } from "events";

import {
  redditSearchPrompt,
  redditAnswerPrompt,
} from "../prompts/redditPrompt.js";

import { llm } from "../lib/llm.js";
import { searchSearxng } from "../lib/searxng.js";
import { searchResultsToDocs } from "../lib/searchToDocs.js";
import { rerankDocs } from "../lib/rerankDocs.js";
import { processDocs } from "../lib/processDocs.js";
import { processSources } from "../lib/processSources.js";

const queryRewriteChain =
  redditSearchPrompt.pipe(llm);

const answerChain =
  redditAnswerPrompt.pipe(llm);

export function handleRedditSearch(
  query: string
) {
  const emitter = new EventEmitter();

  void (async () => {
    try {
      // --------------------------------
      // 1. Rewrite query for Reddit
      // --------------------------------

      const rewrittenResponse =
        await queryRewriteChain.invoke({
          query,
        });

      const rewrittenQuery =
        rewrittenResponse.content.toString();

      console.log(
        "Reddit search query:",
        rewrittenQuery
      );

      // --------------------------------
      // 2. Search Reddit with SearXNG
      // --------------------------------

      const searchData =
        await searchSearxng(
          rewrittenQuery,
          ["reddit"]
        );

      const results =
        searchData.results ?? [];

      console.log(
        `Reddit results: ${results.length}`
      );

      // --------------------------------
      // 3. Convert results to Documents
      // --------------------------------

      const docs =
        searchResultsToDocs(results);

      console.log(
        `Reddit documents: ${docs.length}`
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
        `Reddit ranked documents: ${rankedDocs.length}`
      );

      // --------------------------------
      // 5. Create context
      // --------------------------------

      const context =
        processDocs(rankedDocs);

      // --------------------------------
      // 6. Create sources
      // --------------------------------

      const sources =
        processSources(rankedDocs);

      emitter.emit(
        "sources",
        sources
      );

      // --------------------------------
      // 7. Stream Reddit answer
      // --------------------------------

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

      for await (const event of stream) {
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
        "Reddit search agent error:",
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
