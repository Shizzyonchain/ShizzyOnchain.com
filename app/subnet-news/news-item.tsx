import type { NewsItem as NewsItemType } from "../lib/subnet-news";

export function NewsItem({ item, rank, context }: { item: NewsItemType; rank?: number; context?: string }) {
  const rating = item.rating;
  return (
    <article className={`news-item importance-${item.importance}${rating === 5 ? " five-star" : ""}`}>
      <div className="news-item-meta">
        <span>{rank ? `#${String(rank).padStart(2, "0")}${context ? ` · ${context}` : ""}` : item.importance === "high" ? "High signal" : item.importance === "medium" ? "Watch" : "Update"}</span>
        <em className={`status-${item.status}`}>{item.status}</em>
      </div>
      {rating && <div className="news-rating" aria-label={`${rating} out of 5 stars`}><strong>{"★".repeat(rating)}</strong><i>{"★".repeat(5 - rating)}</i></div>}
      <h3>{item.headline}</h3>
      <p>{item.summary}</p>
      {item.ratingReason && <p className="rating-reason"><b>Why {rating} stars:</b> {item.ratingReason}</p>}
      {item.priceAction && <p className={`price-action ${item.priceAction.change24hPct >= 0 ? "positive" : "negative"}`}><b>{item.priceAction.change24hPct >= 0 ? "+" : ""}{item.priceAction.change24hPct.toFixed(1)}%</b> 24H price action <small>as of {new Date(item.priceAction.observedAt).toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" })} ET</small></p>}
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
