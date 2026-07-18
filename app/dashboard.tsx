"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type ScreenerRow = {
  netuid: number; name?: string; symbol?: string; price_tao: string; tao_reserve?: string;
  alpha_out?: string; market_cap_tao?: string; volume_24h_tao?: string;
  change_1h?: string; change_24h?: string; change_7d?: string;
};
type Candle = { time: string; open: string; high: string; low: string; close: string; volume_tao?: string };
type Stake = { hotkey: string; netuid: number; alpha: string; tao_value?: string };
type Wallet = { address: string; free_tao: string; staked_tao_value?: string; total_tao_value?: string; stakes: Stake[]; error?: string };

const demoRows: ScreenerRow[] = [
  { netuid: 64, name: "Chutes", symbol: "α64", price_tao: "0.1842", market_cap_tao: "246812", tao_reserve: "18842", volume_24h_tao: "3284", change_1h: "1.84", change_24h: "8.42", change_7d: "24.8" },
  { netuid: 4, name: "Targon", symbol: "α4", price_tao: "0.0541", market_cap_tao: "184402", tao_reserve: "12770", volume_24h_tao: "2241", change_1h: "-0.74", change_24h: "3.18", change_7d: "12.4" },
  { netuid: 18, name: "Cortex.t", symbol: "α18", price_tao: "0.0328", market_cap_tao: "115092", tao_reserve: "9414", volume_24h_tao: "1628", change_1h: "2.14", change_24h: "-1.92", change_7d: "8.7" },
  { netuid: 8, name: "Proprietary", symbol: "α8", price_tao: "0.0194", market_cap_tao: "88430", tao_reserve: "7218", volume_24h_tao: "1102", change_1h: "0.38", change_24h: "6.51", change_7d: "-4.2" },
  { netuid: 1, name: "Apex", symbol: "α1", price_tao: "0.0147", market_cap_tao: "74611", tao_reserve: "6390", volume_24h_tao: "942", change_1h: "-1.12", change_24h: "-4.77", change_7d: "18.1" },
];

const fmt = (value?: string | number, digits = 2) => {
  const n = Number(value ?? 0);
  return n.toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: n < 1 ? Math.min(digits, 4) : 0 });
};
const changeClass = (v?: string) => Number(v ?? 0) >= 0 ? "positive" : "negative";

function PriceChart({ candles, row }: { candles: Candle[]; row?: ScreenerRow }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    const box = canvas.getBoundingClientRect();
    canvas.width = box.width * ratio; canvas.height = box.height * ratio;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    ctx.scale(ratio, ratio); ctx.clearRect(0, 0, box.width, box.height);
    let points = candles.map(c => Number(c.close));
    if (points.length < 2) {
      const base = Number(row?.price_tao || 0.05);
      points = Array.from({ length: 42 }, (_, i) => base * (0.88 + i * .004 + Math.sin(i / 2.7) * .035 + Math.cos(i / 7) * .018));
    }
    const min = Math.min(...points), max = Math.max(...points), pad = 16;
    const xy = points.map((p, i) => [pad + i * (box.width - pad * 2) / (points.length - 1), pad + (max - p) * (box.height - pad * 2) / Math.max(max - min, 1e-9)]);
    const grad = ctx.createLinearGradient(0, 0, 0, box.height); grad.addColorStop(0, "rgba(100,244,181,.28)"); grad.addColorStop(1, "rgba(100,244,181,0)");
    ctx.beginPath(); ctx.moveTo(xy[0][0], box.height); xy.forEach(([x,y]) => ctx.lineTo(x,y)); ctx.lineTo(xy.at(-1)![0], box.height); ctx.closePath(); ctx.fillStyle = grad; ctx.fill();
    ctx.beginPath(); xy.forEach(([x,y],i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y)); ctx.strokeStyle = "#64f4b5"; ctx.lineWidth = 2; ctx.stroke();
  }, [candles, row]);
  return <canvas ref={ref} className="price-canvas" aria-label={`Price chart for ${row?.name || "selected subnet"}`} />;
}

