import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import ProjectsBrowser, { ProjectsBrowserFromUrl } from "@/components/projects/ProjectsBrowser";

export const metadata: Metadata = {
  title: "Projects",
  description: "Property for sale and highlighted projects in Noida from Opal Square Properties.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        title="Properties and projects"
        intro="Property for sale and highlighted projects in Noida. Enquire for current prices, floor plans and site visits."
        crumbs={[{ label: "Projects" }]}
        image="/images/project-5.webp"
      />
      <section className="section section-tight">
        <div className="container">
          {/* The fallback is what the static page shows before the URL's filters are read. */}
          <Suspense fallback={<ProjectsBrowser />}>
            <ProjectsBrowserFromUrl />
          </Suspense>
        </div>
      </section>
    </>
  );
}
