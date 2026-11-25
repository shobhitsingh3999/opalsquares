import type { Project } from "./types";

const trim = (n: number) =>
  n.toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 0 });

/** 9200000 → "₹92 lakh", 12800000 → "₹1.28 crore". */
export function formatInr(amount: number): string {
  if (amount >= 1e7) return `₹${trim(amount / 1e7)} crore`;
  if (amount >= 1e5) return `₹${trim(amount / 1e5)} lakh`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function startingPrice(p: Project): number | null {
  const prices = p.configurations
    .map((c) => c.priceFromInr)
    .filter((v): v is number => typeof v === "number");
  return prices.length ? Math.min(...prices) : null;
}

export function priceLabel(p: Project): string {
  const from = startingPrice(p);
  return from === null ? "Price on request" : `From ${formatInr(from)}`;
}

export function configSummary(p: Project): string {
  return p.configurations.map((c) => c.label).join(", ");
}

export function statusLabel(p: Project): string | null {
  if (p.status === "Ready to move") return "Ready to move";
  if (p.possession && p.status) return `${p.status} · Possession ${p.possession}`;
  if (p.possession) return `Possession ${p.possession}`;
  return p.status;
}

export function formatSqft(n: number): string {
  return `${n.toLocaleString("en-IN")} sq ft`;
}

/** Bedroom counts in a project, e.g. ["2 BHK","3 BHK"] → ["2","3"]. Non-BHK labels are kept whole. */
export function configKeys(p: Project): string[] {
  return p.configurations.map((c) => {
    const m = c.label.match(/^(\d+(?:\.\d+)?)\s*BHK/i);
    return m ? `${m[1]} BHK` : c.label;
  });
}

export function telHref(e164: string) {
  return `tel:${e164.replace(/[^\d+]/g, "")}`;
}

export function whatsappHref(e164: string, text: string) {
  return `https://wa.me/${e164.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}
