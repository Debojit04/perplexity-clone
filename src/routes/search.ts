import { Router } from "express";

import {
  handleWebSearch,
} from "../agents/webSearchAgent.js";

import {
  academicSearchAgentStream,
} from "../agents/academicSearchAgentStream.js";

import {
  handleRedditSearch,
} from "../agents/redditSearchAgent.js";

import {
  videoSearchAgent,
} from "../agents/videoSearchAgent.js";

import { handleStream } from "../utils/handleStream.js";


const router = Router();

router.post("/", async (req, res) => {
  try {
    const { query, mode } = req.body;

    // --------------------------------
    // Validate query
    // --------------------------------

    if (!query || typeof query !== "string") {
      return res.status(400).json({
        error: "Query is required",
      });
    }

    // --------------------------------
    // YouTube Search
    // --------------------------------
    // YouTube returns normal JSON,
    // not an SSE stream.

    if (mode === "youtube") {
      const videos =
        await videoSearchAgent(query);

      return res.json({
        videos,
      });
    }

    // --------------------------------
    // Select streaming search agent
    // --------------------------------

    let emitter;

    if (mode === "reddit") {
      emitter =
        handleRedditSearch(query);

    } else if (mode === "web") {
      emitter =
        handleWebSearch(query);

    } else {
      // Academic is the default mode
      emitter =
        academicSearchAgentStream(query);
    }

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
        error: "Something went wrong",
      });
    }
  }
});

export default router;
