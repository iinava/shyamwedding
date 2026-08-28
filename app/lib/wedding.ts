/**
 * Single source of truth for every wedding detail on the site.
 * Everything the invitation card carries lives here — change it once,
 * the whole site follows.
 */

export const wedding = {
  bride: "Vinaya",
  groom: "Aswanth",
  groomFull: "Aswanth K.P.",
  brideFull: "Vinaya",

  // Kept as separate lines so the couple section can breathe.
  brideParents: "",
  groomParents: "",

  dateLong: "5 September 2026",
  dateDisplay: { day: "05", month: "September", year: "2026" },
  weekday: "Saturday",
  timeRange: "12:00 PM – 12:45 PM",
  muhurthamNote: "The muhurtham",

  venueName: "The Bride's Residence",
  venueSubtitle: "Vadhugriham",
  venueCity: "Vadakara",
  venueRegion: "Kerala, India",

  /**
   * Paste the exact Google Maps share link here when it is available.
   * Left null on purpose — nothing about the location is invented.
   * With it null the button falls back to a plain Maps *search* for the
   * place name above.
   */
  mapsUrl: null as string | null,

  /** ISO local time of the muhurtham, used by the countdown. */
  ceremonyISO: "2026-09-05T12:00:00+05:30",
  ceremonyEndISO: "2026-09-05T12:45:00+05:30",

  signOff: "With love and prayers,",
  families: "The families of Vinaya & Aswanth",

  /** Background music, played once the invitation is opened. */
  musicSrc: "/audio/bgsong.mp3",
} as const;

export const mapsHref =
  wedding.mapsUrl ??
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${wedding.venueCity}, ${wedding.venueRegion}`
  )}`;

/** Google Calendar wants UTC stamps like 20260905T063000Z. */
const stamp = (iso: string) =>
  new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export const calendarHref =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  `&text=${encodeURIComponent(`${wedding.bride} & ${wedding.groom} — Wedding`)}` +
  `&dates=${stamp(wedding.ceremonyISO)}/${stamp(wedding.ceremonyEndISO)}` +
  `&location=${encodeURIComponent(`${wedding.venueCity}, ${wedding.venueRegion}`)}` +
  `&details=${encodeURIComponent(
    `The wedding of ${wedding.bride} and ${wedding.groom} at ${wedding.venueName}, ${wedding.venueCity}.`
  )}`;

/**
 * Gallery + couple photography.
 * Drop files into /public/gallery and /public/couple and list them here.
 * While the arrays are empty the sections render elegant empty frames
 * instead of stock photographs.
 */
export const couplePhotos: { src: string; alt: string }[] = [
  { src: "/couple/together.jpg", alt: "Vinaya and Aswanth in the garden" },
  { src: "/couple/embrace.jpg", alt: "Vinaya and Aswanth at the tharavadu" },
  { src: "/couple/hands.jpg", alt: "Henna-covered hands and wedding rings" },
];

export const galleryPhotos: { src: string; alt: string }[] = [
  { src: "/couple/together.jpg", alt: "Vinaya and Aswanth in the garden" },
  { src: "/couple/hands.jpg", alt: "Henna-covered hands and wedding rings" },
  { src: "/couple/embrace.jpg", alt: "Vinaya and Aswanth at the tharavadu" },
];
