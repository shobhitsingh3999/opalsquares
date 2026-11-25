import Image from "next/image";
import Link from "next/link";
import { site } from "@/site.config";
import { localities, projectsUrl, typeCounts } from "@/lib/catalog";
import ProjectCard from "../ProjectCard";
import { IconArrow } from "../Icons";

const plural = (t: string, n: number) => (n === 1 ? t : `${t}s`);

export function HomeIntro() {
  const types = typeCounts(site.projects);
  const locs = localities(site.projects);
  return (
    <section className="section intro" aria-labelledby="intro-title">
      <div className="container intro-grid">
        <div className="intro-media">
          <Image src="/images/sketch.webp" alt="Preview image: architectural sketch of a modern residence" width={2560} height={1431}
            sizes="(min-width: 900px) 50vw, 100vw" />
        </div>
        <div className="intro-copy">
          <p className="kicker">About {site.brand.name}</p>
          <h2 id="intro-title" className="h2">{site.about.statement}</h2>
          <p>{site.about.detail}</p>
          <dl className="stats">
            <div><dt>Projects listed</dt><dd>{site.projects.length}</dd></div>
            <div><dt>Localities</dt><dd>{locs.length}</dd></div>
            <div><dt>Property types</dt><dd>{types.length}</dd></div>
          </dl>
          <ul className="chips" aria-label="Browse by property type">
            {types.map(([t, n]) => (
              <li key={t}>
                <Link className="chip" href={projectsUrl({ type: t })}>{plural(t, n)} <span>({n})</span></Link>
              </li>
            ))}
          </ul>
          <Link className="btn btn-dark" href="/about">More about us</Link>
        </div>
      </div>
    </section>
  );
}

export function FeaturedProjects() {
  const featured = site.projects.slice(0, 6);
  return (
    <section className="section featured" aria-labelledby="featured-title">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="kicker">Featured projects</p>
            <h2 id="featured-title" className="h2">Homes our advisors recommend</h2>
          </div>
          <Link className="link-arrow" href="/projects">View all projects <IconArrow size={16} /></Link>
        </div>
        <div className="cards">
          {featured.map((p, i) => <ProjectCard key={p.slug} project={p} priority={i < 3} />)}
        </div>
      </div>
    </section>
  );
}

export function LocalityTiles({ heading = true }: { heading?: boolean }) {
  const locs = localities(site.projects);
  if (!locs.length) return null;
  return (
    <section className="section localities" aria-labelledby={heading ? "loc-title" : undefined} aria-label={heading ? undefined : "Localities"}>
      <div className="container">
        {heading && (
          <div className="section-head">
            <div>
              <p className="kicker">Localities</p>
              <h2 id="loc-title" className="h2">Explore by locality</h2>
            </div>
            <Link className="link-arrow" href="/localities">All localities <IconArrow size={16} /></Link>
          </div>
        )}
        <ul className="loc-grid">
          {locs.map((l) => (
            <li key={l.name}>
              <Link className="loc-tile" href={projectsUrl({ locality: l.name })}>
                {l.image && <Image src={l.image.src} alt="" width={l.image.width} height={l.image.height} sizes="(min-width: 900px) 33vw, 50vw" />}
                <span className="loc-info">
                  <span className="loc-name">{l.name}</span>
                  <span className="loc-meta">{l.city} · {l.count} {l.count === 1 ? "project" : "projects"}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
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
          <h2 className="h2">See a home before you decide</h2>
          <p>An advisor confirms availability with the developer and meets you at the site.</p>
        </div>
        <Link className="btn btn-gold" href="/contact#enquire">Book a Site Visit</Link>
      </div>
    </section>
  );
}
