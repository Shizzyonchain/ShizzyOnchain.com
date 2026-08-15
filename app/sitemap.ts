import type { MetadataRoute } from "next";
import { getSubnetNewsBriefs } from "./lib/subnet-news";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://shizzyunchained.com";
  const pages = [
    "",
    "/activity",
    "/bubbles",
    "/wallet-tracker",
    "/subnet-news",
    "/deep-dives",
    "/deep-dives/bittensor-v440",
    "/deep-dives/compute-wars",
    "/video",
    "/university",
    "/partners",
    "/about",
  ];
  const staticPages: MetadataRoute.Sitemap = pages.map((path, index) => ({
    url: `${base}${path}`,
    changeFrequency: index === 0 ? "always" : index < 4 ? "daily" : "weekly",
    priority: index === 0 ? 1 : index < 4 ? 0.8 : 0.6,
  }));
  const newsPages: MetadataRoute.Sitemap = getSubnetNewsBriefs().map((brief) => ({
    url: `${base}/subnet-news/${brief.date}`,
    lastModified: new Date(brief.publishedAt),
    changeFrequency: "never",
    priority: 0.6,
  }));
  return [...staticPages, ...newsPages];
}
