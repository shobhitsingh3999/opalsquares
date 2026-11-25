import { site } from "@/site.config";
import { GENERAL_PROPERTY, validateEnquiry } from "@/lib/enquiry";

/**
 * Site-visit enquiries.
 *
 * Configure ENQUIRY_WEBHOOK_URL (and optionally ENQUIRY_WEBHOOK_SECRET) to send
 * each request to your CRM, Zapier/Make, Google Apps Script, etc. The form
 * reports success only when that endpoint answers with a 2xx status.
 * Without it the API answers 503 "not_configured" and nothing is stored.
 */

const RECENT_MS = 10 * 60 * 1000;
const recent = new Map<string, number>(); // phone|property → time accepted (per server instance)

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, code: "bad_request" }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return Response.json({ ok: false, code: "rejected" }, { status: 400 });
  }

  const result = validateEnquiry(
    {
      name: String(body.name ?? ""),
      phone: String(body.phone ?? ""),
      property: String(body.property ?? ""),
      preferredDate: String(body.preferredDate ?? ""),
    },
    site.projects.map((p) => p.slug),
  );
  if (!result.ok) {
    return Response.json({ ok: false, code: "invalid", errors: result.errors }, { status: 422 });
  }

  const webhook = process.env.ENQUIRY_WEBHOOK_URL;
  if (!webhook) {
    return Response.json({ ok: false, code: "not_configured" }, { status: 503 });
  }

  const { value } = result;
  const key = `${value.phone}|${value.property}`;
  const now = Date.now();
  for (const [k, t] of recent) if (now - t > RECENT_MS) recent.delete(k);
  if (recent.has(key)) {
    // Same person, same property, already accepted by the backend a few minutes ago.
    return Response.json({ ok: true, duplicate: true });
  }

  const project = site.projects.find((p) => p.slug === value.property);
  const payload = {
    type: "site_visit_request",
    name: value.name,
    phone: value.phone,
    property:
      value.property === GENERAL_PROPERTY
        ? { slug: GENERAL_PROPERTY, name: "Not sure yet" }
        : { slug: project!.slug, name: project!.name, locality: project!.locality, city: project!.city },
    // A preference only: the advisor confirms the actual time by phone.
    preferredDate: value.preferredDate || null,
    submittedAt: new Date(now).toISOString(),
    source: "opalsquare-website",
  };

  try {
    const headers: Record<string, string> = { "content-type": "application/json" };
    if (process.env.ENQUIRY_WEBHOOK_SECRET) {
      headers.authorization = `Bearer ${process.env.ENQUIRY_WEBHOOK_SECRET}`;
    }
    const res = await fetch(webhook, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      return Response.json({ ok: false, code: "upstream_error" }, { status: 502 });
    }
  } catch {
    return Response.json({ ok: false, code: "upstream_error" }, { status: 502 });
  }

  recent.set(key, now);
  return Response.json({ ok: true });
}
