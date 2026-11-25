import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/site.config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileContactBar from "@/components/MobileContactBar";
import "./site.css";

const satoshi = localFont({
  src: [
    { path: "../fonts/Satoshi-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Satoshi-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Satoshi-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "https://opalsquare.in"),
  title: {
    default: `${site.brand.name} Realty | Real estate advisory`,
    template: `%s | ${site.brand.name} Realty`,
  },
  description: `${site.brand.description} Browse projects, compare carpet area and price, and book a site visit with an advisor.`,
  // Keep the preview build out of search results.
  robots: site.previewMode ? { index: false, follow: false } : undefined,
  icons: site.brand.logo ? { icon: site.brand.logo.mark.src, apple: site.brand.logo.mark.src } : undefined,
  openGraph: { type: "website", siteName: `${site.brand.name} Realty`, images: [site.hero.image.src] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: `${site.brand.name} Realty`,
  description: site.brand.description,
  ...(site.contact.whatsapp ? { telephone: site.contact.whatsapp } : {}),
  ...(site.contact.email ? { email: site.contact.email } : {}),
  sameAs: [site.contact.social.instagram, site.contact.social.linkedin].filter(Boolean),
};

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={satoshi.variable}>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        {site.previewMode && (
          <p className="preview-banner" role="note">
            Preview build: listings, prices, areas and images are sample data, not real projects.
          </p>
        )}
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileContactBar />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  );
}
