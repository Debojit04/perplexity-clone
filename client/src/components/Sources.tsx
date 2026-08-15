import { ExternalLink } from "lucide-react";
import type { Source } from "../hooks/useSearch";

interface SourcesProps {
  sources: Source[];
}

function Sources({
  sources,
}: SourcesProps) {
  if (sources.length === 0) {
    return null;
  }

  return (
    <section className="sources">
      <h3>Sources</h3>

      <div className="source-list">
        {sources.map((source) => (
          <a
            key={source.id}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="source-card"
          >
            <span>
              {source.title}
            </span>

            <ExternalLink size={16} />
          </a>
        ))}
      </div>
    </section>
  );
}

export default Sources;
