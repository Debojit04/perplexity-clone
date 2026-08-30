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

export interface ImageResult {
  img_src: string;
  url: string;
  title: string;
}

export type SearchMode =
  | "academic"
  | "reddit"
  | "web"
  | "youtube"
  | "image"
  | "writing";

export function useSearch() {
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [images, setImages] = useState<ImageResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --------------------------------
  // Generate suggestions
  // --------------------------------

  const getSuggestions = async (
    query: string,
    currentAnswer: string
  ) => {
    try {
      const response = await fetch("/api/search", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          query: "Generate related questions",

          mode: "suggestions",

          chat_history: [
            {
              role: "user",
              content: query,
            },
            {
              role: "assistant",
              content: currentAnswer,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Suggestion request failed with status ${response.status}`
        );
      }

      const data = await response.json();

      setSuggestions(data.suggestions ?? []);
    } catch (err) {
      console.error(
        "Suggestion generation error:",
        err
      );

      // Suggestions are optional.
      // Do not show an error to the user
      // if only suggestion generation fails.
      setSuggestions([]);
    }
  };

  // --------------------------------
  // Main search
  // --------------------------------

  const search = async (
    query: string,
    mode: SearchMode
  ) => {
    if (!query.trim()) {
      return;
    }

    // --------------------------------
    // Clear previous search
    // --------------------------------

    setAnswer("");
    setSources([]);
    setVideos([]);
    setImages([]);
    setSuggestions([]);
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
      // YouTube
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
      // Image search
      // --------------------------------

      if (mode === "image") {
        const data =
          await response.json();

        setImages(
          data.images ?? []
        );

        return;
      }

      // --------------------------------
      // Streaming modes
      // Academic / Reddit / Web / Writing
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

      // Keep the complete answer locally.
      // This is important because React state
      // updates are asynchronous.

      let completeAnswer = "";

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
          const result =
            processEvent(event);

          if (
            result?.type ===
            "response"
          ) {
            completeAnswer +=
              result.data;
          }
        }
      }

      // --------------------------------
      // Process remaining SSE data
      // --------------------------------

      if (buffer.trim()) {
        const result =
          processEvent(buffer);

        if (
          result?.type ===
          "response"
        ) {
          completeAnswer +=
            result.data;
        }
      }

      // --------------------------------
      // Generate suggestions
      // --------------------------------
      //
      // Only generate suggestions for
      // normal conversational searches.
      //
      // Writing responses can also have
      // suggestions if desired.

      if (
        completeAnswer.trim() &&
        (
          mode === "academic" ||
          mode === "reddit" ||
          mode === "web" ||
          mode === "writing"
        )
      ) {
        await getSuggestions(
          query,
          completeAnswer
        );
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

  // --------------------------------
  // Process SSE event
  // --------------------------------

  const processEvent = (
    event: string
  ): {
    type: string;
    data: string;
  } | null => {
    const lines =
      event.split("\n");

    let eventType = "";
    let data = "";

    for (
      const line of lines
    ) {
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
        data +=
          line
            .substring(5)
            .trimStart();
      }
    }

    if (!data) {
      return null;
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
            previous =>
              previous + parsed
          );

          return {
            type: "response",
            data: parsed,
          };

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
          break;

        default:
          break;
      }

      return null;
    } catch (error) {
      console.error(
        "Failed to parse SSE event:",
        error,
        event
      );

      return null;
    }
  };

  // --------------------------------
  // Suggestion click
  // --------------------------------

  const handleSuggestionClick = (
    suggestion: string
  ) => {
    search(
      suggestion,
      "web"
    );
  };

  return {
    answer,
    sources,
    videos,
    images,
    suggestions,
    loading,
    error,
    search,
    getSuggestions,
    handleSuggestionClick,
  };
}
