import type { MetadataRoute } from "next";
import { site } from "@/site.config";

const base = process.env.SITE_URL ?? "https://opalsquare.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/projects", "/localities", "/services", "/about", "/contact", "/faqs", "/privacy-policy", "/terms"];
  return [
    ...pages.map((p) => ({ url: `${base}${p}` })),
    ...site.projects.map((p) => ({ url: `${base}/projects/${p.slug}` })),
  ];
}
