import Image from "next/image";
import Countdown from "./components/Countdown";
import { FloralCorner, Ganesha, GoldDivider, Monogram, WeddingRings } from "./components/Florals";
import InviteShell from "./components/InviteShell";
import PhotoFeature from "./components/PhotoFeature";
import Reveal from "./components/Reveal";
import ScratchDate from "./components/ScratchDate";
import { calendarHref, couplePhotos, mapsHref, wedding } from "./lib/wedding";

const [together, embrace, hands] = couplePhotos;

export default function Page() {
  return (
    <InviteShell>
      <main>
        <Hero />
        <Ribbon />
        <Couple />
        <RingsDivider />
        <InvitationMessage />
        <DateReveal />
        <CountdownSection />
        <Details />
        <Venue />
        <ThankYou />
      </main>
    </InviteShell>
  );
}

/* ── 1. Opening invitation ─────────────────────────────── */
function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-hidden px-0 pb-12 pt-0 lg:flex-row lg:pb-0"
      style={{ backgroundColor: "var(--paper)" }}
    >
      {/* A photographic band across the top on phones; a full-height
          panel on the left past lg, so the couple's faces read as a
          real desktop hero instead of a stretched mobile strip. */}
      <div className="relative h-[50svh] w-full shrink-0 lg:h-auto lg:min-h-screen lg:w-[54%]">
        <Image
          src={together.src}
          alt={together.alt}
          fill
          priority
          sizes="(min-width: 1024px) 54vw, 100vw"
          className="hero-img object-cover"
        />
        <div className="hero-scrim" />
        <div className="hero-scrim-x hidden lg:block" />

        <FloralCorner corner="tl" className="sway pointer-events-none absolute -left-10 -top-10 z-10 h-48 w-48 sm:h-64 sm:w-64" opacity={0.85} />
        <FloralCorner corner="tr" className="sway sway-alt pointer-events-none absolute -right-12 -top-12 z-10 h-40 w-40 sm:h-56 sm:w-56 lg:hidden" opacity={0.75} />
        <FloralCorner corner="bl" className="sway sway-alt pointer-events-none absolute -bottom-12 -left-12 z-10 hidden h-48 w-48 lg:block" opacity={0.85} />

        <Reveal
          delay={300}
          className="absolute inset-x-0 top-[calc(2rem+env(safe-area-inset-top))] z-10 flex flex-col items-center"
        >
          <Ganesha className="float-slow h-14 w-14 opacity-90" />
        </Reveal>
      </div>

      <FloralCorner corner="bl" className="sway sway-alt pointer-events-none absolute -bottom-12 -left-12 z-10 h-48 w-48 lg:hidden" opacity={0.85} />
      <FloralCorner corner="br" className="sway pointer-events-none absolute -bottom-10 -right-10 z-10 h-52 w-52 sm:h-72 sm:w-72" />

      <div className="relative z-20 flex flex-1 flex-col justify-center px-6 lg:w-[46%] lg:px-14 xl:px-20">
        <div className="section-inner left">
          <Reveal delay={200}>
            <p className="eyebrow">Together with their families</p>
            <h1 className="mt-4 font-display text-[clamp(2.6rem,15vw,5.2rem)] font-light leading-[1.02]">
              <span className="gold-shine block">{wedding.groom}</span>
              <span className="my-0.5 block font-display text-[0.34em] italic text-[color:var(--coral)]">
                and
              </span>
              <span className="gold-shine block">{wedding.bride}</span>
            </h1>
          </Reveal>

          <Reveal delay={600}>
            <GoldDivider className="mt-6 lg:ml-0 lg:justify-start" />
            <p className="mt-5 text-[0.7rem] uppercase tracking-[0.38em] text-[color:var(--ink-soft)]">
              {wedding.dateLong}
            </p>
            <p className="mt-2 text-[0.62rem] uppercase tracking-[0.3em] text-[color:var(--ink-mute)]">
              {wedding.venueCity} · Kerala
            </p>
          </Reveal>

          <Reveal delay={1000} className="mt-9 flex justify-center lg:justify-start">
            <span className="scroll-cue">
              <span className="line" />
              <span className="eyebrow text-[0.55rem]">Scroll</span>
            </span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── A gold ribbon to carry the eye between chapters ───── */
