import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/site.config";
import { localities } from "@/lib/catalog";
import { priceLabel } from "@/lib/format";
import { projectHref } from "@/lib/nav";
import PageHero from "@/components/PageHero";
import { CtaBand, ServiceAreas } from "@/components/home/HomeSections";

export const metadata: Metadata = {
  title: "Localities",
  description: "Opal Square Properties works across Noida, Greater Noida, Noida Extension, Greater Noida West, Techzone 4 and the Yamuna Expressway.",
};

export default function LocalitiesPage() {
  const locs = localities(site.projects);
  return (
    <>
      <PageHero
        title="Areas we serve"
        intro="Residential and commercial property across Noida, Greater Noida and the Yamuna Expressway."
        crumbs={[{ label: "Localities" }]}
        image="/images/project-9.webp"
      />
      <ServiceAreas heading={false} />
      {locs.length > 0 && (
        <section className="section section-tight loc-table-section" aria-labelledby="by-locality">
          <div className="container">
            <h2 id="by-locality" className="h2">Current listings by sector</h2>
            <div className="loc-lists">
              {locs.map((l) => (
                <div key={l.name} className="loc-list">
                  <h3 className="h3">{l.name}, {l.city}</h3>
                  <ul>
                    {site.projects.filter((p) => p.locality === l.name).map((p) => (
                      <li key={p.slug}>
                        <Link href={projectHref(p.slug)}>{p.title ?? p.name}</Link>
                        <span>{p.kind === "project" ? "Highlighted project" : p.propertyType} · {priceLabel(p)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      <CtaBand />
    </>
  );
}
