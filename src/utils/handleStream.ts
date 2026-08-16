import { EventEmitter } from "events";

export async function handleStream(
  emitter: EventEmitter,
  answerChain: any,
  query: string,
  context: string
) {
  try {
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

    emitter.emit("end");

  } catch (error) {
    console.error(
      "Streaming error:",
      error
    );

    emitter.emit(
      "error",
      error
    );
  }
}
