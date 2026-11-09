import type { MetadataRoute } from "next";
import { projects } from "@/content/projects.ts";
import { site } from "@/content/site.ts";
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ["", "/work", "/about", "/contact", ...projects.map((p) => `/work/${p.slug}`)].map((p) => ({ url: `${site.url}${p}`, lastModified: now }));
}
