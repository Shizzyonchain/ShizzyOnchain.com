import type { NewsSource } from "./news-source";
import type { SubnetNewsBrief } from "./subnet-news";

export type SubnetTimelineEntry = {
  id: string; date: string; name: string; kind: "news" | "archive-name";
  headline: string; summary: string; status: string; rating?: number;
  sources: NewsSource[];
};
export function subnetTimeline(briefs: SubnetNewsBrief[], netuid: number) {
  const entries: SubnetTimelineEntry[] = [];
  let previous: { name: string; date: string } | null = null;
  const mentions = new RegExp(`\\bSN${netuid}(?!\\d)`, "i");
  for (const brief of [...briefs].sort((a, b) => a.date.localeCompare(b.date))) {
    const subnet = brief.subnets.find(row => row.netuid === netuid);
    const name = subnet?.name.trim() || `Subnet ${netuid}`;
    const placeholder = new RegExp(`^subnet\\s*${netuid}$|^(unknown|pending|unnamed)\\b|identity pending`, "i").test(name);
    const knownName = !!subnet && !placeholder;
    if (knownName && previous && previous.name.toLowerCase() !== name.toLowerCase()) {
      entries.push({ id: `name:${brief.date}`, date: brief.date, name, kind: "archive-name", status: "Archive observation",
        headline: `${previous.name} → ${name}`,
        summary: `Our report listed this slot as ${previous.name} on ${previous.date} and ${name} on ${brief.date}. These are archived report labels, not an independently verified on-chain rename time, ownership transfer or sale.`,
        sources: [{ label: `Earlier report · ${previous.date}`, url: `/subnet-news/${previous.date}` }, { label: `Later report · ${brief.date}`, url: `/subnet-news/${brief.date}` }] });
    }
    previous = knownName ? { name, date: brief.date } : null;
    const updates = [...(subnet?.updates || []), ...brief.ecosystem.filter(item => mentions.test(`${item.headline} ${item.summary}`))];
    for (const [index, item] of updates.entries()) entries.push({ id: `${brief.date}:${index}`, date: brief.date, name, kind: "news", headline: item.headline, summary: item.summary, status: item.status, rating: item.rating, sources: item.sources });
  }
  const seen = new Set<string>();
  return entries.sort((a, b) => b.date.localeCompare(a.date) || (a.kind === b.kind ? 0 : a.kind === "news" ? -1 : 1)).filter(entry => {
    const key = JSON.stringify([entry.kind, entry.headline, entry.summary]);
    if (seen.has(key)) return false;
    seen.add(key); return true;
  });
}
