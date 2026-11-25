import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/site.config";
import PageHero from "@/components/PageHero";
import WhyUs from "@/components/WhyUs";
import Trust from "@/components/Trust";
import { CtaBand } from "@/components/home/HomeSections";

export const metadata: Metadata = {
  title: "About Us",
  description: `${site.brand.description} Learn how we work with home buyers.`,
};

// PREVIEW copy for the About page. Replace with your own story, founding year and team.
const VALUES = [
  { title: "On the buyer's side", text: "We work for the buyer. Our job is to help you choose well, not to push a particular project." },
  { title: "Facts before features", text: "Carpet area, full cost and possession date come first. Brochure language comes last." },
  { title: "Verified before visits", text: "We confirm availability and prices with the developer before you travel to a site." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Opal Square"
        intro="A real estate advisory for home buyers in India."
        crumbs={[{ label: "About Us" }]}
        image="/images/project-3.webp"
      />
      <section className="section about-page" aria-labelledby="story">
        <div className="container about-grid">
          <div>
            <p className="kicker">Who we are</p>
            <h2 id="story" className="h2">{site.about.statement}</h2>
            <p className="lead">{site.about.detail}</p>
            <p>
              We list projects only after speaking with the developer, show the carpet area and starting price on every
              listing, and arrange accompanied site visits so you can see a home before you commit.
            </p>
            <div className="btn-row">
              <Link className="btn btn-gold" href="/projects">Explore projects</Link>
              <Link className="btn btn-outline" href="/contact">Contact us</Link>
            </div>
          </div>
          <div className="about-media">
            <Image src="/images/visit.webp" alt="Preview image: an apartment building with glass balconies" width={800} height={952}
              sizes="(min-width: 900px) 40vw, 100vw" />
          </div>
        </div>
      </section>

      <section className="section values" aria-labelledby="values-title">
        <div className="container">
          <p className="kicker">How we work</p>
          <h2 id="values-title" className="h2">What you can expect from us</h2>
          <ul className="value-grid">
            {VALUES.map((v) => (
              <li key={v.title}>
                <h3 className="h3">{v.title}</h3>
                <p>{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <WhyUs />
      <Trust />
      <CtaBand />
    </>
  );
}
