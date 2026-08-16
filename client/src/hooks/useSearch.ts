import { useState } from "react";

export interface Source {
  id: number;
  title: string;
  url: string;
}

export type SearchMode =
  | "academic"
  | "reddit"
     "web"
     "youtube";

export function useSearch() {
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = async (
    query: string,
    mode: SearchMode
  ) => {
    if (!query.trim()) {
      return;
    }

    setAnswer("");
    setSources([]);
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/search",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            query,
            mode,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Request failed with status ${response.status}`
        );
      }

      if (!response.body) {
        throw new Error(
          "Response body is empty"
        );
      }

      const reader =
        response.body.getReader();

      const decoder =
        new TextDecoder();

      let buffer = "";

      while (true) {
        const {
          value,
          done,
        } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(
          value,
          {
            stream: true,
          }
        );

        const events =
          buffer.split("\n\n");

        buffer =
          events.pop() || "";

        for (const event of events) {
          processEvent(event);
        }
      }

      if (buffer.trim()) {
        processEvent(buffer);
      }

    } catch (err) {
      console.error(
        "Search error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );

    } finally {
      setLoading(false);
    }
  };

  const processEvent = (
    event: string
  ) => {
    const lines =
      event.split("\n");

    let eventType = "";
    let data = "";

    for (const line of lines) {

      if (
        line.startsWith("event:")
      ) {
        eventType =
          line
            .substring(6)
            .trim();
      }

      if (
        line.startsWith("data:")
      ) {
        data += line
          .substring(5)
          .trimStart();
      }
    }

    if (!data) {
      return;
    }

    try {
      const parsed =
        JSON.parse(data);

      switch (eventType) {

        case "sources":
          setSources(parsed);
          break;

        case "response":
          setAnswer(
            (previous) =>
              previous + parsed
          );
          break;

        case "error":
          setError(
            parsed?.error ||
              "Search failed"
          );
          break;

        case "end":
          setLoading(false);
          break;

        default:
          break;
      }

    } catch (error) {
      console.error(
        "Failed to parse SSE event:",
        error,
        event
      );
    }
  };

  return {
    answer,
    sources,
    loading,
    error,
    search,
  };
}
