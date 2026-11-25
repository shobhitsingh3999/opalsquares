import type { Project } from "./types";
import { configKeys, configSummary, startingPrice } from "./format";

export const BUDGETS = [
  { id: "u75l", label: "Up to ₹75 lakh", test: (n: number) => n <= 7.5e6 },
  { id: "75l-1.5c", label: "₹75 lakh – ₹1.5 crore", test: (n: number) => n > 7.5e6 && n <= 1.5e7 },
  { id: "1.5c-3c", label: "₹1.5 – ₹3 crore", test: (n: number) => n > 1.5e7 && n <= 3e7 },
  { id: "3c+", label: "Above ₹3 crore", test: (n: number) => n > 3e7 },
];

export type Filters = { q: string; locality: string; type: string; config: string; budget: string; status: string; sort: string };
export const EMPTY_FILTERS: Filters = { q: "", locality: "", type: "", config: "", budget: "", status: "", sort: "" };
export const FILTER_KEYS = Object.keys(EMPTY_FILTERS) as (keyof Filters)[];

const uniq = (xs: string[]) => [...new Set(xs)].sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

export function filterOptions(projects: Project[]) {
  return {
    locality: uniq(projects.map((p) => p.locality)),
    type: uniq(projects.map((p) => p.propertyType)),
    config: uniq(projects.flatMap(configKeys)),
    status: uniq(projects.map((p) => p.status).filter((v): v is NonNullable<typeof v> => !!v)),
    budget: BUDGETS.filter((b) =>
      projects.some((p) => {
        const n = startingPrice(p);
        return n !== null && b.test(n);
      }),
    ),
  };
}

export function matches(p: Project, f: Filters) {
  if (f.locality && p.locality !== f.locality) return false;
  if (f.type && p.propertyType !== f.type) return false;
  if (f.status && p.status !== f.status) return false;
  if (f.config && !configKeys(p).includes(f.config)) return false;
  if (f.budget) {
    const band = BUDGETS.find((b) => b.id === f.budget);
    const from = startingPrice(p);
    if (band && (from === null || !band.test(from))) return false;
  }
  if (f.q.trim()) {
    const hay = [p.name, p.locality, p.city, p.propertyType, p.developer ?? "", p.status ?? "", configSummary(p)]
      .join(" ")
      .toLowerCase();
    if (!f.q.toLowerCase().trim().split(/\s+/).every((t) => hay.includes(t))) return false;
  }
  return true;
}

/** Localities with how many projects each has and a cover image. */
export function localities(projects: Project[]) {
  const map = new Map<string, { name: string; city: string; count: number; image: Project["images"][number] | null }>();
  for (const p of projects) {
    const cur = map.get(p.locality);
    if (cur) cur.count++;
    else map.set(p.locality, { name: p.locality, city: p.city, count: 1, image: p.images[0] ?? null });
  }
  return [...map.values()];
}

/** Project counts per property type, e.g. [["Apartment", 3], ["Villa", 2]]. */
export function typeCounts(projects: Project[]): [string, number][] {
  const m = new Map<string, number>();
  for (const p of projects) m.set(p.propertyType, (m.get(p.propertyType) ?? 0) + 1);
  return [...m.entries()];
}

export const SORTS = [
  { id: "", label: "Recommended" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "possession", label: "Possession: soonest first" },
] as const;

/** "December 2027" → sortable number; ready-to-move first, unknown last. */
function possessionKey(p: Project) {
  if (p.status === "Ready to move") return 0;
  if (!p.possession) return Number.MAX_SAFE_INTEGER;
  const t = Date.parse(`1 ${p.possession}`);
  return Number.isNaN(t) ? Number.MAX_SAFE_INTEGER - 1 : t;
}

export function sortProjects(list: Project[], sort: string) {
  const out = [...list];
  const price = (p: Project) => startingPrice(p);
  if (sort === "price-asc") out.sort((a, b) => (price(a) ?? Infinity) - (price(b) ?? Infinity));
  if (sort === "price-desc") out.sort((a, b) => (price(b) ?? -Infinity) - (price(a) ?? -Infinity));
  if (sort === "possession") out.sort((a, b) => possessionKey(a) - possessionKey(b));
  return out;
}

/** Other projects to suggest on a project page: same locality or type first. */
export function similarProjects(all: Project[], p: Project, n = 3) {
  const score = (o: Project) => (o.locality === p.locality ? 2 : 0) + (o.propertyType === p.propertyType ? 1 : 0);
  return all.filter((o) => o.slug !== p.slug).sort((a, b) => score(b) - score(a)).slice(0, n);
}

export function projectsUrl(f: Partial<Filters>) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(f)) if (v) params.set(k, v);
  const qs = params.toString();
  return `/projects${qs ? `?${qs}` : ""}`;
}
