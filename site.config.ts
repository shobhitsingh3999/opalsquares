/**
 * Opal Square — the single place to edit business details, contact settings,
 * property data and image paths.
 *
 * EVERYTHING MARKED "PREVIEW" IS SAMPLE CONTENT. Replace it with verified
 * information before launch, then set `previewMode: false` and each project's
 * `preview: false`. See README.md → "Before launch".
 *
 * Rules:
 * - Never publish a price, RERA number, possession date, review or phone number
 *   that you have not verified.
 * - Unknown values stay `null`; the site then shows "Price on request",
 *   hides the RERA block, hides Call/WhatsApp, and so on.
 * - Images live in /public. Give each one real width/height and useful alt text.
 */
import type { SiteConfig, SiteImage } from "@/lib/types";

// PREVIEW imagery: architectural renders copied from the current opalsquare.in
// site (OnePack theme demo assets). They are NOT Opal Square projects.
// Confirm you may use them, or replace them with your own licensed photography.
const SIZES: Record<number, [number, number]> = {
  1: [1500, 844], 2: [1500, 844], 3: [1500, 844], 4: [1500, 844], 5: [1500, 840], 6: [1500, 841],
  7: [1500, 840], 8: [1500, 840], 9: [1500, 840], 10: [1500, 1000], 11: [1500, 1000], 12: [1500, 1000],
  13: [1500, 938], 14: [1500, 1000],
};
const preview = (n: number, alt: string): SiteImage => ({
  src: `/images/project-${n}.webp`,
  alt,
  width: SIZES[n][0],
  height: SIZES[n][1],
});

