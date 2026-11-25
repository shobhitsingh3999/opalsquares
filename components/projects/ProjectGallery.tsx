"use client";

import Image from "next/image";
import { useState } from "react";
import type { SiteImage } from "@/lib/types";
import { SMALL_IMAGE } from "@/lib/format";
import { IconArrow } from "../Icons";

/** Images narrower than this are shown whole (letterboxed) rather than upscaled to fill the wide frame. */
const FILL_MIN_WIDTH = 1100;

export default function ProjectGallery({ images, name }: { images: SiteImage[]; name: string }) {
  const [i, setI] = useState(0);
  const n = images.length;
  if (n === 0) return <div className="gallery-missing">Photographs to come</div>;
  const img = images[Math.min(i, n - 1)];
  const go = (d: number) => setI((v) => (v + d + n) % n);

  return (
    <div
      className="pgallery"
      role="group"
      aria-roledescription="gallery"
      aria-label={`${name} photographs`}
      onKeyDown={(e) => {
        if (n < 2) return;
        if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
        if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
      }}
    >
      {/* Small or portrait images are shown whole on a neutral background instead of being cropped or stretched. */}
      <div className={`pgallery-main${img.width < FILL_MIN_WIDTH || img.height > img.width ? " pgallery-contain" : ""}${img.width < SMALL_IMAGE ? " pgallery-small" : ""}`}>
        <Image key={img.src} src={img.src} alt={img.alt} width={img.width} height={img.height} priority
          sizes={img.width < SMALL_IMAGE ? `${img.width}px` : "(min-width: 1320px) 1280px, 100vw"} />
        {n > 1 && (
          <>
            <button type="button" className="pgallery-nav pgallery-prev" onClick={() => go(-1)} aria-label="Previous photograph">
              <IconArrow size={18} className="flip" />
            </button>
            <button type="button" className="pgallery-nav pgallery-next" onClick={() => go(1)} aria-label="Next photograph">
              <IconArrow size={18} />
            </button>
            <p className="pgallery-count" aria-live="polite">{i + 1} of {n}</p>
          </>
        )}
        {img.credit && <p className="pgallery-credit">{img.credit}</p>}
      </div>
      {n > 1 && (
        <ul className="pgallery-thumbs">
          {images.map((t, k) => (
            <li key={t.src}>
              <button type="button" aria-label={`Show photograph ${k + 1}: ${t.alt}`} aria-current={k === i} onClick={() => setI(k)}>
                <Image src={t.src} alt="" width={t.width} height={t.height} sizes="160px" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
