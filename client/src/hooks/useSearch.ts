import { useState } from "react";

export interface Source {
  id: number;
  title: string;
  url: string;
}

export interface Video {
  img_src: string;
  url: string;
  title: string;
  iframe_src: string;
}

export type SearchMode =
  | "academic"
  | "reddit"
  | "web"
  | "youtube";

export function useSearch() {
  const [answer, setAnswer] = useState("");
  const [sources, setSources] =
    useState<Source[]>([]);
  const [videos, setVideos] =
    useState<Video[]>([]);
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState("");

  const search = async (
    query: string,
    mode: SearchMode
  ) => {
    if (!query.trim()) {
      return;
    }

    // Clear previous search
    setAnswer("");
    setSources([]);
    setVideos([]);
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

      // --------------------------------
      // YouTube search
      // Returns normal JSON
      // --------------------------------

      if (mode === "youtube") {
        const data =
          await response.json();

        setVideos(
          data.videos ?? []
        );

        return;
      }

      // --------------------------------
      // Academic / Reddit / Web
      // Use SSE streaming
      // --------------------------------

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

        for (
          const event of events
        ) {
          processEvent(event);
        }
      }

      // Process remaining buffer
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

        // ----------------------------
        // Sources
        // ----------------------------

        case "sources":
          setSources(parsed);
          break;

        // ----------------------------
        // Streaming answer
        // ----------------------------

        case "response":
          setAnswer(
            (previous) =>
              previous + parsed
          );
          break;

        // ----------------------------
        // Error
        // ----------------------------

        case "error":
          setError(
            parsed?.error ||
              "Search failed"
          );
          break;

        // ----------------------------
        // Search completed
        // ----------------------------

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
    videos,
    loading,
    error,
    search,
  };
}
