import PageHero from "./PageHero";

export type LegalSection = { heading: string; body: string[] };

/** Shared layout for policy pages. */
export default function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: LegalSection[] }) {
  return (
    <>
      <PageHero title={title} crumbs={[{ label: title }]} image="/images/project-13.webp" />
      <section className="section section-tight">
        <div className="container legal">
          <p className="details-note" role="note">
            Draft for review. Please have this page checked by your legal adviser before launch.
          </p>
          <p className="small-note">Last updated: {updated}</p>
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="h3">{s.heading}</h2>
              {s.body.map((b) => <p key={b}>{b}</p>)}
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
