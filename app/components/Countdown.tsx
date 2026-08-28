"use client";

import { useEffect, useState } from "react";
import { wedding } from "../lib/wedding";

const TARGET = new Date(wedding.ceremonyISO).getTime();

function split(ms: number) {
  const clamped = Math.max(0, ms);
  const s = Math.floor(clamped / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

/**
 * Ticks once a second and nothing more — no rAF loop, no layout thrash.
 * Renders blank placeholders on the server so the markup never mismatches.
 */
export default function Countdown() {
  const [left, setLeft] = useState<ReturnType<typeof split> | null>(null);

  useEffect(() => {
    const tick = () => setLeft(split(TARGET - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const cells = [
    { label: "Days", value: left?.days, pad: 2 },
    { label: "Hours", value: left?.hours, pad: 2 },
    { label: "Minutes", value: left?.minutes, pad: 2 },
    { label: "Seconds", value: left?.seconds, pad: 2 },
  ];

  const arrived =
    left !== null && left.days + left.hours + left.minutes + left.seconds === 0;

  return (
    <div>
      <div className="grid grid-cols-4 gap-2 sm:gap-3" role="timer" aria-live="off">
        {cells.map((c) => (
          <div key={c.label} className="count-cell">
            <div className="count-num">
              {c.value === undefined
                ? "–".repeat(c.pad)
                : String(c.value).padStart(c.pad, "0")}
            </div>
            <div className="count-label">{c.label}</div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-[0.62rem] uppercase tracking-[0.32em] text-[color:var(--ink-mute)]">
        {arrived ? "The day is here" : "Until the muhurtham"}
      </p>
    </div>
  );
}
