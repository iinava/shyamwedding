"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Photo = { src: string; alt: string };

/**
 * Masonry-ish gallery with a full-screen viewer. Thumbnails lazy-load through
 * next/image; the viewer handles swipe, keyboard and tap targets.
 */
export default function Gallery({ photos }: { photos: Photo[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % photos.length)),
    [photos.length]
  );
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (index === null) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [index, close, next, prev]);

  if (photos.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="photo-frame is-empty photo-empty"
            style={{ aspectRatio: i % 3 === 0 ? "3 / 4" : "1 / 1" }}
          >
            <span>Photograph<br />coming soon</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="columns-2 gap-3 [column-fill:_balance] lg:columns-3 lg:gap-5">
        {photos.map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => setIndex(i)}
            className="photo-frame mb-3 block w-full break-inside-avoid"
            aria-label={`Open photo ${i + 1} of ${photos.length}`}
          >
            <span className="relative block" style={{ aspectRatio: i % 3 === 0 ? "3 / 4" : "1 / 1" }}>
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(max-width: 640px) 50vw, 260px"
                className="object-cover"
                loading="lazy"
              />
            </span>
          </button>
        ))}
      </div>

      {index !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={close}
          onTouchStart={(e) => {
            touchX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) < 45) return;
            if (dx < 0) next();
            else prev();
          }}
        >
          <div
            className="relative flex h-full w-full items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={photos[index].src}
              src={photos[index].src}
              alt={photos[index].alt}
              width={1400}
              height={1800}
              sizes="100vw"
              className="h-auto max-h-[86vh] w-auto max-w-full object-contain"
              priority
            />

            <button
              type="button"
              onClick={close}
              className="lightbox-btn"
              style={{ top: "calc(1rem + env(safe-area-inset-top))", right: "1rem" }}
              aria-label="Close viewer"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path d="M6 6 18 18 M18 6 6 18" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
              </svg>
            </button>

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="lightbox-btn"
                  style={{ left: "1rem", top: "50%", transform: "translateY(-50%)" }}
                  aria-label="Previous photo"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                    <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="lightbox-btn"
                  style={{ right: "1rem", top: "50%", transform: "translateY(-50%)" }}
                  aria-label="Next photo"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                    <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </>
            )}

            <p
              className="absolute left-1/2 -translate-x-1/2 text-[0.6rem] uppercase tracking-[0.32em] text-[#f0dda3]"
              style={{ bottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}
            >
              {index + 1} / {photos.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
