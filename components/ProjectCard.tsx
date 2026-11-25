import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { SMALL_IMAGE, configSummary, formatSqft, priceLabel } from "@/lib/format";
import { projectHref } from "@/lib/nav";
import { IconPin } from "./Icons";

function areaRange(p: Project) {
  const a = p.configurations.map((c) => c.carpetAreaSqft).filter((v): v is number => !!v);
  if (!a.length) return null;
  const lo = Math.min(...a);
  const hi = Math.max(...a);
  return lo === hi ? formatSqft(lo) : `${lo.toLocaleString("en-IN")}–${formatSqft(hi)}`;
}

export default function ProjectCard({ project: p, priority = false }: { project: Project; priority?: boolean }) {
  const area = areaRange(p);
  const href = projectHref(p.slug);
  const img = p.images[0];
  const small = img && img.width < SMALL_IMAGE;
  const status = p.status === "Ready to move" ? "Ready to move" : p.possession ? `Possession ${p.possession}` : p.status ?? "To be confirmed";

  return (
    <article className="card">
      <Link href={href} className={`card-media${small ? " card-media-contain" : ""}`} tabIndex={-1} aria-hidden="true">
        {img ? (
          <Image src={img.src} alt="" width={img.width} height={img.height}
            sizes={small ? `${img.width}px` : "(min-width: 1100px) 400px, (min-width: 700px) 50vw, 100vw"} priority={priority} />
        ) : (
          <span className="media-missing">Photograph to come</span>
        )}
        {p.status && <span className="card-status">{p.status}</span>}
      </Link>
      <div className="card-body">
        <p className="card-type">
          {p.kind === "project" ? "Highlighted project" : `For sale · ${p.propertyType}`}
          {p.preview && <span className="card-preview">Preview listing</span>}
        </p>
        <h3 className="card-title">
          <Link href={href}>{p.title ?? p.name}</Link>
        </h3>
        <p className="card-loc">
          <IconPin size={15} /> {p.title ? `${p.name}, ` : ""}{p.locality}, {p.city}
        </p>
        <dl className="card-facts">
          <div>
            <dt>Configuration</dt>
            <dd>{configSummary(p)}</dd>
          </div>
          <div>
            <dt>Area</dt>
            <dd>{area ?? "On request"}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{status}</dd>
          </div>
        </dl>
        {p.pendingNote && <p className="card-pending">{p.pendingNote}</p>}
        <div className="card-foot">
          <p className="card-price">
            <span>Price</span>
            {priceLabel(p)}
          </p>
          <Link href={href} className="btn btn-dark btn-sm">
            View Details<span className="visually-hidden"> for {p.name}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
