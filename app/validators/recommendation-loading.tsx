import styles from "./validators.module.css";

export function RecommendationLoading({ root = false }: { root?: boolean }) {
  return <div className={styles.recommendationLoading} role="status" aria-live="polite">
    <span className={styles.loadingSpinner} aria-hidden="true" />
    <div><strong>{root ? "Loading root validator recommendations…" : "Calculating validator recommendations…"}</strong>
      <p>{root ? "Retrieving prepared results for returns, risk and holdings." : "Comparing yield, participation, fees and concentration for your subnet."} You can keep browsing while this loads.</p>
    </div>
  </div>;
}
