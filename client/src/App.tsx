import "./App.css";

import SearchBox from "./components/SearchBox";
import Sources from "./components/Sources";
import Answer from "./components/Answer";

import { useSearch } from "./hooks/useSearch";

function App() {
  const {
    answer,
    sources,
    loading,
    error,
    search,
  } = useSearch();

  const hasResult =
    answer || sources.length > 0 || loading;

  return (
    <div className="app">

      <header className="topbar">
        <div className="logo">
          <div className="logo-mark">P</div>
          <span>Perplexity Clone</span>
        </div>

        <button
          className="new-search"
          onClick={() => window.location.reload()}
        >
          + New Search
        </button>
      </header>

      <main
        className={
          hasResult
            ? "main has-result"
            : "main"
        }
      >

        {!hasResult && (
          <div className="welcome">
            <h1>
              What do you want to know?
            </h1>

            <p>
              Search the web and get
              AI-powered answers with sources.
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
  <Sources sources={sources} />
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

