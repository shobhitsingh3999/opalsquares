import { IconArea, IconDoc, IconPin, IconWalk } from "./Icons";

const POINTS = [
  {
    Icon: IconPin,
    title: "Local office in Noida",
    text: "Our office is in Sector 70, Noida, close to the markets we cover across Noida and Greater Noida.",
  },
  {
    Icon: IconArea,
    title: "Residential and commercial",
    text: "Flats, builder floors, villas and plots, as well as shops, offices, showrooms and commercial land.",
  },
  {
    Icon: IconDoc,
    title: "Buy, sell, rent or invest",
    text: "One team for buying, selling, rentals and leasing, and property investment advice.",
  },
  {
    Icon: IconWalk,
    title: "Site visits arranged",
    text: "Tell us what you want to see. We arrange the visit and answer your questions on site.",
  },
];

export default function WhyUs() {
  return (
    <section className="section why" aria-labelledby="why-title">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="kicker">Why Opal Square</p>
            <h2 id="why-title" className="h2">Why clients work with us</h2>
          </div>
          <p className="section-lead">A Noida-based team for residential and commercial property.</p>
        </div>
        <ul className="why-grid">
          {POINTS.map(({ Icon, title, text }) => (
            <li key={title} className="why-card">
              <span className="why-icon"><Icon size={24} /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
