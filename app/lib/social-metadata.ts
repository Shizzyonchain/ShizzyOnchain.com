import type { Metadata } from "next";

export function socialCardPath(path: string) {
  return `/social/cards/${path === "/" ? "home" : path.slice(1).replaceAll("/", "--")}.png`;
}

// Next replaces nested metadata objects rather than filling missing fields.
// Supply complete OG and Twitter fields at each leaf to avoid home-page previews.
export function withSocialMetadata(metadata: Metadata, path: string, options: { imagePath?: string; article?: boolean; publishedTime?: string } = {}): Metadata {
  const title = typeof metadata.title === "string" ? metadata.title : "ShizzyUnchained";
  const description = metadata.description || "Bittensor research and market intelligence from ShizzyUnchained.";
  const university = path === "/university";
  const logo = university ? "Shiz University" : path === "/tao-heads" ? "Unchained TAO Heads" : "Shizzy Unchained";
  const image = { url: options.imagePath || (university ? "/social/shiz-university-black-v1.jpg" : socialCardPath(path)), width: 1200, height: 630, alt: `${title} — ${logo} logo on a black background` };
  return {
    ...metadata,
    alternates: { ...metadata.alternates, canonical: path },
    openGraph: { title, description, url: path, siteName: "ShizzyUnchained", images: [image], ...(options.article ? { type: "article", ...(options.publishedTime ? { publishedTime: options.publishedTime } : {}) } : { type: "website" }) },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
