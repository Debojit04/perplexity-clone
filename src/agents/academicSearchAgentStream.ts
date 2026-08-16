import { EventEmitter } from "events";

import {
  academicSearchPrompt,
  academicAnswerPrompt,
} from "../prompts/academicPrompt.js";

import { llm } from "../lib/llm.js";
import { searchSearxng } from "../lib/searxng.js";
import { searchResultsToDocs } from "../lib/searchToDocs.js";
import { rerankDocs } from "../lib/rerankDocs.js";
import { processDocs } from "../lib/processDocs.js";
import { processSources } from "../lib/processSources.js";
import { handleStream } from "../utils/handleStream.js";


const queryRewriteChain =
  academicSearchPrompt.pipe(llm);

const answerChain =
  academicAnswerPrompt.pipe(llm);

export function academicSearchAgentStream(
  query: string
) {
  const emitter = new EventEmitter();

  // Start the actual work asynchronously.
  // The emitter is returned immediately so that
  // Express can attach listeners before any events fire.

  void (async () => {
    try {
      // --------------------------------
      // 1. Rewrite search query
      // --------------------------------

      const rewrittenResponse =
        await queryRewriteChain.invoke({
          query,
        });

      const rewrittenQuery =
        rewrittenResponse.content.toString();

      console.log(
        "Search query:",
        rewrittenQuery
      );

      // --------------------------------
      // 2. Search with SearXNG
      // --------------------------------

      const searchData =
        await searchSearxng(rewrittenQuery);

      const results =
        searchData.results ?? [];

      console.log(
        `SearXNG results: ${results.length}`
      );

      // --------------------------------
      // 3. Convert results to Documents
      // --------------------------------

      const docs =
        searchResultsToDocs(results);

      // --------------------------------
      // 4. Rerank documents
      // --------------------------------

      const rankedDocs =
        await rerankDocs(
          rewrittenQuery,
          docs
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

      // Send sources to Express
      emitter.emit(
        "sources",
        sources
      );

      // --------------------------------
      // 7. Stream Groq answer
      // --------------------------------

      await handleStream(
       emitter,
      answerChain,
      query,
      context
    );

      // --------------------------------
      // 8. Finished
      // --------------------------------

      

    } catch (error) {

      console.error(
        "Academic agent error:",
        error
      );

      emitter.emit(
        "error",
        error
      );
    }
  })();

  // IMPORTANT:
  // Return immediately.
  return emitter;
}
