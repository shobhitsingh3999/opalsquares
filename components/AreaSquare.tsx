"use client";

import { useId, useState } from "react";
import type { Project } from "@/lib/types";
import { formatSqft } from "@/lib/format";

const ROOM_W = 10; // ft — a common bedroom used as a yardstick
const ROOM_D = 12;

/**
 * Draws each configuration's carpet area as a true-to-scale square, next to a
 * 10 × 12 ft bedroom at the same scale, so sq ft figures become something you can picture.
 */
export default function AreaSquare({ project }: { project: Project }) {
  const configs = project.configurations.filter((c) => c.carpetAreaSqft);
  const [k, setK] = useState(0);
  const id = useId();
  if (configs.length === 0) return null;

  const current = configs[Math.min(k, configs.length - 1)];
  const area = current.carpetAreaSqft!;
  const side = Math.sqrt(area);
  const maxSide = Math.sqrt(Math.max(...configs.map((c) => c.carpetAreaSqft!)));
  // viewBox in feet, sized to the largest configuration so switching shows real differences.
  const pad = 2;
  const vbW = maxSide + ROOM_W + pad * 3;
  const vbH = Math.max(maxSide, ROOM_D) + pad * 2;
  const rooms = area / (ROOM_W * ROOM_D);
  const sideLabel = Math.round(side);

  return (
    <figure className="area">
      <figcaption className="area-caption">
        <span className="area-figure">{formatSqft(area)}</span> of carpet area is about a{" "}
        {sideLabel} × {sideLabel} ft square, the floor of roughly {rooms.toFixed(1)} bedrooms of {ROOM_W} × {ROOM_D} ft.
      </figcaption>

      {configs.length > 1 && (
        <div className="area-choices" role="radiogroup" aria-label="Show carpet area for">
          {configs.map((c, i) => (
            <button
              key={c.label}
              type="button"
              role="radio"
              aria-checked={i === k}
              className="area-choice"
              onClick={() => setK(i)}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      <svg
        className="area-drawing"
        viewBox={`0 0 ${vbW} ${vbH}`}
        role="img"
        aria-labelledby={`${id}-t`}
        preserveAspectRatio="xMinYMax meet"
      >
        <title id={`${id}-t`}>
          {`${current.label}: ${formatSqft(area)} drawn as a square beside a ${ROOM_W} by ${ROOM_D} foot bedroom, to the same scale.`}
        </title>
        <rect x={pad} y={vbH - pad - side} width={side} height={side} className="area-home" />
        <rect
          x={pad * 2 + maxSide}
          y={vbH - pad - ROOM_D}
          width={ROOM_W}
          height={ROOM_D}
          className="area-room"
        />
        <text x={pad + side / 2} y={vbH - pad - side / 2} className="area-label" textAnchor="middle" dominantBaseline="middle">
          {current.label}
        </text>
        <text x={pad * 2 + maxSide + ROOM_W / 2} y={vbH - pad - ROOM_D - 1.2} className="area-label-small" textAnchor="middle">
          {`${ROOM_W}×${ROOM_D} ft room`}
        </text>
      </svg>
      <p className="details-small">Drawn to scale for comparison. Real layouts are not square.</p>
    </figure>
  );
}
