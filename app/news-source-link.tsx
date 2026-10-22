import type { NewsSource } from "./lib/news-source";

export function NewsSourceLink({ source }: { source: NewsSource }) {
 if (source.availability === "unavailable") return <span className="news-source-unavailable"><strong>{source.label} · original evidence unavailable</strong><small>{source.unavailableReason}</small>{source.checkedAt && <small>Checked {new Date(source.checkedAt).toLocaleDateString("en-US", { timeZone: "UTC", dateStyle: "medium" })} UTC</small>}</span>;
 return <a href={source.url} target="_blank" rel="noopener noreferrer">{source.label} <span aria-hidden="true">↗</span></a>;
}
