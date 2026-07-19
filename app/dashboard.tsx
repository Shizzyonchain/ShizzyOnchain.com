"use client";

import { CSSProperties, FormEvent, PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type ScreenerRow = {
  netuid: number; name?: string; symbol?: string; price_tao: string; tao_reserve?: string;
  alpha_out?: string; market_cap_tao?: string; volume_24h_tao?: string;
  emission_pct?: string; apy?: string; conviction_locked_alpha?: string; conviction_locked_pct?: string;
  change_10m?: string; change_1h?: string; change_24h?: string; change_7d?: string;
};
type Candle = { time: string; open: string; high: string; low: string; close: string; volume_tao?: string };
type Stake = { hotkey: string; netuid: number; name?: string; symbol?: string; alpha: string; tao_value?: string };
type Wallet = { address: string; free_tao: string; staked_tao_value?: string; total_tao_value?: string; stakes: Stake[]; error?: string };

const channelVideos = [
  { id: "AuUwiV1r_cs", title: "Bittensor TAO: Patience Pays Off", meta: "20:39 · Latest episode" },
  { id: "tdZGVfadd00", title: "The 10 to 100 TAO Challenge Is Getting Dangerous. Week 9", meta: "22:45" },
  { id: "6oSJxSfVUBk", title: "The Bittensor Move No One Is Ready For", meta: "26:35" },
  { id: "E8sZrmYiQ5Y", title: "The Trade Everyone Missed. Week 8 of the 10 to 100 TAO Challenge", meta: "23:48" },
  { id: "AymnXq08VDM", title: "Bittensor Subnet Update: Subnet Summer Is Canceled?", meta: "24:46" },
  { id: "beZ18Hdka0Q", title: "Week 7: 10 to 100 TAO Challenge. I’m Not Giving Up!", meta: "22:36" },
  { id: "pFPd1BoUe00", title: "Bittensor Subnet Update: Move Fast and Break People", meta: "24:23" },
  { id: "X3n7DVacpJA", title: "Week 6: 10 TAO to 100 TAO Challenge | Down But Not Out", meta: "22:30" },
];
const liveStreams = [
  { id: "ealfKQI1q2g", title: "ChronoLLM SN38: The AI That Never Cheats Time", meta: "51:47 · Streamed 3 days ago" },
  { id: "T0BbzWFS7EE", title: "Bittensor Subnet Update with Crypto Millie", meta: "1:35:16 · Streamed 5 days ago" },
  { id: "EJMXtvxC6Qo", title: "AI That Finds DNA Mutations: Minos SN107", meta: "1:03:36 · Streamed 11 days ago" },
  { id: "F3ogKcX3xpE", title: "Leadpoet SN71 Deep Dive with Gavin Zaentz", meta: "58:46 · Streamed 2 weeks ago" },
  { id: "wyif_M_zbwg", title: "Bittensor Subnet 85 VIDAIO: AI Video Enhancement", meta: "42:43 · Streamed 3 weeks ago" },
  { id: "rvfP0aSEGkQ", title: "Live With Tom From Bitcast and Stitch3", meta: "44:15 · Streamed 1 month ago" },
  { id: "_DAintx1Zfs", title: "Live with Mark Jeffrey", meta: "1:21:33 · Streamed 1 month ago" },
  { id: "qxr-Q9d9Elw", title: "Bittensor’s Special K Live", meta: "48:22 · Streamed 1 month ago" },
];
const universityCourses = [
  { number: "01", title: "Bittensor Subnets 101", tag: "Foundation", bestFor: "Best for Bittensor beginners", description: "Understand miners, validators, emissions, alpha, subnet economics, and how the Bittensor network fits together.", outcome: "Leave with a practical framework for evaluating what a subnet actually does.", lessons: ["How subnets work", "Reading emissions and incentives", "Finding real utility"] },
  { number: "02", title: "Build the Best Subnet Portfolio", tag: "Portfolio", bestFor: "Best for active subnet investors", description: "Turn subnet research into a focused portfolio built around conviction, sizing, risk, and a repeatable decision process.", outcome: "Leave with a clearer research, sizing, and portfolio-review process.", lessons: ["Subnet research framework", "Position sizing and risk", "Portfolio reviews"] },
  { number: "03", title: "Content Creation Strategies", tag: "Creator", bestFor: "Best for creators and founders", description: "Learn Shizzy’s system for finding ideas, building authority, packaging stories, and publishing content people actually watch.", outcome: "Leave with a repeatable content workflow you can begin using immediately.", lessons: ["Ideas that earn attention", "Titles, hooks, and structure", "Consistent publishing"] },
  { number: "04", title: "Crypto Security & Wallet Safety", tag: "Security", bestFor: "Best for protecting digital assets", description: "Protect your TAO and digital assets with practical wallet separation, transaction hygiene, and scam-resistant habits.", outcome: "Leave with a personal wallet-safety checklist and stronger transaction habits.", lessons: ["Cold and hot wallet setup", "Transaction safety", "Threats and recovery plans"] },
];
const stripeCheckout = "https://buy.stripe.com/fZudRb3u5dkA7Y45RNfAc00";
// Scheduling is never exposed publicly. TAO buyers submit a transaction hash first.
const universityCalendly = "mailto:shizzyunchained@gmail.com?subject=Shiz%20University%20TAO%20payment&body=Transaction%20hash%3A%0A%0ABittensor%20wallet%20address%3A%0A%0AClass%20name%3A";
const universityWallet = "5Gsp2ZkPSCpdscVem8NsE6qEUyjEGSf6YtKx6j1hy1ToG9VM";
const partners = [
  { key: "mentat", name: "Mentat", kicker: "TAO delegation", description: "Automated Bittensor staking strategies designed to keep your TAO delegated across strong validator opportunities.", href: "https://mentatminds.com/?origin=ShizzyUnchained", cta: "Explore Mentat" },
  { key: "alphagap", name: "Alpha Gap", kicker: "Subnet intelligence", description: "AI-powered Bittensor research tracking development, market signals, whale activity, emissions, and all active subnets.", href: "https://www.alphagap.io/?ref=SHIZ", cta: "Find the Alpha Gap" },
  { key: "ledger", name: "Ledger", kicker: "Hardware security", description: "Protect and manage crypto with a secure hardware wallet and the Ledger ecosystem built for self-custody.", href: "https://shop.ledger.com/?r=49c0bef9b376", cta: "Shop Ledger" },
  { key: "nord", name: "NordVPN", kicker: "Online privacy", description: "Add an encrypted layer of protection to your internet connection across desktop, mobile, and public networks.", href: "https://go.nordvpn.net/aff_c?offer_id=15&aff_id=145365&source=Shizzy", cta: "Get NordVPN" },
];

const fmt = (value?: string | number, digits = 2) => {
  const n = Number(value ?? 0);
  return n.toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: n < 1 ? Math.min(digits, 4) : 0 });
};
const changeClass = (v?: string) => Number(v ?? 0) > 0 ? "positive" : Number(v ?? 0) < 0 ? "negative" : "neutral";

