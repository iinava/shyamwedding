/**
 * Hand-drawn watercolour botanicals, redrawn as inline SVG so they stay
 * crisp on every screen and cost nothing to download. All shapes trace the
 * marigold/coral blooms and olive foliage on the printed card.
 */

/**
 * The <defs> below are byte-identical for every corner, so one stable id is
 * shared across instances on purpose — it keeps SSR and hydration in step
 * without a counter, and duplicate refs resolve to the same paint.
 */
const id = "flc";

function Bloom({
  cx,
  cy,
  r,
  hue = "coral",
  rotate = 0,
  petals = 5,
  opacity = 1,
}: {
  cx: number;
  cy: number;
  r: number;
  hue?: "coral" | "marigold" | "blush";
  rotate?: number;
  petals?: number;
  opacity?: number;
}) {
  const tones = {
    coral: ["#f0a271", "#e2703a", "#c8552a"],
    marigold: ["#f6c98a", "#e9a04a", "#d1832f"],
    blush: ["#f3bfae", "#dd8a72", "#c66a55"],
  }[hue];

  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotate})`} opacity={opacity}>
      {Array.from({ length: petals }).map((_, i) => {
        const a = (360 / petals) * i;
        return (
          <path
            key={i}
            transform={`rotate(${a})`}
            d={`M0 0 C ${r * 0.55} ${-r * 0.35}, ${r * 0.85} ${-r * 0.95}, 0 ${-r} C ${-r * 0.85} ${-r * 0.95}, ${-r * 0.55} ${-r * 0.35}, 0 0 Z`}
            fill={i % 2 ? tones[0] : tones[1]}
            opacity={0.72}
          />
        );
      })}
      <circle cx={0} cy={0} r={r * 0.24} fill={tones[2]} opacity={0.8} />
      <circle cx={0} cy={0} r={r * 0.11} fill="#f7e6c2" opacity={0.85} />
    </g>
  );
}

function Bud({ cx, cy, r, rotate = 0 }: { cx: number; cy: number; r: number; rotate?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotate})`}>
      <path
        d={`M0 0 C ${r} ${-r * 0.6}, ${r * 0.7} ${-r * 1.9}, 0 ${-r * 2.1} C ${-r * 0.7} ${-r * 1.9}, ${-r} ${-r * 0.6}, 0 0 Z`}
        fill="#e2703a"
        opacity={0.62}
      />
      <path
        d={`M0 0 C ${r * 0.5} ${-r * 0.5}, ${r * 0.4} ${-r * 1.4}, 0 ${-r * 1.6} C ${-r * 0.4} ${-r * 1.4}, ${-r * 0.5} ${-r * 0.5}, 0 0 Z`}
        fill="#f2b276"
        opacity={0.7}
      />
    </g>
  );
}

