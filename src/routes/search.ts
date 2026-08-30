import { Router } from "express";

import {
  agentDispatcher,
} from "../agents/agentDispatcher.js";

import {
  suggestionGeneratorAgent,
} from "../agents/suggestionGeneratorAgent.js";

import { handleStream } from "../utils/handleStream.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const {
      query,
      mode,
      chat_history = [],
    } = req.body;

    // --------------------------------
    // Validate query
    // --------------------------------

    if (
      !query ||
      typeof query !== "string"
    ) {
      return res.status(400).json({
        error: "Query is required",
      });
    }

    // --------------------------------
    // YouTube Search
    // --------------------------------

    if (mode === "youtube") {
      const videos =
        await agentDispatcher.youtube(query);

      return res.json({
        videos,
      });
    }

    // --------------------------------
    // Image Search
    // --------------------------------

    if (mode === "image") {
      const images =
        await agentDispatcher.image(query);

      return res.json({
        images,
      });
    }

    // --------------------------------
    // Suggestion Generator
    // --------------------------------

    if (mode === "suggestions") {
      const suggestions =
        await suggestionGeneratorAgent({
          chat_history,
        });

      return res.json({
        suggestions,
      });
    }

    // --------------------------------
    // Writing Assistant
    // --------------------------------

    if (mode === "writing") {
      const emitter =
        agentDispatcher.writing(
          query,
          chat_history
        );

      return handleStream(
        res,
        emitter
      );
    }

    // --------------------------------
    // Streaming Search Agents
    // --------------------------------

    const searchMode =
      mode === "reddit"
        ? "reddit"
        : mode === "web"
        ? "web"
        : "academic";

    const emitter =
      agentDispatcher[searchMode](query);

    // --------------------------------
    // Handle SSE stream
    // --------------------------------

    handleStream(
      res,
      emitter
    );

  } catch (error) {
    console.error(
      "Search route error:",
      error
    );

    if (!res.headersSent) {
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      });
    }
  }
});

export default router;
