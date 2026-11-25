/** Shared by the form (client) and /api/enquiry (server). */

export const GENERAL_PROPERTY = "not-sure";

export type EnquiryInput = {
  name: string;
  phone: string;
  property: string;
  preferredDate: string;
};

export type FieldErrors = Partial<Record<keyof EnquiryInput, string>>;

/** Accepts 10-digit Indian mobiles with optional +91 / 91 / 0 prefix, spaces or dashes. Returns +91XXXXXXXXXX or null. */
export function normalisePhone(raw: string): string | null {
  const digits = raw.replace(/[\s\-().]/g, "");
  const m = digits.match(/^(?:\+?91|0)?([6-9]\d{9})$/);
  return m ? `+91${m[1]}` : null;
}

/** Today in India (YYYY-MM-DD), regardless of server timezone. */
export function todayInIndia(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function validateEnquiry(
  input: Partial<EnquiryInput>,
  validProperties: string[],
): { ok: true; value: EnquiryInput } | { ok: false; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const name = (input.name ?? "").trim().replace(/\s+/g, " ");
  const phoneRaw = (input.phone ?? "").trim();
  const property = (input.property ?? "").trim();
  const preferredDate = (input.preferredDate ?? "").trim();

  if (name.length < 2) errors.name = "Enter your name.";
  else if (name.length > 80) errors.name = "Name is too long.";

  const phone = normalisePhone(phoneRaw);
  if (!phoneRaw) errors.phone = "Enter your mobile number.";
  else if (!phone) errors.phone = "Enter a 10-digit Indian mobile number.";

  if (!property) errors.property = "Choose a property, or “Not sure yet”.";
  else if (property !== GENERAL_PROPERTY && !validProperties.includes(property))
    errors.property = "Choose a property from the list.";

  if (preferredDate) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate) || Number.isNaN(Date.parse(preferredDate)))
      errors.preferredDate = "Enter a valid date.";
    else if (preferredDate < todayInIndia())
      errors.preferredDate = "Choose today or a later date.";
  }

  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, value: { name, phone: phone!, property, preferredDate } };
}