function Ribbon() {
  const line = `${wedding.groom} & ${wedding.bride}`;
  return (
    <div className="marquee bleed" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0">
            {[0, 1, 2, 3].map((i) => (
              <span key={i}>
                {line} <span className="text-[color:var(--coral)]">✦</span> 05 · 09 · 2026{" "}
                <span className="text-[color:var(--coral)]">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 2. The couple ─────────────────────────────────────── */
function Couple() {
  return (
    <section className="section pb-24">
      <FloralCorner corner="tr" className="sway pointer-events-none absolute -right-14 -top-10 h-48 w-48" opacity={0.75} />
      <FloralCorner corner="bl" className="sway sway-alt pointer-events-none absolute -bottom-12 -left-14 h-48 w-48" opacity={0.75} />

      <div className="section-inner wide">
        <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal className="lg:text-left">
            <p className="eyebrow">The couple</p>
            <h2 className="section-title mt-4">
              <span className="gold-shine">{wedding.groom}</span>
              <span className="mx-3 font-display italic text-[color:var(--coral)]">&amp;</span>
              <span className="gold-shine">{wedding.bride}</span>
            </h2>
            <GoldDivider className="mt-6 lg:justify-start" />
            <p className="caption-script mt-8">Two families, one prayer</p>
            <p className="body-text mx-auto mt-4 max-w-sm lg:mx-0">
              A day that has been quietly waited for, and a life that starts the
              moment the lamps are lit.
            </p>
          </Reveal>

          {/* An arched portrait with a second frame tucked over its corner. */}
          <Reveal delay={200} slow className="relative mt-12 block pb-16 lg:mt-0 lg:pb-0">
            <div className="mx-auto max-w-[19rem] lg:mx-0 lg:max-w-none">
              <PhotoFeature
                src={embrace.src}
                alt={embrace.alt}
                ratio="3 / 4"
                frameClass="arch frame-gold"
                position="center 30%"
              />
            </div>
            <div className="photo-inset -bottom-2 right-2 sm:right-10">
              <PhotoFeature src={hands.src} alt={hands.alt} ratio="1 / 1" position="center 45%" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── The rings ─────────────────────────────────────────── */
function RingsDivider() {
  return (
    <section className="section">
      <div className="section-inner">
        <Reveal slow>
          <WeddingRings brideName={wedding.bride} groomName={wedding.groom} className="mx-auto" />
          <p className="caption-script mt-5">Two hearts, one promise</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 3. The invitation ─────────────────────────────────── */
function InvitationMessage() {
  return (
    <section className="section">
      <div
        className="pointer-events-none absolute inset-x-5 inset-y-8 rounded-[2rem] border"
        style={{ borderColor: "rgba(201,162,39,0.22)" }}
        aria-hidden="true"
      />
      <FloralCorner corner="tl" className="sway pointer-events-none absolute -left-12 top-0 h-44 w-44" opacity={0.7} />
      <FloralCorner corner="br" className="sway sway-alt pointer-events-none absolute -right-12 bottom-0 h-44 w-44" opacity={0.7} />

      <div className="section-inner">
        <Reveal>
          <p className="eyebrow">An invitation</p>
          <h2 className="section-title mt-5">
            <span className="gold-shine">Our joy is not complete</span>
            <br />
            <span className="font-light italic">without you</span>
          </h2>
          <GoldDivider className="mt-8" />
        </Reveal>

        <Reveal delay={200} slow>
          <div className="body-text mx-auto mt-10 max-w-md space-y-6">
            <p>
              With the blessings of the Almighty and of our elders, and with hearts
              full of gratitude, we invite you to the wedding of our children,{" "}
              <span className="text-[color:var(--ink)]">{wedding.groom}</span> and{" "}
              <span className="text-[color:var(--ink)]">{wedding.bride}</span>.
            </p>
            <p>
              On the morning of {wedding.weekday}, {wedding.dateLong}, at the
              auspicious hour, they will begin their life together in the presence of
              the people who have loved them the longest.
            </p>
            <p>
              Come, be with us. Share the sweets, the lamps and the laughter — and
              leave your blessings behind. That is the only gift we ask for.
            </p>
          </div>
        </Reveal>

        <Reveal delay={400}>
          <p className="mt-12 font-display text-lg italic text-[color:var(--ink-soft)]">
            {wedding.signOff}
          </p>
          <p className="mt-2 text-[0.62rem] uppercase tracking-[0.3em] text-[color:var(--ink-mute)]">
            {wedding.families}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 4. Scratch to reveal ──────────────────────────────── */
function DateReveal() {
  return (
    <section className="section">
      <FloralCorner corner="tr" className="sway pointer-events-none absolute -right-16 top-4 h-44 w-44" opacity={0.6} />
      <FloralCorner corner="bl" className="sway sway-alt pointer-events-none absolute -left-16 bottom-4 h-44 w-44" opacity={0.6} />

      <div className="section-inner">
        <Reveal>
          <p className="eyebrow">A little secret</p>
          <h2 className="section-title mt-5">The date</h2>
          <GoldDivider className="mt-6" />
          <p className="body-text mx-auto mt-6 max-w-xs text-sm">
            Run your finger across the paper.
          </p>
        </Reveal>

        <Reveal delay={200} className="mt-10">
          <ScratchDate />
        </Reveal>
      </div>
    </section>
  );
}

/* ── 5. Countdown, on deep indigo ──────────────────────── */
function CountdownSection() {
  return (
    <section id="countdown" className="section band-dark bleed">
      <FloralCorner corner="tl" className="sway pointer-events-none absolute -left-14 -top-10 h-52 w-52" opacity={0.3} />
      <FloralCorner corner="br" className="sway sway-alt pointer-events-none absolute -bottom-12 -right-14 h-56 w-56" opacity={0.3} />

      <div className="section-inner">
        <Reveal>
          <Ganesha className="float-slow mx-auto h-14 w-14 opacity-80" />
          <p className="eyebrow mt-5">Counting the days</p>
          <h2 className="section-title mt-4">
            <span className="gold-shine">Until we meet</span>
          </h2>
          <GoldDivider className="mt-6" />
        </Reveal>

        <Reveal delay={200} className="mt-10">
          <Countdown />
        </Reveal>

        <Reveal delay={350} className="mt-10">
          <a className="btn-gold" href={calendarHref} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <rect x="3.5" y="5" width="17" height="15" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
              <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            Save the date
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 8. Wedding details ────────────────────────────────── */
function Details() {
  const rows = [
    { label: "Date", value: wedding.dateLong },
    { label: "Day", value: wedding.weekday },
    { label: "Muhurtham", value: wedding.timeRange },
    { label: "Place", value: wedding.venueCity },
  ];

  return (
    <section className="section">
      <FloralCorner corner="tr" className="sway pointer-events-none absolute -right-16 top-0 h-48 w-48" opacity={0.7} />
      <FloralCorner corner="bl" className="sway sway-alt pointer-events-none absolute -left-16 bottom-0 h-48 w-48" opacity={0.7} />

      <div className="section-inner">
        <Reveal>
          <p className="eyebrow">The details</p>
          <h2 className="section-title mt-5">
            <span className="gold-shine">Wedding day</span>
          </h2>
          <GoldDivider className="mt-6" />
        </Reveal>

        <Reveal delay={200} className="mt-10">
          <dl className="card-surface mx-auto max-w-sm rounded-[1.25rem] px-6 py-8">
            {rows.map((row, i) => (
              <div key={row.label} className={i === 0 ? "" : "mt-7"}>
                <dt className="text-[0.55rem] uppercase tracking-[0.34em] text-[color:var(--ink-mute)]">
                  {row.label}
                </dt>
                <dd className="mt-2 font-display text-[1.55rem] font-light leading-tight text-[color:var(--ink)]">
                  {row.value}
                </dd>
                {i < rows.length - 1 && <span className="gold-rule mt-7 block h-px w-full" />}
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 9. Venue ──────────────────────────────────────────── */
function Venue() {
  return (
    <section className="section pt-4">
      <div className="section-inner">
        <Reveal>
          <p className="eyebrow">Where</p>
          <h2 className="section-title mt-5">{wedding.venueName}</h2>
          <p className="mt-4 text-[0.62rem] uppercase tracking-[0.32em] text-[color:var(--ink-mute)]">
            {wedding.venueSubtitle}
          </p>
          <GoldDivider className="mt-6" />
        </Reveal>

        <Reveal delay={150} slow className="mx-auto mt-10 flex max-w-[17rem] items-center justify-center">
          <div className="relative flex h-40 w-40 items-center justify-center rounded-full border" style={{ borderColor: "rgba(201,162,39,0.35)" }}>
            <div className="absolute inset-3 rounded-full border" style={{ borderColor: "rgba(201,162,39,0.22)" }} />
            <svg viewBox="0 0 24 24" className="h-10 w-10" aria-hidden="true">
              <path
                d="M12 21s-6.5-5.4-6.5-10.2A6.5 6.5 0 0 1 18.5 10.8C18.5 15.6 12 21 12 21Z"
                fill="none"
                stroke="var(--coral)"
                strokeWidth="1.2"
              />
              <circle cx="12" cy="10.5" r="2.3" fill="none" stroke="var(--coral)" strokeWidth="1.2" />
            </svg>
          </div>
        </Reveal>

        <Reveal delay={220}>
          <p className="body-text mt-8">
            {wedding.venueCity}
            <br />
            {wedding.venueRegion}
          </p>
        </Reveal>

        <Reveal delay={320} className="mt-8">
          <a className="btn-gold" href={mapsHref} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                d="M12 21s-6.5-5.4-6.5-10.2A6.5 6.5 0 0 1 18.5 10.8C18.5 15.6 12 21 12 21Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <circle cx="12" cy="10.5" r="2.3" fill="none" stroke="currentColor" strokeWidth="1.3" />
            </svg>
            Open in Google Maps
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 10. Thank you ─────────────────────────────────────── */
function ThankYou() {
  return (
    <section className="section band-dark bleed pb-[calc(7rem+env(safe-area-inset-bottom))]">
      <FloralCorner corner="tr" className="sway sway-alt pointer-events-none absolute -right-16 -top-12 h-56 w-56" opacity={0.3} />
      <FloralCorner corner="bl" className="sway pointer-events-none absolute -bottom-16 -left-14 h-52 w-52" opacity={0.3} />

      <div className="section-inner">
        <Reveal>
          <Monogram initials={`${wedding.groom[0]} & ${wedding.bride[0]}`} />
          <Ganesha className="float-slow mx-auto mt-5 h-16 w-16 opacity-80" />
          <h2 className="section-title mt-8">
            <span className="gold-shine">Thank you</span>
          </h2>
          <p className="body-text mx-auto mt-6 max-w-sm">
            For the love you have given them, and for the blessings you will bring on
            the day. We look forward to seeing you.
          </p>
          <GoldDivider className="mt-10" />
          <p className="mt-8 font-display text-[clamp(1.9rem,10vw,3.2rem)] font-light">
            <span className="gold-shine">{wedding.groom}</span>
            <span className="mx-3 italic text-[color:var(--coral)]">&amp;</span>
            <span className="gold-shine">{wedding.bride}</span>
          </p>
          <p className="mt-4 text-[0.64rem] uppercase tracking-[0.38em] text-[color:var(--ink-mute)]">
            {wedding.dateLong}
          </p>
        </Reveal>

        <Reveal delay={250} className="mt-16 flex flex-col items-center gap-5">
          <span className="gold-rule block h-px w-20" />
          <a href="#top" className="back-to-top" aria-label="Back to the top">
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                d="M12 19V5M12 5l-6 6M12 5l6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <p
            className="font-display text-[0.95rem] italic tracking-[0.04em]"
            style={{ color: "rgba(245,226,171,0.75)" }}
          >
            With love, always
          </p>
        </Reveal>
      </div>
    </section>
  );
}
