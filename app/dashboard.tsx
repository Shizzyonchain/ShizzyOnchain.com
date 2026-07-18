"use client";

import { FormEvent, PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from "react";

type ScreenerRow = {
  netuid: number; name?: string; symbol?: string; price_tao: string; tao_reserve?: string;
  alpha_out?: string; market_cap_tao?: string; volume_24h_tao?: string;
  change_10m?: string; change_1h?: string; change_24h?: string; change_7d?: string;
};
type Candle = { time: string; open: string; high: string; low: string; close: string; volume_tao?: string };
type Stake = { hotkey: string; netuid: number; name?: string; symbol?: string; alpha: string; tao_value?: string };
type Wallet = { address: string; free_tao: string; staked_tao_value?: string; total_tao_value?: string; stakes: Stake[]; error?: string };

const demoRows: ScreenerRow[] = [
  { netuid: 64, name: "Chutes", symbol: "α64", price_tao: "0.1842", market_cap_tao: "246812", tao_reserve: "18842", volume_24h_tao: "3284", change_10m: ".34", change_1h: "1.84", change_24h: "8.42", change_7d: "24.8" },
  { netuid: 4, name: "Targon", symbol: "α4", price_tao: "0.0541", market_cap_tao: "184402", tao_reserve: "12770", volume_24h_tao: "2241", change_10m: "-.12", change_1h: "-0.74", change_24h: "3.18", change_7d: "12.4" },
  { netuid: 18, name: "Cortex.t", symbol: "α18", price_tao: "0.0328", market_cap_tao: "115092", tao_reserve: "9414", volume_24h_tao: "1628", change_1h: "2.14", change_24h: "-1.92", change_7d: "8.7" },
  { netuid: 8, name: "Proprietary", symbol: "α8", price_tao: "0.0194", market_cap_tao: "88430", tao_reserve: "7218", volume_24h_tao: "1102", change_1h: "0.38", change_24h: "6.51", change_7d: "-4.2" },
  { netuid: 1, name: "Apex", symbol: "α1", price_tao: "0.0147", market_cap_tao: "74611", tao_reserve: "6390", volume_24h_tao: "942", change_1h: "-1.12", change_24h: "-4.77", change_7d: "18.1" },
];

const fmt = (value?: string | number, digits = 2) => {
  const n = Number(value ?? 0);
  return n.toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: n < 1 ? Math.min(digits, 4) : 0 });
};
const changeClass = (v?: string) => Number(v ?? 0) > 0 ? "positive" : Number(v ?? 0) < 0 ? "negative" : "neutral";

function PriceChart({ candles, row, currency, taoUsd }: { candles: Candle[]; row?: ScreenerRow; currency: "usd" | "tao"; taoUsd: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const visible = useMemo(() => candles.slice(-180), [candles]);
  const price = (value: string) => {
    const tao = Number(value || 0);
    if (currency === "tao") return `τ ${fmt(tao, 6)}`;
    if (!taoUsd) return "$—";
    const usd = tao * taoUsd;
    return usd.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: usd < 1 ? 4 : 2, maximumFractionDigits: usd < 1 ? 6 : 2 });
  };
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    const box = canvas.getBoundingClientRect();
    canvas.width = box.width * ratio; canvas.height = box.height * ratio;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    ctx.scale(ratio, ratio); ctx.clearRect(0, 0, box.width, box.height);
    if (!visible.length) return;
    const highs = visible.map(c => Number(c.high));
    const lows = visible.map(c => Number(c.low));
    const min = Math.min(...lows), max = Math.max(...highs), range = Math.max(max - min, max * .001, 1e-9);
    const padX = 16, padY = 18, usableW = box.width - padX * 2, usableH = box.height - padY * 2;
    const step = usableW / visible.length;
    const bodyW = Math.max(2, Math.min(11, step * .62));
    const y = (value: number) => padY + (max - value) * usableH / range;

    visible.forEach((c, i) => {
      const open = Number(c.open), high = Number(c.high), low = Number(c.low), close = Number(c.close);
      const x = padX + step * (i + .5);
      const color = close > open ? "#22c55e" : close < open ? "#ef4444" : "#ffffff";
      ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, y(high)); ctx.lineTo(x, y(low)); ctx.stroke();
      const top = Math.min(y(open), y(close));
      const height = Math.max(2, Math.abs(y(open) - y(close)));
      ctx.fillRect(x - bodyW / 2, top, bodyW, height);
    });

    if (hovered !== null && visible[hovered]) {
      const candle = visible[hovered];
      const x = padX + step * (hovered + .5), crossY = y(Number(candle.close));
      ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = "rgba(141,164,199,.65)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, padY); ctx.lineTo(x, box.height - padY); ctx.moveTo(padX, crossY); ctx.lineTo(box.width - padX, crossY); ctx.stroke(); ctx.restore();
    }
  }, [visible, hovered]);

  const move = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!visible.length) return;
    const box = event.currentTarget.getBoundingClientRect();
    const pad = 16;
    const x = Math.max(0, Math.min(box.width - pad * 2, event.clientX - box.left - pad));
    setHovered(Math.min(visible.length - 1, Math.floor(x / (box.width - pad * 2) * visible.length)));
  };
  const candle = hovered === null ? undefined : visible[hovered];
  const tooltipLeft = hovered === null || !visible.length ? 50 : Math.min(84, Math.max(16, ((hovered + .5) / visible.length) * 100));
  return <div className="chart-stage">
    <canvas ref={ref} className="price-canvas" aria-label={`Interactive candlestick price chart for ${row?.name || "selected subnet"}`} onPointerMove={move} onPointerLeave={() => setHovered(null)} />
    {!visible.length && <div className="chart-empty">Building candle history from your node…</div>}
    {candle && <div className="candle-tooltip" style={{ left: `${tooltipLeft}%` }}>
      <time>{new Date(candle.time).toLocaleString()}</time>
      <span><em>Open</em><b>{price(candle.open)}</b></span>
      <span><em>High</em><b>{price(candle.high)}</b></span>
      <span><em>Low</em><b>{price(candle.low)}</b></span>
      <span><em>Close</em><b>{price(candle.close)}</b></span>
    </div>}
  </div>;
}

