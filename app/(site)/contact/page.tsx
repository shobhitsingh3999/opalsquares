import type { Metadata } from "next";
import { site } from "@/site.config";
import { telHref, whatsappHref } from "@/lib/format";
import PageHero from "@/components/PageHero";
import EnquiryForm from "@/components/EnquiryForm";
import { IconCheck, IconInstagram, IconLinkedIn, IconPhone, IconWhatsApp } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book a site visit or talk to an Opal Square advisor on WhatsApp.",
};

export default function ContactPage() {
  const { phone, whatsapp, email, officeAddress, hours, social } = site.contact;
  const prettyWa = whatsapp?.replace(/^\+91(\d{5})(\d{5})$/, "+91 $1 $2");
  return (
    <>
      <PageHero
        title="Contact us"
        intro="Book a site visit, or ask us anything about a project. An advisor will get back to you."
        crumbs={[{ label: "Contact" }]}
        image="/images/project-12.webp"
      />
      <section className="section section-tight" aria-label="Contact details and enquiry form">
        <div className="container contact-grid">
          <div className="contact-info">
            <h2 className="h2">Talk to an advisor</h2>
            <p className="lead">The quickest way to reach us is WhatsApp. Share the project or locality you are interested in.</p>
            <ul className="contact-cards">
              {whatsapp && (
                <li>
                  <span className="contact-icon contact-icon-wa"><IconWhatsApp size={22} /></span>
                  <div>
                    <p className="contact-label">WhatsApp</p>
                    <a href={whatsappHref(whatsapp, "Hello Opal Square, I would like to know more about your properties.")} target="_blank" rel="noopener">{prettyWa}</a>
                  </div>
                </li>
              )}
              {phone && (
                <li>
                  <span className="contact-icon"><IconPhone size={20} /></span>
                  <div><p className="contact-label">Phone</p><a href={telHref(phone)}>{phone}</a></div>
                </li>
              )}
              {email && (
                <li>
                  <span className="contact-icon">@</span>
                  <div><p className="contact-label">Email</p><a href={`mailto:${email}`}>{email}</a></div>
                </li>
              )}
              {officeAddress && (
                <li><span className="contact-icon">⌂</span><div><p className="contact-label">Office</p><p>{officeAddress}</p></div></li>
              )}
              {hours && (
                <li><span className="contact-icon">◷</span><div><p className="contact-label">Hours</p><p>{hours}</p></div></li>
              )}
            </ul>
            {(social.instagram || social.linkedin) && (
              <div className="contact-social">
                <p className="contact-label">Follow us</p>
                <div className="contact-social-links">
                  {social.instagram && <a href={social.instagram} target="_blank" rel="noopener"><IconInstagram size={18} /> Instagram</a>}
                  {social.linkedin && <a href={social.linkedin} target="_blank" rel="noopener"><IconLinkedIn size={17} /> LinkedIn</a>}
                </div>
              </div>
            )}
            <ul className="visit-points">
              <li><IconCheck size={16} /> We confirm availability before you travel</li>
              <li><IconCheck size={16} /> An advisor meets you at the site</li>
              <li><IconCheck size={16} /> Ask for the full cost sheet in advance</li>
            </ul>
          </div>
          <div className="contact-form-card" id="enquire">
            <EnquiryForm readPropertyFromUrl title="Book a site visit" />
          </div>
        </div>
      </section>
    </>
  );
}
