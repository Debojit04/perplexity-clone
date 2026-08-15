import { Router } from "express";

import {
  academicSearchAgentStream,
} from "../agents/academicSearchAgentStream.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({
        error: "Query is required",
      });
    }

    // --------------------------------
    // Configure SSE
    // --------------------------------

    res.setHeader(
      "Content-Type",
      "text/event-stream"
    );

    res.setHeader(
      "Cache-Control",
      "no-cache"
    );

    res.setHeader(
      "Connection",
      "keep-alive"
    );

    // --------------------------------
    // Create agent emitter
    // --------------------------------

    const emitter =
      academicSearchAgentStream(query);

    // --------------------------------
    // Sources
    // --------------------------------

    emitter.on(
      "sources",
      (sources) => {
        res.write(
          `event: sources\n`
        );

        res.write(
          `data: ${JSON.stringify(sources)}\n\n`
        );
      }
    );

    // --------------------------------
    // Response chunks
    // --------------------------------

    emitter.on(
      "response",
      (chunk) => {
        res.write(
          `event: response\n`
        );

        res.write(
          `data: ${JSON.stringify(chunk)}\n\n`
        );
      }
    );

    // --------------------------------
    // End
    // --------------------------------

    emitter.on(
      "end",
      () => {
        res.write(
          `event: end\n`
        );

        res.write(
          `data: {}\n\n`
        );

        res.end();
      }
    );

    // --------------------------------
    // Error
    // --------------------------------

    emitter.on(
      "error",
      (error) => {
        console.error(
          "Streaming error:",
          error
        );

        if (!res.writableEnded) {
          res.write(
            `event: error\n`
          );

          res.write(
            `data: ${JSON.stringify({
              error:
                error instanceof Error
                  ? error.message
                  : "Unknown error",
            })}\n\n`
          );

          res.end();
        }
      }
    );

    // --------------------------------
    // Client disconnect
    // --------------------------------

    req.on("close", () => {
      console.log(
        "Client disconnected"
      );
    });

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
