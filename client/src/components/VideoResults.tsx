import { ExternalLink, Play } from "lucide-react";
import type { Video } from "../hooks/useSearch";

interface VideoResultsProps {
  videos: Video[];
}

function VideoResults({ videos }: VideoResultsProps) {
  if (videos.length === 0) {
    return null;
  }

  return (
    <section className="video-results">
      <div className="video-results-header">
        <div className="video-results-title">
          <div className="video-results-icon">
            <Play size={15} />
          </div>

          <h2>Videos</h2>
        </div>

        <span className="video-results-count">
          {videos.length} {videos.length === 1 ? "video" : "videos"}
        </span>
      </div>

      <div className="video-grid">
        {videos.map((video) => (
          <a
            key={video.url}
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="video-card"
          >
            <div className="video-thumbnail-wrapper">
              <img
                src={video.img_src}
                alt={video.title}
                className="video-thumbnail"
              />

              <div className="video-play">
                <Play size={18} fill="currentColor" />
              </div>
            </div>

            <div className="video-card-content">
              <h3>{video.title}</h3>

              <div className="video-card-footer">
                <span>YouTube</span>

                <ExternalLink
                  size={14}
                  className="video-external-icon"
                />
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default VideoResults;
