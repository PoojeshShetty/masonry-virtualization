// MasonryLayout.jsx
import { useEffect, useState, useRef } from "react";

export default function MasonryLayout({ columnCount = 4, gap = 16 }) {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const containerRef = useRef(null);
  const [positions, setPositions] = useState([]);

  const FIXED_WIDTH = 270;

  useEffect(() => {
    loadMore();
  }, []);

  async function loadMore() {
    const res = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=30`);
    const data = await res.json();

    const adjusted = data.map((img) => ({
      ...img,
      width: FIXED_WIDTH,
      height: Math.floor((img.height / img.width) * FIXED_WIDTH), // maintain aspect ratio
      url: img.download_url
    }));

    setImages((prev) => [...prev, ...adjusted]);
    setPage((p) => p + 1);
  }

  // Calculate positions whenever images or container width changes
  useEffect(() => {
    if (!containerRef.current) return;

    const columnWidth = FIXED_WIDTH; // fixed width per column
    let colHeights = Array(columnCount).fill(0);

    const newPositions = images.map((img) => {
      const minCol = colHeights.indexOf(Math.min(...colHeights));
      const x = minCol * (columnWidth + gap);
      const y = colHeights[minCol];
      colHeights[minCol] += img.height + gap;

      return { x, y, width: columnWidth, height: img.height };
    });

    console.log({newPositions})

    setPositions(newPositions);
  }, [images, columnCount, gap]);

  const containerHeight = positions.length
    ? Math.max(...positions.map((pos) => pos.y + pos.height))
    : 0;

  return (
    <div>
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: columnCount * (FIXED_WIDTH + gap) - gap,
          margin: "0 auto"
        }}
      >
        {images.map((img, idx) => (
          <div
            key={img.id + "-" + idx}
            style={{
              position: "absolute",
              width: positions[idx]?.width,
              height: positions[idx]?.height,
              transform: `translate(${positions[idx]?.x || 0}px, ${
                positions[idx]?.y || 0
              }px)`,
              transition: "transform 0.3s ease"
            }}
          >
            <img
              src={img.url}
              alt={img.author}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "8px"
              }}
            />
            <div style={{position: 'absolute', top: '20px', left: "20px", color: 'white'}}>
              {idx}
              </div>
          </div>
        ))}
      </div>
      <button
        onClick={loadMore}
        style={{
          display: "block",
          margin: "20px auto",
          padding: "10px 20px",
          fontSize: "16px"
        }}
      >
        Load More
      </button>
    </div>
  );
}
