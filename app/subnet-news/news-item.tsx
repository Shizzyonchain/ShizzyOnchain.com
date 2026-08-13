import type { NewsItem as NewsItemType } from "../lib/subnet-news";

export function NewsItem({ item }: { item: NewsItemType }) {
  return (
    <article className={`news-item importance-${item.importance}`}>
      <div className="news-item-meta">
        <span>{item.importance === "high" ? "High signal" : item.importance === "medium" ? "Watch" : "Update"}</span>
        <em className={`status-${item.status}`}>{item.status}</em>
      </div>
      <h3>{item.headline}</h3>
      <p>{item.summary}</p>
      <div className="news-sources" aria-label="Sources">
        {item.sources.map((source) => (
          <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
            {source.label} <span aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </article>
  );
}
