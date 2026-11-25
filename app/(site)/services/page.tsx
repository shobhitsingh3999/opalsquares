import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import Process from "@/components/Process";
import Faqs from "@/components/Faqs";
import { CtaBand } from "@/components/home/HomeSections";

export const metadata: Metadata = {
  title: "Services",
  description: "Shortlisting, accompanied site visits, paperwork checks and booking support for home buyers.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Our services"
        intro="One advisor works with you from the first shortlist to the day you book."
        crumbs={[{ label: "Services" }]}
        image="/images/project-10.webp"
      />
      <Services standalone />
      <WhyUs />
      <Process />
      <Faqs limit={3} />
      <CtaBand />
    </>
  );
}
