"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PetalBurst } from "./Petals";
import { wedding } from "../lib/wedding";

/**
 * Scratch-to-reveal date. The covering layer is a canvas painted to look like
 * the card's decorated paper; pointer moves erase it with destination-out.
 * Works identically for touch and mouse via Pointer Events.
 */
export default function ScratchDate() {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const movesRef = useRef(0);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const clearedRef = useRef(false);

  const [cleared, setCleared] = useState(false);
  const [burst, setBurst] = useState(0);

  const paintCover = useCallback(() => {
    const canvas = canvasRef.current;
    const shell = shellRef.current;
    if (!canvas || !shell) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { width, height } = shell.getBoundingClientRect();
    if (!width || !height) return;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // Warm paper wash
    const wash = ctx.createLinearGradient(0, 0, width, height);
    wash.addColorStop(0, "#f7ead4");
    wash.addColorStop(0.5, "#efdcbd");
    wash.addColorStop(1, "#e8cfa9");
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, width, height);

    // Marigold and olive blooms, echoing the card border
    const blooms: [number, number, number, string][] = [
      [width * 0.16, height * 0.22, 26, "#e2703a"],
      [width * 0.84, height * 0.26, 20, "#e9a04a"],
      [width * 0.24, height * 0.82, 18, "#dd8a72"],
      [width * 0.78, height * 0.8, 24, "#e9a04a"],
      [width * 0.5, height * 0.12, 14, "#cf5f52"],
    ];
    for (const [cx, cy, r, tone] of blooms) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.globalAlpha = 0.4;
      for (let i = 0; i < 6; i++) {
        ctx.rotate(Math.PI / 3);
        ctx.beginPath();
        ctx.ellipse(0, -r * 0.6, r * 0.34, r * 0.62, 0, 0, Math.PI * 2);
        ctx.fillStyle = tone;
        ctx.fill();
      }
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.24, 0, Math.PI * 2);
      ctx.fillStyle = "#c9a227";
      ctx.fill();
      ctx.restore();
    }

    // Olive foliage strokes
    ctx.strokeStyle = "rgba(110,139,91,0.45)";
    ctx.lineWidth = 1.4;
    for (let i = 0; i < 5; i++) {
      const y = height * (0.2 + i * 0.15);
      ctx.beginPath();
      ctx.moveTo(-10, y);
      ctx.bezierCurveTo(width * 0.3, y - 26, width * 0.7, y + 26, width + 10, y - 6);
      ctx.stroke();
    }

    // Gold frame + prompt
    ctx.strokeStyle = "rgba(201,162,39,0.7)";
    ctx.lineWidth = 1;
    ctx.strokeRect(14, 14, width - 28, height - 28);

    ctx.fillStyle = "rgba(27,42,91,0.72)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // Letter-spacing by hand keeps this working on every canvas engine.
    const spaced = (t: string) => t.split("").join("  ");
    ctx.font = "500 11px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(spaced("SCRATCH TO REVEAL"), width / 2, height / 2 - 9);
    ctx.font = "300 9px ui-sans-serif, system-ui, sans-serif";
    ctx.fillStyle = "rgba(27,42,91,0.45)";
    ctx.fillText(spaced("THE DAY THEY SAY YES"), width / 2, height / 2 + 14);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      clearedRef.current = true;
      const frame = requestAnimationFrame(() => setCleared(true));
      return () => cancelAnimationFrame(frame);
    }
    paintCover();
    const shell = shellRef.current;
    if (!shell) return;
    const ro = new ResizeObserver(() => {
      if (!clearedRef.current) paintCover();
    });
    ro.observe(shell);
    return () => ro.disconnect();
  }, [paintCover]);

  const finish = useCallback(() => {
    if (clearedRef.current) return;
    clearedRef.current = true;
    setCleared(true);
    setBurst((n) => n + 1);
  }, []);

  const measure = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx) return;
    // Sample a coarse grid instead of every pixel — plenty accurate, cheap.
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let clearPx = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4 * 41) {
      total++;
      if (data[i] < 40) clearPx++;
    }
    if (total && clearPx / total > 0.52) finish();
  }, [finish]);

  const scratch = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = canvas.width / canvas.getBoundingClientRect().width;
    const px = x * dpr;
    const py = y * dpr;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 46 * dpr;
    const last = lastRef.current;
    ctx.beginPath();
    if (last) {
      ctx.moveTo(last.x * dpr, last.y * dpr);
      ctx.lineTo(px, py);
      ctx.stroke();
    }
    ctx.arc(px, py, 23 * dpr, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    lastRef.current = { x, y };
  }, []);

  const pointFrom = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  return (
    <div className="scratch-area relative">
      <div ref={shellRef} className={`scratch-shell ${cleared ? "shimmer-sweep" : ""}`}>
        {/* The reveal underneath */}
        <div className="absolute inset-0 grid place-items-center px-6 text-center">
          <div>
            <p className="eyebrow">Save the date</p>
            <p
              className="gold-shine lining-nums mt-3 font-display text-[clamp(1.6rem,7.6vw,2.3rem)] font-light uppercase leading-tight tracking-[0.1em]"
              style={{ letterSpacing: "0.09em" }}
            >
              {wedding.dateDisplay.day} {wedding.dateDisplay.month}
            </p>
            <p className="gold-shine gold-shine--gold lining-nums font-display text-[clamp(1.6rem,7.6vw,2.3rem)] font-light tracking-[0.28em]">
              {wedding.dateDisplay.year}
            </p>
            <span className="gold-rule mx-auto mt-4 block h-px w-24" />
            <p className="mt-3 text-[0.6rem] uppercase tracking-[0.34em] text-[color:var(--ink-mute)]">
              {wedding.weekday} · {wedding.timeRange}
            </p>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          className={`scratch-canvas ${cleared ? "is-cleared" : ""}`}
          aria-hidden="true"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            drawingRef.current = true;
            const p = pointFrom(e);
            lastRef.current = null;
            scratch(p.x, p.y);
          }}
          onPointerMove={(e) => {
            if (!drawingRef.current) return;
            const p = pointFrom(e);
            scratch(p.x, p.y);
            // Check coverage while scratching, but not on every frame.
            if (++movesRef.current % 14 === 0) measure();
          }}
          onPointerUp={() => {
            drawingRef.current = false;
            lastRef.current = null;
            measure();
          }}
          onPointerCancel={() => {
            drawingRef.current = false;
            lastRef.current = null;
            measure();
          }}
          onPointerLeave={() => {
            if (!drawingRef.current) return;
            drawingRef.current = false;
            lastRef.current = null;
            measure();
          }}
        />
      </div>

      {!cleared && (
        <p className="mt-5 text-center text-[0.6rem] uppercase tracking-[0.3em] text-[color:var(--ink-mute)]">
          Use your finger
        </p>
      )}
      {cleared && (
        <button
          type="button"
          onClick={() => document.getElementById("countdown")?.scrollIntoView({ behavior: "smooth" })}
          className="mt-5 text-center text-[0.6rem] uppercase tracking-[0.3em] text-[color:var(--coral)]"
        >
          Not long now ↓
        </button>
      )}

      <PetalBurst trigger={burst} count={22} />
    </div>
  );
}
