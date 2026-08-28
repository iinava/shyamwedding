import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { wedding } from "./lib/wedding";

const display = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const body = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const title = `${wedding.bride} & ${wedding.groom} · ${wedding.dateLong}`;
const description =
  `With the blessings of our elders, ${wedding.bride} and ${wedding.groom} are getting married on ` +
  `${wedding.weekday}, ${wedding.dateLong} at ${wedding.venueCity}. We would love to have you with us.`;

export const metadata: Metadata = {
  metadataBase: new URL("https://vinaya-aswanth.wedding"),
  title,
  description,
  applicationName: "Wedding Invitation",
  keywords: ["wedding", "invitation", wedding.bride, wedding.groom, wedding.venueCity],
  openGraph: {
    type: "website",
    siteName: `${wedding.bride} & ${wedding.groom}`,
    title,
    description,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#fbf6ec",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
