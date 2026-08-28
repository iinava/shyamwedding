"use client";

import { useEffect, useState } from "react";

const TONES = ["#e2703a", "#e9a04a", "#dd8a72", "#f0dda3", "#cf5f52"];

type Petal = {
  left: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  tone: string;
  spin: number;
};

function makePetals(count: number, maxDelay: number): Petal[] {
  return Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    size: 7 + Math.random() * 12,
    delay: Math.random() * maxDelay,
    duration: 9 + Math.random() * 9,
    drift: (Math.random() - 0.5) * 160,
    tone: TONES[Math.floor(Math.random() * TONES.length)],
    spin: Math.random() * 360,
  }));
}

/**
 * Ambient petals drifting over the whole page. Rendered only after mount so
 * the markup stays deterministic, and skipped entirely for reduced motion.
 */
export function PetalDrift({ count = 12, fixed = true }: { count?: number; fixed?: boolean }) {
  const [petals, setPetals] = useState<Petal[] | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Seeded on the next frame so the first paint is never held up.
    const frame = requestAnimationFrame(() => {
      // A leaner field on small/low-power screens.
      const n = window.innerWidth < 480 ? Math.round(count * 0.6) : count;
      setPetals(makePetals(n, 12));
    });
    return () => cancelAnimationFrame(frame);
  }, [count]);

  if (!petals) return null;

  return (
    <div
      className="petal-layer"
      style={{ position: fixed ? "fixed" : "absolute" }}
      aria-hidden="true"
    >
      {petals.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: `linear-gradient(140deg, ${p.tone}, rgba(255,255,255,0.35))`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.spin}deg)`,
            ["--drift" as string]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * A one-shot burst — used when the invitation opens and when the date is
 * scratched clear. Self-clears so nothing keeps animating off-screen.
 */
export function PetalBurst({
  trigger,
  count = 26,
  fixed = true,
}: {
  trigger: number;
  count?: number;
  fixed?: boolean;
}) {
  const [petals, setPetals] = useState<Petal[] | null>(null);

  useEffect(() => {
    if (!trigger) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const frame = requestAnimationFrame(() => setPetals(makePetals(count, 1.2)));
    const t = window.setTimeout(() => setPetals(null), 14000);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(t);
    };
  }, [trigger, count]);

  if (!petals) return null;

  return (
    <div
      className="petal-layer"
      style={{ position: fixed ? "fixed" : "absolute" }}
      aria-hidden="true"
    >
      {petals.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: `linear-gradient(140deg, ${p.tone}, rgba(255,255,255,0.35))`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration * 0.7}s`,
            transform: `rotate(${p.spin}deg)`,
            ["--drift" as string]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
