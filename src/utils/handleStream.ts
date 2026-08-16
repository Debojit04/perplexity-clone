import { Response } from "express";
import { EventEmitter } from "events";

export function handleStream(
  res: Response,
  emitter: EventEmitter
) {
  // Tell the browser that this is an SSE stream
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

  // Send data to the client
  const sendEvent = (
    event: string,
    data: unknown
  ) => {
    res.write(
      `event: ${event}\n`
    );

    res.write(
      `data: ${JSON.stringify(data)}\n\n`
    );
  };

  // Sources
  emitter.on(
    "sources",
    (sources) => {
      sendEvent(
        "sources",
        sources
      );
    }
  );

  // Streaming answer chunks
  emitter.on(
    "response",
    (chunk) => {
      sendEvent(
        "response",
        chunk
      );
    }
  );

  // Errors
  emitter.on(
    "error",
    (error) => {
      sendEvent(
        "error",
        {
          error:
            error instanceof Error
              ? error.message
              : "Something went wrong",
        }
      );

      res.end();
    }
  );

  // Stream finished
  emitter.on(
    "end",
    () => {
      res.end();
    }
  );

  // Handle client disconnect
  res.on(
    "close",
    () => {
      emitter.removeAllListeners();
    }
  );
}
