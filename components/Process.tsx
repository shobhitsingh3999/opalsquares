"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { site } from "@/site.config";

export default function Process() {
  const steps = site.process;
  const [active, setActive] = useState(0);
  if (!steps.length) return null;
  const img = steps[active].image;

  return (
    <section className="section process" aria-labelledby="process-title">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="kicker">How it works</p>
            <h2 id="process-title" className="h2">From enquiry to keys</h2>
          </div>
          <p className="section-lead">A simple, four-step journey with one advisor throughout.</p>
        </div>
        <div className="process-grid">
          <ol className="process-steps">
            {steps.map((s, i) => (
              <li key={s.title} className={i === active ? "is-active" : undefined}>
                <button type="button" className="process-step" aria-expanded={i === active} onClick={() => setActive(i)}>
                  <span className="process-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <span className="process-title">{s.title}</span>
                </button>
                <p className="process-desc" hidden={i !== active}>{s.description}</p>
              </li>
            ))}
          </ol>
          <div className="process-media">
            <Image key={img.src} src={img.src} alt={img.alt} width={img.width} height={img.height} sizes="(min-width: 900px) 50vw, 100vw" />
          </div>
        </div>
        <p className="process-cta">
          Ready to start? <Link href="/contact#enquire">Book a site visit</Link>
        </p>
      </div>
    </section>
  );
}
