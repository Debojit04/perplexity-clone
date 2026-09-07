import "./App.css";

import VideoResults from "./components/VideoResults";
import ImageResults from "./components/ImageResults";
import Suggestions from "./components/Suggestions";
import SearchBox from "./components/SearchBox";
import Sources from "./components/Sources";
import Answer from "./components/Answer";

import { useSearch } from "./hooks/useSearch";

function App() {
  const {
    answer,
    sources,
    videos,
    images,
    suggestions,
    loading,
    error,
    search,
    handleSuggestionClick,
  } = useSearch();

  const hasResult =
    answer ||
    sources.length > 0 ||
    videos.length > 0 ||
    images.length > 0 ||
    suggestions.length > 0 ||
    loading;

  return (
    <div className="app">
      <header className="topbar">
        <div className="logo">
          <span>Perplexity Clone</span>
        </div>

        <button
          className="new-search-btn"
          onClick={() => window.location.reload()}
        >
          + New Search
        </button>
      </header>

      <main className={hasResult ? "main has-result" : "main"}>
        {!hasResult && (
          <div className="welcome">
            <h1>What do you want to know?</h1>

            <p>
              Search the web and get AI-powered answers with sources.
            </p>
          </div>
        )}

        <SearchBox
          onSearch={search}
          loading={loading}
        />

        {error && (
          <div className="error">
            <strong>Something went wrong</strong>
            <p>{error}</p>
          </div>
        )}

        {answer && (
          <Answer
            answer={answer}
            loading={loading}
          />
        )}

        {sources.length > 0 && (
          <Sources
            sources={sources}
          />
        )}

        {videos.length > 0 && (
          <VideoResults
            videos={videos}
          />
        )}

        {images.length > 0 && (
          <ImageResults
            images={images}
          />
        )}

        {suggestions.length > 0 && (
          <Suggestions
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
          />
        )}

        {loading && !answer && (
          <div className="loading">
            <div className="loading-dot"></div>

            <span>Searching the web...</span>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