export function Dashboard() {
  const [view, setView] = useState<"screener" | "wallets">("screener");
  const [currency, setCurrency] = useState<"usd" | "tao">("usd");
  const [taoUsd, setTaoUsd] = useState(0);
  const [rows, setRows] = useState<ScreenerRow[]>(demoRows);
  const [live, setLive] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<keyof ScreenerRow>("market_cap_tao");
  const [selected, setSelected] = useState(64);
  const [timeframe, setTimeframe] = useState("1h");
  const [candles, setCandles] = useState<Candle[]>([]);
  const [walletInput, setWalletInput] = useState("");
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [checking, setChecking] = useState(false);
  const [walletError, setWalletError] = useState("");

  useEffect(() => {
    fetch("/api/backend/v1/screener").then(r => r.ok ? r.json() : Promise.reject()).then(json => {
      const subnetMarkets = (json.data || []).filter((row: ScreenerRow) => row.netuid !== 0);
      if (subnetMarkets.length) { setRows(subnetMarkets); setSelected(subnetMarkets[0].netuid); setLive(true); }
    }).catch(() => setLive(false));
  }, []);
  useEffect(() => {
    fetch("/api/tao-price").then(r => r.ok ? r.json() : Promise.reject()).then(json => {
      const price = Number(json.usd);
      if (Number.isFinite(price) && price > 0) setTaoUsd(price);
    }).catch(() => undefined);
  }, []);
  useEffect(() => {
    const end = new Date();
    const windowMs = timeframe === "1m" ? 6 * 3600000 : timeframe === "10m" ? 2 * 86400000 : 14 * 86400000;
    const start = new Date(end.getTime() - windowMs);
    fetch(`/api/backend/v1/subnets/${selected}/prices?interval=${timeframe}&start=${start.toISOString()}&end=${end.toISOString()}&limit=500`)
      .then(r => r.ok ? r.json() : Promise.reject()).then(json => setCandles(json.data || [])).catch(() => setCandles([]));
  }, [selected, timeframe]);

  const filtered = useMemo(() => rows.filter(r => `${r.netuid} ${r.name} ${r.symbol}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a,b) => Number(b[sort] ?? 0) - Number(a[sort] ?? 0)), [rows, query, sort]);
  const active = rows.find(r => r.netuid === selected) || rows[0];
  const totalVolume = rows.reduce((sum,r) => sum + Number(r.volume_24h_tao || 0), 0);
  const rankedMovers = [...rows].sort((a,b) => Number(b.change_1h || 0) - Number(a.change_1h || 0));
  const money = (value?: string | number, price = false) => {
    const tao = Number(value ?? 0);
    if (currency === "tao") return `τ ${fmt(tao, price ? 6 : 4)}`;
    if (!taoUsd) return "$—";
    const usd = tao * taoUsd;
    return usd.toLocaleString("en-US", {
      style: "currency", currency: "USD",
      minimumFractionDigits: price && usd < 1 ? 4 : 0,
      maximumFractionDigits: price ? (usd < 1 ? 6 : 2) : 0,
    });
  };

  async function checkWallets(e: FormEvent) {
    e.preventDefault(); setWalletError("");
    const addresses = walletInput.split(/[\s,]+/).map(v => v.trim()).filter(Boolean);
    if (!addresses.length) return setWalletError("Paste at least one coldkey address.");
    setChecking(true);
    try {
      const res = await fetch("/api/backend/v1/wallets/mass-check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ addresses, persist: false }) });
      if (!res.ok) throw new Error(); const json = await res.json(); setWallets(json.data || []);
    } catch { setWalletError("The wallet service is not connected yet. Start the data pipeline, then try again."); }
    finally { setChecking(false); }
  }

  return <main className="shell">
    <header className="topbar">
      <button className="brand" onClick={() => setView("screener")} aria-label="Shizzy Unchained home">
        <img src="/shizzy-unchained-logo.svg" alt="Shizzy Unchained" />
      </button>
      <nav aria-label="Primary navigation">
        <button className={view === "screener" ? "active" : ""} onClick={() => setView("screener")}>Market</button>
        <button className={view === "wallets" ? "active" : ""} onClick={() => setView("wallets")}>Wallet checker</button>
      </nav>
      <div className="currency-toggle" role="group" aria-label="Display currency" title={taoUsd ? `1 TAO = ${taoUsd.toLocaleString("en-US", { style: "currency", currency: "USD" })}` : "Loading live TAO price"}>
        <button className={currency === "usd" ? "active" : ""} aria-pressed={currency === "usd"} onClick={() => setCurrency("usd")}>USD</button>
        <button className={currency === "tao" ? "active" : ""} aria-pressed={currency === "tao"} onClick={() => setCurrency("tao")}>TAO</button>
      </div>
      <div className={`status ${live ? "live" : "demo"}`}><i />{live ? "Finney live" : "Preview data"}</div>
    </header>

    {view === "screener" ? <>
      <section className="hero-strip">
        <div><span>TAO price</span><strong>{currency === "usd" ? money(1, true) : "τ 1"}</strong><small>Live spot price</small></div>
        <div><span>24h volume</span><strong>{money(totalVolume)}</strong><small>Across {rows.length} markets</small></div>
        <div><span>Top mover</span><strong className="positive">{rankedMovers[0]?.name}</strong><small className={changeClass(rankedMovers[0]?.change_1h)}>{Number(rankedMovers[0]?.change_1h || 0) > 0 ? "+" : ""}{fmt(rankedMovers[0]?.change_1h)}% · 1 Hour</small></div>
        <div><span>Network</span><strong>FINNEY</strong><small>Finalized blocks only</small></div>
      </section>
      <section className="market-grid">
        <div className="chart-card panel">
          <div className="panel-head"><div><p className="eyebrow">SN{active?.netuid} · {active?.symbol || "ALPHA"}</p><h1>{active?.name || `Subnet ${active?.netuid}`}</h1></div><div className="quote"><strong>{money(active?.price_tao, true)}</strong><span className={changeClass(active?.change_1h)}>{Number(active?.change_1h || 0) > 0 ? "+" : ""}{fmt(active?.change_1h)}% · 1 Hour</span></div></div>
          <div className="timeframes">{[{ value: "1m", label: "1 Minute" }, { value: "10m", label: "10 Minutes" }, { value: "1h", label: "1 Hour" }].map(t => <button key={t.value} className={timeframe === t.value ? "active" : ""} onClick={() => setTimeframe(t.value)}>{t.label}</button>)}</div>
          <PriceChart candles={candles} row={active} currency={currency} taoUsd={taoUsd} />
          <div className="chart-stats"><span>Liquidity <b>{money(active?.tao_reserve)}</b></span><span>Market cap <b>{money(active?.market_cap_tao)}</b></span><span>24h vol <b>{money(active?.volume_24h_tao)}</b></span></div>
        </div>
        <aside className="movers panel"><div className="panel-title"><h2>Momentum</h2><span>1 Hour</span></div>{rankedMovers.slice(0,5).map((r,i)=><button key={r.netuid} onClick={()=>setSelected(r.netuid)}><em>{String(i+1).padStart(2,"0")}</em><span><b>{r.name || `Subnet ${r.netuid}`}</b><small>SN{r.netuid}</small></span><strong className={changeClass(r.change_1h)}>{Number(r.change_1h)>0?"+":""}{fmt(r.change_1h)}%</strong></button>)}</aside>
      </section>
      <section className="screener panel">
        <div className="screener-head"><div><p className="eyebrow">Bittensor markets</p><h2>Subnet screener</h2></div><label className="search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search subnet or netuid" /></label></div>
        <div className="table-wrap"><table><thead><tr><th>#</th><th>Subnet</th><th><button onClick={()=>setSort("price_tao")}>Price {currency === "usd" ? "$" : "τ"}</button></th><th><button onClick={()=>setSort("change_10m")}>10 Minutes</button></th><th><button onClick={()=>setSort("change_1h")}>1 Hour</button></th><th><button onClick={()=>setSort("change_24h")}>1 Day</button></th><th><button onClick={()=>setSort("volume_24h_tao")}>Volume</button></th><th><button onClick={()=>setSort("tao_reserve")}>Liquidity</button></th><th><button onClick={()=>setSort("market_cap_tao")}>Mkt cap</button></th></tr></thead>
        <tbody>{filtered.map((r,i)=><tr key={r.netuid} className={r.netuid===selected?"selected":""} onClick={()=>setSelected(r.netuid)}><td>{i+1}</td><td><span className="token">{r.symbol?.replace("α","") || r.netuid}</span><div><b>{r.name || `Subnet ${r.netuid}`}</b><small>SN{r.netuid}</small></div></td><td>{money(r.price_tao, true)}</td>{[r.change_10m,r.change_1h,r.change_24h].map((v,j)=><td key={j} className={changeClass(v)}>{Number(v||0)>0?"+":""}{fmt(v)}%</td>)}<td>{money(r.volume_24h_tao)}</td><td>{money(r.tao_reserve)}</td><td>{money(r.market_cap_tao)}</td></tr>)}</tbody></table></div>
      </section>
    </> : <section className="wallet-page">
      <div className="wallet-intro"><p className="eyebrow">Portfolio intelligence</p><h1>See every wallet.<br/><span>See the whole position.</span></h1><p>Paste up to 100 Bittensor coldkeys. We’ll combine free TAO, alpha positions, subnet exposure, and spot-value estimates at one finalized block.</p></div>
      <form className="wallet-form panel" onSubmit={checkWallets}><label htmlFor="wallets">Coldkey addresses</label><textarea id="wallets" value={walletInput} onChange={e=>setWalletInput(e.target.value)} placeholder={"5F...\n5G...\n5H..."} /><div className="form-foot"><span>One per line, space, or comma</span><button disabled={checking}>{checking ? "Checking chain…" : "Check wallets →"}</button></div>{walletError && <p className="form-error">{walletError}</p>}</form>
      {wallets.length > 0 && <div className="portfolio-summary panel"><div><span>Total wallets</span><strong>{wallets.length}</strong></div><div><span>Free balance</span><strong>{money(wallets.reduce((s,w)=>s+Number(w.free_tao||0),0))}</strong></div><div><span>Staked value</span><strong>{money(wallets.reduce((s,w)=>s+Number(w.staked_tao_value||0),0))}</strong></div><div><span>Total portfolio</span><strong className="accent">{money(wallets.reduce((s,w)=>s+Number(w.total_tao_value||0),0))}</strong></div></div>}
      <div className="wallet-results">{wallets.map(w=><article className="wallet-card panel" key={w.address}><div className="wallet-card-head"><span className="wallet-ident">{w.address.slice(0,6)}</span><div><b>{w.address.slice(0,12)}…{w.address.slice(-8)}</b><small>{w.stakes.length} positions</small></div><strong>{money(w.total_tao_value)}</strong></div><div className="wallet-split"><span>Free <b>{money(w.free_tao)}</b></span><span>Staked <b>{money(w.staked_tao_value)}</b></span></div><div className="positions">{w.stakes.slice(0,8).map((s,i)=><div key={`${s.hotkey}-${s.netuid}-${i}`}><span><b>SN{s.netuid}</b><small>{s.name || s.hotkey.slice(0,7) + "…"}</small></span><span>{fmt(s.alpha,4)} α<small>{money(s.tao_value)}</small></span></div>)}</div></article>)}</div>
      {!wallets.length && <div className="wallet-empty"><div className="radar"><i/><i/><i/></div><p>Your combined portfolio will appear here.</p></div>}
    </section>}
    <footer><span>SHIZZYUNCHAINED</span><p>Finalized on-chain data · {currency === "usd" ? "USD values use the live TAO spot rate" : "TAO-denominated values"} · Not financial advice</p><b>Built on Bittensor</b></footer>
  </main>;
}
