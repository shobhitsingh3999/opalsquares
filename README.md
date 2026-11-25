# Opal Square website

A multi-page real estate website for Opal Square Realty, built with Next.js 16 (App Router) and TypeScript.
No database: all content comes from one config file.

| Page | URL |
| --- | --- |
| Home (search, featured projects, localities, services, process, FAQs) | `/` |
| Projects listing (filters: search, type, locality, configuration, budget, status; sorting; shareable URLs) | `/projects` |
| Project page (gallery, key facts, prices, carpet area, amenities, location, RERA, enquiry form, similar projects) | `/projects/<slug>` |
| Localities | `/localities` |
| Services | `/services` |
| About | `/about` |
| Contact (site-visit form, WhatsApp, social) | `/contact` (`?property=<slug>` preselects a project) |
| FAQs | `/faqs` |
| Privacy Policy, Terms of Use (drafts for legal review) | `/privacy-policy`, `/terms` |
| Sitemap, robots | `/sitemap.xml`, `/robots.txt` |

The WhatsApp button floats on every page; each project page has its own WhatsApp message.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

Production check:

```bash
npm run build && npm start
npm run lint
npm run test:e2e     # after a build; uses your installed Google Chrome
```

`test:e2e` (54 checks) covers every page and the 404, mobile layout and menu, navigation, home search,
listing filters, sorting and shared links, the project page (gallery, carpet-area drawing, locked enquiry form,
WhatsApp message), and every enquiry outcome (no backend, accepted, backend error, server-side validation).

## Where to edit

Everything editable lives in **`site.config.ts`**:

| What | Where in `site.config.ts` |
| --- | --- |
| Name, logo (light/dark versions + favicon) | `brand` (regenerate from a new square logo with `node scripts/make-logo.mjs`) |
| Hero headline, sentence, photo, highlights | `hero` |
| "How it works" steps and images | `process` |
| Phone, WhatsApp, email, address, hours, Instagram/LinkedIn | `contact` |
| About text and services | `about` |
| FAQs | `faqs` |
| Testimonials / developer affiliations | `testimonials`, `developerAffiliations` (labelled placeholder slots in preview mode; hidden in production while empty) |
| Properties | `projects` (fields documented in `lib/types.ts`) |
| Photo credits | `imageCredits` |
| When search and filters appear | `filtersFromCount` (default: 5 or more projects) |

Put images in `public/` (for example `public/properties/<project>/facade.jpg`) and reference them as
`/properties/<project>/facade.jpg` with their real `width`, `height` and descriptive `alt`. Next.js serves
responsive sizes automatically.

How the page reacts to the data:

- **One project:** its details are shown directly on the page instead of a grid.
- **Fewer than `filtersFromCount` projects:** no search or filters. Each filter appears only when it has
  more than one option.
- **`priceFromInr: null`:** "Price on request". **`carpetAreaSqft: null`:** "To be confirmed".
- **`rera`:** shown only when `verified: true`, with the number and a link to the official state portal.
- **`floorPlan`:** "View plan" link per configuration; otherwise "Floor plans are available on request".
- **`contact.phone` / `contact.whatsapp`:** when set, Call and WhatsApp buttons appear (and a fixed bar
  on phones). While `null` they are hidden.

## Enquiries (site-visit requests)

The form posts to `/api/enquiry`, which validates on the server and forwards the request to a webhook.
**The visitor sees "Request received" only when your webhook answers with a 2xx status.** With no webhook
configured, the form says the request was not sent.

Set these environment variables (in `.env.local` locally, and in your host's settings in production):

```bash
ENQUIRY_WEBHOOK_URL=https://your-crm-or-automation-endpoint
ENQUIRY_WEBHOOK_SECRET=optional-shared-secret   # sent as "Authorization: Bearer …"
```

Payload sent to the webhook:

```json
{
  "type": "site_visit_request",
  "name": "Asha Rao",
  "phone": "+919876543210",
  "property": { "slug": "sample-project-a", "name": "Sample Project A", "locality": "Baner", "city": "Pune" },
  "preferredDate": "2026-12-05",
  "submittedAt": "2026-11-26T09:30:00.000Z",
  "source": "opalsquare-website"
}
```

`preferredDate` is a preference only. The page tells visitors the time is confirmed by phone. Phones are
normalised to `+91XXXXXXXXXX`. A hidden honeypot field rejects simple bots. The button is locked while
sending, and an identical request (same phone and property) is not forwarded twice within 10 minutes.

## Before launch: replace the preview data

The site currently runs in **preview mode**: a banner says listings are samples, and search engines are
told not to index it. Replace the following, then set `previewMode: false`:

1. **All six projects** in `projects`. Their names, localities, prices, carpet areas, possession dates,
   amenities and photos are placeholders. Set `preview: false` on each verified project.
2. **Images.** Everything in `public/images/` was copied from the current opalsquare.in site. They are the
   OnePack theme's demo renders, not Opal Square projects, and theme demo images are often not licensed for
   live use. Replace them with your own licensed photos (update `hero.image`, `process`, each project's
   `images`, and `imageCredits`).
3. **Logo.** Done: generated from `public/IMG_3542.png` into `public/brand/`.
4. **Contact details:** WhatsApp, Instagram and LinkedIn are set. Still empty: `phone` (Call buttons),
   `email`, `officeAddress`, `hours`.
5. **About copy, services, "Why Opal Square" points (`components/WhyUs.tsx`) and hero highlights.** They describe a typical buyer-side advisory; confirm they match what
   Opal Square actually offers and charges.
6. **FAQ answers.** These are general guidance. Check them against your process.
7. **RERA details** for each project, once verified on the state portal.
8. **Enquiry webhook** (`ENQUIRY_WEBHOOK_URL`).
9. **Footer year** in `components/Footer.tsx` (fixed at 2026).

Never publish a price, RERA number, possession date, review or phone number you have not verified.
Leave the field `null` instead.

## Project layout

```
site.config.ts                 all editable content
lib/types.ts                   data model (documented)
lib/catalog.ts                 filters, sorting, localities, similar projects
lib/format.ts                  ₹ lakh/crore, sq ft and status formatting
lib/enquiry.ts                 validation shared by form and API
lib/nav.ts                     header and footer links
app/(site)/                    all pages, layout and styles (site.css)
app/api/enquiry/route.ts       enquiry endpoint → webhook
app/global-not-found.tsx       branded 404 for unknown URLs
components/                    header, footer, cards, forms, sections
scripts/e2e.mjs                end-to-end checks
scripts/make-logo.mjs          builds transparent logo files from public/IMG_3542.png
app/(legacy)/original/         the earlier copy of the WordPress homepage at /original (can be deleted
                               with content/, public/wp-content, public/wp-includes and
                               scripts/sync-from-wordpress.mjs)
```

## Not included yet

AI chat, user accounts, shortlist/compare, booking calendars and blog/news. Set `SITE_URL` to your live
domain when you deploy (used for sitemap and social previews). Deployment has not been done.
