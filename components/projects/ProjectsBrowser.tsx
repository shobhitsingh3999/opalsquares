"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { site } from "@/site.config";
import { EMPTY_FILTERS, FILTER_KEYS, SORTS, filterOptions, matches, sortProjects, type Filters } from "@/lib/catalog";
import ProjectCard from "../ProjectCard";
import { IconSearch } from "../Icons";

function readFilters(params: URLSearchParams | null): Filters {
  const f = { ...EMPTY_FILTERS };
  if (params) for (const k of FILTER_KEYS) f[k] = params.get(k) ?? "";
  return f;
}

/** Reads the filters from the URL (?locality=Baner&config=2+BHK) and renders the browser with them. */
export function ProjectsBrowserFromUrl() {
  const params = useSearchParams();
  return <ProjectsBrowser initial={readFilters(params)} />;
}

/** Listing with sidebar filters and sorting. Filters live in the URL so results can be shared. */
export default function ProjectsBrowser({ initial = EMPTY_FILTERS }: { initial?: Filters }) {
  const [filters, setFilters] = useState<Filters>(initial);
  const [panelOpen, setPanelOpen] = useState(false);
  const opts = useMemo(() => filterOptions(site.projects), []);

  const update = (patch: Partial<Filters>, replace = false) => {
    const next = replace ? { ...EMPTY_FILTERS, ...patch } : { ...filters, ...patch };
    setFilters(next);
    const qs = new URLSearchParams();
    for (const k of FILTER_KEYS) if (next[k]) qs.set(k, next[k]);
    const s = qs.toString();
    history.replaceState(null, "", `/projects${s ? `?${s}` : ""}`);
  };

  // With a small inventory, filters add nothing: show the items grouped by kind instead.
  if (site.projects.length < site.filtersFromCount) return <Grouped />;

  const results = sortProjects(site.projects.filter((p) => matches(p, filters)), filters.sort);
  const activeCount = FILTER_KEYS.filter((k) => k !== "sort" && filters[k]).length;

  return (
    <div className="browser">
      <aside className={`filters-panel${panelOpen ? " is-open" : ""}`} id="filters-panel" aria-label="Filter projects">
        <div className="filters-panel-head">
          <p className="filters-title">Filters</p>
          {activeCount > 0 && (
            <button type="button" className="link-btn" onClick={() => update({ sort: filters.sort }, true)}>Clear all</button>
          )}
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="filters-form">
          <label className="field">
            <span>Search</span>
            <span className="input-icon">
              <IconSearch size={18} />
              <input type="search" value={filters.q} onChange={(e) => update({ q: e.target.value })} placeholder="Project, locality or BHK" autoComplete="off" />
            </span>
          </label>

          {opts.type.length > 1 && (
            <fieldset className="field">
              <legend>Property type</legend>
              <div className="pill-group">
                {[["", "All"], ...opts.type.map((t) => [t, t])].map(([v, l]) => (
                  <button key={l} type="button" className="pill" aria-pressed={filters.type === v} onClick={() => update({ type: v })}>{l}</button>
                ))}
              </div>
            </fieldset>
          )}

          {opts.locality.length > 1 && (
            <Select label="Locality" value={filters.locality} onChange={(v) => update({ locality: v })} all="All localities" options={opts.locality.map((o) => [o, o])} />
          )}
          {opts.config.length > 1 && (
            <Select label="Configuration" value={filters.config} onChange={(v) => update({ config: v })} all="Any configuration" options={opts.config.map((o) => [o, o])} />
          )}
          {opts.budget.length > 1 && (
            <Select label="Budget (starting price)" value={filters.budget} onChange={(v) => update({ budget: v })} all="Any budget" options={opts.budget.map((b) => [b.id, b.label])} />
          )}
          {opts.status.length > 1 && (
            <fieldset className="field">
              <legend>Status</legend>
              <div className="pill-group">
                {[["", "Any"], ...opts.status.map((t) => [t, t])].map(([v, l]) => (
                  <button key={l} type="button" className="pill" aria-pressed={filters.status === v} onClick={() => update({ status: v })}>{l}</button>
                ))}
              </div>
            </fieldset>
          )}
          <button type="button" className="btn btn-dark btn-block filters-done" onClick={() => setPanelOpen(false)}>
            Show {results.length} {results.length === 1 ? "project" : "projects"}
          </button>
        </form>
      </aside>

      <div className="browser-main">
        <div className="results-bar">
          <p aria-live="polite">
            <strong>{results.length}</strong> {results.length === 1 ? "project" : "projects"} found
          </p>
          <div className="results-tools">
            <button type="button" className="btn btn-outline btn-sm filters-toggle" aria-expanded={panelOpen} aria-controls="filters-panel"
              onClick={() => setPanelOpen((v) => !v)}>
              Filters{activeCount ? ` (${activeCount})` : ""}
            </button>
            <label className="sort">
              <span>Sort by</span>
              <select value={filters.sort} onChange={(e) => update({ sort: e.target.value })}>
                {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </label>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="empty">
            <p className="empty-title">No projects match these filters.</p>
            <p>Try fewer filters, or <Link href="/contact#enquire">tell us what you are looking for</Link> and an advisor will shortlist for you.</p>
          </div>
        ) : (
          <div className="cards cards-2">
            {results.map((p, i) => <ProjectCard key={p.slug} project={p} priority={i < 2} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options, all }: {
  label: string; value: string; onChange: (v: string) => void; options: [string, string][]; all: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{all}</option>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );
}

function Grouped() {
  const groups = [
    { id: "for-sale", title: "Properties for sale", items: site.projects.filter((p) => p.kind === "listing") },
    { id: "highlighted", title: "Highlighted projects", items: site.projects.filter((p) => p.kind === "project") },
  ].filter((g) => g.items.length);
  return (
    <div className="grouped">
      {groups.map((g) => (
        <section key={g.id} id={g.id} aria-labelledby={`${g.id}-title`} className="group">
          <div className="results-bar">
            <h2 id={`${g.id}-title`} className="h3">{g.title}</h2>
            <p>{g.items.length} {g.items.length === 1 ? "item" : "items"}</p>
          </div>
          <div className="cards">
            {g.items.map((p, i) => <ProjectCard key={p.slug} project={p} priority={i < 2} />)}
          </div>
        </section>
      ))}
      <div className="empty">
        <p className="empty-title">Looking for something else?</p>
        <p>We deal in flats, builder floors, villas, plots and commercial property across Noida and Greater Noida. <Link href="/contact#enquire">Tell us what you need</Link> and we will share current options.</p>
      </div>
    </div>
  );
}
