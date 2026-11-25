import { site } from "@/site.config";

/**
 * Developer affiliations and buyer reviews.
 * Real content comes only from site.config.ts. In preview mode, empty lists show
 * clearly labelled placeholder slots so the layout can be reviewed; in production
 * an empty list hides its block entirely. No quotes or names are ever invented.
 */
export default function Trust() {
  const devs = site.developerAffiliations;
  const reviews = site.testimonials;
  const showDevs = devs.length > 0 || site.previewMode;
  const showReviews = reviews.length > 0 || site.previewMode;
  if (!showDevs && !showReviews) return null;

  return (
    <section className="section trust" aria-labelledby="trust-title">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="kicker">Trust</p>
            <h2 id="trust-title" className="h2">Developers and buyers</h2>
          </div>
          <p className="section-lead">Only approved affiliations and reviews from real buyers appear here.</p>
        </div>

        {showDevs && (
          <div className="trust-block">
            <h3 className="h3">Developers we work with</h3>
            {devs.length > 0 ? (
              <ul className="dev-list">
                {devs.map((d) => <li key={d}>{d}</li>)}
              </ul>
            ) : (
              <ul className="dev-list" aria-label="Placeholder slots">
                {Array.from({ length: 5 }, (_, i) => (
                  <li key={i} className="slot">Developer logo</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {showReviews && (
          <div className="trust-block">
            <h3 className="h3">What buyers say</h3>
            {reviews.length > 0 ? (
              <ul className="review-grid">
                {reviews.map((t) => (
                  <li key={t.name + t.context} className="review">
                    <blockquote>“{t.quote}”</blockquote>
                    <p className="review-name">{t.name}</p>
                    <p className="review-context">{t.context}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="review-grid" aria-label="Placeholder slots">
                {Array.from({ length: 3 }, (_, i) => (
                  <li key={i} className="review slot">
                    <p>Approved buyer review goes here.</p>
                    <p className="review-context">Add quotes with permission in site.config.ts → testimonials.</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
