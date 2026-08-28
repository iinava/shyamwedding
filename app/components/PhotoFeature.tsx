"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Full-bleed portrait with a very gentle parallax. The scroll handler only
 * does work while the frame is on screen, and switches off entirely for
 * reduced motion — nothing runs when it isn't being looked at.
 */
export default function PhotoFeature({
  src,
  alt,
  caption,
  ratio = "3 / 4",
  priority = false,
  frameClass = "",
  position,
}: {
  src?: string;
  alt?: string;
  caption?: string;
  ratio?: string;
  priority?: boolean;
  /** Extra shape classes for the frame, e.g. "arch frame-gold". */
  frameClass?: string;
  /** Overrides the default face-safe crop anchor. */
  position?: string;
}) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    const inner = innerRef.current;
    if (!frame || !inner) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let visible = false;
    let ticking = false;

    const apply = () => {
      ticking = false;
      const rect = frame.getBoundingClientRect();
      const progress = (rect.top + rect.height / 2) / window.innerHeight - 0.5;
      inner.style.transform = `translate3d(0, ${(-progress * 22).toFixed(2)}px, 0) scale(1.1)`;
    };

    const onScroll = () => {
      if (!visible || ticking) return;
      ticking = true;
      requestAnimationFrame(apply);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) apply();
      },
      { rootMargin: "20% 0px" }
    );
    io.observe(frame);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <figure className="m-0">
      <div
        ref={frameRef}
        className={`photo-frame ${src ? "" : "is-empty"} ${frameClass}`}
        style={{ aspectRatio: ratio }}
      >
        {src ? (
          <div ref={innerRef} className="absolute inset-0 will-change-transform">
            <Image
              src={src}
              alt={alt ?? ""}
              fill
              sizes="(max-width: 640px) 100vw, 640px"
              priority={priority}
              className="object-cover"
              style={{ opacity: loaded ? 1 : 0, objectPosition: position }}
              onLoad={() => setLoaded(true)}
            />
          </div>
        ) : (
          <div className="photo-empty absolute inset-0">
            <span>
              A photograph
              <br />
              belongs here
            </span>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-4 text-center text-[0.6rem] uppercase tracking-[0.34em] text-[color:var(--ink-mute)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
