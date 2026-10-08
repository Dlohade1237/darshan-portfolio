import React, { useEffect, useId, useRef } from "react";

/* =========================================================
   PIXEL REVEAL
   Renders `children` (a base layer stacked on a reveal layer)
   plus an SVG mask made of columns*rows cells. Each cell's
   fill-opacity is driven by pointer distance, and the mask is
   applied (via CSS) to whichever child carries the
   `pixel-mask-target` class — that child fades out per-cell,
   letting the layer beneath show through.
========================================================= */

function PixelReveal({
  className = "",
  children,
  columns = 18,
  rows = 12,
  revealRadius = 2.8,
  transitionMs = 180,
}) {
  const containerRef = useRef(null);
  const cellRefs = useRef([]);
  const frameRef = useRef(null);
  const targetRef = useRef({ x: 0.5, y: 0.5 });
  const activeRef = useRef(false);

  const rawId = useId().replace(/[:]/g, "");
  const maskId = `pixel-mask-${rawId}`;

  const cells = Array.from(
    { length: columns * rows },
    (_, index) => index
  );

  const updateCells = () => {
    frameRef.current = null;

    const total = columns * rows;

    const aspect =
      containerRef.current?.clientWidth /
      Math.max(containerRef.current?.clientHeight || 1, 1);

    for (let index = 0; index < total; index++) {
      const col = index % columns;
      const row = Math.floor(index / columns);

      const cellX = (col + 0.5) / columns;
      const cellY = (row + 0.5) / rows;

      const dx = cellX - targetRef.current.x;
      const dy = cellY - targetRef.current.y;

      const distance = Math.sqrt(
        Math.pow(dx * aspect, 2) + Math.pow(dy, 2)
      );

      const normalized = 1 - distance / revealRadius;
      const strength = Math.max(0, Math.min(1, normalized));

      const cell = cellRefs.current[index];
      if (!cell) continue;

      cell.setAttribute(
        "fill-opacity",
        activeRef.current ? strength : 0
      );
    }
  };

  const handlePointerMove = (event) => {
    const element = containerRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();

    targetRef.current = {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    };

    activeRef.current = true;

    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(updateCells);
  };

  const handlePointerEnter = (event) => {
    activeRef.current = true;
    handlePointerMove(event);
  };

  const handlePointerLeave = () => {
    activeRef.current = false;

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    cellRefs.current.forEach((cell) => {
      if (!cell) return;
      cell.setAttribute("fill-opacity", 0);
    });
  };

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`pixel-reveal ${className}`}
      style={{
        "--pixel-mask": `url(#${maskId})`,
        "--pixel-transition": `${transitionMs}ms`,
      }}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}

      <svg className="pixel-reveal-svg" aria-hidden="true">
        <defs>
          <mask
            id={maskId}
            maskUnits="objectBoundingBox"
            maskContentUnits="objectBoundingBox"
            x="0"
            y="0"
            width="1"
            height="1"
          >
            <rect x="0" y="0" width="1" height="1" fill="#fff" />

            {cells.map((index) => {
              const col = index % columns;
              const row = Math.floor(index / columns);

              return (
                <rect
                  key={index}
                  ref={(element) => {
                    cellRefs.current[index] = element;
                  }}
                  x={col / columns}
                  y={row / rows}
                  width={1 / columns}
                  height={1 / rows}
                  fill="#000"
                  fillOpacity="0"
                />
              );
            })}
          </mask>
        </defs>
      </svg>
    </div>
  );
}

export default PixelReveal;