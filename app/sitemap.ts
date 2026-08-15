import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://shizzyunchained.com";
  const pages = ["", "/activity", "/bubbles", "/wallet-tracker", "/subnet-news", "/deep-dives", "/about"];
  return pages.map((path, index) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: index === 0 ? "always" : index < 4 ? "daily" : "weekly",
    priority: index === 0 ? 1 : index < 4 ? 0.8 : 0.6,
  }));
}
