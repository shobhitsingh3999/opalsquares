export const NAV = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/localities", label: "Localities" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export const FOOTER_LINKS = {
  company: [
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/faqs", label: "FAQs" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Use" },
  ],
};

export const projectHref = (slug: string) => `/projects/${slug}`;
export const visitHref = (slug?: string) => (slug ? `/contact?property=${encodeURIComponent(slug)}#enquire` : "/contact#enquire");
