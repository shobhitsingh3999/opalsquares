import Image from "next/image";
import Link from "next/link";
import { site } from "@/site.config";
import { whatsappHref } from "@/lib/format";
import ProjectCard from "../ProjectCard";
import { IconArrow, IconPin, IconWhatsApp } from "../Icons";

export function HomeIntro() {
  const { serviceAreas, propertyTypes, services } = site.about;
  return (
    <section className="section intro" aria-labelledby="intro-title">
      <div className="container intro-grid">
        <div className="intro-media">
          <Image src="/images/sketch.webp" alt="" width={2560} height={1431} sizes="(min-width: 900px) 50vw, 100vw" />
        </div>
        <div className="intro-copy">
          <p className="kicker">About {site.brand.legalName}</p>
          <h2 id="intro-title" className="h2">{site.about.statement}</h2>
          <p>{site.about.detail}</p>
          <dl className="stats">
            <div><dt>Services</dt><dd>{services.length}</dd></div>
            <div><dt>Areas served</dt><dd>{serviceAreas.length}</dd></div>
            <div><dt>Property types</dt><dd>{propertyTypes.residential.length + propertyTypes.commercial.length}</dd></div>
          </dl>
          <ul className="chips" aria-label="Services">
            {services.map((s) => (
              <li key={s.title}><Link className="chip" href="/services">{s.title}</Link></li>
            ))}
          </ul>
          <Link className="btn btn-dark" href="/about">More about us</Link>
        </div>
      </div>
    </section>
  );
}

/** A row of property cards of one kind ("listing" for sale, or highlighted "project"). */
export function Showcase({ kind, kicker, title, tone = "light" }: { kind: "listing" | "project"; kicker: string; title: string; tone?: "light" | "white" }) {
  const items = site.projects.filter((p) => p.kind === kind);
  if (!items.length) return null;
  return (
    <section className={`section showcase${tone === "light" ? " showcase-light" : ""}`} aria-labelledby={`${kind}-title`}>
      <div className="container">
        <div className="section-head">
          <div>
            <p className="kicker">{kicker}</p>
            <h2 id={`${kind}-title`} className="h2">{title}</h2>
          </div>
          <Link className="link-arrow" href="/projects">View all <IconArrow size={16} /></Link>
        </div>
        <div className="cards">
          {items.map((p, i) => <ProjectCard key={p.slug} project={p} priority={i < 2} />)}
        </div>
      </div>
    </section>
  );
}

export function ServiceAreas({ heading = true }: { heading?: boolean }) {
  const { serviceAreas } = site.about;
  const { whatsapp } = site.contact;
  return (
    <section className="section areas" aria-labelledby={heading ? "areas-title" : undefined} aria-label={heading ? undefined : "Areas we serve"}>
      <div className="container">
        {heading && (
          <div className="section-head">
            <div>
              <p className="kicker">Areas we serve</p>
              <h2 id="areas-title" className="h2">Noida, Greater Noida and beyond</h2>
            </div>
            <Link className="link-arrow" href="/localities">Localities <IconArrow size={16} /></Link>
          </div>
        )}
        <ul className="area-grid">
          {serviceAreas.map((a) => (
            <li key={a} className="area-card">
              <span className="area-icon"><IconPin size={20} /></span>
              <p className="area-name">{a}</p>
              {whatsapp ? (
                <a className="area-link" target="_blank" rel="noopener"
                  href={whatsappHref(whatsapp, `Hello Opal Square, I'm looking for property in ${a}.`)}>
                  <IconWhatsApp size={16} /> Ask about {a}
                </a>
              ) : (
                <Link className="area-link" href="/contact#enquire">Ask about {a}</Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function PropertyTypes() {
  const { residential, commercial } = site.about.propertyTypes;
  return (
    <section className="section types" aria-labelledby="types-title">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="kicker">What we deal in</p>
            <h2 id="types-title" className="h2">Residential and commercial property</h2>
          </div>
          <p className="section-lead">Tell us what you are looking for and we will share current options.</p>
        </div>
        <div className="types-grid">
          <div className="types-col">
            <h3 className="h3">Residential</h3>
            <ul className="chips">{residential.map((t) => <li key={t}><span className="chip chip-static">{t}</span></li>)}</ul>
          </div>
          <div className="types-col">
            <h3 className="h3">Commercial</h3>
            <ul className="chips">{commercial.map((t) => <li key={t}><span className="chip chip-static">{t}</span></li>)}</ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="cta-band" aria-label="Book a site visit">
      <div className="container cta-band-inner">
        <Image src="/images/project-6.webp" alt="" fill sizes="100vw" className="cta-band-bg" />
        <div className="cta-band-shade" aria-hidden="true" />
        <div className="cta-band-copy">
          <h2 className="h2">Buying, selling or renting?</h2>
          <p>Tell us what you need. We will call you back with options and arrange a visit.</p>
        </div>
        <Link className="btn btn-gold" href="/contact#enquire">Talk to us</Link>
      </div>
    </section>
  );
}
