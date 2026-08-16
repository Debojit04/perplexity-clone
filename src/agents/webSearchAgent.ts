import { EventEmitter } from "events";

import {
  webSearchPrompt,
  webAnswerPrompt,
} from "../prompts/webPrompt.js";

import { llm } from "../lib/llm.js";
import { searchSearxng } from "../lib/searxng.js";
import { searchResultsToDocs } from "../lib/searchToDocs.js";
import { rerankDocs } from "../lib/rerankDocs.js";
import { processDocs } from "../lib/processDocs.js";
import { processSources } from "../lib/processSources.js";

export function handleWebSearch(
  query: string
) {
  const emitter = new EventEmitter();

  void (async () => {
    try {
      // --------------------------------
      // 1. Rewrite search query
      // --------------------------------

      const rewriteChain =
        webSearchPrompt.pipe(llm);

      const rewrittenResponse =
        await rewriteChain.invoke({
          query,
        });

      const rewrittenQuery =
        rewrittenResponse.content
          .toString()
          .trim();

      console.log(
        "Web search query:",
        rewrittenQuery
      );

      // --------------------------------
      // 2. Handle not_needed
      // --------------------------------

      if (
        rewrittenQuery.toLowerCase() ===
        "not_needed"
      ) {
        emitter.emit(
          "sources",
          []
        );

        emitter.emit("end");

        return;
      }

      // --------------------------------
      // 3. Search with SearXNG
      // --------------------------------

      const searchData =
        await searchSearxng(
          rewrittenQuery
        );

      const results =
        searchData.results ?? [];

      console.log(
        `Web results: ${results.length}`
      );

      // --------------------------------
      // 4. Convert results to Documents
      // --------------------------------

      const docs =
        searchResultsToDocs(results);

      console.log(
        `Documents created: ${docs.length}`
      );

      // --------------------------------
      // 5. Rerank documents
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
      // 6. Send sources
      // --------------------------------

      const sources =
  processSources(rankedDocs);

emitter.emit(
  "sources",
  sources
);

      // --------------------------------
      // 7. Create context
      // --------------------------------

      const context =
        processDocs(rankedDocs);

      // --------------------------------
      // 8. Generate streaming answer
      // --------------------------------

      const answerChain =
        webAnswerPrompt.pipe(llm);

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
      // 9. Finished
      // --------------------------------

      emitter.emit("end");

    } catch (error) {
      console.error(
        "Web search agent error:",
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
