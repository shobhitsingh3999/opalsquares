import Image from "next/image";
import Link from "next/link";
import { site } from "@/site.config";
import { filterOptions } from "@/lib/catalog";
import { IconCheck, IconSearch } from "../Icons";

/** Full-bleed hero with a property search that opens /projects with the chosen filters (works without JavaScript). */
export default function HomeHero() {
  const { headline, supporting, image, highlights } = site.hero;
  const opts = filterOptions(site.projects);

  return (
    <section className="hero" aria-labelledby="hero-title">
      <Image className="hero-bg" src={image.src} alt="" fill priority sizes="100vw" />
      <div className="hero-shade" aria-hidden="true" />
      <div className="container hero-inner">
        <div className="hero-copy">
          <h1 id="hero-title">{headline}</h1>
          <p className="hero-lead">{supporting}</p>
          <div className="hero-actions">
            <Link className="btn btn-gold" href="/projects">Explore Properties</Link>
            <Link className="btn btn-outline-light" href="/contact#enquire">Request a Site Visit</Link>
          </div>
        </div>

        <form className="hero-search" action="/projects" method="get" role="search" aria-label="Search properties">
          <label className="hs-field hs-q">
            <span>Search</span>
            <input type="search" name="q" placeholder="Project, locality or BHK" autoComplete="off" />
          </label>
          <label className="hs-field">
            <span>Locality</span>
            <select name="locality" defaultValue="">
              <option value="">Any locality</option>
              {opts.locality.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label className="hs-field">
            <span>Configuration</span>
            <select name="config" defaultValue="">
              <option value="">Any</option>
              {opts.config.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label className="hs-field">
            <span>Budget</span>
            <select name="budget" defaultValue="">
              <option value="">Any budget</option>
              {opts.budget.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
            </select>
          </label>
          <button type="submit" className="btn btn-gold hs-submit">
            <IconSearch size={18} /> Search
          </button>
        </form>

        <ul className="hero-highlights">
          {highlights.map((h) => (
            <li key={h}><IconCheck size={16} /> {h}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
