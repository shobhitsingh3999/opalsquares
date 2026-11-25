import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/site.config";
import { localities, projectsUrl } from "@/lib/catalog";
import { priceLabel } from "@/lib/format";
import { projectHref } from "@/lib/nav";
import PageHero from "@/components/PageHero";
import { LocalityTiles, CtaBand } from "@/components/home/HomeSections";

export const metadata: Metadata = {
  title: "Localities",
  description: "Explore the localities where Opal Square lists projects and see every project in each area.",
};

export default function LocalitiesPage() {
  const locs = localities(site.projects);
  return (
    <>
      <PageHero
        title="Localities"
        intro="Choose an area to see every project we list there, with prices and possession at a glance."
        crumbs={[{ label: "Localities" }]}
        image="/images/project-9.webp"
      />
      <LocalityTiles heading={false} />
      <section className="section section-tight loc-table-section" aria-labelledby="by-locality">
        <div className="container">
          <h2 id="by-locality" className="h2">Projects by locality</h2>
          <div className="loc-lists">
            {locs.map((l) => {
              const list = site.projects.filter((p) => p.locality === l.name);
              return (
                <div key={l.name} className="loc-list">
                  <h3 className="h3"><Link href={projectsUrl({ locality: l.name })}>{l.name}, {l.city}</Link></h3>
                  <ul>
                    {list.map((p) => (
                      <li key={p.slug}>
                        <Link href={projectHref(p.slug)}>{p.name}</Link>
                        <span>{p.propertyType} · {priceLabel(p)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
