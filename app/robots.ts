import type { MetadataRoute } from "next";
import { site } from "@/site.config";

const base = process.env.SITE_URL ?? "https://opalsquare.in";

export default function robots(): MetadataRoute.Robots {
  // While previewMode is on, keep the whole site out of search engines.
  if (site.previewMode) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/original"] }, sitemap: `${base}/sitemap.xml` };
}