export function Dashboard() {
  const [view, setView] = useState<"screener" | "wallets">("screener");
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
      if (json.data?.length) { setRows(json.data); setSelected(json.data[0].netuid); setLive(true); }
    }).catch(() => setLive(false));
  }, []);
  useEffect(() => {
    const end = new Date(), start = new Date(end.getTime() - (timeframe === "1d" ? 30 : 7) * 86400000);
    fetch(`/api/backend/v1/subnets/${selected}/prices?interval=${timeframe}&start=${start.toISOString()}&end=${end.toISOString()}&limit=500`)
      .then(r => r.ok ? r.json() : Promise.reject()).then(json => setCandles(json.data || [])).catch(() => setCandles([]));
  }, [selected, timeframe]);

  const filtered = useMemo(() => rows.filter(r => `${r.netuid} ${r.name} ${r.symbol}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a,b) => Number(b[sort] ?? 0) - Number(a[sort] ?? 0)), [rows, query, sort]);
  const active = rows.find(r => r.netuid === selected) || rows[0];
  const totalMarket = rows.reduce((sum,r) => sum + Number(r.market_cap_tao || 0), 0);
  const totalVolume = rows.reduce((sum,r) => sum + Number(r.volume_24h_tao || 0), 0);
  const rankedMovers = [...rows].sort((a,b) => Number(b.change_24h || 0) - Number(a.change_24h || 0));

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
      <button className="brand" onClick={() => setView("screener")}><span className="brand-mark">S</span><span>SHIZZY<span className="accent">UNCHAINED</span></span></button>
      <nav aria-label="Primary navigation">
        <button className={view === "screener" ? "active" : ""} onClick={() => setView("screener")}>Market</button>
        <button className={view === "wallets" ? "active" : ""} onClick={() => setView("wallets")}>Wallet checker</button>
      </nav>
      <div className={`status ${live ? "live" : "demo"}`}><i />{live ? "Finney live" : "Preview data"}</div>
    </header>

    {view === "screener" ? <>
      <section className="hero-strip">
        <div><span>Subnet market cap</span><strong>τ {fmt(totalMarket,0)}</strong><small className="positive">↗ live indexed value</small></div>
        <div><span>24h volume</span><strong>τ {fmt(totalVolume,0)}</strong><small>Across {rows.length} markets</small></div>
        <div><span>Top mover</span><strong className="positive">{rankedMovers[0]?.name}</strong><small className="positive">+{fmt(rankedMovers[0]?.change_24h)}%</small></div>
        <div><span>Network</span><strong>FINNEY</strong><small>Finalized blocks only</small></div>
      </section>
      <section className="market-grid">
        <div className="chart-card panel">
          <div className="panel-head"><div><p className="eyebrow">SN{active?.netuid} · {active?.symbol || "ALPHA"}</p><h1>{active?.name || `Subnet ${active?.netuid}`}</h1></div><div className="quote"><strong>τ {fmt(active?.price_tao,6)}</strong><span className={changeClass(active?.change_24h)}>{Number(active?.change_24h || 0) >= 0 ? "+" : ""}{fmt(active?.change_24h)}%</span></div></div>
          <div className="timeframes">{["5m","15m","1h","4h","1d"].map(t => <button key={t} className={timeframe === t ? "active" : ""} onClick={() => setTimeframe(t)}>{t}</button>)}</div>
          <PriceChart candles={candles} row={active} />
          <div className="chart-stats"><span>Liquidity <b>τ {fmt(active?.tao_reserve,0)}</b></span><span>Market cap <b>τ {fmt(active?.market_cap_tao,0)}</b></span><span>24h vol <b>τ {fmt(active?.volume_24h_tao,0)}</b></span></div>
        </div>
        <aside className="movers panel"><div className="panel-title"><h2>Momentum</h2><span>24H</span></div>{rankedMovers.slice(0,5).map((r,i)=><button key={r.netuid} onClick={()=>setSelected(r.netuid)}><em>{String(i+1).padStart(2,"0")}</em><span><b>{r.name || `Subnet ${r.netuid}`}</b><small>SN{r.netuid}</small></span><strong className={changeClass(r.change_24h)}>{Number(r.change_24h)>=0?"+":""}{fmt(r.change_24h)}%</strong></button>)}</aside>
      </section>
      <section className="screener panel">
        <div className="screener-head"><div><p className="eyebrow">Bittensor markets</p><h2>Subnet screener</h2></div><label className="search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search subnet or netuid" /></label></div>
        <div className="table-wrap"><table><thead><tr><th>#</th><th>Subnet</th><th><button onClick={()=>setSort("price_tao")}>Price τ</button></th><th><button onClick={()=>setSort("change_1h")}>1H</button></th><th><button onClick={()=>setSort("change_24h")}>24H</button></th><th><button onClick={()=>setSort("change_7d")}>7D</button></th><th><button onClick={()=>setSort("volume_24h_tao")}>Volume</button></th><th><button onClick={()=>setSort("tao_reserve")}>Liquidity</button></th><th><button onClick={()=>setSort("market_cap_tao")}>Mkt cap</button></th></tr></thead>
        <tbody>{filtered.map((r,i)=><tr key={r.netuid} className={r.netuid===selected?"selected":""} onClick={()=>setSelected(r.netuid)}><td>{i+1}</td><td><span className="token">{r.symbol?.replace("α","") || r.netuid}</span><div><b>{r.name || `Subnet ${r.netuid}`}</b><small>SN{r.netuid}</small></div></td><td>τ {fmt(r.price_tao,6)}</td>{[r.change_1h,r.change_24h,r.change_7d].map((v,j)=><td key={j} className={changeClass(v)}>{Number(v||0)>=0?"+":""}{fmt(v)}%</td>)}<td>τ {fmt(r.volume_24h_tao,0)}</td><td>τ {fmt(r.tao_reserve,0)}</td><td>τ {fmt(r.market_cap_tao,0)}</td></tr>)}</tbody></table></div>
      </section>
    </> : <section className="wallet-page">
      <div className="wallet-intro"><p className="eyebrow">Portfolio intelligence</p><h1>See every wallet.<br/><span>See the whole position.</span></h1><p>Paste up to 100 Bittensor coldkeys. We’ll combine free TAO, alpha positions, subnet exposure, and spot-value estimates at one finalized block.</p></div>
      <form className="wallet-form panel" onSubmit={checkWallets}><label htmlFor="wallets">Coldkey addresses</label><textarea id="wallets" value={walletInput} onChange={e=>setWalletInput(e.target.value)} placeholder={"5F...\n5G...\n5H..."} /><div className="form-foot"><span>One per line, space, or comma</span><button disabled={checking}>{checking ? "Checking chain…" : "Check wallets →"}</button></div>{walletError && <p className="form-error">{walletError}</p>}</form>
      {wallets.length > 0 && <div className="portfolio-summary panel"><div><span>Total wallets</span><strong>{wallets.length}</strong></div><div><span>Free TAO</span><strong>τ {fmt(wallets.reduce((s,w)=>s+Number(w.free_tao||0),0),4)}</strong></div><div><span>Staked value</span><strong>τ {fmt(wallets.reduce((s,w)=>s+Number(w.staked_tao_value||0),0),4)}</strong></div><div><span>Total portfolio</span><strong className="accent">τ {fmt(wallets.reduce((s,w)=>s+Number(w.total_tao_value||0),0),4)}</strong></div></div>}
      <div className="wallet-results">{wallets.map(w=><article className="wallet-card panel" key={w.address}><div className="wallet-card-head"><span className="wallet-ident">{w.address.slice(0,6)}</span><div><b>{w.address.slice(0,12)}…{w.address.slice(-8)}</b><small>{w.stakes.length} positions</small></div><strong>τ {fmt(w.total_tao_value,4)}</strong></div><div className="wallet-split"><span>Free <b>τ {fmt(w.free_tao,4)}</b></span><span>Staked <b>τ {fmt(w.staked_tao_value,4)}</b></span></div><div className="positions">{w.stakes.slice(0,8).map((s,i)=><div key={`${s.hotkey}-${s.netuid}-${i}`}><span>SN{s.netuid}<small>{s.hotkey.slice(0,7)}…</small></span><span>{fmt(s.alpha,4)} α<small>τ {fmt(s.tao_value,4)}</small></span></div>)}</div></article>)}</div>
      {!wallets.length && <div className="wallet-empty"><div className="radar"><i/><i/><i/></div><p>Your combined portfolio will appear here.</p></div>}
    </section>}
    <footer><span>SHIZZYUNCHAINED</span><p>Finalized on-chain data · TAO values are spot estimates · Not financial advice</p><b>Built on Bittensor</b></footer>
  </main>;
}