export const site: SiteConfig = {
  previewMode: true,

  brand: {
    name: "Opal Square",
    // Generated from public/IMG_3542.png by scripts/make-logo.mjs (transparent background).
    logo: {
      onLight: { src: "/brand/logo-dark.png", alt: "Opal Square Realty", width: 728, height: 160 },
      onDark: { src: "/brand/logo-light.png", alt: "Opal Square Realty", width: 728, height: 160 },
      mark: { src: "/brand/mark.png", alt: "", width: 512, height: 512 },
    },
    description:
      "Opal Square is a real estate advisory for home buyers in India.",
  },

  hero: {
    headline: "Find the right home, then see it in person.",
    // PREVIEW copy — confirm it matches how you work.
    supporting:
      "Opal Square helps home buyers in India compare projects on carpet area, price and possession, and arranges site visits with an advisor.",
    image: {
      src: "/images/hero.webp",
      alt: "Preview image: a modern residence with large glass windows",
      width: 1920,
      height: 1120,
    },
    highlights: ["Carpet area on every listing", "Checked with the developer before your visit", "One advisor from shortlist to booking"],
  },

  contact: {
    phone: null, // TODO: approved number, e.g. "+919876543210"
    whatsapp: "+917010101295",
    email: null, // TODO
    officeAddress: null, // TODO
    hours: null, // TODO, e.g. "Mon–Sat, 10am–7pm"
    social: {
      instagram: "https://www.instagram.com/opalsquare_",
      linkedin: "https://www.linkedin.com/in/opal-square-realty-140b0044b",
    },
  },

  about: {
    // PREVIEW copy — rewrite with the services you actually offer.
    statement: "Advice on the buyer's side, from first shortlist to booking.",
    detail:
      "We narrow a crowded market to a few homes that fit your budget, preferred localities and possession timeline. Every listing is checked with the developer before we take you to it, and every price is a starting figure until you hold the cost sheet.",
    services: [
      {
        title: "Shortlisting",
        description:
          "We match projects to your budget, preferred localities and possession timeline, and explain the trade-offs between them.",
        tags: ["Budget", "Locality", "Possession"],
      },
      {
        title: "Accompanied site visits",
        description:
          "We schedule visits with the developer's sales team and come with you, so the questions that matter get asked on the spot.",
        tags: ["Scheduling", "On-site advice"],
      },
      {
        title: "Paperwork checks",
        description:
          "We help you read the cost sheet, the RERA registration and the agreement draft before you pay a booking amount.",
        tags: ["Cost sheet", "RERA", "Agreement"],
      },
      {
        title: "Booking support",
        description:
          "Once you choose, we coordinate the booking, payment schedule and loan paperwork with the developer.",
        tags: ["Booking", "Payment plan", "Loan documents"],
      },
    ],
  },

  process: [
    {
      title: "Tell us what you need",
      description: "Share your budget, preferred localities and configuration, or pick a project from this page.",
      image: { src: "/images/project-13.webp", alt: "Preview image: a modern house on the water", width: 1500, height: 938 },
    },
    {
      title: "Get a call back",
      description: "An advisor calls you, confirms availability with the developer and shares the cost sheet.",
      image: { src: "/images/project-14.webp", alt: "Preview image: a curved house among trees", width: 1500, height: 1000 },
    },
    {
      title: "Visit with an advisor",
      description: "We fix a time with the developer and meet you at the site to walk the home and the amenities.",
      image: { src: "/images/visit.webp", alt: "Preview image: an apartment building with glass balconies", width: 800, height: 952 },
    },
    {
      title: "Book with confidence",
      description: "When you decide, we help you check the paperwork and coordinate the booking and payment plan.",
      image: { src: "/images/process-4.webp", alt: "Preview image: a curved residence at dusk", width: 1000, height: 659 },
    },
  ],

  faqs: [
    {
      question: "Is the price shown the final price?",
      answer:
        "No. The figure on each listing is the starting price for the smallest configuration. The final cost usually adds GST on under-construction homes, stamp duty and registration, parking, and maintenance deposits. Ask us for the developer's cost sheet before you decide.",
    },
    {
      question: "What does carpet area mean?",
      answer:
        "Under RERA, carpet area is the usable floor area inside the walls of the apartment, excluding external walls, service shafts, exclusive balconies and open terraces. Developers must quote it, so it is the fairest figure for comparing homes. Built-up and super built-up areas are larger because they add walls and shared spaces.",
    },
    {
      question: "Is every listed unit still available?",
      answer:
        "Availability changes daily. We confirm the configuration, floor and price with the developer before your visit, and tell you if anything has changed since you enquired.",
    },
    {
      question: "How does a site visit work?",
      answer:
        "Send a request with the project you want to see. We call you to agree a time with the developer, then meet you at the site. A preferred date is a request until we confirm it with you by phone.",
    },
    {
      question: "How do I check a project's RERA registration?",
      answer:
        "Each verified listing shows its RERA registration number and a link to the official state portal. Search the number there to see the approved plans, the promised completion date and the developer's quarterly updates.",
    },
    {
      question: "Can you help with a home loan?",
      answer:
        "We can coordinate the documents the developer and your bank need. The loan decision and the interest rate always come from the lender.",
    },
  ],

  testimonials: [], // Add only approved, attributable quotes.
  developerAffiliations: [], // Add only formal affiliations.

  filtersFromCount: 5,

  // PREVIEW: six sample projects. Names, prices, areas, dates and amenities are
  // placeholders to show the layout. Replace with verified project data.
  projects: [
    {
      slug: "sample-project-a",
      name: "Sample Project A",
      preview: true,
      developer: null,
      locality: "Baner",
      city: "Pune",
      propertyType: "Apartment",
      status: "Under construction",
      possession: "December 2027",
      summary:
        "Placeholder listing. Mid-rise towers with two- and three-bedroom homes facing a central garden.",
      configurations: [
        { label: "2 BHK", carpetAreaSqft: 680, priceFromInr: 9200000 },
        { label: "3 BHK", carpetAreaSqft: 960, priceFromInr: 12800000 },
      ],
      images: [
        preview(1, "Preview image: apartment building with a curved white facade"),
        preview(7, "Preview image: curved residences set into a garden"),
      ],
      amenities: ["Clubhouse", "Swimming pool", "Children's play area", "Covered parking"],
      location: {
        address: null,
        mapUrl: null,
        nearby: ["Sample landmark: 10 minutes to a highway", "Sample landmark: schools nearby"],
      },
      rera: null,
    },
    {
      slug: "sample-project-b",
      name: "Sample Project B",
      preview: true,
      developer: null,
      locality: "Kharadi",
      city: "Pune",
      propertyType: "Apartment",
      status: "New launch",
      possession: "June 2029",
      summary: "Placeholder listing. A high-rise launch with compact homes near an office district.",
      configurations: [
        { label: "1 BHK", carpetAreaSqft: 450, priceFromInr: 6500000 },
        { label: "2 BHK", carpetAreaSqft: 720, priceFromInr: 9800000 },
      ],
      images: [
        preview(2, "Preview image: white curved building beside water"),
        preview(8, "Preview image: residence with a pool and glass walls"),
      ],
      amenities: ["Gym", "Co-working lounge", "Rooftop garden"],
      location: { address: null, mapUrl: null, nearby: [] },
      rera: null,
    },
    {
      slug: "sample-project-c",
      name: "Sample Project C",
      preview: true,
      developer: null,
      locality: "Kothrud",
      city: "Pune",
      propertyType: "Apartment",
      status: "Ready to move",
      possession: null,
      summary: "Placeholder listing. A completed building with larger family homes.",
      configurations: [
        { label: "3 BHK", carpetAreaSqft: 1120, priceFromInr: 18500000 },
        { label: "4 BHK", carpetAreaSqft: 1480, priceFromInr: null },
      ],
      images: [
        preview(3, "Preview image: family home with a pitched glass gable"),
        preview(9, "Preview image: concrete house with garden terraces"),
      ],
      amenities: ["Power backup", "Security", "Visitor parking"],
      location: { address: null, mapUrl: null, nearby: [] },
      rera: null,
    },
    {
      slug: "sample-project-d",
      name: "Sample Project D",
      preview: true,
      developer: null,
      locality: "Wakad",
      city: "Pune",
      propertyType: "Villa",
      status: "Under construction",
      possession: "March 2028",
      summary: "Placeholder listing. Row villas with private terraces.",
      configurations: [{ label: "4 BHK villa", carpetAreaSqft: 2100, priceFromInr: 32000000 }],
      images: [
        preview(4, "Preview image: villa with a broad stone staircase"),
        preview(10, "Preview image: villa with a glass sphere wing"),
      ],
      amenities: ["Private terrace", "Clubhouse", "Landscaped lanes"],
      location: { address: null, mapUrl: null, nearby: [] },
      rera: null,
    },
    {
      slug: "sample-project-e",
      name: "Sample Project E",
      preview: true,
      developer: null,
      locality: "Hinjewadi",
      city: "Pune",
      propertyType: "Apartment",
      status: "Under construction",
      possession: "September 2028",
      summary: "Placeholder listing. Two-bedroom homes near an IT park.",
      configurations: [
        { label: "2 BHK", carpetAreaSqft: 650, priceFromInr: 7400000 },
        { label: "2.5 BHK", carpetAreaSqft: 790, priceFromInr: 8900000 },
      ],
      images: [
        preview(5, "Preview image: residence with a long cantilevered roof"),
        preview(12, "Preview image: curved residence on a lake"),
      ],
      amenities: ["Jogging track", "Indoor games room"],
      location: { address: null, mapUrl: null, nearby: [] },
      rera: null,
    },
    {
      slug: "sample-project-f",
      name: "Sample Project F",
      preview: true,
      developer: null,
      locality: "Viman Nagar",
      city: "Pune",
      propertyType: "Office",
      status: "Ready to move",
      possession: null,
      summary: "Placeholder listing. Small office units for owner-occupiers.",
      configurations: [{ label: "Office unit", carpetAreaSqft: 540, priceFromInr: null }],
      images: [
        preview(11, "Preview image: curved white building in a dry landscape"),
        preview(6, "Preview image: terrace with an infinity pool"),
      ],
      amenities: ["Lift lobby", "Power backup"],
      location: { address: null, mapUrl: null, nearby: [] },
      rera: null,
    },
  ],

  imageCredits: [
    "Preview images are architectural renders from the current opalsquare.in theme (OnePack demo content). Replace before launch.",
  ],
};
