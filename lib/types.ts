export type SiteImage = {
  /** Path under /public, e.g. "/properties/project-a/facade.jpg". */
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Configuration = {
  /** e.g. "2 BHK", "3 BHK + study", "Plot 1,200 sq ft". */
  label: string;
  /** RERA carpet area in sq ft. null = not yet confirmed. */
  carpetAreaSqft: number | null;
  /** Starting price in rupees (e.g. 9200000 for ₹92 lakh). null = price on request. */
  priceFromInr: number | null;
  /** Optional floor plan image. */
  floorPlan?: SiteImage | null;
};

export type Rera = {
  /** Registration number exactly as shown on the state RERA portal. */
  number: string;
  /** Link to the project's page (or search page) on the official state RERA portal. */
  portalUrl: string;
  /** Only verified registrations are shown on the site. */
  verified: boolean;
};

export type ProjectStatus = "New launch" | "Under construction" | "Ready to move";

export type Project = {
  /** URL-safe id, unique. */
  slug: string;
  name: string;
  /** true = sample data. Shows a "Preview listing" tag. Set false only for verified projects. */
  preview: boolean;
  developer: string | null;
  locality: string;
  city: string;
  /** e.g. "Apartment", "Villa", "Plot", "Office". */
  propertyType: string;
  status: ProjectStatus | null;
  /** e.g. "December 2027". null = not confirmed. */
  possession: string | null;
  /** One or two sentences. */
  summary: string;
  configurations: Configuration[];
  /** First image is the card image. */
  images: SiteImage[];
  amenities: string[];
  location: {
    address: string | null;
    /** Google Maps (or similar) link. */
    mapUrl: string | null;
    nearby: string[];
  };
  rera: Rera | null;
};

export type Service = { title: string; description: string; tags: string[] };
export type ProcessStep = { title: string; description: string; image: SiteImage };
export type Faq = { question: string; answer: string };

export type Testimonial = {
  quote: string;
  name: string;
  /** e.g. "Bought a 2 BHK in Baner, 2025". */
  context: string;
};

export type SiteConfig = {
  /** Shows the preview banner across the site. Turn off once all content is verified. */
  previewMode: boolean;
  brand: {
    name: string;
    /** Logo lockups for light and dark backgrounds, plus the square mark (favicon). null = text wordmark. */
    logo: { onLight: SiteImage; onDark: SiteImage; mark: SiteImage } | null;
    description: string;
  };
  hero: {
    headline: string;
    supporting: string;
    image: SiteImage;
    /** Three short points shown along the bottom of the hero. */
    highlights: string[];
  };
  contact: {
    /** E.164 without spaces, e.g. "+919876543210". null hides Call buttons. */
    phone: string | null;
    /** WhatsApp number in E.164, e.g. "+919876543210". null hides WhatsApp buttons. */
    whatsapp: string | null;
    email: string | null;
    officeAddress: string | null;
    hours: string | null;
    /** Profile links. null hides the icon. */
    social: { instagram: string | null; linkedin: string | null };
  };
  about: {
    statement: string;
    detail: string;
    services: Service[];
  };
  /** "How it works" steps, in order. */
  process: ProcessStep[];
  faqs: Faq[];
  /** Leave empty until you have approved, attributable quotes. Section is hidden when empty. */
  testimonials: Testimonial[];
  /** Developer names you are formally affiliated with. Hidden when empty. */
  developerAffiliations: string[];
  /** Show search and filters only when there are at least this many projects. */
  filtersFromCount: number;
  projects: Project[];
  /** Credits for photographs that are not your own. Shown in the footer. */
  imageCredits: string[];
};
