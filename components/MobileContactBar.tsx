"use client";

import { useEffect, useState } from "react";
import { site } from "@/site.config";
import { telHref, whatsappHref } from "@/lib/format";
import { IconPhone, IconUp, IconWhatsApp } from "./Icons";

/**
 * Floating actions: WhatsApp chat (all screens), back to top, and a Call bar on
 * phones once an approved phone number is configured.
 */
export default function MobileContactBar() {
  const { phone, whatsapp } = site.contact;
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="floaters">
        <button
          type="button"
          className={`to-top${show ? " is-visible" : ""}`}
          aria-label="Back to top"
          tabIndex={show ? 0 : -1}
          onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
        >
          <IconUp size={20} />
        </button>
        {whatsapp && (
          <a
            className="wa-float"
            href={whatsappHref(whatsapp, "Hello Opal Square, I would like to know more about your properties.")}
            target="_blank"
            rel="noopener"
            aria-label="Chat with us on WhatsApp (opens in a new tab)"
          >
            <IconWhatsApp size={26} />
            <span className="wa-float-label">Chat on WhatsApp</span>
          </a>
        )}
      </div>
      {phone && (
        <div className="mobile-bar" role="region" aria-label="Call us">
          <a className="btn btn-gold" href={telHref(phone)}>
            <IconPhone size={18} /> Call {phone}
          </a>
        </div>
      )}
    </>
  );
}
