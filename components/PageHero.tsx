import Image from "next/image";
import Link from "next/link";

type Crumb = { href?: string; label: string };

/** Banner at the top of every inner page: title, short intro and breadcrumb. */
export default function PageHero({
  title,
  intro,
  crumbs,
  image = "/images/hero.webp",
}: {
  title: string;
  intro?: string;
  crumbs: Crumb[];
  image?: string;
}) {
  const all: Crumb[] = [{ href: "/", label: "Home" }, ...crumbs];
  return (
    <section className="page-hero">
      <Image className="page-hero-bg" src={image} alt="" fill sizes="100vw" priority />
      <div className="page-hero-shade" aria-hidden="true" />
      <div className="container page-hero-inner">
        <nav aria-label="Breadcrumb">
          <ol className="crumbs">
            {all.map((c, i) => (
              <li key={c.label}>
                {c.href && i < all.length - 1 ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
              </li>
            ))}
          </ol>
        </nav>
        <h1>{title}</h1>
        {intro && <p className="page-hero-intro">{intro}</p>}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, ...(c.href ? { item: c.href } : {}) })),
          }),
        }}
      />
    </section>
  );
}
