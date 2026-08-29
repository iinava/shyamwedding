# Aswanth & Vinaya — Wedding Invitation

A mobile-first digital wedding invitation built from the printed card: ivory paper,
deep indigo type, watercolour marigold and coral blooms, soft gold light.

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Everything you can change lives in one file

[app/lib/wedding.ts](app/lib/wedding.ts) holds every wedding detail — names, date,
time, venue, the sign-off, the music path and the photo lists. Nothing is hard-coded
into the sections.

### Names and details

The card is the source of truth. If a name or place needs correcting, edit
`wedding` in that file and the cover, hero, countdown, details card, venue,
thank-you section and the WhatsApp preview image all follow.

### Google Maps

`mapsUrl` is `null` on purpose — no location link has been invented. Until it is
filled in, the **Open in Google Maps** button falls back to a plain Maps *search*
for `Vadakara, Kerala, India`. Paste the venue's real share link there:

```ts
mapsUrl: "https://maps.app.goo.gl/…",
```

### Photographs

Three photographs are in `public/couple/` — `together.jpg`, `embrace.jpg` and
`hands.jpg` — and they carry the hero band, the arched couple collage, the
full-bleed feature, the two dark bands and the gallery.

| List in         | Used by                                                      |
| --------------- | ------------------------------------------------------------ |
| `couplePhotos`  | Hero band, couple collage, photography section, dark bands   |
| `galleryPhotos` | Gallery grid + full-screen viewer                            |

To add more, drop the files into `public/couple/` or `public/gallery/` and append
to the matching array:

```ts
export const galleryPhotos = [
  { src: "/gallery/mehendi-01.jpg", alt: "Mehendi evening" },
];
```

Each frame takes a `position` prop (`center 30%`, etc.) that anchors the crop, so
faces are never cut off; the empty-frame placeholders still appear for any entry
you leave out. `next/image` handles AVIF/WebP conversion, sizing and lazy loading.

### Background music

Put an mp3 at `public/audio/wedding-theme.mp3` (or point `musicSrc` elsewhere).
It starts on the tap that opens the invitation, fades in to a low volume, and the
toggle in the bottom-right remembers the guest's choice in `localStorage`. If the
file is missing, the audio element errors quietly and the toggle never appears.

### WhatsApp preview

[app/opengraph-image.tsx](app/opengraph-image.tsx) draws the 1200×630 share card at
build time from the same details, with an arched crop of `app/og-photo.jpg` — a
640px copy of the hero photograph, kept small so the card stays inside Satori's
500KB budget. Regenerate it if you swap the hero photo. Before sharing, set the real domain in
`metadataBase` in [app/layout.tsx](app/layout.tsx) — Open Graph needs absolute URLs.

## How it is built

- **Next.js 16 App Router.** Every section is a server component; only the
  interactive pieces (`InviteShell`, `ScratchDate`, `Countdown`, `Gallery`,
  `PhotoFeature`, `Reveal`, `Petals`) ship JavaScript.
- **No animation or UI libraries.** Florals, the Ganesha motif and the ornaments are
  inline SVG; every animation is CSS. Reveals use one `IntersectionObserver` per
  element that disconnects after it fires.
- **Chapters alternate** between ivory paper and two deep-indigo bands (the
  countdown and the closing), each carrying a dimmed photograph behind it, with a
  scrolling gold ribbon between the hero and the couple.
- **`prefers-reduced-motion` is honoured everywhere** — the gold shine, petals,
  sway, scroll cue and the scratch cover all stand down, and the date is shown
  revealed rather than trapped behind an interaction.
- **Safe-area insets** on the cover, music toggle, lightbox and final section, so
  nothing hides under the iPhone notch or home indicator.
