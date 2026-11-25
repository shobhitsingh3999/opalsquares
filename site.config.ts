/**
 * Opal Square — the single place to edit business details, contact settings,
 * property data and image paths.
 *
 * Data source: the "Opal Square Properties Website Pack", copied to
 * content/source/. Figures the pack marks as unconfirmed or conflicting
 * (asking price, booking amount, areas, rates, price ranges, RERA numbers,
 * directory rating) stay ONLY in content/source/website-data.json.
 * Do not paste them here: this file is bundled into the browser JavaScript.
 *
 * Rules:
 * - Never publish a price, RERA number, possession date, review or phone number
 *   that you have not verified.
 * - Unknown values stay `null`; the site then shows "Price on request",
 *   hides the RERA block, and so on.
 * - Images live in /public. Give each one real width/height and useful alt text.
 */
import type { SiteConfig } from "@/lib/types";

export const site: SiteConfig = {
  // Keeps the site out of search engines and shows the preview banner.
  // Turn off once pending details are confirmed and the theme images are replaced.
  previewMode: true,

  brand: {
    name: "Opal Square",
    // The pack and its directory profile use "Opal Square Properties" (directory spelling:
    // "Opalsquare Properties"). The supplied logo file reads "OpalSquare Realty". Confirm one.
    legalName: "Opal Square Properties",
    // Generated from public/IMG_3542.png by scripts/make-logo.mjs (transparent background).
    logo: {
      onLight: { src: "/brand/logo-dark.png", alt: "Opal Square", width: 728, height: 160 },
      onDark: { src: "/brand/logo-light.png", alt: "Opal Square", width: 728, height: 160 },
      mark: { src: "/brand/mark.png", alt: "", width: 512, height: 512 },
    },
    description:
      "Opal Square Properties is a real estate and investment advisory firm based in Sector 70, Noida.",
  },

  hero: {
    headline: "Buy, sell or rent property in Noida",
    supporting:
      "We help clients buy, sell, rent and explore investment opportunities across residential and commercial properties in Noida and Greater Noida.",
    // Theme render from the current opalsquare.in site. Replace with your own photo.
    image: { src: "/images/hero.webp", alt: "", width: 1920, height: 1120 },
    highlights: [
      "Residential and commercial properties",
      "Noida, Greater Noida and Yamuna Expressway",
      "Buying, selling, rentals and investment advice",
    ],
  },

  contact: {
    phone: null, // Directory phone was masked. Add your call number if different from WhatsApp.
    whatsapp: "+917010101295",
    email: null, // TODO
    officeAddress: "Gate No. 02, Pan Oasis Society, Basi Bahuddin Nagar, Sector 70, Noida, Uttar Pradesh 201301",
    hours: null, // TODO, e.g. "Mon–Sat, 10am–7pm"
    contactPerson: "Anmol Sharma",
    mapUrl: "https://www.google.co.in/maps/dir//28.5974,77.3827",
    social: {
      instagram: "https://www.instagram.com/opalsquare_",
      linkedin: "https://www.linkedin.com/in/opal-square-realty-140b0044b",
    },
  },

  about: {
    statement: "Real estate and investment advice in Noida and Greater Noida",
    detail:
      "Opal Square Properties is a real estate and investment advisory firm based in Sector 70, Noida. We help clients buy, sell, rent, and explore investment opportunities across residential and commercial properties in Noida and Greater Noida.",
    services: [
      {
        title: "Buying",
        description:
          "We help you find a home or commercial space that fits your budget and preferred location, arrange site visits and support you through to booking.",
        tags: ["Flats", "Builder floors", "Villas", "Plots"],
      },
      {
        title: "Selling",
        description:
          "We help owners market their property, reach serious buyers and handle viewings and negotiations.",
        tags: ["Residential", "Commercial"],
      },
      {
        title: "Rentals and leasing",
        description:
          "We help tenants find homes and offices to rent, and help owners lease their property to the right occupant.",
        tags: ["Homes", "Offices", "Shops"],
      },
      {
        title: "Property investment advisory",
        description:
          "We help investors compare residential and commercial opportunities across Noida, Greater Noida and the Yamuna Expressway.",
        tags: ["Residential", "Commercial", "Land"],
      },
    ],
    serviceAreas: ["Noida", "Greater Noida", "Noida Extension", "Greater Noida West", "Techzone 4", "Yamuna Expressway"],
    propertyTypes: {
      residential: ["Flats and apartments", "Builder floors", "Farmhouses", "Residential plots", "Studio apartments", "Villas"],
      commercial: [
        "Shops",
        "Showrooms",
        "Office space",
        "Business centres",
        "Commercial plots",
        "Industrial land",
        "Hotels and restaurants",
        "Factories",
      ],
    },
  },


  // "How it works" images are theme renders from the current site. Replace with your own.
  process: [
    {
      title: "Tell us what you need",
      description: "Share whether you want to buy, sell, rent or invest, your budget and preferred area.",
      image: { src: "/images/project-13.webp", alt: "", width: 1500, height: 938 },
    },
    {
      title: "Get a call back",
      description: "We call you to understand your requirement and share options and current availability.",
      image: { src: "/images/project-14.webp", alt: "", width: 1500, height: 1000 },
    },
    {
      title: "Visit the property",
      description: "We arrange a site visit at a time that suits you and answer your questions on the spot.",
      image: { src: "/images/listings/sunwest-homes/photo-1.jpg", alt: "Sunwest Homes, Sector 107, Noida, under construction", width: 600, height: 800 },
    },
    {
      title: "Close with confidence",
      description: "We support you with paperwork, negotiation and the final booking or agreement.",
      image: { src: "/images/process-4.webp", alt: "", width: 1000, height: 659 },
    },
  ],

  faqs: [
    {
      question: "Which areas do you cover?",
      answer:
        "We work across Noida, Greater Noida, Noida Extension, Greater Noida West, Techzone 4 and the Yamuna Expressway. Our office is in Sector 70, Noida.",
    },
    {
      question: "Do you help with selling or renting out a property?",
      answer:
        "Yes. Besides helping buyers, we help owners sell or lease residential and commercial property, and help tenants find homes and offices to rent.",
    },
    {
      question: "Is the price shown the final price?",
      answer:
        "Where a price is shown it is a starting figure. The final cost usually adds charges such as GST on under-construction homes, stamp duty and registration, parking and maintenance deposits. Ask us for the cost sheet before you decide. Some listings show “Price on request” while we confirm the current figure.",
    },
    {
      question: "What does carpet area mean?",
      answer:
        "Under RERA, carpet area is the usable floor area inside the walls of the apartment, excluding external walls, service shafts, exclusive balconies and open terraces. Built-up and super built-up areas are larger because they add walls and shared spaces.",
    },
    {
      question: "How does a site visit work?",
      answer:
        "Send a request or message us on WhatsApp with the property you want to see. We call you to agree a time and meet you at the site. A preferred date is a request until we confirm it with you by phone.",
    },
    {
      question: "How do I check a project's RERA registration?",
      answer:
        "Once we have verified a project's registration, its page shows the RERA number and a link to the UP RERA portal, where you can see the approved plans and promised completion date.",
    },
  ],

  testimonials: [], // Add only approved, attributable quotes.
  developerAffiliations: [], // Add only formal affiliations.

  filtersFromCount: 5,

  projects: [
    {
      slug: "sunwest-homes-sector-107-noida",
      kind: "listing",
      name: "Sunwest Homes",
      title: "3 BHK Builder Floor at Sunwest Homes",
      preview: false,
      // Listed as the developer on the RealEstateIndia and Housing.com project pages. Confirm.
      developer: "Harvin Realty",
      locality: "Sector 107",
      city: "Noida",
      propertyType: "Builder floor",
      status: "Under construction",
      possession: null,
      summary:
        "Explore this 3 BHK builder floor at Sunwest Homes in Sector 107, Noida. The semi-furnished first-floor home includes three bathrooms, two balconies, a study, a modular kitchen, and a wardrobe. The gated development offers lift access, parking, and around-the-clock security. Enquire for current pricing, floor plans, and site visits.",
      // Price and area pending confirmation (the source listing has conflicting figures).
      configurations: [{ label: "3 BHK", carpetAreaSqft: null, priceFromInr: null }],
      images: [
        // Developer's official elevation render from the Sunwest Homes 107 project page
        // (owner: Harvin Realty). Confirm you have permission to use it.
        {
          src: "/images/listings/sunwest-homes/elevation.jpg",
          alt: "Sunwest Homes 107, Sector 107, Noida: artist's impression of the building",
          width: 795,
          height: 553,
          credit: "Artist's impression · Harvin Realty",
        },
        {
          src: "/images/listings/sunwest-homes/photo-1.jpg",
          alt: "Sunwest Homes, Sector 107, Noida, under construction",
          width: 600,
          height: 800,
          credit: "Site photo · construction in progress",
        },
        // On hold: these two marketing images print area figures (3 BHK 2350–2450 sq ft,
        // 4 BHK 2950–3050 sq ft) that conflict with the source listing. Move them into
        // this list once the areas are confirmed:
        //   { src: "/images/listings/sunwest-homes/photo-2.jpg", alt: "Sunwest Homes builder floors, artist's impression", width: 600, height: 600 },
        //   { src: "/images/listings/sunwest-homes/photo-3.jpg", alt: "Opal Square premium builder floors, Sector 107, artist's impression", width: 600, height: 600 },
      ],
      specs: [
        { label: "Bedrooms", value: "3" },
        { label: "Bathrooms", value: "3" },
        { label: "Balconies", value: "2" },
        { label: "Floor", value: "1st of 6" },
        { label: "Furnishing", value: "Semi-furnished (modular kitchen, wardrobe)" },
        { label: "Facing", value: "Northwest" },
        { label: "Ownership", value: "Freehold" },
        { label: "Sale type", value: "New" },
      ],
      amenities: ["Car parking", "24/7 security", "Lift", "Maintenance staff", "Vastu compliant", "Security/fire alarm"],
      features: ["Gated access", "Underground parking", "Rooftop green terrace", "Play and recreation areas", "Pet-friendly environment"],
      location: {
        address: "Sector 107, Noida",
        mapUrl: null,
        nearby: ["Sector 104 Market", "Yatharth Hospital", "Felix Hospital", "Noida–Greater Noida Expressway", "Aqua Line Metro"],
      },
      rera: null,
      pendingNote: "Price, area and availability are being confirmed. Enquire for current details.",
      // Source URL and unconfirmed figures: content/source/website-data.json (kept out of the browser bundle).
    },
    {
      slug: "cyberthum",
      kind: "project",
      name: "Cyberthum",
      preview: false,
      developer: null,
      locality: "Sector 140A",
      city: "Noida",
      propertyType: "Project",
      status: null,
      possession: null,
      summary:
        "Cyberthum is a project in Sector 140A, Noida. Enquire for current configurations, prices, availability and RERA details.",
      configurations: [],
      // Directory thumbnail (180×199). Replace with a larger official image when available.
      images: [{ src: "/images/highlighted/cyberthum.jpg", alt: "Cyberthum, Sector 140A, Noida", width: 180, height: 199 }],
      amenities: [],
      location: { address: "Sector 140A, Noida", mapUrl: null, nearby: [] },
      rera: null,
      pendingNote: "Configurations, prices and RERA details are being confirmed.",
      // Source URL and unconfirmed figures: content/source/website-data.json (kept out of the browser bundle).
    },
    {
      slug: "eon",
      kind: "project",
      name: "EON",
      preview: false,
      developer: null,
      locality: "Sector 140A",
      city: "Noida",
      propertyType: "Project",
      status: null,
      possession: null,
      summary:
        "EON is a project in Sector 140A, Noida. Enquire for current configurations, prices, availability and RERA details.",
      configurations: [],
      // Directory thumbnail (200×109). Replace with a larger official image when available.
      images: [{ src: "/images/highlighted/eon.jpg", alt: "EON, Sector 140A, Noida", width: 200, height: 109 }],
      amenities: [],
      location: { address: "Sector 140A, Noida", mapUrl: null, nearby: [] },
      rera: null,
      pendingNote: "Configurations, prices and RERA details are being confirmed.",
      // Source URL and unconfirmed figures: content/source/website-data.json (kept out of the browser bundle).
    },
  ],

  imageCredits: [
    "Banner and background images are architectural renders from the current opalsquare.in theme (OnePack demo content) and will be replaced. Property images are from Opal Square's listings.",
  ],
};
