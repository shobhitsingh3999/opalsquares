import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotFound from "./(site)/not-found";
import "./(site)/site.css";

const satoshi = localFont({
  src: [
    { path: "./fonts/Satoshi-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Satoshi-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Satoshi-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-satoshi",
});

export const metadata: Metadata = { title: "Page not found | Opal Square Properties" };

export default function GlobalNotFound() {
  return (
    <html lang="en-IN" className={satoshi.variable}>
      <body>
        <Header />
        <main id="main">
          <NotFound />
        </main>
        <Footer />
      </body>
    </html>
  );
}
