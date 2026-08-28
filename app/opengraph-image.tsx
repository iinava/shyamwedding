import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { wedding } from "./lib/wedding";

export const alt = `${wedding.bride} & ${wedding.groom} — Wedding Invitation, ${wedding.dateLong}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The WhatsApp/social preview: the printed card reduced to its essentials —
 * ivory paper, a gold rule, watercolour blooms in the corners.
 * Satori only supports flexbox, so the florals arrive as SVG data URIs.
 */
const corner = (flipX: boolean, flipY: boolean) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 220 220">
  <g transform="${flipX ? "scale(-1,1) translate(-220,0)" : ""}${flipY ? "scale(1,-1) translate(0,-220)" : ""}">
    <path d="M-6 96 C 34 88, 66 62, 92 22" stroke="#6e8b5b" stroke-width="2" fill="none" opacity="0.5"/>
    <path d="M2 132 C 46 122, 84 92, 112 46" stroke="#4f6b47" stroke-width="1.6" fill="none" opacity="0.4"/>
    <g fill="#6e8b5b" opacity="0.55">
      <ellipse cx="30" cy="120" rx="9" ry="24" transform="rotate(-38 30 120)"/>
      <ellipse cx="62" cy="96" rx="8" ry="21" transform="rotate(28 62 96)"/>
      <ellipse cx="98" cy="60" rx="7" ry="19" transform="rotate(52 98 60)"/>
      <ellipse cx="20" cy="168" rx="9" ry="23" transform="rotate(-16 20 168)"/>
      <ellipse cx="132" cy="30" rx="6" ry="16" transform="rotate(66 132 30)"/>
    </g>
    ${[
      [58, 44, 30, "#e2703a"],
      [104, 84, 21, "#e9a04a"],
      [22, 104, 22, "#dd8a72"],
      [80, 142, 15, "#e2703a"],
      [16, 18, 17, "#e9a04a"],
      [136, 66, 12, "#cf5f52"],
    ]
      .map(([cx, cy, r, tone]) => {
        const petals = Array.from({ length: 6 }, (_, i) => {
          const a = (360 / 6) * i;
          return `<ellipse cx="${cx}" cy="${Number(cy) - Number(r) * 0.55}" rx="${Number(r) * 0.34}" ry="${Number(r) * 0.6}" transform="rotate(${a} ${cx} ${cy})" fill="${tone}" opacity="0.62"/>`;
        }).join("");
        return `${petals}<circle cx="${cx}" cy="${cy}" r="${Number(r) * 0.24}" fill="#c9a227" opacity="0.75"/>`;
      })
      .join("")}
  </g>
</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
};

/**
 * Satori has no system fonts, so the display serif is fetched at build time.
 * If the network is unavailable the card still renders, just in the default face.
 */
async function displayFont(weight: 300 | 400) {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css?family=Cormorant+Garamond:${weight}`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    ).then((r) => r.text());
    const url = css.match(/src: url\((https:[^)]+\.ttf)\)/)?.[1];
    if (!url) return null;
    const data = await fetch(url).then((r) => r.arrayBuffer());
    return { name: "Cormorant Garamond", data, weight, style: "normal" as const };
  } catch {
    return null;
  }
}

/** A downscaled copy of the hero photograph, inlined into the card. */
async function photo() {
  const bytes = await readFile(join(process.cwd(), "app", "og-photo.jpg"));
  return `data:image/jpeg;base64,${bytes.toString("base64")}`;
}

export default async function OpengraphImage() {
  const [fontsRaw, portrait] = await Promise.all([
    Promise.all([displayFont(300), displayFont(400)]),
    photo(),
  ]);
  const fonts = fontsRaw.filter((f) => f !== null);
  const display = fonts.length ? "Cormorant Garamond" : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(155deg, #fffdf8 0%, #fbf6ec 45%, #f4e9d6 100%)",
          position: "relative",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={corner(false, false)} width={300} height={300} style={{ position: "absolute", top: -30, left: -30 }} alt="" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={corner(true, false)} width={300} height={300} style={{ position: "absolute", top: -30, right: -30 }} alt="" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={corner(false, true)} width={300} height={300} style={{ position: "absolute", bottom: -30, left: -30 }} alt="" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={corner(true, true)} width={300} height={300} style={{ position: "absolute", bottom: -30, right: -30 }} alt="" />

        <div style={{ display: "flex", alignItems: "center", gap: 56 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={portrait}
            width={330}
            height={440}
            alt=""
            style={{
              objectFit: "cover",
              borderRadius: "165px 165px 12px 12px",
              border: "3px solid rgba(201,162,39,0.5)",
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              maxWidth: 560,
            }}
          >
            <div style={{ display: "flex", fontSize: 20, letterSpacing: 12, color: "#7b8299", textTransform: "uppercase" }}>
              Shubha Vivaham
            </div>

            <div style={{ display: "flex", flexDirection: "column", marginTop: 22, color: "#1b2a5b" }}>
              <span style={{ fontFamily: display, fontSize: 86, lineHeight: 1.05 }}>
                {wedding.bride}
              </span>
              <span style={{ fontFamily: display, fontSize: 40, color: "#e2703a", fontStyle: "italic" }}>
                and
              </span>
              <span style={{ fontFamily: display, fontSize: 86, lineHeight: 1.05 }}>
                {wedding.groom}
              </span>
            </div>

            <div style={{ display: "flex", width: 360, height: 2, marginTop: 30, background: "linear-gradient(90deg, #c9a227, rgba(201,162,39,0))" }} />

            <div style={{ display: "flex", fontSize: 28, letterSpacing: 9, color: "#4a5578", marginTop: 26, textTransform: "uppercase" }}>
              {wedding.dateLong}
            </div>
            <div style={{ display: "flex", fontSize: 18, letterSpacing: 6, color: "#7b8299", marginTop: 14, textTransform: "uppercase" }}>
              {wedding.weekday} · {wedding.timeRange} · {wedding.venueCity}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined }
  );
}
