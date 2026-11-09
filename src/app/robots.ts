import type { MetadataRoute } from "next";
import { site } from "@/content/site.ts";
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/__forms.html"] }, sitemap: `${site.url}/sitemap.xml` };
}
