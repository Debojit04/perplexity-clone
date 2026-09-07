import { useState } from "react";
import type { FormEvent } from "react";
import {
  Search,
  BookOpen,
  MessageCircle,
  Globe,
  PlayCircle,
  Image,
  PenLine,
  Loader2,
} from "lucide-react";

export type SearchMode =
  | "academic"
  | "reddit"
  | "web"
  | "youtube"
  | "image"
  | "writing";

interface SearchBoxProps {
  onSearch: (query: string, mode: SearchMode) => void;
  loading: boolean;
}

function SearchBox({ onSearch, loading }: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<SearchMode>("academic");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!query.trim() || loading) {
      return;
    }

    onSearch(query, mode);
  };

  const getModeIcon = () => {
    switch (mode) {
      case "academic":
        return <BookOpen size={16} />;

      case "reddit":
        return <MessageCircle size={16} />;

      case "web":
        return <Globe size={16} />;

      case "youtube":
        return <PlayCircle size={16} />;

      case "image":
        return <Image size={16} />;

      case "writing":
        return <PenLine size={16} />;

      default:
        return <Globe size={16} />;
    }
  };

  return (
    <form className="search-box" onSubmit={handleSubmit}>
      <div className="search-input-wrapper">
        <Search className="search-icon" size={19} />

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ask anything..."
          disabled={loading}
          aria-label="Search query"
        />
      </div>

      <div className="search-mode">
        <span className="mode-icon">
          {getModeIcon()}
        </span>

        <select
          value={mode}
          onChange={(event) =>
            setMode(event.target.value as SearchMode)
          }
          disabled={loading}
          aria-label="Search mode"
        >
          <option value="academic">Academic</option>
          <option value="reddit">Reddit</option>
          <option value="web">Web</option>
          <option value="youtube">YouTube</option>
          <option value="image">Images</option>
          <option value="writing">Writing</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading || !query.trim()}
      >
        {loading ? (
          <>
            <Loader2 className="loading-spinner" size={17} />
            Searching
          </>
        ) : (
          <>
            <Search size={17} />
            Search
          </>
        )}
      </button>
    </form>
  );
}

export default SearchBox;