function Leaf({
  cx,
  cy,
  len,
  rotate = 0,
  deep = false,
}: {
  cx: number;
  cy: number;
  len: number;
  rotate?: number;
  deep?: boolean;
}) {
  const w = len * 0.34;
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotate})`}>
      <path
        d={`M0 0 C ${w} ${-len * 0.32}, ${w * 0.8} ${-len * 0.82}, 0 ${-len} C ${-w * 0.8} ${-len * 0.82}, ${-w} ${-len * 0.32}, 0 0 Z`}
        fill={deep ? "#4f6b47" : "#6e8b5b"}
        opacity={deep ? 0.6 : 0.5}
      />
      <path d={`M0 0 L 0 ${-len}`} stroke="#3f5b3a" strokeWidth={0.7} opacity={0.28} fill="none" />
    </g>
  );
}

function Sprig({ x, y, rotate = 0, scale = 1 }: { x: number; y: number; rotate?: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path d="M0 0 C 14 -16, 26 -34, 30 -56" stroke="#6e8b5b" strokeWidth={1.3} fill="none" opacity={0.55} />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <Leaf cx={5 + i * 6} cy={-i * 12} len={16 - i * 1.6} rotate={-58 + i * 4} />
          <Leaf cx={4 + i * 6} cy={-i * 12} len={15 - i * 1.6} rotate={38 + i * 4} deep />
        </g>
      ))}
    </g>
  );
}

/** A dense corner cluster, mirrored per corner like the printed border. */
export function FloralCorner({
  corner,
  className = "",
  opacity = 1,
}: {
  corner: "tl" | "tr" | "bl" | "br";
  className?: string;
  opacity?: number;
}) {
  const flip =
    corner === "tl"
      ? ""
      : corner === "tr"
        ? "scale(-1,1) translate(-220,0)"
        : corner === "bl"
          ? "scale(1,-1) translate(0,-220)"
          : "scale(-1,-1) translate(-220,-220)";

  return (
    <svg
      viewBox="0 0 220 220"
      className={className}
      aria-hidden="true"
      focusable="false"
      style={{ opacity }}
    >
      <defs>
        <filter id={`${id}-wc`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <radialGradient id={`${id}-wash`} cx="30%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#f3b184" stopOpacity="0.5" />
          <stop offset="55%" stopColor="#e9a04a" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#fbf6ec" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-leafwash`} cx="60%" cy="70%" r="70%">
          <stop offset="0%" stopColor="#6e8b5b" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#fbf6ec" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform={flip}>
        {/* soft watercolour bleed under the linework */}
        <g filter={`url(#${id}-wc)`}>
          <circle cx="62" cy="58" r="72" fill={`url(#${id}-wash)`} />
          <circle cx="118" cy="128" r="66" fill={`url(#${id}-leafwash)`} />
        </g>

        <g>
          <path d="M-6 96 C 34 88, 66 62, 92 22" stroke="#6e8b5b" strokeWidth="1.4" fill="none" opacity="0.45" />
          <path d="M2 132 C 46 122, 84 92, 112 46" stroke="#4f6b47" strokeWidth="1.1" fill="none" opacity="0.35" />

          <Sprig x={6} y={150} rotate={-18} scale={1.15} />
          <Sprig x={70} y={92} rotate={22} scale={0.95} />
          <Sprig x={112} y={40} rotate={54} scale={0.8} />
          <Sprig x={30} y={196} rotate={12} scale={0.9} />

          <Leaf cx={140} cy={26} len={40} rotate={64} deep />
          <Leaf cx={24} cy={182} len={44} rotate={-38} />
          <Leaf cx={96} cy={112} len={34} rotate={128} deep />

          <Bloom cx={58} cy={44} r={30} hue="coral" rotate={12} />
          <Bloom cx={104} cy={82} r={20} hue="marigold" rotate={-24} petals={6} />
          <Bloom cx={22} cy={104} r={22} hue="blush" rotate={40} />
          <Bloom cx={78} cy={140} r={15} hue="coral" rotate={-8} petals={6} opacity={0.9} />
          <Bloom cx={16} cy={16} r={17} hue="marigold" rotate={30} opacity={0.85} />

          <Bud cx={132} cy={64} r={9} rotate={38} />
          <Bud cx={46} cy={168} r={8} rotate={-22} />
          <Bud cx={118} cy={150} r={7} rotate={72} />
        </g>
      </g>
    </svg>
  );
}

/** Slim horizontal ornament used between blocks of text. */
export function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className="gold-rule block h-px w-16 sm:w-24" />
      <svg viewBox="0 0 44 24" className="h-5 w-9 shrink-0">
        <g>
          <path d="M22 3 C 27 9, 27 15, 22 21 C 17 15, 17 9, 22 3 Z" fill="#e2703a" opacity="0.55" />
          <path d="M22 7 C 24.5 11, 24.5 15, 22 18 C 19.5 15, 19.5 11, 22 7 Z" fill="#c9a227" opacity="0.55" />
          <path d="M12 12 C 15 9, 18 11, 20 12 C 18 13, 15 15, 12 12 Z" fill="#6e8b5b" opacity="0.5" />
          <path d="M32 12 C 29 9, 26 11, 24 12 C 26 13, 29 15, 32 12 Z" fill="#6e8b5b" opacity="0.5" />
        </g>
      </svg>
      <span className="gold-rule block h-px w-16 sm:w-24" />
    </div>
  );
}

