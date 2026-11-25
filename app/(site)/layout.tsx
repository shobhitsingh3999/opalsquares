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
    default: `${site.brand.legalName} | Real estate in Noida`,
    template: `%s | ${site.brand.legalName}`,
  },
  description: `${site.brand.description} Buy, sell, rent or invest in residential and commercial property in Noida and Greater Noida.`,
  // Keep the preview build out of search results.
  robots: site.previewMode ? { index: false, follow: false } : undefined,
  icons: site.brand.logo ? { icon: site.brand.logo.mark.src, apple: site.brand.logo.mark.src } : undefined,
  openGraph: { type: "website", siteName: site.brand.legalName, images: [site.hero.image.src] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: site.brand.legalName,
  description: site.brand.description,
  areaServed: site.about.serviceAreas,
  ...(site.contact.officeAddress
    ? { address: { "@type": "PostalAddress", streetAddress: site.contact.officeAddress, addressLocality: "Noida", addressRegion: "Uttar Pradesh", postalCode: "201301", addressCountry: "IN" } }
    : {}),
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
            Preview build: some prices, areas and RERA details are pending confirmation, and banner images are placeholders.
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
