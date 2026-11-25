import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import ProjectsBrowser, { ProjectsBrowserFromUrl } from "@/components/projects/ProjectsBrowser";

export const metadata: Metadata = {
  title: "Projects",
  description: "Browse residential and commercial projects with configuration, carpet area, starting price and possession on every listing.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        title="Projects"
        intro="Compare homes on configuration, carpet area, starting price and possession, then book a visit with an advisor."
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
