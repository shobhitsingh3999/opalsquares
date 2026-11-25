import HomeHero from "@/components/home/HomeHero";
import { CtaBand, FeaturedProjects, HomeIntro, LocalityTiles } from "@/components/home/HomeSections";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import Process from "@/components/Process";
import Trust from "@/components/Trust";
import Faqs from "@/components/Faqs";

export default function Home() {
  return (
    <>
      <HomeHero />
      <FeaturedProjects />
      <HomeIntro />
      <LocalityTiles />
      <Services />
      <WhyUs />
      <Process />
      <Trust />
      <Faqs limit={4} />
      <CtaBand />
    </>
  );
}
