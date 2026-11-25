import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/site.config";
import PageHero from "@/components/PageHero";
import WhyUs from "@/components/WhyUs";
import Trust from "@/components/Trust";
import { CtaBand, PropertyTypes, ServiceAreas } from "@/components/home/HomeSections";
import { IconPin } from "@/components/Icons";

export const metadata: Metadata = {
  title: "About Us",
  description: site.about.detail,
};

export default function AboutPage() {
  const { officeAddress, mapUrl, contactPerson } = site.contact;
  return (
    <>
      <PageHero title={`About ${site.brand.legalName}`} intro={site.brand.description} crumbs={[{ label: "About Us" }]} image="/images/project-3.webp" />
      <section className="section about-page" aria-labelledby="story">
        <div className="container about-grid">
          <div>
            <p className="kicker">Who we are</p>
            <h2 id="story" className="h2">{site.about.statement}</h2>
            <p className="lead">{site.about.detail}</p>
            <ul className="service-inline">
              {site.about.services.map((s) => <li key={s.title}>{s.title}</li>)}
            </ul>
            <div className="btn-row">
              <Link className="btn btn-gold" href="/projects">View properties</Link>
              <Link className="btn btn-outline" href="/contact">Contact us</Link>
            </div>
          </div>
          {officeAddress && (
            <div className="office-card">
              <p className="kicker">Our office</p>
              <p className="office-address"><IconPin size={18} /> {officeAddress}</p>
              {contactPerson && <p><span className="contact-label">Contact</span><br />{contactPerson}</p>}
              {mapUrl && <a className="btn btn-dark btn-sm" href={mapUrl} target="_blank" rel="noopener">Get directions</a>}
            </div>
          )}
        </div>
      </section>
      <PropertyTypes />
      <ServiceAreas />
      <WhyUs />
      <Trust />
      <CtaBand />
    </>
  );
}
