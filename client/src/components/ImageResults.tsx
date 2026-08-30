import type { ImageResult } from "../hooks/useSearch";

interface ImageResultsProps {
  images: ImageResult[];
}

function ImageResults({
  images,
}: ImageResultsProps) {
  if (images.length === 0) {
    return null;
  }

  return (
    <section className="image-results">
      <h2>Images</h2>

      <div className="image-grid">
        {images.map((image) => (
          <a
            key={image.img_src}
            href={image.url}
            target="_blank"
            rel="noopener noreferrer"
            className="image-card"
          >
            <img
              src={image.img_src}
              alt={image.title}
            />

            <div className="image-card-content">
              <h3>{image.title}</h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default ImageResults;
