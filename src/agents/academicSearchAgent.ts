import { EventEmitter } from "events";
import { academicSearchPrompt, academicAnswerPrompt } from "../prompts/academicPrompt.js";
import { llm } from "../lib/llm.js";
import { searchSearxng } from "../lib/searxng.js";
import { searchResultsToDocs } from "../lib/searchToDocs.js";
import { rerankDocs } from "../lib/rerankDocs.js";
import { processDocs } from "../lib/processDocs.js";

const queryRewriteChain =
  academicSearchPrompt.pipe(llm);

const answerChain =
  academicAnswerPrompt.pipe(llm);

export async function academicSearchAgent(
  query: string
) {
  const emitter = new EventEmitter();

  // 1. Rewrite the user's query

  const rewrittenResponse =
    await queryRewriteChain.invoke({
      query,
    });

  const rewrittenQuery =
    rewrittenResponse.content.toString();

  console.log("Search query:", rewrittenQuery);

  // 2. Search the web
  const searchData =
    await searchSearxng(rewrittenQuery);

  const results =
    searchData.results ?? [];

  console.log(
    `SearXNG results: ${results.length}`
  );

  // 3. Convert results to LangChain Documents
  const docs =
    searchResultsToDocs(results);

  console.log(
    `Documents created: ${docs.length}`
  );

  // 4. Rerank documents
  const rankedDocs =
    await rerankDocs(
      rewrittenQuery,
      docs
    );

  console.log(
    `Documents after reranking: ${rankedDocs.length}`
  );

  // 5. Create context
  const context =
    processDocs(rankedDocs);

  // 6. Generate final answer
  const answer =
    await answerChain.invoke({
      query,
      context,
    });

  return {
    answer: answer.content.toString(),
    documents: rankedDocs,
  };
}

