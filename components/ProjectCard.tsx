import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { configSummary, formatSqft, priceLabel } from "@/lib/format";
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
  return (
    <article className="card">
      <Link href={href} className="card-media" tabIndex={-1} aria-hidden="true">
        {img ? (
          <Image src={img.src} alt="" width={img.width} height={img.height}
            sizes="(min-width: 1100px) 400px, (min-width: 700px) 50vw, 100vw" priority={priority} />
        ) : (
          <span className="media-missing">Photograph to come</span>
        )}
        {p.status && <span className="card-status">{p.status}</span>}
      </Link>
      <div className="card-body">
        <p className="card-type">
          {p.propertyType}
          {p.preview && <span className="card-preview">Preview listing</span>}
        </p>
        <h3 className="card-title">
          <Link href={href}>{p.name}</Link>
        </h3>
        <p className="card-loc">
          <IconPin size={15} /> {p.locality}, {p.city}
        </p>
        <dl className="card-facts">
          <div>
            <dt>Configuration</dt>
            <dd>{configSummary(p)}</dd>
          </div>
          <div>
            <dt>Carpet area</dt>
            <dd>{area ?? "On request"}</dd>
          </div>
          <div>
            <dt>Possession</dt>
            <dd>{p.status === "Ready to move" ? "Ready to move" : p.possession ?? "To be confirmed"}</dd>
          </div>
        </dl>
        <div className="card-foot">
          <p className="card-price">
            <span>Starting price</span>
            {priceLabel(p).replace(/^From /, "")}
          </p>
          <Link href={href} className="btn btn-dark btn-sm">
            View Details<span className="visually-hidden"> for {p.name}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
