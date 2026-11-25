import Image from "next/image";
import Link from "next/link";
import { site } from "@/site.config";
import { telHref, whatsappHref } from "@/lib/format";
import { localities, projectsUrl } from "@/lib/catalog";
import { FOOTER_LINKS } from "@/lib/nav";
import { IconInstagram, IconLinkedIn, IconWhatsApp } from "./Icons";

export default function Footer() {
  const { phone, whatsapp, email, officeAddress, hours, social } = site.contact;
  const logo = site.brand.logo;
  const locs = localities(site.projects);
  const waText = "Hello Opal Square, I would like to know more about your properties.";
  const prettyWa = whatsapp?.replace(/^\+91(\d{5})(\d{5})$/, "+91 $1 $2");

  return (
    <footer className="site-footer">
      <div className="container footer-cta-band">
        <div>
          <p className="footer-cta-title">Looking for the right home?</p>
          <p>Tell us your budget and preferred locality. An advisor will shortlist options and arrange visits.</p>
        </div>
        <div className="footer-cta-actions">
          <Link className="btn btn-gold" href="/contact#enquire">Book a Site Visit</Link>
          {whatsapp && (
            <a className="btn btn-wa" href={whatsappHref(whatsapp, waText)} target="_blank" rel="noopener">
              <IconWhatsApp size={18} /> WhatsApp us
            </a>
          )}
        </div>
      </div>

      <div className="container footer-top">
        <div className="footer-brand">
          <Link href="/" className="logo" aria-label={`${site.brand.name} home`}>
            {logo ? (
              <Image className="footer-logo" src={logo.onDark.src} alt="" width={logo.onDark.width} height={logo.onDark.height} />
            ) : (
              <span className="logo-text">{site.brand.name}</span>
            )}
          </Link>
          <p>{site.brand.description} We help buyers compare projects, visit them with an advisor and book with confidence.</p>
          {(social.instagram || social.linkedin || whatsapp) && (
            <ul className="social" aria-label="Follow Opal Square">
              {social.instagram && (
                <li><a href={social.instagram} target="_blank" rel="noopener" aria-label="Instagram (opens in a new tab)"><IconInstagram size={18} /></a></li>
              )}
              {social.linkedin && (
                <li><a href={social.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn (opens in a new tab)"><IconLinkedIn size={17} /></a></li>
              )}
              {whatsapp && (
                <li><a href={whatsappHref(whatsapp, waText)} target="_blank" rel="noopener" aria-label="WhatsApp (opens in a new tab)"><IconWhatsApp size={18} /></a></li>
              )}
            </ul>
          )}
        </div>

        <div className="footer-col">
          <p className="footer-head">Company</p>
          <ul>{FOOTER_LINKS.company.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}</ul>
        </div>

        <div className="footer-col">
          <p className="footer-head">Projects</p>
          <ul>
            <li><Link href="/projects">All projects</Link></li>
            {locs.slice(0, 5).map((l) => (
              <li key={l.name}><Link href={projectsUrl({ locality: l.name })}>Projects in {l.name}</Link></li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <p className="footer-head">Contact</p>
          <ul>
            {whatsapp && <li><a href={whatsappHref(whatsapp, waText)} target="_blank" rel="noopener">WhatsApp {prettyWa}</a></li>}
            {phone && <li><a href={telHref(phone)}>{phone}</a></li>}
            {email && <li><a href={`mailto:${email}`}>{email}</a></li>}
            {officeAddress && <li className="footer-text">{officeAddress}</li>}
            {hours && <li className="footer-text">{hours}</li>}
            <li><Link href="/contact">Contact page</Link></li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© 2026 {site.brand.name}. All rights reserved. Prices are indicative starting figures; confirm with the developer&apos;s cost sheet.</p>
        <ul className="footer-legal">
          {FOOTER_LINKS.legal.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}
        </ul>
        {site.imageCredits.map((c) => <p key={c} className="footer-credit">{c}</p>)}
      </div>
    </footer>
  );
}
