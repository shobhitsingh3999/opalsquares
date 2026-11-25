import { IconArea, IconDoc, IconShield, IconWalk } from "./Icons";

const POINTS = [
  {
    Icon: IconArea,
    title: "Carpet area first",
    text: "We compare homes on RERA carpet area, the usable space inside your walls, not on super built-up figures.",
  },
  {
    Icon: IconShield,
    title: "RERA checked",
    text: "Where a project is registered, we show the registration number and link to the official state portal.",
  },
  {
    Icon: IconDoc,
    title: "Full cost, upfront",
    text: "Ask for the cost sheet before you visit: GST, stamp duty, registration, parking and deposits, line by line.",
  },
  {
    Icon: IconWalk,
    title: "Visit with an advisor",
    text: "We confirm availability with the developer, then meet you on site so the right questions get asked.",
  },
];

export default function WhyUs() {
  return (
    <section className="section why" aria-labelledby="why-title">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="kicker">Why Opal Square</p>
            <h2 id="why-title" className="h2">Buy with the full picture</h2>
          </div>
          <p className="section-lead">Four checks we run on every shortlist, so price and space mean the same thing across projects.</p>
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
