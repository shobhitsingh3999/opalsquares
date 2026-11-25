import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section not-found">
      <div className="container">
        <p className="kicker">Page not found</p>
        <h1 className="h2">We couldn&apos;t find that page</h1>
        <p className="lead">The link may be out of date, or the project may no longer be listed.</p>
        <div className="btn-row">
          <Link className="btn btn-gold" href="/projects">Browse projects</Link>
          <Link className="btn btn-outline" href="/">Go to home</Link>
        </div>
      </div>
    </section>
  );
}
