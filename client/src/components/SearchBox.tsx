import { useState } from "react";
import type { FormEvent } from "react";
import { Search } from "lucide-react";

interface SearchBoxProps {
  onSearch: (query: string) => void;
  loading: boolean;
}

function SearchBox({
  onSearch,
  loading,
}: SearchBoxProps) {
  const [query, setQuery] =
    useState("");

  const handleSubmit = (
    event: FormEvent
  ) => {
    event.preventDefault();

    if (!query.trim()) {
      return;
    }

    onSearch(query);
  };

  return (
    <form
      className="search-box"
      onSubmit={handleSubmit}
    >
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