function PriceChart({ candles, row, currency, taoUsd, timeframe, valueCurrency = "tao" }: { candles: Candle[]; row?: ScreenerRow; currency: "usd" | "tao"; taoUsd: number; timeframe: string; valueCurrency?: "tao" | "usd" }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(1000);
  const visible = useMemo(() => candles.slice(-180), [candles]);
  const sparse = visible.length > 1 && visible.length < 24;
  const layout = (width: number) => {
    const pad = 16;
    const usable = Math.max(1, width - pad * 2);
    const step = usable / Math.max(visible.length, 1);
    const start = pad;
    return { pad, usable, step, start };
  };
  const price = (value: string) => {
    const raw = Number(value || 0);
    if (valueCurrency === "usd") return raw.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const tao = raw;
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
    const { pad: padX, step, start } = layout(box.width);
    const padY = 18, bottomY = box.height - 28, usableH = bottomY - padY;
    const bodyW = Math.max(2, Math.min(14, step * .62));
    const y = (value: number) => padY + (max - value) * usableH / range;

    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(38,85,132,.35)";
    for (let line = 0; line < 4; line++) {
      const gridY = padY + usableH * line / 3;
      ctx.beginPath(); ctx.moveTo(padX, gridY); ctx.lineTo(box.width - padX, gridY); ctx.stroke();
    }

    if (sparse) {
      const points = visible.map((c, i) => ({ x: start + step * (i + .5), y: y(Number(c.close)) }));
      const rising = Number(visible.at(-1)?.close) >= Number(visible[0]?.close);
      const color = rising ? "#22c55e" : "#ef4444";
      const fill = ctx.createLinearGradient(0, padY, 0, bottomY);
      fill.addColorStop(0, rising ? "rgba(34,197,94,.2)" : "rgba(239,68,68,.18)");
      fill.addColorStop(1, "rgba(2,8,23,0)");
      ctx.beginPath(); ctx.moveTo(points[0].x, bottomY);
      points.forEach(point => ctx.lineTo(point.x, point.y));
      ctx.lineTo(points.at(-1)!.x, bottomY); ctx.closePath();
      ctx.fillStyle = fill; ctx.fill();
      ctx.beginPath();
      points.forEach((point, i) => i ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = color;
      points.forEach(point => { ctx.beginPath(); ctx.arc(point.x, point.y, 2.5, 0, Math.PI * 2); ctx.fill(); });
    } else {
      visible.forEach((c, i) => {
        const open = Number(c.open), high = Number(c.high), low = Number(c.low), close = Number(c.close);
        const x = start + step * (i + .5);
        const color = close > open ? "#22c55e" : close < open ? "#ef4444" : "#ffffff";
        ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, y(high)); ctx.lineTo(x, y(low)); ctx.stroke();
        const top = Math.min(y(open), y(close));
        const height = Math.max(2, Math.abs(y(open) - y(close)));
        ctx.fillRect(x - bodyW / 2, top, bodyW, height);
      });
    }

    ctx.fillStyle = "rgba(141,164,199,.75)";
    ctx.font = "10px monospace";
    const firstLabel = new Date(visible[0].time).toLocaleString([], { month: "short", day: "numeric", hour: "numeric" });
    const lastLabel = new Date(visible.at(-1)!.time).toLocaleString([], { month: "short", day: "numeric", hour: "numeric" });
    ctx.textAlign = "left"; ctx.fillText(firstLabel, padX, box.height - 7);
    ctx.textAlign = "right"; ctx.fillText(lastLabel, box.width - padX, box.height - 7);

    if (hovered !== null && visible[hovered]) {
      const candle = visible[hovered];
      const x = start + step * (hovered + .5), crossY = y(Number(candle.close));
      ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = "rgba(141,164,199,.65)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, padY); ctx.lineTo(x, box.height - padY); ctx.moveTo(padX, crossY); ctx.lineTo(box.width - padX, crossY); ctx.stroke(); ctx.restore();
    }
  }, [visible, hovered, sparse, currency, taoUsd, valueCurrency]);

  const move = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!visible.length) return;
    const box = event.currentTarget.getBoundingClientRect();
    setCanvasWidth(box.width);
    const { step, start } = layout(box.width);
    const x = event.clientX - box.left;
    setHovered(Math.max(0, Math.min(visible.length - 1, Math.floor((x - start) / step))));
  };
  const candle = hovered === null ? undefined : visible[hovered];
  const tooltipLayout = layout(canvasWidth);
  const tooltipLeft = hovered === null || !visible.length ? 50 : Math.min(84, Math.max(16, (tooltipLayout.start + tooltipLayout.step * (hovered + .5)) / canvasWidth * 100));
  return <div className="chart-stage">
    <canvas ref={ref} className="price-canvas" aria-label={`Interactive candlestick price chart for ${row?.name || "selected subnet"}`} onPointerMove={move} onPointerLeave={() => setHovered(null)} />
    {!visible.length && <div className="chart-empty">Building candle history from your node…</div>}
    {sparse && <div className="chart-history-note">History building · {visible.length} {timeframe === "1d" ? "daily" : timeframe === "1h" ? "hourly" : timeframe === "10m" ? "10-minute" : "minute"} candles</div>}
    {candle && <div className="candle-tooltip" style={{ left: `${tooltipLeft}%` }}>
      <time>{new Date(candle.time).toLocaleString()}</time>
      <span><em>Open</em><b>{price(candle.open)}</b></span>
      <span><em>High</em><b>{price(candle.high)}</b></span>
      <span><em>Low</em><b>{price(candle.low)}</b></span>
      <span><em>Close</em><b>{price(candle.close)}</b></span>
    </div>}
  </div>;
}

