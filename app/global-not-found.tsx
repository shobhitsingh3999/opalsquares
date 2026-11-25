import type { Metadata } from "next";
import { fontVars } from "@/lib/fonts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotFound from "./(site)/not-found";
import "./(site)/site.css";


export const metadata: Metadata = { title: "Page not found | Opal Square Properties" };

export default function GlobalNotFound() {
  return (
    <html lang="en-IN" className={fontVars}>
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
