import localFont from "next/font/local";
import { Cormorant_Garamond } from "next/font/google";

/** UI and body text. */
export const satoshi = localFont({
  src: [
    { path: "../app/fonts/Satoshi-400.woff2", weight: "400", style: "normal" },
    { path: "../app/fonts/Satoshi-500.woff2", weight: "500", style: "normal" },
    { path: "../app/fonts/Satoshi-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

/** Display serif for headings; echoes the serif lettering of the Opal Square logo. Self-hosted at build time. */
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const fontVars = `${satoshi.variable} ${cormorant.variable}`;