export type DashboardView = "screener" | "bubbles" | "wallets" | "videos" | "university" | "partners";

export function Dashboard({ initialView = "screener" }: { initialView?: DashboardView }) {
  const [view, setView] = useState<DashboardView>(initialView);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(channelVideos[0]);
  const [checkoutCourse, setCheckoutCourse] = useState<(typeof universityCourses)[number] | null>(null);
  const [walletCopied, setWalletCopied] = useState(false);
  const [currency, setCurrency] = useState<"usd" | "tao">("usd");
  const [taoUsd, setTaoUsd] = useState(0);
  const [rows, setRows] = useState<ScreenerRow[]>([]);
  const [dataState, setDataState] = useState<"loading" | "live" | "error">("loading");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<keyof ScreenerRow>("market_cap_tao");
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");
  const [selected, setSelected] = useState(64);
  const [showTaoChart, setShowTaoChart] = useState(false);
  const [timeframe, setTimeframe] = useState("1h");
  const [bubbleTimeframe, setBubbleTimeframe] = useState<"change_10m" | "change_1h" | "change_24h">("change_1h");
  const [bubbleOffsets, setBubbleOffsets] = useState<Record<number, { x: number; y: number }>>({});
  const [draggingBubble, setDraggingBubble] = useState<number | null>(null);
  const chartCardRef = useRef<HTMLDivElement>(null);
  const bubbleCloudRef = useRef<HTMLElement>(null);
  const bubbleDragRef = useRef<{ netuid: number; pointerId: number; startX: number; startY: number; offsetX: number; offsetY: number; minX: number; maxX: number; minY: number; maxY: number; moved: boolean } | null>(null);
  const suppressBubbleClick = useRef(false);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [walletInput, setWalletInput] = useState("");
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [checking, setChecking] = useState(false);
  const [walletError, setWalletError] = useState("");

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("view");
    if (requested === "wallets" || requested === "videos" || requested === "university" || requested === "screener" || requested === "bubbles" || requested === "partners") queueMicrotask(() => setView(requested));
  }, []);

  useEffect(() => {
    try {
      const cached = JSON.parse(window.localStorage.getItem("shizzy:screener") || "null");
      const cachedRows = Array.isArray(cached?.data)
        ? cached.data.filter((row: ScreenerRow) => row.netuid !== 0)
        : [];
      if (cachedRows.length && Date.now() - Number(cached.savedAt || 0) < 10 * 60_000) {
        setRows(cachedRows);
        setSelected(current => cachedRows.some((row: ScreenerRow) => row.netuid === current) ? current : cachedRows[0].netuid);
        setDataState("live");
        setLastUpdated(new Date(cached.savedAt));
      }
    } catch {
      window.localStorage.removeItem("shizzy:screener");
    }
    const refreshMarkets = () => {
      fetch("/api/backend/v1/screener", { cache: "no-store" }).then(r => r.ok ? r.json() : Promise.reject()).then(json => {
        const subnetMarkets = (json.data || []).filter((row: ScreenerRow) => row.netuid !== 0);
        if (subnetMarkets.length) {
          window.localStorage.setItem("shizzy:screener", JSON.stringify({ data: json.data, savedAt: Date.now() }));
          setRows(subnetMarkets);
          setSelected(current => subnetMarkets.some((row: ScreenerRow) => row.netuid === current) ? current : subnetMarkets[0].netuid);
          setDataState("live");
          setLastUpdated(new Date());
        }
      }).catch(() => setDataState(current => current === "live" ? "live" : "error"));
    };
    refreshMarkets();
    const refreshTimer = window.setInterval(refreshMarkets, 60_000);
    return () => window.clearInterval(refreshTimer);
  }, []);
  useEffect(() => {
    const refreshTaoPrice = () => {
      fetch("/api/tao-price", { cache: "no-store" }).then(r => r.ok ? r.json() : Promise.reject()).then(json => {
        const price = Number(json.usd);
        if (Number.isFinite(price) && price > 0) setTaoUsd(price);
      }).catch(() => undefined);
    };
    refreshTaoPrice();
    const refreshTimer = window.setInterval(refreshTaoPrice, 60_000);
    return () => window.clearInterval(refreshTimer);
  }, []);
  useEffect(() => {
    if (showTaoChart) {
      fetch(`/api/tao-chart?interval=${timeframe}`)
        .then(r => r.ok ? r.json() : Promise.reject()).then(json => setCandles(json.data || [])).catch(() => setCandles([]));
      return;
    }
    const end = new Date();
    const windowMs = timeframe === "1m" ? 6 * 3600000 : timeframe === "10m" ? 2 * 86400000 : 14 * 86400000;
    const start = new Date(end.getTime() - windowMs);
    fetch(`/api/backend/v1/subnets/${selected}/prices?interval=${timeframe}&start=${start.toISOString()}&end=${end.toISOString()}&limit=500`)
      .then(r => r.ok ? r.json() : Promise.reject()).then(json => setCandles(json.data || [])).catch(() => setCandles([]));
  }, [selected, timeframe, showTaoChart]);

  const filtered = useMemo(() => rows.filter(r => `${r.netuid} ${r.name} ${r.symbol}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a,b) => sortDirection === "desc"
      ? Number(b[sort] ?? 0) - Number(a[sort] ?? 0)
      : Number(a[sort] ?? 0) - Number(b[sort] ?? 0)), [rows, query, sort, sortDirection]);
  const active = rows.find(r => r.netuid === selected) || rows[0];
  const totalVolume = rows.reduce((sum,r) => sum + Number(r.volume_24h_tao || 0), 0);
  const rankedMovers = [...rows].sort((a,b) => Number(b.change_1h || 0) - Number(a.change_1h || 0));
  const marketCapLeaders = [...rows].sort((a,b) => Number(b.market_cap_tao || 0) - Number(a.market_cap_tao || 0)).slice(0, 14);
  const bubbleRows = useMemo(() => [...rows]
    .filter(r => r.netuid !== 0)
    .sort((a,b) => a.netuid - b.netuid)
    .slice(0, 128), [rows]);
  const bubbleSize = (row: ScreenerRow) => {
    const movement = Number(row[bubbleTimeframe] || 0);
    if (Math.abs(movement) <= .005) return 48;
    if (movement > 0) return Math.round(54 + Math.min(98, Math.pow(movement, .62) * 13));
    return Math.round(52 + Math.min(22, Math.sqrt(Math.abs(movement)) * 7));
  };
  const bubbleChange = (row: ScreenerRow) => row[bubbleTimeframe] as string | undefined;
  const startBubbleDrag = (event: ReactPointerEvent<HTMLButtonElement>, netuid: number) => {
    if (event.button !== 0 || !bubbleCloudRef.current) return;
    const bubble = event.currentTarget.getBoundingClientRect();
    const cloud = bubbleCloudRef.current.getBoundingClientRect();
    const offset = bubbleOffsets[netuid] || { x: 0, y: 0 };
    bubbleDragRef.current = {
      netuid, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY,
      offsetX: offset.x, offsetY: offset.y,
      minX: offset.x + cloud.left - bubble.left, maxX: offset.x + cloud.right - bubble.right,
      minY: offset.y + cloud.top - bubble.top, maxY: offset.y + cloud.bottom - bubble.bottom,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDraggingBubble(netuid);
  };
  const moveBubbleDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = bubbleDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.startX, dy = event.clientY - drag.startY;
    if (Math.hypot(dx, dy) > 4) drag.moved = true;
    const x = Math.max(drag.minX, Math.min(drag.maxX, drag.offsetX + dx));
    const y = Math.max(drag.minY, Math.min(drag.maxY, drag.offsetY + dy));
    setBubbleOffsets(current => ({ ...current, [drag.netuid]: { x, y } }));
  };
  const endBubbleDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = bubbleDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    suppressBubbleClick.current = drag.moved;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    bubbleDragRef.current = null;
    setDraggingBubble(null);
  };
  const money = (value?: string | number, price = false) => {
    if (value == null || value === "") return currency === "tao" ? "τ —" : "$—";
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

  function changeSort(field: keyof ScreenerRow) {
    if (sort === field) setSortDirection(current => current === "desc" ? "asc" : "desc");
    else { setSort(field); setSortDirection("desc"); }
  }
  function openSubnetChart(netuid: number) {
    setShowTaoChart(false);
    setSelected(netuid);
    setView("screener");
    window.setTimeout(() => chartCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }
  function openTaoChart() {
    setShowTaoChart(true);
    setView("screener");
    window.setTimeout(() => chartCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }
  const taoChartChange = candles.length > 1 ? (Number(candles.at(-1)?.close || 0) / Number(candles[0]?.open || 1) - 1) * 100 : 0;
  const sortArrow = (field: keyof ScreenerRow) => sort === field ? (sortDirection === "desc" ? " ↓" : " ↑") : "";

  return <main className="shell">
    <section className="market-ticker" aria-label="Top subnet tokens by market capitalization">
      <div className="ticker-label"><span>Market leaders</span><small>1 Hour</small></div>
      <div className="ticker-window">
        <div className="ticker-track">{[...marketCapLeaders, ...marketCapLeaders].map((r, i) => <button key={`${r.netuid}-${i}`} onClick={() => openSubnetChart(r.netuid)}>
          <span><b>{r.name || `Subnet ${r.netuid}`}</b><small>SN{r.netuid}</small></span>
          <strong>{money(r.price_tao, true)}</strong>
          <em className={changeClass(r.change_1h)}>{Number(r.change_1h || 0) > 0 ? "+" : ""}{fmt(r.change_1h)}%</em>
        </button>)}</div>
      </div>
    </section>
    <header className="topbar">
      <Link className="brand" href="/" aria-label="Shizzy Unchained home">
        <img src="/shizzy-unchained-logo.svg" alt="Shizzy Unchained" />
      </Link>
      <button className={`mobile-menu-toggle ${mobileMenuOpen ? "open" : ""}`} aria-label="Open navigation menu" aria-expanded={mobileMenuOpen} aria-controls="primary-navigation" onClick={() => setMobileMenuOpen(open => !open)}><span /><span /><span /></button>
      <nav id="primary-navigation" className={mobileMenuOpen ? "mobile-open" : ""} aria-label="Primary navigation">
        <Link className={view === "screener" ? "active" : ""} href="/" onClick={() => setMobileMenuOpen(false)}>Market</Link>
        <Link className={view === "bubbles" ? "active" : ""} href="/bubbles" onClick={() => setMobileMenuOpen(false)}>Bubbles</Link>
        <Link className={view === "videos" ? "active" : ""} href="/video" onClick={() => setMobileMenuOpen(false)}>Videos</Link>
        <a href="https://shizzyunchained.printful.me/" target="_blank" rel="noreferrer" onClick={() => setMobileMenuOpen(false)}>Shop</a>
        <Link className={view === "university" ? "active" : ""} href="/university" onClick={() => setMobileMenuOpen(false)}>Shiz University</Link>
        <Link className={view === "wallets" ? "active" : ""} href="/wallet-tracker" onClick={() => setMobileMenuOpen(false)}>Wallet tracker</Link>
        <Link href="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
        <Link className={view === "partners" ? "active" : ""} href="/partners" onClick={() => setMobileMenuOpen(false)}>Partners</Link>
      </nav>
      <div className="currency-toggle" role="group" aria-label="Display currency" title={taoUsd ? `1 TAO = ${taoUsd.toLocaleString("en-US", { style: "currency", currency: "USD" })}` : "Loading live TAO price"}>
        <button className={currency === "usd" ? "active" : ""} aria-pressed={currency === "usd"} onClick={() => setCurrency("usd")}>USD</button>
        <button className={currency === "tao" ? "active" : ""} aria-pressed={currency === "tao"} onClick={() => setCurrency("tao")}>TAO</button>
      </div>
      <div className={`status ${dataState === "live" ? "live" : "demo"}`} title={lastUpdated ? `Last updated ${lastUpdated.toLocaleTimeString()}` : undefined}><i />{dataState === "live" ? "Finney live" : dataState === "loading" ? "Connecting…" : "Reconnecting…"}</div>
    </header>

    {view === "screener" ? <>
      <section className="hero-strip">
        <button className={`tao-price-tile ${showTaoChart ? "active" : ""}`} onClick={openTaoChart} aria-label="Open TAO price chart"><span>TAO price</span><strong>{currency === "usd" ? money(1, true) : "τ 1"}</strong><small>Open TAO / USD chart →</small></button>
        <div><span>24h volume</span><strong>{dataState !== "live" || totalVolume === 0 ? "—" : money(totalVolume)}</strong><small>{dataState === "live" ? (totalVolume === 0 ? "Collecting trade history" : `Across ${rows.length} markets`) : "Connecting to Finney"}</small></div>
        <div><span>Top mover</span><strong className={changeClass(rankedMovers[0]?.change_1h)}>{rankedMovers[0]?.name || "—"}</strong><small className={changeClass(rankedMovers[0]?.change_1h)}>{rankedMovers[0] ? `${Number(rankedMovers[0].change_1h || 0) > 0 ? "+" : ""}${fmt(rankedMovers[0].change_1h)}% · 1 Hour` : "Waiting for market data"}</small></div>
        <div><span>Network</span><strong>FINNEY</strong><small>Finalized blocks only</small></div>
      </section>
      <section className="market-grid">
        <div ref={chartCardRef} className="chart-card panel">
          {dataState !== "live" && <div className="market-loading" role="status"><i/><strong>{dataState === "loading" ? "Connecting to Finney" : "Market feed unavailable"}</strong><span>{dataState === "loading" ? "Loading finalized subnet data…" : "We’ll reconnect automatically."}</span></div>}
          {dataState === "live" && <>
          <div className="panel-head"><div><p className="eyebrow">{showTaoChart ? "TAO · USD" : `SN${active?.netuid} · ${active?.symbol || "ALPHA"}`}</p><h1>{showTaoChart ? "Bittensor" : active?.name || `Subnet ${active?.netuid}`}</h1></div><div className="quote"><strong>{showTaoChart ? taoUsd.toLocaleString("en-US", { style: "currency", currency: "USD" }) : money(active?.price_tao, true)}</strong><span className={changeClass(showTaoChart ? String(taoChartChange) : active?.change_1h)}>{Number(showTaoChart ? taoChartChange : active?.change_1h || 0) > 0 ? "+" : ""}{fmt(showTaoChart ? taoChartChange : active?.change_1h)}% · {timeframe === "1d" ? "1 Day" : timeframe === "1h" ? "1 Hour" : timeframe === "10m" ? "10 Minutes" : "1 Minute"}</span></div></div>
          <div className="timeframes">{[{ value: "1m", label: "1 Minute" }, { value: "10m", label: "10 Minutes" }, { value: "1h", label: "1 Hour" }, { value: "1d", label: "1 Day" }].map(t => <button key={t.value} className={timeframe === t.value ? "active" : ""} onClick={() => setTimeframe(t.value)}>{t.label}</button>)}</div>
          <PriceChart candles={candles} row={showTaoChart ? undefined : active} currency={currency} taoUsd={taoUsd} timeframe={timeframe} valueCurrency={showTaoChart ? "usd" : "tao"} />
          {showTaoChart ? <div className="chart-stats"><span>Pair <b>TAO / USD</b></span><span>Price source <b>Coinbase</b></span><span>History <b>{candles.length} candles</b></span></div> : <div className="chart-stats"><span>Liquidity <b>{money(active?.tao_reserve)}</b></span><span>Market cap <b>{money(active?.market_cap_tao)}</b></span><span>24h vol <b>{Number(active?.volume_24h_tao || 0) === 0 ? "Collecting" : money(active?.volume_24h_tao)}</b></span></div>}
          </>}
        </div>
        <aside className="movers panel"><div className="panel-title"><h2>Momentum</h2><span>1 Hour</span></div>{rankedMovers.slice(0,5).map((r,i)=><button key={r.netuid} onClick={()=>openSubnetChart(r.netuid)}><em>{String(i+1).padStart(2,"0")}</em><span><b>{r.name || `Subnet ${r.netuid}`}</b><small>SN{r.netuid}</small></span><strong className={changeClass(r.change_1h)}>{Number(r.change_1h)>0?"+":""}{fmt(r.change_1h)}%</strong></button>)}</aside>
      </section>
      <section className="screener panel">
        <div className="screener-head"><div><p className="eyebrow">Bittensor markets</p><h2>Subnet screener</h2></div><label className="search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search subnet or netuid" /></label></div>
        <div className="table-wrap"><table><thead><tr><th>#</th><th><button onClick={()=>changeSort("netuid")}>Subnet{sortArrow("netuid")}</button></th><th><button onClick={()=>changeSort("price_tao")}>Price {currency === "usd" ? "$" : "τ"}{sortArrow("price_tao")}</button></th><th><button onClick={()=>changeSort("market_cap_tao")}>Market Cap{sortArrow("market_cap_tao")}</button></th><th><button onClick={()=>changeSort("change_10m")}>10 Minutes{sortArrow("change_10m")}</button></th><th><button onClick={()=>changeSort("change_1h")}>1 Hour{sortArrow("change_1h")}</button></th><th><button onClick={()=>changeSort("change_24h")}>1 Day{sortArrow("change_24h")}</button></th><th><button onClick={()=>changeSort("emission_pct")}>Emission %{sortArrow("emission_pct")}</button></th><th title="Annualized latest on-chain validator dividends per tempo, divided by subnet alpha stake."><button onClick={()=>changeSort("apy")}>Staker APY{sortArrow("apy")}</button></th><th title="Percentage of the subnet's full on-chain Alpha supply currently conviction locked."><button onClick={()=>changeSort("conviction_locked_pct")}>Supply Locked{sortArrow("conviction_locked_pct")}</button></th><th><button onClick={()=>changeSort("volume_24h_tao")}>Volume{sortArrow("volume_24h_tao")}</button></th><th><button onClick={()=>changeSort("tao_reserve")}>Liquidity{sortArrow("tao_reserve")}</button></th></tr></thead>
        <tbody>{filtered.map((r,i)=><tr key={r.netuid} className={r.netuid===selected?"selected":""} onClick={()=>openSubnetChart(r.netuid)} tabIndex={0} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openSubnetChart(r.netuid); } }}><td>{i+1}</td><td><div><b>{r.name || `Subnet ${r.netuid}`}</b><small>SN{r.netuid}</small></div></td><td>{money(r.price_tao, true)}</td><td>{money(r.market_cap_tao)}</td>{[r.change_10m,r.change_1h,r.change_24h].map((v,j)=><td key={j} className={changeClass(v)}>{Number(v||0)>0?"+":""}{fmt(v)}%</td>)}<td className="emission-cell">{r.emission_pct == null ? "—" : `${fmt(r.emission_pct, 4)}%`}<small>of each block</small></td><td className="apy-cell" title="Annualized latest on-chain validator dividends per tempo, divided by subnet alpha stake.">{r.apy == null ? "—" : `${fmt(r.apy, Number(r.apy) < 1 ? 4 : 2)}%`}<small>latest realized tempo</small></td><td>{r.conviction_locked_pct == null ? "—" : `${fmt(r.conviction_locked_pct, 2)}%`}</td><td>{money(r.volume_24h_tao)}</td><td>{money(r.tao_reserve)}</td></tr>)}</tbody></table></div>
      </section>
    </> : view === "bubbles" ? <section className="bubbles-page">
      <div className="bubbles-hero">
        <div><p className="eyebrow">All 128 subnets · live market map</p><h1>Subnet <span>bubbles.</span></h1><p>Every subnet in one view. Subnet numbers lead, names stay compact, and only exceptional green movers grow large.</p></div>
        <div className="bubble-controls" role="group" aria-label="Bubble performance period">
          {[
            { value: "change_10m", label: "10 Minutes" },
            { value: "change_1h", label: "1 Hour" },
            { value: "change_24h", label: "1 Day" },
          ].map(period => <button key={period.value} className={bubbleTimeframe === period.value ? "active" : ""} onClick={() => setBubbleTimeframe(period.value as typeof bubbleTimeframe)}>{period.label}</button>)}
        </div>
      </div>
      <div className="bubble-legend"><span><i className="gain"/>Gaining</span><span><i className="flat"/>Flat</span><span><i className="loss"/>Falling</span><b>Drag any bubble · big bubbles = exceptional gains</b><button onClick={() => setBubbleOffsets({})}>Reset layout</button></div>
      <section ref={bubbleCloudRef} className="bubble-cloud panel" aria-label="Draggable subnet market bubbles">
        {dataState !== "live" && <div className="market-loading" role="status"><i/><strong>{dataState === "loading" ? "Building the live market map" : "Bubble data unavailable"}</strong><span>{dataState === "loading" ? "Waiting for all finalized subnets…" : "We’ll reconnect automatically."}</span></div>}
        {bubbleRows.map(row => {
          const movement = Number(bubbleChange(row) || 0);
          const size = bubbleSize(row);
          const offset = bubbleOffsets[row.netuid] || { x: 0, y: 0 };
          const bubbleStyle = { width: size, height: size, "--bubble-x": `${offset.x}px`, "--bubble-y": `${offset.y}px` } as CSSProperties;
          return <button key={row.netuid} style={bubbleStyle} className={`market-bubble ${size < 58 ? "compact" : ""} ${movement > 0.005 ? "gain" : movement < -0.005 ? "loss" : "flat"} ${selected === row.netuid ? "selected" : ""} ${draggingBubble === row.netuid ? "dragging" : ""}`} onPointerDown={event => startBubbleDrag(event, row.netuid)} onPointerMove={moveBubbleDrag} onPointerUp={endBubbleDrag} onPointerCancel={endBubbleDrag} onClick={() => { if (suppressBubbleClick.current) { suppressBubbleClick.current = false; return; } setSelected(row.netuid); }} aria-label={`${row.name || `Subnet ${row.netuid}`}, draggable, ${money(row.market_cap_tao)} market cap, ${movement >= 0 ? "+" : ""}${fmt(movement)} percent`}>
            <small>{row.name || "Unknown"}</small><strong>SN{row.netuid}</strong><em>{movement > 0 ? "+" : ""}{fmt(movement)}%</em><span>{money(row.market_cap_tao)}</span>
          </button>;
        })}
      </section>
      {active && <aside className="bubble-detail panel">
        <div><span className="bubble-token">{active.symbol?.replace("α", "") || active.netuid}</span><div><small>SN{active.netuid}</small><h2>{active.name || `Subnet ${active.netuid}`}</h2></div></div>
        <dl><div><dt>Price</dt><dd>{money(active.price_tao, true)}</dd></div><div><dt>Market cap</dt><dd>{money(active.market_cap_tao)}</dd></div><div><dt>Liquidity</dt><dd>{money(active.tao_reserve)}</dd></div><div><dt>{bubbleTimeframe === "change_10m" ? "10 minutes" : bubbleTimeframe === "change_1h" ? "1 hour" : "1 day"}</dt><dd className={changeClass(bubbleChange(active))}>{Number(bubbleChange(active) || 0) > 0 ? "+" : ""}{fmt(bubbleChange(active))}%</dd></div></dl>
        <button onClick={() => openSubnetChart(active.netuid)}>Open market chart →</button>
      </aside>}
    </section> : view === "wallets" ? <section className="wallet-page">
      <div className="wallet-intro"><p className="eyebrow">Portfolio intelligence</p><h1>See every wallet.<br/><span>See the whole position.</span></h1><p>Paste up to 100 Bittensor coldkeys. We’ll combine free TAO, alpha positions, subnet exposure, and spot-value estimates at one finalized block.</p></div>
      <form className="wallet-form panel" onSubmit={checkWallets}><label htmlFor="wallets">Coldkey addresses</label><p className="wallet-safety">Read-only lookup. Never enter a seed phrase, private key, or password.</p><textarea id="wallets" value={walletInput} onChange={e=>setWalletInput(e.target.value)} placeholder={"5F...\n5G...\n5H..."} /><div className="form-foot"><span>One public coldkey per line, space, or comma</span><button disabled={checking}>{checking ? "Checking chain…" : "Check wallets →"}</button></div>{walletError && <p className="form-error">{walletError}</p>}</form>
      {wallets.length > 0 && <div className="portfolio-summary panel"><div><span>Total wallets</span><strong>{wallets.length}</strong></div><div><span>Free balance</span><strong>{money(wallets.reduce((s,w)=>s+Number(w.free_tao||0),0))}</strong></div><div><span>Staked value</span><strong>{money(wallets.reduce((s,w)=>s+Number(w.staked_tao_value||0),0))}</strong></div><div><span>Total portfolio</span><strong className="accent">{money(wallets.reduce((s,w)=>s+Number(w.total_tao_value||0),0))}</strong></div></div>}
      <div className="wallet-results">{wallets.map(w=><article className="wallet-card panel" key={w.address}><div className="wallet-card-head"><span className="wallet-ident">{w.address.slice(0,6)}</span><div><b>{w.address.slice(0,12)}…{w.address.slice(-8)}</b><small>{w.stakes.length} positions</small></div><strong>{money(w.total_tao_value)}</strong></div><div className="wallet-split"><span>Free <b>{money(w.free_tao)}</b></span><span>Staked <b>{money(w.staked_tao_value)}</b></span></div><div className="positions">{w.stakes.slice(0,8).map((s,i)=><div key={`${s.hotkey}-${s.netuid}-${i}`}><span><b>SN{s.netuid}</b><small>{s.name || s.hotkey.slice(0,7) + "…"}</small></span><span>{fmt(s.alpha,4)} α<small>{money(s.tao_value)}</small></span></div>)}</div></article>)}</div>
      {!wallets.length && <div className="wallet-empty"><div className="radar"><i/><i/><i/></div><p>Your combined portfolio will appear here.</p></div>}
    </section> : view === "videos" ? <section className="videos-page">
      <div className="videos-intro">
        <div><p className="eyebrow">Shizzy Unchained TV</p><h1>Watch the latest.<br/><span>Stay ahead of TAO.</span></h1></div>
        <p>Deep dives, subnet updates, interviews, and the 10 to 100 TAO challenge—watch every episode right here.</p>
      </div>
      <div className="featured-video panel">
        <div className="video-frame"><iframe key={activeVideo.id} src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?rel=0`} title={activeVideo.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div>
        <div className="video-caption"><span>Now playing</span><h2>{activeVideo.title}</h2><small>{activeVideo.meta}</small></div>
      </div>
      <div className="live-library">
        <div className="library-head"><div><p className="eyebrow">Shizzy live</p><h2>Live streams & replays</h2></div><span>{liveStreams.length} streams</span></div>
        <div className="live-grid">{liveStreams.map((video, index) => <button key={video.id} className={video.id === activeVideo.id ? "active" : ""} onClick={() => { setActiveVideo(video); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          <span className="video-thumb"><img src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt="" /><i>▶</i><em className="stream-badge">Live replay</em></span>
          <span className="video-info"><small>{String(index + 1).padStart(2, "0")}</small><span><b>{video.title}</b><em>{video.meta}</em></span></span>
        </button>)}</div>
      </div>
      <div className="video-library">
        <div className="library-head"><div><p className="eyebrow">From the channel</p><h2>Recent videos</h2></div><span>{channelVideos.length} episodes</span></div>
        <div className="video-grid">{channelVideos.map((video, index) => <button key={video.id} className={video.id === activeVideo.id ? "active" : ""} onClick={() => { setActiveVideo(video); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          <span className="video-thumb"><img src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt="" /><i>▶</i><em>{video.meta.split(" · ")[0]}</em></span>
          <span className="video-info"><small>{String(index + 1).padStart(2, "0")}</small><b>{video.title}</b></span>
        </button>)}</div>
      </div>
    </section> : view === "partners" ? <section className="partners-page">
      <div className="partners-hero">
        <p className="eyebrow">Tools Shizzy trusts</p>
        <h1>Power your journey.<br/><span>Meet our partners.</span></h1>
        <p>Research smarter, protect your assets, strengthen your privacy, and put your TAO to work with handpicked products from across the ecosystem.</p>
      </div>
      <div className="partner-grid">
        {partners.map((partner, index) => <a className={`partner-banner ${partner.key}`} href={partner.href} target="_blank" rel="sponsored noreferrer" key={partner.name}>
          <div className="partner-number">0{index + 1}</div>
          <div className="partner-logo" aria-hidden="true">{partner.key === "mentat" ? <><span className="mentat-mark"><b/><b/><b/><b/></span><span>Mentat</span></> : <><i/>{partner.name}</>}</div>
          <div className="partner-copy"><span>{partner.kicker}</span><h2>{partner.name}</h2><p>{partner.description}</p></div>
          <strong>{partner.cta}<b>↗</b></strong>
        </a>)}
      </div>
      <div className="partner-note"><span>Shizzy-approved resources</span><p>Some links are affiliate links. If you use them, Shizzy Unchained may earn a commission at no additional cost to you.</p></div>
    </section> : <section className="university-page">
      <div className="university-hero">
        <div className="university-copy"><p className="eyebrow">Private education · Real experience</p><h1>Private strategy sessions.<br/><span>Built around you.</span></h1><p>Choose one focused, one-on-one class with Shizzy covering Bittensor, portfolio construction, content, or crypto security. Bring your questions and leave with a clearer, practical next step.</p><div className="university-actions"><a className="university-primary" href="#classes">Choose your class →</a><a className="university-secondary" href="#how-it-works">How it works</a></div><div className="university-proof"><span><b>$100</b> per session</span><span><b>Private</b> 1-on-1</span><span><b>Card or TAO</b> payment</span></div></div>
        <img src="/Copy%20of%20new%20shizzy%20logo.png" alt="Shiz University" />
      </div>
      <section className="university-trust" aria-label="Why learn with Shizzy"><div><strong>Real market experience</strong><span>Lessons shaped by ongoing Bittensor research and participation.</span></div><div><strong>Your questions first</strong><span>A private conversation focused on where you need the most clarity.</span></div><div><strong>Practical takeaways</strong><span>Frameworks and next steps designed to be useful after the session.</span></div></section>
      <div className="course-heading" id="classes"><div><p className="eyebrow">Choose your class</p><h2>Pick your focus</h2></div><p>Start with the session that matches your current goal. You can always book another topic later.</p></div>
      <div className="course-grid">{universityCourses.map(course => <article className="course-card panel" key={course.number}><div className="course-top"><span>{course.number}</span><em>{course.tag}</em></div><small className="course-best">{course.bestFor}</small><h3>{course.title}</h3><p>{course.description}</p><div className="course-outcome"><b>Your takeaway</b><span>{course.outcome}</span></div><ul>{course.lessons.map(lesson => <li key={lesson}>{lesson}</li>)}</ul><div className="course-foot"><div><strong>$100</strong><small>Private session</small></div><button onClick={() => { setCheckoutCourse(course); setWalletCopied(false); }}>Book this session →</button></div></article>)}</div>
      <section className="university-process" id="how-it-works"><div className="course-heading"><div><p className="eyebrow">Simple booking</p><h2>How it works</h2></div><p>Choose your topic, complete payment, and coordinate your private session directly.</p></div><div className="process-grid">{[["01","Choose a class","Select the topic that best matches your current goal."],["02","Pay securely","Use the card checkout or pay the live $100 equivalent in TAO."],["03","Send your details","TAO buyers submit their transaction confirmation and preferred class."],["04","Meet with Shizzy","Join your private session ready with your goals and questions."]].map(step => <div key={step[0]}><span>{step[0]}</span><strong>{step[1]}</strong><p>{step[2]}</p></div>)}</div></section>
      <section className="university-about"><img src="/about-shizzy.png" alt="Shizzy Unchained" /><div><p className="eyebrow">Your instructor</p><h2>Learn directly from Shizzy</h2><p>Shizzy Unchained creates practical Bittensor market coverage, subnet deep dives, interviews, and educational content. These sessions bring that same direct approach into a private conversation centered on your questions.</p><div><span>Bittensor research</span><span>Subnet deep dives</span><span>Creator experience</span></div></div></section>
      <section className="university-faq"><div className="course-heading"><div><p className="eyebrow">Before you book</p><h2>Frequently asked questions</h2></div></div><div>{[["Do I need Bittensor experience?","No. Choose Subnets 101 if you are beginning, or select another class if you already have a specific goal."],["Can I pay with TAO?","Yes. The checkout shows the live TAO equivalent of $100 and the wallet address. Submit your transaction confirmation afterward."],["Is this financial advice?","No. Sessions provide education, perspective, and personal guidance. Every financial decision remains your responsibility."],["Can the session cover my specific questions?","Yes. The one-on-one format is designed around your goals, while staying within the selected class topic."],["What happens after payment?","Card buyers continue through the secure checkout. TAO buyers receive instructions to submit payment confirmation and coordinate their class."]].map(item => <details key={item[0]}><summary>{item[0]}</summary><p>{item[1]}</p></details>)}</div></section>
      <section className="university-final"><p className="eyebrow">Ready when you are</p><h2>Choose the skill you want to sharpen.</h2><p>Book one focused private session and bring the questions that matter most to you.</p><a href="#classes">View the classes →</a></section>
      <div className="university-note"><span>Education, perspective, and personal guidance.</span><p>Nothing here is financial or life advice. Every decision remains yours.</p></div>
      {checkoutCourse && <div className="checkout-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setCheckoutCourse(null); }}><section className="course-checkout panel" role="dialog" aria-modal="true" aria-labelledby="checkout-title"><button className="checkout-close" aria-label="Close checkout" onClick={() => setCheckoutCourse(null)}>×</button><p className="eyebrow">Shiz University enrollment</p><h2 id="checkout-title">{checkoutCourse.title}</h2><div className="checkout-price"><strong>$100</strong><span>One private class</span></div><a className="card-checkout" href={stripeCheckout} target="_blank" rel="noreferrer">Pay securely with card →</a><div className="checkout-divider"><span>or pay with TAO</span></div><div className="tao-payment"><div><span>Send exactly</span><strong>{taoUsd ? `${fmt(100 / taoUsd, 4)} TAO` : "$100 in TAO"}</strong><small>{taoUsd ? `Based on the current $${fmt(taoUsd)} TAO price` : "Use the live TAO price when sending"}</small></div><code>{universityWallet}</code><button onClick={async () => { await navigator.clipboard.writeText(universityWallet); setWalletCopied(true); }}>{walletCopied ? "Wallet copied ✓" : "Copy wallet address"}</button></div><div className="schedule-step"><span>Paid with TAO? Schedule your class</span><p>After sending your TAO, use the calendar below. You must include your transaction hash or transaction confirmation in the booking form so payment can be verified.</p><a className="card-checkout" href={universityCalendly} target="_blank" rel="noreferrer">Open scheduling calendar →</a><b>Bookings without transaction confirmation will not be accepted.</b></div></section></div>}
    </section>}
    <footer><span>SHIZZYUNCHAINED</span><p>Finalized on-chain data · {currency === "usd" ? "USD values use the live TAO spot rate" : "TAO-denominated values"} · Not financial advice</p><b>Built on Bittensor</b></footer>
  </main>;
}