/**
 * Two engraved bands that travel in from either side and settle
 * interlocked, with a bright "clink" of sparkle right as they meet —
 * the one piece of jewellery motion on the page. Purely presentational;
 * wrap it in <Reveal> so the CSS in globals.css can key off data-visible.
 */
export function WeddingRings({
  brideName,
  groomName,
  className = "",
}: {
  brideName: string;
  groomName: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 220 130"
      className={`rings-svg ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="ring-gold-a" x1="0.15" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#8a6b1c" />
          <stop offset="30%" stopColor="#e6cf8f" />
          <stop offset="50%" stopColor="#fdf3d6" />
          <stop offset="70%" stopColor="#c9a227" />
          <stop offset="100%" stopColor="#7c5e17" />
        </linearGradient>
        <linearGradient id="ring-gold-b" x1="0.85" y1="0" x2="0.1" y2="1">
          <stop offset="0%" stopColor="#7c5e17" />
          <stop offset="30%" stopColor="#c9a227" />
          <stop offset="50%" stopColor="#fdf3d6" />
          <stop offset="70%" stopColor="#e6cf8f" />
          <stop offset="100%" stopColor="#8a6b1c" />
        </linearGradient>
        <filter id="ring-drop" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.2" floodColor="#1b2a5b" floodOpacity="0.28" />
        </filter>
        <path id="ring-path-a" d="M 55,66 A 34,34 0 1 1 123,66 A 34,34 0 1 1 55,66" />
        <path id="ring-path-b" d="M 97,66 A 34,34 0 1 1 165,66 A 34,34 0 1 1 97,66" />
      </defs>

      {/* the band */}
      <g className="ring ring-a" filter="url(#ring-drop)">
        <circle cx="89" cy="66" r="34" fill="none" stroke="url(#ring-gold-a)" strokeWidth="8.5" />
        <circle cx="89" cy="66" r="34" fill="none" stroke="#fdf8ec" strokeWidth="0.8" opacity="0.55" />
        <path d="M64 46 A 30 30 0 0 1 100 37" fill="none" stroke="#fff8e4" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
      </g>
      <g className="ring ring-b" filter="url(#ring-drop)">
        <circle cx="131" cy="66" r="34" fill="none" stroke="url(#ring-gold-b)" strokeWidth="8.5" />
        <circle cx="131" cy="66" r="34" fill="none" stroke="#fdf8ec" strokeWidth="0.8" opacity="0.55" />
        <path d="M156 46 A 30 30 0 0 0 120 37" fill="none" stroke="#fff8e4" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
      </g>

      {/* names, engraved along the inner rim */}
      <g className="ring-name ring-name-a">
        <text dy="-0.5" fill="#3a2c08" opacity="0.85">
          <textPath href="#ring-path-a" startOffset="9%">
            {brideName.toUpperCase()}
          </textPath>
        </text>
      </g>
      <g className="ring-name ring-name-b">
        <text dy="-0.5" fill="#3a2c08" opacity="0.85">
          <textPath href="#ring-path-b" startOffset="9%">
            {groomName.toUpperCase()}
          </textPath>
        </text>
      </g>

      <g className="ring-gem" transform="translate(110 30)">
        <path d="M0 -7 L6 0 L0 9 L-6 0 Z" fill="#fdf8ec" stroke="#c9a227" strokeWidth="1" />
      </g>

      <g className="ring-sparkle ring-sparkle-1" transform="translate(110 66)">
        <path d="M0 -7 L1.8 -1.8 L7 0 L1.8 1.8 L0 7 L-1.8 1.8 L-7 0 L-1.8 -1.8 Z" fill="#fff6d8" />
      </g>
      <g className="ring-sparkle ring-sparkle-2" transform="translate(160 92)">
        <path d="M0 -4 L1 -1 L4 0 L1 1 L0 4 L-1 1 L-4 0 L-1 -1 Z" fill="#e2703a" opacity="0.8" />
      </g>
      <g className="ring-sparkle ring-sparkle-3" transform="translate(60 96)">
        <path d="M0 -4 L1 -1 L4 0 L1 1 L0 4 L-1 1 L-4 0 L-1 -1 Z" fill="#c9a227" opacity="0.75" />
      </g>
      <g className="ring-sparkle ring-sparkle-4" transform="translate(52 40)">
        <path d="M0 -3.4 L0.9 -0.9 L3.4 0 L0.9 0.9 L0 3.4 L-0.9 0.9 L-3.4 0 L-0.9 -0.9 Z" fill="#f2dfa8" opacity="0.85" />
      </g>
    </svg>
  );
}

/** A wax-seal-style monogram, echoing the opening cover-seal at the close. */
export function Monogram({ initials, className = "" }: { initials: string; className?: string }) {
  return (
    <div className={`monogram-seal ${className}`} aria-hidden="true">
      <svg viewBox="0 0 90 90">
        <defs>
          <linearGradient id="mono-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c9a227" />
            <stop offset="45%" stopColor="#efd79b" />
            <stop offset="100%" stopColor="#b1912f" />
          </linearGradient>
        </defs>
        <circle cx="45" cy="45" r="42" fill="none" stroke="url(#mono-gold)" strokeWidth="1.2" opacity="0.75" />
        <circle cx="45" cy="45" r="35" fill="none" stroke="url(#mono-gold)" strokeWidth="0.8" opacity="0.45" />
      </svg>
      <span className="monogram-text">{initials}</span>
    </div>
  );
}

/** Traditional Ganesha, drawn as a single-weight gold line motif. */
export function Ganesha({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 130" className={className} aria-label="Shree Ganesha" role="img">
      <defs>
        <linearGradient id="gan-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c9a227" />
          <stop offset="45%" stopColor="#efd79b" />
          <stop offset="100%" stopColor="#b1912f" />
        </linearGradient>
      </defs>
      <g
        fill="none"
        stroke="url(#gan-gold)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* halo */}
        <circle cx="60" cy="58" r="46" opacity="0.35" />
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={i}
            x1="60"
            y1="58"
            x2="60"
            y2="9"
            transform={`rotate(${i * 15} 60 58)`}
            opacity="0.18"
            strokeWidth="0.9"
          />
        ))}
        {/* crown */}
        <path d="M46 30 C 50 16, 70 16, 74 30" />
        <path d="M60 18 L 60 8 M55 12 L 60 8 L 65 12" />
        {/* head */}
        <path d="M42 34 C 34 44, 34 58, 44 66 C 52 72, 68 72, 76 66 C 86 58, 86 44, 78 34 C 72 27, 48 27, 42 34 Z" />
        {/* ears */}
        <path d="M42 38 C 24 34, 16 48, 22 60 C 27 70, 40 68, 44 62" />
        <path d="M78 38 C 96 34, 104 48, 98 60 C 93 70, 80 68, 76 62" />
        {/* trunk */}
        <path d="M60 50 C 58 62, 64 72, 58 82 C 53 90, 44 88, 44 80" />
        {/* eyes + tusks */}
        <path d="M50 46 C 53 43, 57 43, 59 46" />
        <path d="M70 46 C 67 43, 63 43, 61 46" />
        <path d="M50 62 C 47 68, 47 74, 50 78" />
        <path d="M70 62 C 73 66, 73 70, 71 73" />
        {/* tilak */}
        <path d="M60 32 L 60 42" opacity="0.7" />
        {/* body + lotus base */}
        <path d="M34 78 C 30 92, 34 104, 48 108 L 72 108 C 86 104, 90 92, 86 78" />
        <path d="M60 92 C 64 98, 64 104, 60 108 C 56 104, 56 98, 60 92 Z" />
        <path d="M22 112 C 34 104, 46 118, 60 118 C 74 118, 86 104, 98 112 C 92 124, 74 128, 60 128 C 46 128, 28 124, 22 112 Z" />
      </g>
    </svg>
  );
}
