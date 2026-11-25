"use client";

import { useEffect, useId, useRef, useState } from "react";
import { site } from "@/site.config";
import { GENERAL_PROPERTY, todayInIndia, validateEnquiry, type FieldErrors } from "@/lib/enquiry";
import { telHref, whatsappHref } from "@/lib/format";
import { IconCheck, IconWhatsApp } from "./Icons";

type Status = "idle" | "sending" | "sent" | "not_configured" | "error";

/**
 * Site-visit request form. Success is shown only when /api/enquiry reports that
 * the configured backend accepted the request.
 */
export default function EnquiryForm({
  defaultProperty = "",
  readPropertyFromUrl = false,
  title = "Book a site visit",
  lockProperty = false,
}: {
  defaultProperty?: string;
  readPropertyFromUrl?: boolean;
  title?: string;
  /** On a project page the property is fixed to that project. */
  lockProperty?: boolean;
}) {
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;
  const [property, setProperty] = useState(defaultProperty);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const statusRef = useRef<HTMLDivElement>(null);
  const [minDate, setMinDate] = useState<string | undefined>(undefined);
  const { phone, whatsapp } = site.contact;

  useEffect(() => {
    setMinDate(todayInIndia()); // eslint-disable-line react-hooks/set-state-in-effect
    if (readPropertyFromUrl) {
      const p = new URLSearchParams(window.location.search).get("property");
      if (p && (p === GENERAL_PROPERTY || site.projects.some((x) => x.slug === p))) setProperty(p);
    }
  }, [readPropertyFromUrl]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const check = validateEnquiry(data, site.projects.map((p) => p.slug));
    if (!check.ok) {
      setErrors(check.errors);
      form.querySelector<HTMLElement>(`[name="${Object.keys(check.errors)[0]}"]`)?.focus();
      return;
    }
    setErrors({});
    setStatus("sending");
    let next: Status = "error";
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok === true) {
        next = "sent";
        form.reset();
        if (!lockProperty) setProperty("");
      } else if (json.code === "invalid" && json.errors) {
        setErrors(json.errors);
        next = "idle";
      } else if (json.code === "not_configured") next = "not_configured";
    } catch {
      next = "error";
    }
    setStatus(next);
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  const describedBy = (k: keyof FieldErrors, hint?: string) =>
    [errors[k] ? id(`err-${k}`) : "", hint ?? ""].filter(Boolean).join(" ") || undefined;
  const locked = lockProperty ? site.projects.find((p) => p.slug === property) : null;

  if (status === "sent") {
    return (
      <div className="form-status form-status-ok" role="status" tabIndex={-1} ref={statusRef}>
        <span className="form-status-icon"><IconCheck size={22} /></span>
        <p className="form-status-title">Request received</p>
        <p>An advisor will call you to confirm the visit. Your preferred date is not booked until we confirm it with you.</p>
        <button type="button" className="btn btn-outline" onClick={() => setStatus("idle")}>Send another request</button>
      </div>
    );
  }

  return (
    <form className="enquiry-form" noValidate onSubmit={onSubmit} aria-labelledby={id("title")}>
      <p className="form-title" id={id("title")}>{title}</p>

      <div className="field">
        <label htmlFor={id("name")}>Name</label>
        <input id={id("name")} name="name" autoComplete="name" required maxLength={80} placeholder="Your full name"
          aria-invalid={!!errors.name} aria-describedby={describedBy("name")} />
        {errors.name && <p id={id("err-name")} className="field-error">{errors.name}</p>}
      </div>

      <div className="field">
        <label htmlFor={id("phone")}>Mobile number</label>
        <input id={id("phone")} name="phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder="98765 43210"
          aria-invalid={!!errors.phone} aria-describedby={describedBy("phone")} />
        {errors.phone && <p id={id("err-phone")} className="field-error">{errors.phone}</p>}
      </div>

      {locked ? (
        <>
          <input type="hidden" name="property" value={locked.slug} />
          <p className="field-locked">
            <span>Property</span>
            {locked.name}, {locked.locality}
          </p>
        </>
      ) : (
        <div className="field">
          <label htmlFor={id("property")}>Property</label>
          <select id={id("property")} name="property" required value={property} onChange={(e) => setProperty(e.target.value)}
            aria-invalid={!!errors.property} aria-describedby={describedBy("property")}>
            <option value="">Choose a property</option>
            {site.projects.map((p) => <option key={p.slug} value={p.slug}>{p.name}, {p.locality}</option>)}
            <option value={GENERAL_PROPERTY}>Not sure yet, help me choose</option>
          </select>
          {errors.property && <p id={id("err-property")} className="field-error">{errors.property}</p>}
        </div>
      )}

      <div className="field">
        <label htmlFor={id("date")}>Preferred date <span className="optional">(optional)</span></label>
        <input id={id("date")} name="preferredDate" type="date" min={minDate}
          aria-invalid={!!errors.preferredDate} aria-describedby={describedBy("preferredDate", id("date-hint"))} />
        <p id={id("date-hint")} className="field-hint">A request only. We confirm the actual time by phone.</p>
        {errors.preferredDate && <p id={id("err-preferredDate")} className="field-error">{errors.preferredDate}</p>}
      </div>

      <div className="hp" aria-hidden="true">
        <label htmlFor={id("website")}>Website</label>
        <input id={id("website")} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" className="btn btn-gold btn-block" disabled={status === "sending"} aria-busy={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send request"}
      </button>
      {whatsapp && (
        <a className="btn btn-wa btn-block" target="_blank" rel="noopener"
          href={whatsappHref(whatsapp, locked ? `Hello Opal Square, I'd like to visit ${locked.name} (${locked.locality}).` : "Hello Opal Square, I'd like to arrange a site visit.")}>
          <IconWhatsApp size={18} /> Or chat on WhatsApp
        </a>
      )}
      <p className="field-hint">
        By submitting, you agree to be contacted about this request. See our <a href="/privacy-policy">privacy policy</a>.
      </p>

      {(status === "not_configured" || status === "error") && (
        <div className="form-status form-status-warn" role="alert" tabIndex={-1} ref={statusRef}>
          <p className="form-status-title">Your request was not sent.</p>
          {status === "not_configured" ? (
            <p>
              Online requests are not switched on yet.{" "}
              {whatsapp ? <>Please message us on <a href={whatsappHref(whatsapp, "Hello Opal Square, I'd like to arrange a site visit.")} target="_blank" rel="noopener">WhatsApp</a> instead.</>
                : phone ? <>Please call <a href={telHref(phone)}>{phone}</a> instead.</> : "Please try again later."}
            </p>
          ) : (
            <p>Something went wrong on our side. Please try again in a moment.</p>
          )}
        </div>
      )}
    </form>
  );
}
