import { ExternalLink, Globe2 } from "lucide-react";
import type { Source } from "../hooks/useSearch";

interface SourcesProps {
  sources: Source[];
}

function Sources({ sources }: SourcesProps) {
  if (sources.length === 0) {
    return null;
  }

  return (
    <section className="sources">
      <div className="sources-header">
        <div className="sources-title">
          <div className="sources-icon">
            <Globe2 size={16} />
          </div>

          <h3>Sources</h3>
        </div>

        <span className="sources-count">
          {sources.length} {sources.length === 1 ? "source" : "sources"}
        </span>
      </div>

      <div className="source-list">
        {sources.map((source) => {
          let domain = "";

          try {
            domain = new URL(source.url).hostname.replace("www.", "");
          } catch {
            domain = source.url;
          }

          return (
            <a
              key={source.id}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="source-card"
            >
              <div className="source-main">
                <div className="source-favicon">
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
                    alt=""
                  />
                </div>

                <div className="source-info">
                  <span className="source-title">
                    {source.title || "Untitled source"}
                  </span>

                  <span className="source-domain">
                    {domain}
                  </span>
                </div>
              </div>

              <ExternalLink
                className="source-external-icon"
                size={15}
              />
            </a>
          );
        })}
      </div>
    </section>
  );
}

export default Sources;
