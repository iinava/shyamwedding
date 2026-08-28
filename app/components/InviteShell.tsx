"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { FloralCorner, Ganesha } from "./Florals";
import { PetalBurst, PetalDrift } from "./Petals";
import { wedding } from "../lib/wedding";

const MUSIC_KEY = "vinaya-aravind:music";

/**
 * Owns the two things that have to live above every section: the sealed
 * invitation cover and the background music. Sections themselves stay server
 * components and are passed in as children.
 */
export default function InviteShell({ children }: { children: ReactNode }) {
  const [opened, setOpened] = useState(false);
  const [unsealing, setUnsealing] = useState(false);
  const [burst, setBurst] = useState(0);
  const [musicOn, setMusicOn] = useState(false);
  const [musicAvailable, setMusicAvailable] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Hold the page still until the invitation is opened.
  useEffect(() => {
    const root = document.documentElement;
    root.style.overflow = opened ? "" : "hidden";
    return () => {
      root.style.overflow = "";
    };
  }, [opened]);

  const startMusic = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      audio.volume = 0;
      await audio.play();
      setMusicOn(true);
      // Fade in gently rather than arriving at full volume.
      const target = 0.32;
      const step = () => {
        if (!audioRef.current) return;
        const next = Math.min(target, audioRef.current.volume + 0.02);
        audioRef.current.volume = next;
        if (next < target) window.setTimeout(step, 90);
      };
      step();
    } catch {
      // Autoplay refused — the toggle stays available.
      setMusicOn(false);
    }
  }, []);

  const open = useCallback(() => {
    if (unsealing) return;
    setUnsealing(true);
    setBurst((n) => n + 1);

    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(MUSIC_KEY);
    } catch {
      stored = null;
    }
    if (stored !== "off") void startMusic();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => setOpened(true), reduced ? 200 : 1500);
  }, [unsealing, startMusic]);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicOn) {
      audio.pause();
      setMusicOn(false);
      try {
        window.localStorage.setItem(MUSIC_KEY, "off");
      } catch {}
    } else {
      void startMusic();
      try {
        window.localStorage.setItem(MUSIC_KEY, "on");
      } catch {}
    }
  }, [musicOn, startMusic]);

  return (
    <>
      {/* Everything visual lives in this fixed-width column: full-bleed
          on phones, a framed card floating on a richer backdrop past
          ~780px (see .stage in globals.css). Music/petals stay outside
          it so their fixed positioning still tracks the real viewport. */}
      <div className="stage">
      {/* ── The sealed cover ─────────────────────────── */}
      {!opened && (
        <div
          className="absolute left-0 right-0 top-0 z-50 select-none"
          style={{ height: "100svh", perspective: "1600px" }}
          role="dialog"
          aria-label="Wedding invitation cover"
        >
          <CoverPanel side="left" unsealing={unsealing} />
          <CoverPanel side="right" unsealing={unsealing} />

          <button
            type="button"
            onClick={open}
            className="absolute inset-0 flex w-full flex-col items-center justify-center px-8 text-center"
            style={{
              transition: "opacity 700ms var(--ease-cine), transform 900ms var(--ease-cine)",
              opacity: unsealing ? 0 : 1,
              transform: unsealing ? "scale(1.06)" : "scale(1)",
              paddingTop: "env(safe-area-inset-top)",
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
            aria-label="Tap to open the invitation"
          >
            <span className="eyebrow block">Shubha Vivaham</span>

            <Ganesha className="float-slow mt-6 h-24 w-24 opacity-90" />

            <span className="eyebrow mt-3 block text-[0.58rem]">Shree Ganeshaya Namah</span>

            <span className="mt-9 block font-display text-[clamp(2.6rem,15vw,4.6rem)] font-light leading-[1.02] tracking-[0.01em]">
              <span className="gold-shine block">{wedding.bride}</span>
              <span className="my-1 block font-display text-[0.42em] italic text-[color:var(--coral)]">
                and
              </span>
              <span className="gold-shine block">{wedding.groom}</span>
            </span>

            <span className="gold-rule mt-8 block h-px w-40" />

            <span className="mt-5 block font-body text-[0.74rem] font-normal uppercase tracking-[0.4em] text-[color:var(--ink-soft)]">
              {wedding.dateLong}
            </span>

            <span className="mt-14 flex flex-col items-center gap-3">
              <span className="cover-seal">
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path
                    d="M12 20s-7-4.7-7-9.4A4 4 0 0 1 12 8a4 4 0 0 1 7 2.6C19 15.3 12 20 12 20Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                </svg>
              </span>
              <span className="eyebrow text-[color:var(--ink)]">Tap to open</span>
            </span>
          </button>
        </div>
      )}

      {/* ── The invitation itself ────────────────────── */}
      {/* Fades up while the cover is still swinging, so the reveal is
          continuous rather than passing through a blank frame. */}
      <div
        aria-hidden={!opened}
        style={{
          transition: "opacity 1400ms var(--ease-cine)",
          opacity: opened || unsealing ? 1 : 0,
        }}
      >
        {children}
      </div>
      </div>

      {opened && <PetalDrift count={12} />}
      <PetalBurst trigger={burst} count={44} />

      {/* ── Music ────────────────────────────────────── */}
      {musicAvailable && (
        <audio
          ref={audioRef}
          src={wedding.musicSrc}
          loop
          preload="none"
          onError={() => setMusicAvailable(false)}
        />
      )}

      {opened && musicAvailable && (
        <button
          type="button"
          onClick={toggleMusic}
          className="music-toggle"
          aria-pressed={musicOn}
          aria-label={musicOn ? "Mute background music" : "Play background music"}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path
              d="M9 17.5V6.2l9-1.7v10.6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="7" cy="17.6" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.3" />
            <circle cx="16" cy="15.6" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.3" />
            {!musicOn && (
              <path d="M4 20 20 4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            )}
          </svg>
          <span className={`music-bars ${musicOn ? "is-on" : ""}`} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </button>
      )}
    </>
  );
}

function CoverPanel({ side, unsealing }: { side: "left" | "right"; unsealing: boolean }) {
  const isLeft = side === "left";
  return (
    <div
      className="absolute inset-y-0 w-1/2 overflow-hidden"
      style={{
        left: isLeft ? 0 : "50%",
        transformOrigin: isLeft ? "left center" : "right center",
        transform: unsealing
          ? `rotateY(${isLeft ? -102 : 102}deg) translateZ(0)`
          : "rotateY(0deg) translateZ(0)",
        opacity: unsealing ? 0.15 : 1,
        transition:
          "transform 1700ms var(--ease-cine), opacity 1700ms var(--ease-cine)",
        background:
          "linear-gradient(160deg, #fffdf8 0%, #fbf6ec 42%, #f4e9d6 100%)",
        boxShadow: unsealing
          ? "none"
          : isLeft
            ? "inset -14px 0 26px -22px rgba(27,42,91,0.4)"
            : "inset 14px 0 26px -22px rgba(27,42,91,0.4)",
        backfaceVisibility: "hidden",
      }}
      aria-hidden="true"
    >
      <FloralCorner
        corner={isLeft ? "tl" : "tr"}
        className={`sway absolute -top-8 h-56 w-56 sm:h-72 sm:w-72 ${isLeft ? "-left-8" : "-right-8"}`}
        opacity={0.95}
      />
      <FloralCorner
        corner={isLeft ? "bl" : "br"}
        className={`sway sway-alt absolute -bottom-8 h-52 w-52 sm:h-64 sm:w-64 ${isLeft ? "-left-8" : "-right-8"}`}
        opacity={0.85}
      />
    </div>
  );
}
