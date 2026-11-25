import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Faqs from "@/components/Faqs";
import { CtaBand, PropertyTypes, ServiceAreas } from "@/components/home/HomeSections";

export const metadata: Metadata = {
  title: "Services",
  description: "Buying, selling, rentals and leasing, and property investment advisory in Noida and Greater Noida.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Our services"
        intro="Buying, selling, rentals and leasing, and property investment advice across residential and commercial property."
        crumbs={[{ label: "Services" }]}
        image="/images/project-10.webp"
      />
      <Services standalone />
      <PropertyTypes />
      <ServiceAreas />
      <Process />
      <Faqs limit={3} />
      <CtaBand />
    </>
  );
}
