import HomeHero from "@/components/home/HomeHero";
import { CtaBand, HomeIntro, PropertyTypes, ServiceAreas, Showcase } from "@/components/home/HomeSections";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import Process from "@/components/Process";
import Trust from "@/components/Trust";
import Faqs from "@/components/Faqs";

export default function Home() {
  return (
    <>
      <HomeHero />
      <Showcase kind="listing" kicker="For sale" title="Featured property" />
      <Showcase kind="project" kicker="Highlighted projects" title="Projects in Sector 140A, Noida" tone="white" />
      <HomeIntro />
      <Services />
      <ServiceAreas />
      <PropertyTypes />
      <Process />
      <WhyUs />
      <Trust />
      <Faqs limit={4} />
      <CtaBand />
    </>
  );
}
