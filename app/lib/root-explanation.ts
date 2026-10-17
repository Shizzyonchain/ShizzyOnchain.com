import type { rankRootMatches } from "./root-ranking";
type Ranked = ReturnType<typeof rankRootMatches>[number];
const pct = (value: number) => `${(value * 100).toFixed(2)}%`;
export function explainRootMatch(row: Ranked) {
  const measured = [pct(row.totalReturn), pct(row.drawdown), pct(row.volatility), `concentration index ${row.concentration.toFixed(3)}; top five holdings ${pct(row.topFive)}`, pct(row.quoteGap)];
  const why = [...row.factors].sort((a, b) => b.points - a.points || a.index - b.index).slice(0, 2).map(factor => `${factor.label}: ${measured[factor.index]}. Contributes ${factor.points.toFixed(1)} of ${factor.weight} available points in this preference.`);
  const watch: string[] = [];
  if (row.drawdown < 0) watch.push(`Capital fell ${pct(Math.abs(row.drawdown))} from a daily-close peak in this window. Intraday declines can be larger.`);
  else watch.push("No daily-close capital drawdown was recorded in this window; that does not establish protection from future losses or intraday declines.");
  const weaker = [...row.factors].filter(factor => factor.index !== 1 && factor.percentile < .5).sort((a, b) => a.percentile - b.percentile || a.index - b.index)[0];
  if (weaker) {
    const notes = ["Measured return is less favorable than the middle of this qualifying group.", "", "Daily capital volatility is higher than the middle of this qualifying group.", "Holdings concentration is higher than the middle of this qualifying group. The score uses all allocation weights, not only the top five.", "The spot-to-realizable gap is wider than the middle of this qualifying group; an individual exit can differ."];
    watch.push(`${notes[weaker.index]} ${measured[weaker.index]}.`);
  } else watch.push(`Top five holdings account for ${pct(row.topFive)} of realizable value. Different subnet holdings can still share market risks.`);
  watch.push(row.take > 0 ? `Current take is ${pct(row.take)}. Historical staker return already includes applied fees; future fee changes can alter returns.` : "Current take is 0%; this does not guarantee it will remain zero. Historical results do not establish future returns.");
  return { why, watch };
}
