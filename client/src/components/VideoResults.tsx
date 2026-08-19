import type { Video } from "../hooks/useSearch";

interface VideoResultsProps {
  videos: Video[];
}

function VideoResults({
  videos,
}: VideoResultsProps) {
  if (videos.length === 0) {
    return null;
  }

  return (
    <section className="video-results">
      <h2>Videos</h2>

      <div className="video-grid">
        {videos.map((video) => (
          <a
            key={video.url}
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="video-card"
          >
            <img
              src={video.img_src}
              alt={video.title}
            />

            <div className="video-card-content">
              <h3>{video.title}</h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default VideoResults;
