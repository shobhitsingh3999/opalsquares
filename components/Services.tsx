import Image from "next/image";
import Link from "next/link";
import { site } from "@/site.config";

export default function Services({ standalone = false }: { standalone?: boolean }) {
  const { services } = site.about;
  return (
    <section className="section services-section" aria-labelledby="services-title">
      <div className="container">
        <div className="section-head section-head-dark">
          <div>
            <p className="kicker kicker-light">Our services</p>
            <h2 id="services-title" className="h2">How we help buyers</h2>
          </div>
          {standalone ? (
            <p className="section-lead">One advisor works with you from the first shortlist to the day you book.</p>
          ) : (
            <Link className="link-arrow link-arrow-light" href="/services">All services</Link>
          )}
        </div>
        <ol className="service-list">
          {services.map((s, i) => (
            <li key={s.title} className="service">
              <span className="service-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="service-title">{s.title}</h3>
              <p className="service-desc">{s.description}</p>
              <ul className="service-tags" aria-label={`${s.title} covers`}>
                {s.tags.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </li>
          ))}
        </ol>
        <div className="services-banner">
          <Image src="/images/services.webp" alt="Preview image: a modern house in a forest, black and white" width={1300} height={700} sizes="(min-width: 1320px) 1280px, 100vw" />
          <div className="services-banner-copy">
            <p>Not sure where to start?</p>
            <Link className="btn btn-gold" href="/contact#enquire">Talk to an advisor</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
