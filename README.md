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

## Data and what still needs confirming

Content comes from the **Opal Square Properties Website Pack**, copied to `content/source/`
(`website-data.json`, `image-sources.json`, `PACK-README.md`). That folder is never served or bundled.

On the site now: the About copy, services, service areas, property types, office address, map link and
contact person; the **Sunwest Homes** 3 BHK builder floor listing (details, amenities, features, nearby,
construction photo); and the highlighted projects **Cyberthum** and **EON** (Sector 140A).

Deliberately kept off the site until confirmed (they stay only in `content/source/website-data.json`):

1. **Sunwest Homes price and area.** Asking price ₹1.12 crore and booking amount ₹40 lakh are unconfirmed,
   and the source gives conflicting areas and rates (6,500 sq ft at ₹1,723/sq ft vs 1,880–2,050 sq ft 3 BHK
   at ₹5,999/sq ft). The page shows "Price on request" / "On request".
2. **Sunwest photos 2 and 3** (in `public/images/listings/sunwest-homes/`). They are marketing posters that
   print 3 BHK 2,350–2,450 sq ft and 4 BHK 2,950–3,050 sq ft, which conflict with the listing. Uncomment
   them in `site.config.ts` once the areas are confirmed.
3. **Cyberthum and EON** price ranges, configurations and RERA numbers (the directory only shows a RERA
   badge). Their images are 200 px directory thumbnails; replace them with larger official images.
4. **Directory claims**: 4.5 rating from 29 reviews, 7+ years' experience, team of up to 10. Not shown.
5. **Company name**: the pack uses "Opal Square Properties" (directory: "Opalsquare Properties"); the logo
   file reads "OpalSquare Realty". The site uses "Opal Square Properties". Confirm one.
6. **Contact**: WhatsApp +91 70101 01295 is set. Still missing: a call number (`phone`), `email`, `hours`.
7. **Banner and background images** (`public/images/hero.webp`, `project-*.webp`, `sketch.webp`,
   `services.webp`, `visit.webp`, `process-4.webp`) are OnePack theme demo renders from the old site.
   Replace them with your own photos.
8. **Enquiry webhook** (`ENQUIRY_WEBHOOK_URL`) so online requests are delivered.
9. **Privacy Policy and Terms** are drafts for legal review.

When these are done, set `previewMode: false` in `site.config.ts` (removes the banner and lets search
engines index the site). Search and filters on `/projects` turn on automatically at 5 or more items.

Important: `site.config.ts` is bundled into the browser JavaScript. Never put unconfirmed figures or
private notes in it, not even in fields that are not displayed.

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
