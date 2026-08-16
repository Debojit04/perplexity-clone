import { useState } from "react";
import type { FormEvent } from "react";
import { Search } from "lucide-react";

export type SearchMode =
  | "academic"
  | "reddit"
  | "web"
  | "youtube";

interface SearchBoxProps {
  onSearch: (
    query: string,
    mode: SearchMode
  ) => void;
  loading: boolean;
}

function SearchBox({
  onSearch,
  loading,
}: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [mode, setMode] =
    useState<SearchMode>("academic");

  const handleSubmit = (
    event: FormEvent
  ) => {
    event.preventDefault();

    if (!query.trim()) {
      return;
    }

    onSearch(query, mode);
  };

  return (
    <form
      className="search-box"
      onSubmit={handleSubmit}
    >
      <select
        value={mode}
        onChange={(event) =>
          setMode(
            event.target.value as SearchMode
          )
        }
        disabled={loading}
      >
        <option value="academic">
          Academic
        </option>

        <option value="reddit">
          Reddit
        </option>

        <option value="web">
          Web
        </option>

        <option value="youtube">
          YouTube
        </option>
      </select>

      <input
        value={query}
        onChange={(event) =>
          setQuery(event.target.value)
        }
        placeholder="Ask anything..."
        disabled={loading}
      />

      <button
        type="submit"
        disabled={loading}
      >
        <Search size={18} />

        {loading
          ? "Searching..."
          : "Search"}
      </button>
    </form>
  );
}

export default SearchBox;
