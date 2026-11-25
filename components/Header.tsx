"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/site.config";
import { telHref, whatsappHref } from "@/lib/format";
import { NAV } from "@/lib/nav";
import { IconPhone, IconWhatsApp } from "./Icons";

export default function Header() {
  const pathname = usePathname();
  const overHero = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation and on Escape.
  useEffect(() => setOpen(false), [pathname]); // eslint-disable-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = !overHero || scrolled || open;
  const { phone, whatsapp } = site.contact;
  const logo = site.brand.logo;
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className={`site-header${solid ? " is-solid" : ""}${overHero ? " is-overlay" : ""}`}>
      <div className="container header-inner">
        <Link href="/" className="logo" aria-label={`${site.brand.name} home`}>
          {logo ? (
            <>
              <Image className="logo-img logo-img-dark-bg" src={logo.onDark.src} alt="" width={logo.onDark.width} height={logo.onDark.height} priority />
              <Image className="logo-img logo-img-light-bg" src={logo.onLight.src} alt="" width={logo.onLight.width} height={logo.onLight.height} priority />
            </>
          ) : (
            <span className="logo-text">{site.brand.name}</span>
          )}
        </Link>

        <nav id="site-nav" aria-label="Main" className={open ? "is-open" : undefined}>
          <ul>
            {NAV.map((l) => (
              <li key={l.href}>
                <Link href={l.href} aria-current={isActive(l.href) ? "page" : undefined} onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link className="btn btn-gold nav-cta-mobile" href="/contact#enquire" onClick={() => setOpen(false)}>
            Book a Site Visit
          </Link>
        </nav>

        <div className="header-actions">
          {phone && (
            <a className="header-phone" href={telHref(phone)}>
              <IconPhone size={16} /> {phone}
            </a>
          )}
          {whatsapp && (
            <a className="header-wa" href={whatsappHref(whatsapp, "Hello Opal Square, I would like to know more about your properties.")}
              target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp (opens in a new tab)" title="WhatsApp">
              <IconWhatsApp size={20} />
            </a>
          )}
          <Link className="btn btn-gold btn-sm header-cta" href="/contact#enquire">
            Book a Site Visit
          </Link>
          <button type="button" className="menu-toggle" aria-expanded={open} aria-controls="site-nav"
            aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((v) => !v)}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
