import type { Metadata } from "next";
import { site } from "@/site.config";
import PageHero from "@/components/PageHero";
import Faqs from "@/components/Faqs";
import { CtaBand } from "@/components/home/HomeSections";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Answers to common questions about prices, carpet area, availability, site visits and RERA.",
};

export default function FaqsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: site.faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
  return (
    <>
      <PageHero title="Frequently asked questions" intro="Prices, carpet area, availability, site visits and RERA, explained."
        crumbs={[{ label: "FAQs" }]} image="/images/project-11.webp" />
      <Faqs title="Buyer questions, answered" />
      <CtaBand />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
