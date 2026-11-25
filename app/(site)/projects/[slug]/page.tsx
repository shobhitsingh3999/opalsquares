import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/site.config";
import { configSummary, formatInr, formatSqft, priceLabel, statusLabel, whatsappHref } from "@/lib/format";
import { similarProjects, projectsUrl } from "@/lib/catalog";
import ProjectGallery from "@/components/projects/ProjectGallery";
import AreaSquare from "@/components/AreaSquare";
import EnquiryForm from "@/components/EnquiryForm";
import ProjectCard from "@/components/ProjectCard";
import { IconCheck, IconPin, IconWhatsApp } from "@/components/Icons";


export function generateStaticParams() {
  return site.projects.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = site.projects.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: `${p.name}, ${p.locality}`,
    description: `${p.name} in ${p.locality}, ${p.city}: ${configSummary(p)}. ${priceLabel(p)}. ${statusLabel(p) ?? ""}`.trim(),
    openGraph: p.images[0] ? { images: [p.images[0].src] } : undefined,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const p = site.projects.find((x) => x.slug === slug);
  if (!p) notFound();

  const areas = p.configurations.map((c) => c.carpetAreaSqft).filter((v): v is number => !!v);
  const areaText = areas.length
    ? Math.min(...areas) === Math.max(...areas)
      ? formatSqft(areas[0])
      : `${Math.min(...areas).toLocaleString("en-IN")}–${formatSqft(Math.max(...areas))}`
    : "On request";
  const hasPlans = p.configurations.some((c) => c.floorPlan);
  const similar = similarProjects(site.projects, p);
  const { whatsapp } = site.contact;

  const facts = [
    ["Starting price", priceLabel(p).replace(/^From /, "")],
    ["Configuration", configSummary(p)],
    ["Carpet area", areaText],
    ["Possession", p.status === "Ready to move" ? "Ready to move" : p.possession ?? "To be confirmed"],
    ["Property type", p.propertyType],
    ["Developer", p.developer ?? "To be confirmed"],
  ];

  return (
    <>
      <section className="project-head">
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className="crumbs crumbs-dark">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/projects">Projects</Link></li>
              <li><span aria-current="page">{p.name}</span></li>
            </ol>
          </nav>
          <div className="project-title-row">
            <div>
              <h1 className="project-title">{p.name}</h1>
              <p className="project-loc">
                <IconPin size={16} /> {p.location.address ?? `${p.locality}, ${p.city}`}
              </p>
            </div>
            <div className="project-badges">
              {p.status && <span className="badge badge-gold">{p.status}</span>}
              {p.preview && <span className="badge">Preview listing</span>}
            </div>
          </div>
          {p.preview && (
            <p className="details-note" role="note">Preview listing. Every figure and photograph on this page is a placeholder.</p>
          )}
          <ProjectGallery images={p.images} name={p.name} />
          <dl className="facts-bar">
            {facts.map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section section-tight project-body">
        <div className="container project-layout">
          <div className="project-content">
            <section aria-labelledby="ov">
              <h2 id="ov" className="h3">Overview</h2>
              <p className="lead">{p.summary}</p>
            </section>

            <section aria-labelledby="cfg">
              <h2 id="cfg" className="h3">Configurations and prices</h2>
              <div className="table-wrap">
                <table className="config-table">
                  <thead>
                    <tr>
                      <th scope="col">Configuration</th>
                      <th scope="col">Carpet area</th>
                      <th scope="col">Starting price</th>
                      <th scope="col">Floor plan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.configurations.map((c) => (
                      <tr key={c.label}>
                        <th scope="row">{c.label}</th>
                        <td>{c.carpetAreaSqft ? formatSqft(c.carpetAreaSqft) : "To be confirmed"}</td>
                        <td>{c.priceFromInr ? formatInr(c.priceFromInr) : "On request"}</td>
                        <td>
                          {c.floorPlan ? (
                            <a href={c.floorPlan.src} target="_blank" rel="noopener">View plan<span className="visually-hidden"> for {c.label}</span></a>
                          ) : (
                            <a href="#enquire">Request plan<span className="visually-hidden"> for {c.label}</span></a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="small-note">
                Prices are starting figures. The final cost may add GST, stamp duty, registration, parking and deposits. {hasPlans ? "" : "Floor plans are shared on request."}
              </p>
            </section>

            <section aria-labelledby="area">
              <h2 id="area" className="h3">What the carpet area looks like</h2>
              <AreaSquare project={p} />
            </section>

            {p.amenities.length > 0 && (
              <section aria-labelledby="am">
                <h2 id="am" className="h3">Amenities</h2>
                <ul className="amenity-grid">
                  {p.amenities.map((a) => <li key={a}><IconCheck size={16} /> {a}</li>)}
                </ul>
              </section>
            )}

            <section aria-labelledby="loc">
              <h2 id="loc" className="h3">Location</h2>
              <p>{p.location.address ?? `${p.locality}, ${p.city}`}</p>
              {p.location.mapUrl && (
                <p><a className="link-strong" href={p.location.mapUrl} target="_blank" rel="noopener">Open in Google Maps</a></p>
              )}
              {p.location.nearby.length > 0 && (
                <ul className="nearby">{p.location.nearby.map((n) => <li key={n}>{n}</li>)}</ul>
              )}
              <p><Link className="link-strong" href={projectsUrl({ locality: p.locality })}>More projects in {p.locality}</Link></p>
            </section>

            {p.rera?.verified && (
              <section aria-labelledby="rera">
                <h2 id="rera" className="h3">RERA registration</h2>
                <p>
                  {p.rera.number} · <a className="link-strong" href={p.rera.portalUrl} target="_blank" rel="noopener">Verify on the official RERA portal</a>
                </p>
              </section>
            )}
          </div>

          <aside className="project-aside" id="enquire" aria-label={`Enquire about ${p.name}`}>
            <div className="aside-card">
              <p className="aside-price"><span>Starting price</span>{priceLabel(p).replace(/^From /, "")}</p>
              <EnquiryForm defaultProperty={p.slug} lockProperty title="Book a site visit" />
            </div>
          </aside>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="section similar" aria-labelledby="similar-title">
          <div className="container">
            <div className="section-head">
              <h2 id="similar-title" className="h2">Similar projects</h2>
              <Link className="link-arrow" href="/projects">View all projects</Link>
            </div>
            <div className="cards">
              {similar.map((s) => <ProjectCard key={s.slug} project={s} />)}
            </div>
          </div>
        </section>
      )}

      {whatsapp && (
        <div className="project-mobile-cta">
          <a className="btn btn-gold" href="#enquire">Book a visit</a>
          <a className="btn btn-wa" target="_blank" rel="noopener"
            href={whatsappHref(whatsapp, `Hello Opal Square, I'm interested in ${p.name} (${p.locality}, ${p.city}).`)}>
            <IconWhatsApp size={18} /> WhatsApp
          </a>
        </div>
      )}
    </>
  );
}
