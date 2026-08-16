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

import { handleStream } from "../utils/handleStream.js";

import {
  handleYoutubeSearch,
} from "../agents/youtubeSearchAgent.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { query, mode } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({
        error: "Query is required",
      });
    }

    let emitter;

    // --------------------------------
    // Select search agent
    // --------------------------------

   if (mode === "reddit") {
  emitter = handleRedditSearch(query);
} else if (mode === "web") {
  emitter = handleWebSearch(query);
} else if (mode === "youtube") {
  emitter = handleYoutubeSearch(query);
} else {
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
    console.error(error);

    if (!res.headersSent) {
      res.status(500).json({
        error: "Something went wrong",
      });
    }
  }
});

export default router;
