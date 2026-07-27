"use client";

import { CSSProperties, FormEvent, PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import TradingChart from "./trading-chart";

type ScreenerRow = {
  netuid: number;
  name?: string;
  symbol?: string;
  price_tao: string;
  tao_reserve?: string;
  description?: string;
  website?: string;
  github_repo?: string;
  discord?: string;
  contact?: string;
  logo_url?: string;
  additional?: string;
  alpha_out?: string;
  market_cap_tao?: string;
  volume_24h_tao?: string;
  emission_pct?: string;
  apy?: string;
  conviction_locked_alpha?: string;
  conviction_locked_pct?: string;
  change_10m?: string;
  change_1h?: string;
  change_24h?: string;
  change_7d?: string;
  liquidity_change_1h?: string;
  emission_change_1h?: string;
  volume_1h_tao?: string;
  volume_acceleration_1h?: string;
};
type Candle = {
  time: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume_tao?: string;
};
type Stake = {
  hotkey: string;
  netuid: number;
  name?: string;
  symbol?: string;
  alpha: string;
  tao_value?: string;
};
type Wallet = {
  address: string;
  free_tao: string;
  staked_tao_value?: string;
  total_tao_value?: string;
  stakes: Stake[];
  error?: string;
};
type PortfolioAsset = {
  key: string;
  netuid: number | null;
  name: string;
  symbol: string;
  alpha: number;
  taoValue: number;
  wallets: Set<string>;
};
type ChainEvent = {
  block_number: number;
  event_index: number;
  time: string;
  event_type: string;
  netuid?: number;
  destination_netuid?: number;
  name?: string;
  destination_name?: string;
  coldkey?: string;
  destination_coldkey?: string;
  hotkey?: string;
  destination_hotkey?: string;
  amount_alpha?: string;
  amount_tao?: string;
  tao_value?: string;
  perpetual?: boolean;
};
type ActivitySummary = {
  locked_alpha_24h: string;
  unlocked_alpha_24h: string;
  net_locked_alpha_24h: string;
  stake_moves_24h: number;
  locked_tao_24h: string;
  unlocked_tao_24h: string;
  net_locked_tao_24h: string;
  event_count_24h: number;
  tao_moved_24h: string;
  largest_move_tao_24h: string;
  active_subnets_24h: number;
};

const channelVideos = [
  {
    id: "_2VA_b-HRnw",
    title: "Getting Out of Everything besides Compute - Week 11 10 to 100 TAO Challenge",
    meta: "20:28 · Latest episode",
  },
  {
    id: "RfiDazAg8r8",
    title: "Compute Wars: The Battle for AI Infrastructure Has Begun on Bittensor",
    meta: "35:17 · Latest episode",
  },
  {
    id: "AuUwiV1r_cs",
    title: "Bittensor TAO: Patience Pays Off",
    meta: "20:39 · Latest episode",
  },
  {
    id: "tdZGVfadd00",
    title: "The 10 to 100 TAO Challenge Is Getting Dangerous. Week 9",
    meta: "22:45",
  },
  {
    id: "6oSJxSfVUBk",
    title: "The Bittensor Move No One Is Ready For",
    meta: "26:35",
  },
  {
    id: "E8sZrmYiQ5Y",
    title: "The Trade Everyone Missed. Week 8 of the 10 to 100 TAO Challenge",
    meta: "23:48",
  },
  {
    id: "AymnXq08VDM",
    title: "Bittensor Subnet Update: Subnet Summer Is Canceled?",
    meta: "24:46",
  },
  {
    id: "beZ18Hdka0Q",
    title: "Week 7: 10 to 100 TAO Challenge. I’m Not Giving Up!",
    meta: "22:36",
  },
  {
    id: "pFPd1BoUe00",
    title: "Bittensor Subnet Update: Move Fast and Break People",
    meta: "24:23",
  },
  {
    id: "X3n7DVacpJA",
    title: "Week 6: 10 TAO to 100 TAO Challenge | Down But Not Out",
    meta: "22:30",
  },
];
const liveStreams = [
  {
    id: "yZceSNu4ugc",
    title: "The TAO Thesis Nobody Is Ready For | Mark Jeffrey Live",
    meta: "1:28:36 · Streamed today",
  },
  {
    id: "ealfKQI1q2g",
    title: "ChronoLLM SN38: The AI That Never Cheats Time",
    meta: "51:47 · Streamed 3 days ago",
  },
  {
    id: "T0BbzWFS7EE",
    title: "Bittensor Subnet Update with Crypto Millie",
    meta: "1:35:16 · Streamed 5 days ago",
  },
  {
    id: "EJMXtvxC6Qo",
    title: "AI That Finds DNA Mutations: Minos SN107",
    meta: "1:03:36 · Streamed 11 days ago",
  },
  {
    id: "F3ogKcX3xpE",
    title: "Leadpoet SN71 Deep Dive with Gavin Zaentz",
    meta: "58:46 · Streamed 2 weeks ago",
  },
  {
    id: "wyif_M_zbwg",
    title: "Bittensor Subnet 85 VIDAIO: AI Video Enhancement",
    meta: "42:43 · Streamed 3 weeks ago",
  },
  {
    id: "rvfP0aSEGkQ",
    title: "Live With Tom From Bitcast and Stitch3",
    meta: "44:15 · Streamed 1 month ago",
  },
  {
    id: "_DAintx1Zfs",
    title: "Live with Mark Jeffrey",
    meta: "1:21:33 · Streamed 1 month ago",
  },
  {
    id: "qxr-Q9d9Elw",
    title: "Bittensor’s Special K Live",
    meta: "48:22 · Streamed 1 month ago",
  },
];
const universityCourses = [
  {
    number: "01",
    title: "Bittensor Subnets 101",
    tag: "Foundation",
    bestFor: "Best for Bittensor beginners",
    description: "Understand miners, validators, emissions, alpha, subnet economics, and how the Bittensor network fits together.",
    outcome: "Leave with a practical framework for evaluating what a subnet actually does.",
    lessons: ["How subnets work", "Reading emissions and incentives", "Finding real utility"],
  },
  {
    number: "02",
    title: "Build the Best Subnet Portfolio",
    tag: "Portfolio",
    bestFor: "Best for active subnet investors",
    description: "Turn subnet research into a focused portfolio built around conviction, sizing, risk, and a repeatable decision process.",
    outcome: "Leave with a clearer research, sizing, and portfolio-review process.",
    lessons: ["Subnet research framework", "Position sizing and risk", "Portfolio reviews"],
  },
  {
    number: "03",
    title: "Content Creation Strategies",
    tag: "Creator",
    bestFor: "Best for creators and founders",
    description: "Learn Shizzy’s system for finding ideas, building authority, packaging stories, and publishing content people actually watch.",
    outcome: "Leave with a repeatable content workflow you can begin using immediately.",
    lessons: ["Ideas that earn attention", "Titles, hooks, and structure", "Consistent publishing"],
  },
  {
    number: "04",
    title: "Crypto Security & Wallet Safety",
    tag: "Security",
    bestFor: "Best for protecting digital assets",
    description: "Protect your TAO and digital assets with practical wallet separation, transaction hygiene, and scam-resistant habits.",
    outcome: "Leave with a personal wallet-safety checklist and stronger transaction habits.",
    lessons: ["Cold and hot wallet setup", "Transaction safety", "Threats and recovery plans"],
  },
];
const stripeCheckout = "https://buy.stripe.com/fZudRb3u5dkA7Y45RNfAc00";
// Scheduling is never exposed publicly. TAO buyers submit a transaction hash first.
const universityCalendly = "mailto:shizzyunchained@gmail.com?subject=Shiz%20University%20TAO%20payment&body=Transaction%20hash%3A%0A%0ABittensor%20wallet%20address%3A%0A%0AClass%20name%3A";
const universityWallet = "5Gsp2ZkPSCpdscVem8NsE6qEUyjEGSf6YtKx6j1hy1ToG9VM";
const partners = [
  {
    key: "mentat",
    name: "Mentat",
    kicker: "TAO delegation",
    description: "Automated Bittensor staking strategies designed to keep your TAO delegated across strong validator opportunities.",
    href: "https://mentatminds.com/?origin=ShizzyUnchained",
    cta: "Explore Mentat",
  },
  {
    key: "alphagap",
    name: "Alpha Gap",
    kicker: "Subnet intelligence",
    description: "AI-powered Bittensor research tracking development, market signals, whale activity, emissions, and all active subnets.",
    href: "https://www.alphagap.io/?ref=SHIZ",
    cta: "Find the Alpha Gap",
  },
  {
    key: "ledger",
    name: "Ledger",
    kicker: "Hardware security",
    description: "Protect and manage crypto with a secure hardware wallet and the Ledger ecosystem built for self-custody.",
    href: "https://shop.ledger.com/?r=49c0bef9b376",
    cta: "Shop Ledger",
  },
  {
    key: "nord",
    name: "NordVPN",
    kicker: "Online privacy",
    description: "Add an encrypted layer of protection to your internet connection across desktop, mobile, and public networks.",
    href: "https://go.nordvpn.net/aff_c?offer_id=15&aff_id=145365&source=Shizzy",
    cta: "Get NordVPN",
  },
];

const fmt = (value?: string | number, digits = 2) => {
  const n = Number(value ?? 0);
  return n.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: n < 1 ? Math.min(digits, 4) : 0,
  });
};
const changeClass = (v?: string) => (Number(v ?? 0) > 0 ? "positive" : Number(v ?? 0) < 0 ? "negative" : "neutral");
const candleIntervalMs: Record<string, number> = {
  "1m": 60_000,
  "10m": 600_000,
  "1h": 3_600_000,
  "1d": 86_400_000,
};
const candleCache = new Map<string, { data: Candle[]; savedAt: number }>();
const candleRequests = new Map<string, Promise<Candle[]>>();
const portfolioColors = ["#16d9c4", "#ffb547", "#ff5d73", "#64748b", "#36d66b", "#ff8a4c", "#173766", "#c7e85b", "#40b8ff"];

const safeProjectUrl = (value?: string) => {
  if (!value) return undefined;
  try {
    const url = new URL(value.startsWith("http://") || value.startsWith("https://") ? value : `https://${value}`);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : undefined;
  } catch {
    return undefined;
  }
};

function decodeCompactCandles(rows: unknown[]): Candle[] {
  return rows.flatMap((row) => {
    if (!Array.isArray(row) || row.length < 5) return [];
    return [
      {
        time: String(row[0]),
        open: String(row[1]),
        high: String(row[2]),
        low: String(row[3]),
        close: String(row[4]),
        volume_tao: String(row[5] ?? 0),
      },
    ];
  });
}

function loadSubnetCandles(netuid: number, timeframe: string) {
  const key = `${netuid}:${timeframe}`;
  const cached = candleCache.get(key);
  if (cached?.data.length) return Promise.resolve(cached.data);
  const pending = candleRequests.get(key);
  if (pending) return pending;
  const url = `/api/backend/v1/subnets/${netuid}/candles?interval=${timeframe}&limit=180`;
  const fetchWithRetry = async () => {
    let lastError: unknown;
    for (let attempt = 0; attempt < 2; attempt++) {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 8_000);
      try {
        const response = await fetch(url, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Chart request failed: ${response.status}`);
        return await response.json();
      } catch (error) {
        lastError = error;
      } finally {
        window.clearTimeout(timeout);
      }
    }
    throw lastError;
  };
  const request = fetchWithRetry()
    .then((json) => {
      const data = decodeCompactCandles(json.data || []);
      candleCache.set(key, { data, savedAt: Date.now() });
      return data;
    })
    .finally(() => candleRequests.delete(key));
  candleRequests.set(key, request);
  return request;
}

function withLiveCandle(candles: Candle[], spotPrice: number, timeframe: string, now = Date.now()) {
  if (!candles.length || !Number.isFinite(spotPrice) || spotPrice <= 0) return candles;
  const interval = candleIntervalMs[timeframe] || 60_000;
  const bucketTime = Math.floor(now / interval) * interval;
  const last = candles.at(-1)!;
  const lastTime = new Date(last.time).getTime();
  if (!Number.isFinite(lastTime)) return candles;
  // Do not draw a synthetic spot candle across stale archive history.
  // That creates a misleading vertical jump while the indexer fills the gap.
  if (bucketTime - lastTime > interval * 2) return candles;
  const updated = [...candles];
  if (lastTime < bucketTime) {
    const previousClose = Number(last.close);
    updated.push({
      time: new Date(bucketTime).toISOString(),
      open: String(previousClose),
      high: String(Math.max(previousClose, spotPrice)),
      low: String(Math.min(previousClose, spotPrice)),
      close: String(spotPrice),
      volume_tao: "0",
    });
    return updated;
  }
  updated[updated.length - 1] = {
    ...last,
    high: String(Math.max(Number(last.high), spotPrice)),
    low: String(Math.min(Number(last.low), spotPrice)),
    close: String(spotPrice),
  };
  return updated;
}

function PriceChart({ candles, row, currency, taoUsd, timeframe, valueCurrency = "tao" }: { candles: Candle[]; row?: ScreenerRow; currency: "usd" | "tao"; taoUsd: number; timeframe: string; valueCurrency?: "tao" | "usd" }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(1000);
  const visible = useMemo(
    () =>
      candles
        .filter((candle) => ["open", "high", "low", "close"].every((field) => Number(candle[field as keyof Candle]) > 0))
        .slice(-180)
        .map((candle, index, validCandles) => {
          if (!index) return candle;
          const previousClose = Number(validCandles[index - 1].close);
          const close = Number(candle.close);
          return {
            ...candle,
            open: String(previousClose),
            high: String(Math.max(Number(candle.high), previousClose, close)),
            low: String(Math.min(Number(candle.low), previousClose, close)),
          };
        }),
    [candles],
  );
  const layout = (width: number) => {
    const pad = 10;
    const priceAxis = width < 520 ? 58 : 72;
    const chartRight = width - priceAxis;
    const usable = Math.max(1, chartRight - pad);
    const naturalStep = usable / Math.max(visible.length, 1);
    const maxHourlyStep = width < 600 ? 34 : 52;
    const step = timeframe === "1h" ? Math.min(naturalStep, maxHourlyStep) : naturalStep;
    const start = timeframe === "1h" && step < naturalStep ? chartRight - step * visible.length : pad;
    return { pad, priceAxis, chartRight, usable, step, start };
  };
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const observer = new ResizeObserver((entries) => setCanvasWidth(entries[0].contentRect.width));
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    const box = canvas.getBoundingClientRect();
    canvas.width = box.width * ratio;
    canvas.height = box.height * ratio;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(ratio, ratio);
    ctx.clearRect(0, 0, box.width, box.height);
    if (!visible.length) return;
    const highs = visible.map((c) => Number(c.high));
    const lows = visible.map((c) => Number(c.low));
    const min = Math.min(...lows),
      max = Math.max(...highs),
      range = Math.max(max - min, max * 0.001, 1e-9);
    const { pad: padX, chartRight, step, start } = layout(box.width);
    const padY = 16,
      bottomY = box.height - 34,
      usableH = bottomY - padY;
    const bodyW = Math.max(2, Math.min(14, step * 0.62));
    const y = (value: number) => padY + ((max - value) * usableH) / range;
    const axisPrice = (value: number) => {
      const displayed = valueCurrency === "usd" ? value : currency === "usd" ? value * taoUsd : value;
      if (valueCurrency === "usd" || currency === "usd") {
        if (displayed >= 1000) return `$${fmt(displayed, 0)}`;
        return `$${fmt(displayed, displayed < 1 ? 4 : 2)}`;
      }
      return `τ${fmt(displayed, displayed < 1 ? 4 : 2)}`;
    };
    const axisTime = (value: string) => {
      const date = new Date(value);
      if (timeframe === "1d") return date.toLocaleDateString([], { month: "short", day: "numeric" });
      return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: timeframe === "1m" || timeframe === "10m" ? "2-digit" : undefined,
      });
    };

    ctx.lineWidth = 1;
    ctx.font = "10px monospace";
    ctx.fillStyle = "rgba(141,164,199,.82)";
    for (let line = 0; line < 5; line++) {
      const ratioY = line / 4;
      const gridY = padY + usableH * ratioY;
      const gridPrice = max - range * ratioY;
      ctx.strokeStyle = "rgba(38,85,132,.32)";
      ctx.beginPath();
      ctx.moveTo(padX, gridY);
      ctx.lineTo(chartRight, gridY);
      ctx.stroke();
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(axisPrice(gridPrice), chartRight + 7, gridY);
    }
    const timeTickCount = box.width < 600 ? 3 : 5;
    for (let tick = 0; tick < timeTickCount; tick++) {
      const ratioX = tick / (timeTickCount - 1);
      const candleIndex = Math.round((visible.length - 1) * ratioX);
      const gridX = start + step * (candleIndex + 0.5);
      ctx.strokeStyle = "rgba(38,85,132,.24)";
      ctx.beginPath();
      ctx.moveTo(gridX, padY);
      ctx.lineTo(gridX, bottomY);
      ctx.stroke();
      ctx.fillStyle = "rgba(141,164,199,.82)";
      ctx.textBaseline = "alphabetic";
      ctx.textAlign = tick === 0 ? "left" : tick === timeTickCount - 1 ? "right" : "center";
      ctx.fillText(axisTime(visible[candleIndex].time), gridX, box.height - 7);
    }

    visible.forEach((c, i) => {
      const open = Number(c.open),
        high = Number(c.high),
        low = Number(c.low),
        close = Number(c.close);
      const x = start + step * (i + 0.5);
      const color = close > open ? "#22c55e" : close < open ? "#ef4444" : "#ffffff";
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y(high));
      ctx.lineTo(x, y(low));
      ctx.stroke();
      const top = Math.min(y(open), y(close));
      const height = Math.max(2, Math.abs(y(open) - y(close)));
      ctx.fillRect(x - bodyW / 2, top, bodyW, height);
    });

    if (hovered !== null && visible[hovered]) {
      const candle = visible[hovered];
      const x = start + step * (hovered + 0.5),
        crossY = y(Number(candle.close));
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = "rgba(141,164,199,.65)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, padY);
      ctx.lineTo(x, bottomY);
      ctx.moveTo(padX, crossY);
      ctx.lineTo(chartRight, crossY);
      ctx.stroke();
      ctx.restore();
      const priceLabel = axisPrice(Number(candle.close));
      ctx.font = "10px monospace";
      const priceWidth = Math.min(box.width - chartRight, ctx.measureText(priceLabel).width + 12);
      ctx.fillStyle = "#1676ad";
      ctx.fillRect(chartRight, crossY - 10, priceWidth, 20);
      ctx.fillStyle = "#fff";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(priceLabel, chartRight + 6, crossY);
      const timeLabel = axisTime(candle.time);
      const timeWidth = ctx.measureText(timeLabel).width + 14;
      const timeLeft = Math.max(padX, Math.min(chartRight - timeWidth, x - timeWidth / 2));
      ctx.fillStyle = "#1676ad";
      ctx.fillRect(timeLeft, bottomY, timeWidth, 20);
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(timeLabel, timeLeft + timeWidth / 2, bottomY + 10);
    }
  }, [visible, hovered, currency, taoUsd, valueCurrency, timeframe, canvasWidth]);

  const move = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!visible.length) return;
    const box = event.currentTarget.getBoundingClientRect();
    setCanvasWidth(box.width);
    const { step, start } = layout(box.width);
    const x = event.clientX - box.left;
    if (x < start || x > start + step * visible.length) {
      setHovered(null);
      return;
    }
    setHovered(Math.max(0, Math.min(visible.length - 1, Math.floor((x - start) / step))));
  };
  return (
    <div className="chart-stage">
      <canvas ref={ref} className="price-canvas" aria-label={`Interactive candlestick price chart for ${row?.name || "selected subnet"}`} onPointerMove={move} onPointerLeave={() => setHovered(null)} />
      {!visible.length && <div className="chart-empty">Building candle history from your node…</div>}
    </div>
  );
}

export type DashboardView = "screener" | "activity" | "bubbles" | "wallets" | "videos" | "university" | "partners";

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
  const [subnetPanel, setSubnetPanel] = useState<"overview" | "chart">("overview");
  const [marketDetailOpen, setMarketDetailOpen] = useState(false);
  const [timeframe, setTimeframe] = useState("10m");
  const [bubbleTimeframe, setBubbleTimeframe] = useState<"change_10m" | "change_1h" | "change_24h">("change_1h");
  const [bubbleOffsets, setBubbleOffsets] = useState<Record<number, { x: number; y: number }>>({});
  const [draggingBubble, setDraggingBubble] = useState<number | null>(null);
  const chartCardRef = useRef<HTMLDivElement>(null);
  const marketModalCloseRef = useRef<HTMLButtonElement>(null);
  const bubbleCloudRef = useRef<HTMLElement>(null);
  const bubbleDragRef = useRef<{
    netuid: number;
    pointerId: number;
    startX: number;
    startY: number;
    offsetX: number;
    offsetY: number;
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    moved: boolean;
  } | null>(null);
  const suppressBubbleClick = useRef(false);
  const [chartData, setChartData] = useState<{
    key: string;
    candles: Candle[];
  }>({ key: "", candles: [] });
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState(false);
  const [walletInput, setWalletInput] = useState("");
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [walletDisplay, setWalletDisplay] = useState<"wallets" | "portfolio">("wallets");
  const [hideBalances, setHideBalances] = useState(false);
  const [portfolioMetric, setPortfolioMetric] = useState<"allocation" | "value">("allocation");
  const [checking, setChecking] = useState(false);
  const [walletProgress, setWalletProgress] = useState("");
  const [walletError, setWalletError] = useState("");
  const walletPollingRef = useRef(false);
  const [activity, setActivity] = useState<ChainEvent[]>([]);
  const [activitySummary, setActivitySummary] = useState<ActivitySummary | null>(null);
  const [activityCollectingSince, setActivityCollectingSince] = useState<string | null>(null);
  const [activityFilter, setActivityFilter] = useState<"all" | "locks" | "keys">("all");

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("view");
    if (requested === "wallets" || requested === "videos" || requested === "university" || requested === "screener" || requested === "activity" || requested === "bubbles" || requested === "partners") queueMicrotask(() => setView(requested));
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem("shizzy:wallet-job");
    if (!saved) return;
    try {
      const job = JSON.parse(saved);
      if (!job?.id || !job?.total) return;
      queueMicrotask(() => {
        setChecking(true);
        setWalletError("");
        setWalletProgress("Reconnecting to wallet lookup…");
        void pollWalletJob(job.id, job.total)
          .catch((error) => setWalletError(error instanceof Error ? error.message : "The wallet lookup could not reconnect."))
          .finally(() => {
            setChecking(false);
            setWalletProgress("");
          });
      });
    } catch {
      window.localStorage.removeItem("shizzy:wallet-job");
    }
  }, []);

  useEffect(() => {
    if (!marketDetailOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    marketModalCloseRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMarketDetailOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [marketDetailOpen]);

  useEffect(() => {
    try {
      const cached = JSON.parse(window.localStorage.getItem("shizzy:screener") || "null");
      const cachedRows = Array.isArray(cached?.data) ? cached.data.filter((row: ScreenerRow) => row.netuid !== 0) : [];
      if (cachedRows.length && Date.now() - Number(cached.savedAt || 0) < 24 * 60 * 60_000) {
        queueMicrotask(() => {
          setRows(cachedRows);
          setSelected((current) => (cachedRows.some((row: ScreenerRow) => row.netuid === current) ? current : cachedRows[0].netuid));
          setDataState("live");
          setLastUpdated(new Date(cached.savedAt));
        });
      }
    } catch {
      window.localStorage.removeItem("shizzy:screener");
    }
    const refreshMarkets = () => {
      fetch("/api/backend/v1/screener", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((json) => {
          const subnetMarkets = (json.data || []).filter((row: ScreenerRow) => row.netuid !== 0);
          if (subnetMarkets.length) {
            window.localStorage.setItem("shizzy:screener", JSON.stringify({ data: json.data, savedAt: Date.now() }));
            setRows(subnetMarkets);
            setSelected((current) => (subnetMarkets.some((row: ScreenerRow) => row.netuid === current) ? current : subnetMarkets[0].netuid));
            setDataState("live");
            setLastUpdated(new Date());
          }
        })
        .catch(() => setDataState((current) => (current === "live" ? "live" : "error")));
    };
    refreshMarkets();
    const refreshTimer = window.setInterval(refreshMarkets, 12_000);
    return () => window.clearInterval(refreshTimer);
  }, []);
  useEffect(() => {
    const refreshTaoPrice = () => {
      fetch("/api/tao-price", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((json) => {
          const price = Number(json.usd);
          if (Number.isFinite(price) && price > 0) setTaoUsd(price);
        })
        .catch(() => undefined);
    };
    refreshTaoPrice();
    const refreshTimer = window.setInterval(refreshTaoPrice, 12_000);
    return () => window.clearInterval(refreshTimer);
  }, []);
  useEffect(() => {
    let activeRequest = true;
    const controller = new AbortController();
    const cacheKey = `${showTaoChart ? "tao" : selected}:${timeframe}`;
    const cached = candleCache.get(cacheKey);
    queueMicrotask(() => {
      if (!activeRequest) return;
      setChartData({ key: cacheKey, candles: cached?.data || [] });
      setChartLoading(!cached?.data.length);
      setChartError(false);
    });
    const refreshChart = (background = false) => {
      if (showTaoChart) {
        fetch(`/api/tao-chart?interval=${timeframe}`, {
          cache: "no-store",
          signal: controller.signal,
        })
          .then((r) => (r.ok ? r.json() : Promise.reject()))
          .then((json) => {
            if (activeRequest) {
              const data = json.data || [];
              candleCache.set(cacheKey, { data, savedAt: Date.now() });
              setChartData({ key: cacheKey, candles: data });
              setChartLoading(false);
              setChartError(false);
            }
          })
          .catch(() => {
            if (activeRequest) {
              setChartLoading(false);
              setChartError(true);
            }
          });
        return;
      }
      if (background) candleCache.delete(cacheKey);
      loadSubnetCandles(selected, timeframe)
        .then((data) => {
          if (activeRequest) {
            setChartData({ key: cacheKey, candles: data });
            setChartLoading(false);
            setChartError(false);
          }
        })
        .catch((error) => {
          if (activeRequest && error?.name !== "AbortError") {
            setChartLoading(false);
            setChartError(!cached?.data.length);
          }
        });
    };
    refreshChart();
    const refreshTimer = window.setInterval(() => refreshChart(true), 30_000);
    return () => {
      activeRequest = false;
      controller.abort();
      window.clearInterval(refreshTimer);
    };
  }, [selected, timeframe, showTaoChart]);

  useEffect(() => {
    if (showTaoChart || !selected || chartLoading) return;
    let cancelled = false;
    const idle = window.setTimeout(() => {
      const prefetch = async () => {
        for (const value of (["10m", "1h", "1d"] as const).filter((item) => item !== timeframe)) {
          if (cancelled) return;
          const key = `${selected}:${value}`;
          if (candleCache.has(key)) continue;
          try {
            await loadSubnetCandles(selected, value);
          } catch {
            /* A direct selection will retry if prefetch fails. */
          }
        }
      };
      void prefetch();
    }, 750);
    return () => {
      cancelled = true;
      window.clearTimeout(idle);
    };
  }, [selected, timeframe, showTaoChart, chartLoading]);
  useEffect(() => {
    if (showTaoChart || !rows.length) return;
    let cancelled = false;
    const warmTimer = window.setTimeout(() => {
      const leaders = [...rows].sort((a, b) => Number(b.market_cap_tao || 0) - Number(a.market_cap_tao || 0)).slice(0, 14);
      const warm = async () => {
        for (const row of leaders) {
          if (cancelled) return;
          try {
            await loadSubnetCandles(row.netuid, timeframe);
          } catch {
            /* A direct selection retries stalled requests. */
          }
        }
      };
      void warm();
    }, 500);
    return () => {
      cancelled = true;
      window.clearTimeout(warmTimer);
    };
  }, [rows, timeframe, showTaoChart]);
  useEffect(() => {
    const refreshActivity = () => {
      fetch("/api/backend/v1/activity?limit=200", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((json) => {
          setActivity(json.data || []);
          setActivitySummary(json.summary || null);
          setActivityCollectingSince(json.collecting_since || null);
        })
        .catch(() => undefined);
    };
    refreshActivity();
    const refreshTimer = window.setInterval(refreshActivity, 60_000);
    return () => window.clearInterval(refreshTimer);
  }, []);

  const filtered = useMemo(() => rows.filter((r) => `${r.netuid} ${r.name} ${r.symbol}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => (sortDirection === "desc" ? Number(b[sort] ?? 0) - Number(a[sort] ?? 0) : Number(a[sort] ?? 0) - Number(b[sort] ?? 0))), [rows, query, sort, sortDirection]);
  const active = rows.find((r) => r.netuid === selected) || rows[0];
  const hasActiveMetadata = Boolean(active && (active.description || active.website || active.github_repo || active.discord || active.contact || active.additional));
  const portfolioAssets = useMemo(() => {
    const assets = new Map<string, PortfolioAsset>();
    const add = (key: string, netuid: number | null, name: string, symbol: string, alpha: number, taoValue: number, address: string) => {
      const existing = assets.get(key) || {
        key,
        netuid,
        name,
        symbol,
        alpha: 0,
        taoValue: 0,
        wallets: new Set<string>(),
      };
      existing.alpha += Number.isFinite(alpha) ? alpha : 0;
      existing.taoValue += Number.isFinite(taoValue) ? taoValue : 0;
      existing.wallets.add(address);
      assets.set(key, existing);
    };
    wallets.forEach((wallet) => {
      const free = Number(wallet.free_tao || 0);
      if (free > 0) add("tao", null, "Bittensor", "TAO", free, free, wallet.address);
      wallet.stakes.forEach((stake) => add(`sn-${stake.netuid}`, stake.netuid, stake.name || `Subnet ${stake.netuid}`, stake.symbol || `SN${stake.netuid}`, Number(stake.alpha || 0), Number(stake.tao_value || 0), wallet.address));
    });
    return [...assets.values()].filter((asset) => asset.taoValue > 0).sort((a, b) => b.taoValue - a.taoValue);
  }, [wallets]);
  const portfolioTotal = portfolioAssets.reduce((sum, asset) => sum + asset.taoValue, 0);
  const portfolioChartAssets = useMemo(() => {
    if (portfolioAssets.length <= 9) return portfolioAssets;
    const primary = portfolioAssets.slice(0, 8);
    const other = portfolioAssets.slice(8).reduce<PortfolioAsset>(
      (combined, asset) => {
        combined.alpha += asset.alpha;
        combined.taoValue += asset.taoValue;
        asset.wallets.forEach((wallet) => combined.wallets.add(wallet));
        return combined;
      },
      {
        key: "other",
        netuid: null,
        name: "Other assets",
        symbol: "OTHER",
        alpha: 0,
        taoValue: 0,
        wallets: new Set<string>(),
      },
    );
    return [...primary, other];
  }, [portfolioAssets]);
  const portfolioGradient = useMemo(() => {
    if (!portfolioTotal) return "#0a1731";
    let cursor = 0;
    return `conic-gradient(${portfolioChartAssets
      .map((asset, index) => {
        const start = cursor;
        cursor += (asset.taoValue / portfolioTotal) * 100;
        return `${portfolioColors[index % portfolioColors.length]} ${start}% ${cursor}%`;
      })
      .join(",")})`;
  }, [portfolioChartAssets, portfolioTotal]);
  const requestedChartKey = `${showTaoChart ? "tao" : selected}:${timeframe}`;
  const candles = chartData.key === requestedChartKey ? chartData.candles : [];
  const chartCandles = useMemo(() => withLiveCandle(candles, showTaoChart ? taoUsd : Number(active?.price_tao || 0), timeframe), [candles, showTaoChart, taoUsd, active?.price_tao, timeframe]);
  const totalVolume = rows.reduce((sum, r) => sum + Number(r.volume_24h_tao || 0), 0);
  const rankedMovers = [...rows].sort((a, b) => Number(b.change_1h || 0) - Number(a.change_1h || 0));
  const advancingMarkets = rows.filter((row) => Number(row.change_1h || 0) > 0).length;
  const decliningMarkets = rows.filter((row) => Number(row.change_1h || 0) < 0).length;
  const directionalMarkets = advancingMarkets + decliningMarkets;
  const marketBreadth = directionalMarkets ? (advancingMarkets / directionalMarkets) * 100 : 0;
  const liquidityFlowTao = rows.reduce((total, row) => {
    if (row.liquidity_change_1h == null) return total;
    const reserve = Number(row.tao_reserve || 0);
    const change = Number(row.liquidity_change_1h || 0) / 100;
    return reserve > 0 && change > -1 ? total + reserve - reserve / (1 + change) : total;
  }, 0);
  const emissionLeader = [...rows].filter((row) => row.emission_change_1h != null).sort((a, b) => Number(b.emission_change_1h || 0) - Number(a.emission_change_1h || 0))[0];
  const volumePulseTotals = rows.reduce(
    (totals, row) => {
      const current = Number(row.volume_1h_tao || 0);
      const acceleration = Number(row.volume_acceleration_1h || 0);
      if (current > 0 && acceleration > 0) {
        totals.current += current;
        totals.previous += current / acceleration;
      }
      return totals;
    },
    { current: 0, previous: 0 },
  );
  const volumePulse = volumePulseTotals.previous > 0 ? volumePulseTotals.current / volumePulseTotals.previous : 0;
  const marketCapLeaders = [...rows].sort((a, b) => Number(b.market_cap_tao || 0) - Number(a.market_cap_tao || 0)).slice(0, 14);
  const bubbleRows = useMemo(
    () =>
      [...rows]
        .filter((r) => r.netuid !== 0)
        .sort((a, b) => a.netuid - b.netuid)
        .slice(0, 128),
    [rows],
  );
  const bubbleSize = (row: ScreenerRow) => {
    const movement = Number(row[bubbleTimeframe] || 0);
    if (Math.abs(movement) <= 0.005) return 48;
    if (movement > 0) return Math.round(54 + Math.min(98, Math.pow(movement, 0.62) * 13));
    return Math.round(52 + Math.min(22, Math.sqrt(Math.abs(movement)) * 7));
  };
  const bubbleChange = (row: ScreenerRow) => row[bubbleTimeframe] as string | undefined;
  const startBubbleDrag = (event: ReactPointerEvent<HTMLButtonElement>, netuid: number) => {
    if (event.button !== 0 || !bubbleCloudRef.current) return;
    const bubble = event.currentTarget.getBoundingClientRect();
    const cloud = bubbleCloudRef.current.getBoundingClientRect();
    const offset = bubbleOffsets[netuid] || { x: 0, y: 0 };
    bubbleDragRef.current = {
      netuid,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: offset.x,
      offsetY: offset.y,
      minX: offset.x + cloud.left - bubble.left,
      maxX: offset.x + cloud.right - bubble.right,
      minY: offset.y + cloud.top - bubble.top,
      maxY: offset.y + cloud.bottom - bubble.bottom,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDraggingBubble(netuid);
  };
  const moveBubbleDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = bubbleDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.startX,
      dy = event.clientY - drag.startY;
    if (Math.hypot(dx, dy) > 4) drag.moved = true;
    const x = Math.max(drag.minX, Math.min(drag.maxX, drag.offsetX + dx));
    const y = Math.max(drag.minY, Math.min(drag.maxY, drag.offsetY + dy));
    setBubbleOffsets((current) => ({ ...current, [drag.netuid]: { x, y } }));
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
      style: "currency",
      currency: "USD",
      minimumFractionDigits: price && usd < 1 ? 4 : 0,
      maximumFractionDigits: price ? (usd < 1 ? 6 : 2) : 0,
    });
  };
  const privateMoney = (value?: string | number, price = false) => (hideBalances ? "$••••" : money(value, price));

  async function pollWalletJob(jobId: string, total: number) {
    if (walletPollingRef.current) return;
    walletPollingRef.current = true;
    let missedPolls = 0;
    try {
      for (let attempt = 0; attempt < 240; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, 2500));
        let job: { completed?: number; total?: number; status: string; error?: string; results?: Wallet[] };
        try {
          const response = await fetch(`/api/backend/v1/wallets/jobs/${jobId}`, { cache: "no-store" });
          if (!response.ok) throw new Error(`status ${response.status}`);
          job = await response.json();
          missedPolls = 0;
        } catch {
          missedPolls += 1;
          setWalletProgress(`Reconnecting… ${missedPolls}`);
          if (missedPolls >= 48) throw new Error("The wallet lookup could not reconnect after two minutes. Refresh the page to resume the same job.");
          continue;
        }
        setWalletProgress(`Checking ${job.completed || 0} of ${job.total || total}…`);
        if (job.status === "failed") {
          window.localStorage.removeItem("shizzy:wallet-job");
          throw new Error(job.error || "The wallet lookup could not complete.");
        }
        if (job.status === "complete") {
          window.localStorage.removeItem("shizzy:wallet-job");
          setWallets(job.results || []);
          setWalletDisplay("wallets");
          return;
        }
      }
      throw new Error("This lookup is still running after ten minutes. Refresh the page to resume the same job.");
    } finally {
      walletPollingRef.current = false;
    }
  }

  async function checkWallets(e: FormEvent) {
    e.preventDefault();
    setWalletError("");
    const addresses = [
      ...new Set(
        walletInput
          .split(/[\s,]+/)
          .map((v) => v.trim())
          .filter(Boolean),
      ),
    ];
    if (!addresses.length) return setWalletError("Paste at least one coldkey address.");
    setChecking(true);
    setWalletProgress("Starting lookup…");
    try {
      let res: Response | undefined;
      for (let attempt = 0; attempt < 7; attempt++) {
        try {
          res = await fetch("/api/backend/v1/wallets/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ addresses, persist: false }),
          });
          if (res.status < 500) break;
        } catch {
          res = undefined;
        }
        setWalletProgress("Node service reconnecting…");
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
      if (!res) throw new Error("The live wallet lookup is temporarily unavailable. Please try again shortly.");
      if (!res.ok) {
        const contentType = res.headers.get("content-type") || "";
        const errorBody = contentType.includes("application/json") ? await res.json().catch(() => null) : null;
        const validationMessage = errorBody?.detail?.[0]?.msg?.replace(/^Value error, /, "");
        if (res.status === 422) throw new Error(validationMessage || "One or more entries are not valid Bittensor public coldkeys.");
        if (res.status === 413) throw new Error("Too many coldkeys. Paste no more than 100 at once.");
        throw new Error("The live wallet lookup is temporarily unavailable. Your addresses were not saved; please try again shortly.");
      }
      const started = await res.json();
      window.localStorage.setItem("shizzy:wallet-job", JSON.stringify({ id: started.job_id, total: addresses.length }));
      await pollWalletJob(started.job_id, addresses.length);
    } catch (error) {
      setWalletError(error instanceof Error ? error.message : "The live wallet lookup is temporarily unavailable. Please try again shortly.");
    } finally {
      setChecking(false);
      setWalletProgress("");
    }
  }

  function changeSort(field: keyof ScreenerRow) {
    if (sort === field) setSortDirection((current) => (current === "desc" ? "asc" : "desc"));
    else {
      setSort(field);
      setSortDirection("desc");
    }
  }
  function openSubnetChart(netuid: number) {
    setShowTaoChart(false);
    setMarketDetailOpen(true);
    const subnet = rows.find((row) => row.netuid === netuid);
    setSubnetPanel(subnet && (subnet.description || subnet.website || subnet.github_repo || subnet.discord || subnet.contact || subnet.additional) ? "overview" : "chart");
    setSelected(netuid);
    setView("screener");
  }
  function warmSubnetChart(netuid: number) {
    void loadSubnetCandles(netuid, timeframe).catch(() => undefined);
  }
  function openTaoChart() {
    setShowTaoChart(true);
    setMarketDetailOpen(true);
    setSubnetPanel("chart");
    setView("screener");
  }
  const taoChartChange = chartCandles.length > 1 ? (Number(chartCandles.at(-1)?.close || 0) / Number(chartCandles[0]?.open || 1) - 1) * 100 : 0;
  const clampScore = (value: number) => Math.round(Math.max(0, Math.min(100, value)));
  const signalData = active
    ? (() => {
        const change10 = Number(active.change_10m || 0),
          change1h = Number(active.change_1h || 0),
          change24 = Number(active.change_24h || 0);
        const liquidityFlow = Number(active.liquidity_change_1h || 0),
          emissionFlow = Number(active.emission_change_1h || 0);
        const volumeAcceleration = Number(active.volume_acceleration_1h || 0);
        const marketCap = Number(active.market_cap_tao || 0),
          liquidity = Number(active.tao_reserve || 0);
        const coverage = marketCap > 0 ? (liquidity / marketCap) * 100 : 0;
        const momentum = clampScore(50 + (change10 * 0.2 + change1h * 0.45 + change24 * 0.35) * 6);
        const liquidityScore = clampScore(50 + liquidityFlow * 8);
        const emissionScore = clampScore(50 + emissionFlow * 40);
        const activityScore = clampScore(Number.isFinite(volumeAcceleration) ? volumeAcceleration * 50 : 0);
        const risk = clampScore(78 - coverage * 1.6 + Math.abs(change1h) * 5);
        return {
          change10,
          change1h,
          change24,
          liquidityFlow,
          emissionFlow,
          volumeAcceleration,
          coverage,
          momentum,
          liquidityScore,
          emissionScore,
          activityScore,
          risk,
        };
      })()
    : null;
  const sortArrow = (field: keyof ScreenerRow) => (sort === field ? (sortDirection === "desc" ? " ↓" : " ↑") : "");
  const shortKey = (value?: string) => (value ? `${value.slice(0, 6)}…${value.slice(-5)}` : "—");
  const knownValidatorNames: Record<string, string> = {
    "5E4z3h9yVhmQyCFWNbY9BPpwhx4xFiPwq3eeqmBgVF6KULde": "Tensorplex Labs",
  };
  const eventLabel = (event: ChainEvent) =>
    ({
      StakeLocked: "Conviction locked",
      StakeUnlocked: "Conviction unlocked",
      LockMoved: "Lock moved",
      PerpetualLockUpdated: event.perpetual ? "Perpetual lock enabled" : "Perpetual lock disabled",
      StakeMoved: "Stake moved",
      StakeSwapped: "Stake swapped",
      StakeTransferred: "Stake transferred",
      HotkeySwapped: "Hotkey swapped",
      HotkeySwappedOnSubnet: "Subnet hotkey swapped",
      SubnetOwnerChanged: "Subnet owner changed",
    })[event.event_type] || event.event_type;
  const subnetLabel = (netuid?: number, name?: string) => {
    if (netuid === 0) return "Root";
    if (name && name.toLowerCase() !== "deprecated") return name;
    if (netuid != null) return name ? `Retired SN${netuid}` : `SN${netuid}`;
    return "Network";
  };
  const eventSubnet = (event: ChainEvent) => subnetLabel(event.netuid, event.name);
  const eventDestination = (event: ChainEvent) => subnetLabel(event.destination_netuid, event.destination_name);
  const eventCategory = (event: ChainEvent) => (event.event_type.includes("Lock") ? "locks" : event.event_type.includes("Hotkey") || event.event_type === "SubnetOwnerChanged" ? "keys" : "stake");
  const meaningfulActivity = activity.filter((event) => !["StakeLocked", "StakeUnlocked"].includes(event.event_type) || Number(event.tao_value || 0) >= 10);
  const visibleActivity = meaningfulActivity.filter((event) => activityFilter === "all" || eventCategory(event) === activityFilter);
  const keyChangeCount = meaningfulActivity.filter((event) => eventCategory(event) === "keys").length;
  const convictionEventCount = meaningfulActivity.filter((event) => eventCategory(event) === "locks").length;
  const convictionLeaders = [...rows].sort((a, b) => Number(b.conviction_locked_pct || 0) - Number(a.conviction_locked_pct || 0));
  const emissionMovers = [...rows].filter((row) => row.emission_change_1h != null).sort((a, b) => Math.abs(Number(b.emission_change_1h || 0)) - Math.abs(Number(a.emission_change_1h || 0)));
  const liquidityMovers = [...rows].filter((row) => row.liquidity_change_1h != null).sort((a, b) => Math.abs(Number(b.liquidity_change_1h || 0)) - Math.abs(Number(a.liquidity_change_1h || 0)));
  const activityHours = activityCollectingSince ? Math.max(0, (Date.now() - new Date(activityCollectingSince).getTime()) / 3_600_000) : 0;
  const activityPeriod = activityHours < 24 ? `Since tracking began · ${activityHours < 1 ? "<1" : Math.floor(activityHours)}h` : "Last 24 hours";
  const eventDescription = (event: ChainEvent) => {
    const source = eventSubnet(event),
      destination = eventDestination(event);
    if (event.event_type === "StakeLocked") return `Conviction locked on ${source}`;
    if (event.event_type === "StakeUnlocked") return `Conviction unlocked on ${source}`;
    if (event.event_type === "StakeSwapped") return `Stake swapped from ${source} into ${destination}`;
    if (event.event_type === "StakeTransferred") return `Stake transferred from ${source} to ${destination}`;
    if (event.event_type === "StakeMoved") return source === destination ? `Stake moved between hotkeys on ${source}` : `Stake moved from ${source} to ${destination}`;
    if (event.event_type === "LockMoved") return `Conviction lock moved on ${source}`;
    if (event.event_type.includes("Hotkey")) return `Hotkey changed${event.netuid != null ? ` on ${source}` : ""}`;
    if (event.event_type === "SubnetOwnerChanged") return `${source} ownership changed`;
    return eventLabel(event);
  };
  const validatorIdentity = (hotkey?: string) => {
    if (!hotkey) return null;
    const knownName = knownValidatorNames[hotkey];
    return knownName ? `${knownName} (${shortKey(hotkey)})` : shortKey(hotkey);
  };
  const eventIdentity = (event: ChainEvent) => {
    const parts: string[] = [];
    const category = eventCategory(event);
    if (event.coldkey) parts.push(`${category === "stake" || category === "locks" ? "Delegator wallet" : "Wallet"} ${shortKey(event.coldkey)}`);
    if (event.hotkey) parts.push(`${category === "stake" || category === "locks" ? "Validator" : "Hotkey"} ${validatorIdentity(event.hotkey)}`);
    if (event.destination_hotkey) parts.push(`→ ${category === "stake" || category === "locks" ? "Validator" : "Hotkey"} ${validatorIdentity(event.destination_hotkey)}`);
    else if (event.destination_coldkey) parts.push(`→ Wallet ${shortKey(event.destination_coldkey)}`);
    return parts.length ? parts.join(" · ") : "Finalized on Finney";
  };

  return (
    <main className="shell">
      <section className="market-ticker" aria-label="Top subnet tokens by market capitalization">
        <div className="ticker-label">
          <span>Market leaders</span>
          <small>1 Hour</small>
        </div>
        <div className="ticker-window">
          <div className="ticker-track">
            {[...marketCapLeaders, ...marketCapLeaders].map((r, i) => (
              <button key={`${r.netuid}-${i}`} onClick={() => openSubnetChart(r.netuid)}>
                <span>
                  <b>{r.name || `Subnet ${r.netuid}`}</b>
                  <small>SN{r.netuid}</small>
                </span>
                <strong>{money(r.price_tao, true)}</strong>
                <em className={changeClass(r.change_1h)}>
                  {Number(r.change_1h || 0) > 0 ? "+" : ""}
                  {fmt(r.change_1h)}%
                </em>
              </button>
            ))}
          </div>
        </div>
      </section>
      <header className="topbar">
        <Link className="brand" href="/" aria-label="Shizzy Unchained home">
          <img src="/shizzy-unchained-logo.svg" alt="Shizzy Unchained" />
        </Link>
        <button className={`mobile-menu-toggle ${mobileMenuOpen ? "open" : ""}`} aria-label="Open navigation menu" aria-expanded={mobileMenuOpen} aria-controls="primary-navigation" onClick={() => setMobileMenuOpen((open) => !open)}>
          <span />
          <span />
          <span />
        </button>
        <nav id="primary-navigation" className={mobileMenuOpen ? "mobile-open" : ""} aria-label="Primary navigation">
          <Link className={view === "screener" ? "active" : ""} href="/" onClick={() => setMobileMenuOpen(false)}>
            Market
          </Link>
          <Link className={view === "activity" ? "active" : ""} href="/activity" onClick={() => setMobileMenuOpen(false)}>
            Chain
          </Link>
          <Link className={view === "bubbles" ? "active" : ""} href="/bubbles" onClick={() => setMobileMenuOpen(false)}>
            Bubbles
          </Link>
          <Link className={view === "videos" ? "active" : ""} href="/video" onClick={() => setMobileMenuOpen(false)}>
            Videos
          </Link>
          <Link href="/deep-dives" onClick={() => setMobileMenuOpen(false)}>
            Deep Dives
          </Link>
          <a href="https://shizzyunchained.printful.me/" target="_blank" rel="noreferrer" onClick={() => setMobileMenuOpen(false)}>
            Shop
          </a>
          <Link className={view === "university" ? "active" : ""} href="/university" onClick={() => setMobileMenuOpen(false)}>
            Shiz University
          </Link>
          <Link className={view === "wallets" ? "active" : ""} href="/wallet-tracker" onClick={() => setMobileMenuOpen(false)}>
            Wallet tracker
          </Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
            About
          </Link>
          <Link className={view === "partners" ? "active" : ""} href="/partners" onClick={() => setMobileMenuOpen(false)}>
            Partners
          </Link>
        </nav>
        <div className="header-actions">
          <div className="currency-toggle" role="group" aria-label="Display currency" title={taoUsd ? `1 TAO = ${taoUsd.toLocaleString("en-US", { style: "currency", currency: "USD" })}` : "Loading live TAO price"}>
            <button className={currency === "usd" ? "active" : ""} aria-pressed={currency === "usd"} onClick={() => setCurrency("usd")}>
              USD
            </button>
            <button className={currency === "tao" ? "active" : ""} aria-pressed={currency === "tao"} onClick={() => setCurrency("tao")}>
              TAO
            </button>
          </div>
          <div className={`status ${dataState === "live" ? "live" : "demo"}`} title={lastUpdated ? `Last updated ${lastUpdated.toLocaleTimeString()}` : undefined}>
            <i />
            {dataState === "live" ? "Finney live" : dataState === "loading" ? "Connecting…" : "Reconnecting…"}
          </div>
        </div>
      </header>

      {view === "screener" ? (
        <>
          <section className="hero-strip">
            <button className={`tao-price-tile ${showTaoChart ? "active" : ""}`} onClick={openTaoChart} aria-label="Open TAO price chart">
              <span>TAO price</span>
              <strong>{currency === "usd" ? money(1, true) : "τ 1"}</strong>
              <small>Open TAO / USD chart →</small>
            </button>
            <div>
              <span>24h volume</span>
              <strong>{dataState !== "live" || totalVolume === 0 ? "—" : money(totalVolume)}</strong>
              <small>{dataState === "live" ? (totalVolume === 0 ? "Collecting trade history" : `Across ${rows.length} markets`) : "Connecting to Finney"}</small>
            </div>
            <div>
              <span>Top mover</span>
              <strong className={changeClass(rankedMovers[0]?.change_1h)}>{rankedMovers[0]?.name || "—"}</strong>
              <small className={changeClass(rankedMovers[0]?.change_1h)}>{rankedMovers[0] ? `${Number(rankedMovers[0].change_1h || 0) > 0 ? "+" : ""}${fmt(rankedMovers[0].change_1h)}% · 1 Hour` : "Waiting for market data"}</small>
            </div>
            <div>
              <span>Network</span>
              <strong>FINNEY</strong>
              <small>Finalized blocks only</small>
            </div>
          </section>
          <section className="network-pulse panel" aria-label="Network pulse">
            <div className="network-pulse-label">
              <span>Network pulse</span>
              <small>1 Hour</small>
            </div>
            <button
              onClick={() => {
                setSort("change_1h");
                setSortDirection("desc");
              }}
            >
              <span>Breadth</span>
              <strong className={marketBreadth >= 50 ? "positive" : "negative"}>{directionalMarkets ? `${Math.round(marketBreadth)}%` : "—"}</strong>
              <small>
                {advancingMarkets} rising · {decliningMarkets} falling
              </small>
            </button>
            <button onClick={() => rankedMovers[0] && openSubnetChart(rankedMovers[0].netuid)}>
              <span>Momentum</span>
              <strong>{rankedMovers[0]?.name || "—"}</strong>
              <small className={changeClass(rankedMovers[0]?.change_1h)}>{rankedMovers[0] ? `${Number(rankedMovers[0].change_1h || 0) >= 0 ? "+" : ""}${fmt(rankedMovers[0].change_1h)}% leader` : "Collecting"}</small>
            </button>
            <button
              onClick={() => {
                setSort("liquidity_change_1h");
                setSortDirection("desc");
              }}
            >
              <span>Liquidity flow</span>
              <strong className={liquidityFlowTao > 0 ? "positive" : liquidityFlowTao < 0 ? "negative" : ""}>{liquidityFlowTao === 0 ? "—" : `${liquidityFlowTao > 0 ? "+" : "−"}${money(Math.abs(liquidityFlowTao))}`}</strong>
              <small>Net TAO reserve</small>
            </button>
            <button
              onClick={() => {
                setSort("emission_change_1h");
                setSortDirection("desc");
              }}
            >
              <span>Emission</span>
              <strong>{emissionLeader?.name || "—"}</strong>
              <small className={changeClass(emissionLeader?.emission_change_1h)}>{emissionLeader ? `${Number(emissionLeader.emission_change_1h || 0) >= 0 ? "+" : ""}${fmt(emissionLeader.emission_change_1h, 4)} pts` : "Collecting"}</small>
            </button>
            <button
              onClick={() => {
                setSort("volume_1h_tao");
                setSortDirection("desc");
              }}
            >
              <span>Volume pulse</span>
              <strong className={volumePulse >= 1 ? "positive" : volumePulse > 0 ? "negative" : ""}>{volumePulse ? `${fmt(volumePulse, 2)}×` : "—"}</strong>
              <small>vs previous hour</small>
            </button>
          </section>
          <div className="market-content">
            {marketDetailOpen && (
              <div className="market-modal-backdrop" onMouseDown={() => setMarketDetailOpen(false)}>
                <div className="market-modal" role="dialog" aria-modal="true" aria-label={showTaoChart ? "TAO market details" : `${active?.name || `Subnet ${active?.netuid}`} market details`} onMouseDown={(event) => event.stopPropagation()}>
                  <button ref={marketModalCloseRef} className="market-modal-close" onClick={() => setMarketDetailOpen(false)} aria-label="Close market details">
                    ×
                  </button>
                  <section className="market-grid">
                    <div ref={chartCardRef} className="chart-card panel">
                      {dataState !== "live" && (
                        <div className="market-loading" role="status">
                          <i />
                          <strong>{dataState === "loading" ? "Connecting to Finney" : "Market feed unavailable"}</strong>
                          <span>{dataState === "loading" ? "Loading finalized subnet data…" : "We’ll reconnect automatically."}</span>
                        </div>
                      )}
                      {dataState === "live" && (
                        <>
                          <div className="panel-head">
                            <div>
                              <p className="eyebrow chart-subnet-id">{showTaoChart ? "TAO · USD" : `SN${active?.netuid} · ${active?.symbol || "ALPHA"}`}</p>
                              <h1>{showTaoChart ? "Bittensor" : active?.name || `Subnet ${active?.netuid}`}</h1>
                            </div>
                            <div className="quote">
                              <strong>
                                {showTaoChart
                                  ? taoUsd.toLocaleString("en-US", {
                                      style: "currency",
                                      currency: "USD",
                                    })
                                  : money(active?.price_tao, true)}
                              </strong>
                              <span className={changeClass(showTaoChart ? String(taoChartChange) : active?.change_1h)}>
                                {Number(showTaoChart ? taoChartChange : active?.change_1h || 0) > 0 ? "+" : ""}
                                {fmt(showTaoChart ? taoChartChange : active?.change_1h)}% · {timeframe === "1d" ? "1 Day" : timeframe === "1h" ? "1 Hour" : "10 Minutes"}
                              </span>
                            </div>
                          </div>
                          {!showTaoChart && hasActiveMetadata && (
                            <div className="subnet-view-tabs" role="tablist" aria-label="Subnet details">
                              <button role="tab" aria-selected={subnetPanel === "overview"} className={subnetPanel === "overview" ? "active" : ""} onClick={() => setSubnetPanel("overview")}>
                                Overview
                              </button>
                              <button role="tab" aria-selected={subnetPanel === "chart"} className={subnetPanel === "chart" ? "active" : ""} onClick={() => setSubnetPanel("chart")}>
                                Chart
                              </button>
                            </div>
                          )}
                          {showTaoChart || !hasActiveMetadata || subnetPanel === "chart" ? (
                            <>
                              <TradingChart key={requestedChartKey} candles={chartCandles} currency={currency} taoUsd={taoUsd} timeframe={timeframe} onTimeframeChange={setTimeframe} valueCurrency={showTaoChart ? "usd" : "tao"} loading={chartLoading} error={chartError} />
                              {showTaoChart ? (
                                <div className="chart-stats">
                                  <span>
                                    Pair <b>TAO / USD</b>
                                  </span>
                                  <span>
                                    Price source <b>Coinbase</b>
                                  </span>
                                  <span>
                                    History <b>{candles.length} candles</b>
                                  </span>
                                </div>
                              ) : (
                                <div className="chart-stats">
                                  <span>
                                    Liquidity <b>{money(active?.tao_reserve)}</b>
                                  </span>
                                  <span>
                                    Market cap <b>{money(active?.market_cap_tao)}</b>
                                  </span>
                                  <span>
                                    24h vol <b>{Number(active?.volume_24h_tao || 0) === 0 ? "Collecting" : money(active?.volume_24h_tao)}</b>
                                  </span>
                                </div>
                              )}
                            </>
                          ) : (
                            active && (
                              <div className="subnet-overview" role="tabpanel">
                                <div className="subnet-description">
                                  <p className="eyebrow">Owner-submitted on-chain metadata</p>
                                  <h2>What this subnet does</h2>
                                  {active.description ? <p>{active.description}</p> : <p className="metadata-empty">The subnet owner has not published a description on-chain yet.</p>}
                                  {active.additional && <p className="project-additional">{active.additional}</p>}
                                </div>
                                <div className="overview-stats">
                                  <span>
                                    Market cap <b>{money(active.market_cap_tao)}</b>
                                  </span>
                                  <span>
                                    Liquidity <b>{money(active.tao_reserve)}</b>
                                  </span>
                                  <span>
                                    24h volume <b>{Number(active.volume_24h_tao || 0) === 0 ? "Collecting" : money(active.volume_24h_tao)}</b>
                                  </span>
                                  <span>
                                    Emission <b>{active.emission_pct == null ? "—" : `${fmt(active.emission_pct, 4)}%`}</b>
                                  </span>
                                </div>
                                <div className="project-links">
                                  {safeProjectUrl(active.website) && (
                                    <a href={safeProjectUrl(active.website)} target="_blank" rel="noopener noreferrer">
                                      Website ↗
                                    </a>
                                  )}
                                  {safeProjectUrl(active.github_repo) && (
                                    <a href={safeProjectUrl(active.github_repo)} target="_blank" rel="noopener noreferrer">
                                      GitHub ↗
                                    </a>
                                  )}
                                  {safeProjectUrl(active.discord) && (
                                    <a href={safeProjectUrl(active.discord)} target="_blank" rel="noopener noreferrer">
                                      Discord ↗
                                    </a>
                                  )}
                                  {active.contact && (
                                    <span>
                                      Contact <b>{active.contact}</b>
                                    </span>
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </>
                      )}
                    </div>
                    <aside className="movers panel">
                      <div className="panel-title">
                        <h2>Momentum</h2>
                        <span>1 Hour</span>
                      </div>
                      {rankedMovers.slice(0, 5).map((r, i) => (
                        <button key={r.netuid} onClick={() => openSubnetChart(r.netuid)}>
                          <em>{String(i + 1).padStart(2, "0")}</em>
                          <span>
                            <b>{r.name || `Subnet ${r.netuid}`}</b>
                            <small>SN{r.netuid}</small>
                          </span>
                          <strong className={changeClass(r.change_1h)}>
                            {Number(r.change_1h) > 0 ? "+" : ""}
                            {fmt(r.change_1h)}%
                          </strong>
                        </button>
                      ))}
                    </aside>
                  </section>
                  {!showTaoChart && active && signalData && (
                    <section className="trading-signals panel" aria-labelledby="signals-title">
                      <div className="signals-head">
                        <div>
                          <p className="eyebrow">On-chain research</p>
                          <h2 id="signals-title">Trading signals · {active.name || `SN${active.netuid}`}</h2>
                        </div>
                        <span>Transparent indicators · Not financial advice</span>
                      </div>
                      <div className="signal-grid">
                        <article>
                          <div>
                            <span>Momentum</span>
                            <strong>{signalData.momentum}</strong>
                          </div>
                          <i
                            style={
                              {
                                "--score": `${signalData.momentum}%`,
                              } as CSSProperties
                            }
                          />
                          <p className={signalData.momentum >= 55 ? "positive" : signalData.momentum <= 45 ? "negative" : ""}>{signalData.momentum >= 55 ? "Positive alignment" : signalData.momentum <= 45 ? "Negative alignment" : "Mixed direction"}</p>
                          <small>
                            10m {signalData.change10 >= 0 ? "+" : ""}
                            {fmt(signalData.change10)}% · 1h {signalData.change1h >= 0 ? "+" : ""}
                            {fmt(signalData.change1h)}% · 1d {signalData.change24 >= 0 ? "+" : ""}
                            {fmt(signalData.change24)}%
                          </small>
                        </article>
                        <article>
                          <div>
                            <span>Liquidity flow</span>
                            <strong>{active.liquidity_change_1h == null ? "—" : signalData.liquidityScore}</strong>
                          </div>
                          <i
                            style={
                              {
                                "--score": `${signalData.liquidityScore}%`,
                              } as CSSProperties
                            }
                          />
                          <p className={signalData.liquidityFlow > 0 ? "positive" : signalData.liquidityFlow < 0 ? "negative" : ""}>{active.liquidity_change_1h == null ? "Collecting history" : signalData.liquidityFlow > 0 ? "TAO entering pool" : signalData.liquidityFlow < 0 ? "TAO leaving pool" : "Liquidity unchanged"}</p>
                          <small>{active.liquidity_change_1h == null ? "Needs one hour of comparable reserve data" : `${signalData.liquidityFlow >= 0 ? "+" : ""}${fmt(signalData.liquidityFlow)}% TAO reserve over 1h`}</small>
                        </article>
                        <article>
                          <div>
                            <span>Emission trend</span>
                            <strong>{active.emission_change_1h == null ? "—" : signalData.emissionScore}</strong>
                          </div>
                          <i
                            style={
                              {
                                "--score": `${signalData.emissionScore}%`,
                              } as CSSProperties
                            }
                          />
                          <p className={signalData.emissionFlow > 0 ? "positive" : signalData.emissionFlow < 0 ? "negative" : ""}>{active.emission_change_1h == null ? "Collecting history" : signalData.emissionFlow > 0 ? "Allocation increasing" : signalData.emissionFlow < 0 ? "Allocation decreasing" : "Allocation steady"}</p>
                          <small>{active.emission_change_1h == null ? "Needs one hour of comparable emission data" : `${signalData.emissionFlow >= 0 ? "+" : ""}${fmt(signalData.emissionFlow, 4)} percentage points over 1h`}</small>
                        </article>
                        <article>
                          <div>
                            <span>Volume activity</span>
                            <strong>{active.volume_acceleration_1h == null ? "—" : signalData.activityScore}</strong>
                          </div>
                          <i
                            style={
                              {
                                "--score": `${signalData.activityScore}%`,
                              } as CSSProperties
                            }
                          />
                          <p>{active.volume_acceleration_1h == null ? "Collecting history" : signalData.volumeAcceleration >= 1.25 ? "Volume accelerating" : signalData.volumeAcceleration <= 0.75 ? "Volume cooling" : "Normal activity"}</p>
                          <small>{active.volume_acceleration_1h == null ? "Needs two complete hourly windows" : `${fmt(signalData.volumeAcceleration, 2)}× previous hour`}</small>
                        </article>
                        <article className="risk-signal">
                          <div>
                            <span>Risk</span>
                            <strong>{signalData.risk}</strong>
                          </div>
                          <i
                            style={
                              {
                                "--score": `${signalData.risk}%`,
                              } as CSSProperties
                            }
                          />
                          <p className={signalData.risk >= 65 ? "negative" : signalData.risk <= 35 ? "positive" : ""}>{signalData.risk >= 65 ? "Higher market risk" : signalData.risk <= 35 ? "Lower relative risk" : "Moderate market risk"}</p>
                          <small>
                            {fmt(signalData.coverage)}% liquidity coverage · {fmt(Math.abs(signalData.change1h))}% 1h volatility
                          </small>
                        </article>
                      </div>
                      <p className="signals-note">Scores compare current on-chain conditions, not future performance. Thin liquidity, missing history, and sudden chain events can make any signal unreliable.</p>
                    </section>
                  )}
                </div>
              </div>
            )}
            <section className="screener panel">
              <div className="screener-head">
                <div>
                  <p className="eyebrow">Bittensor markets</p>
                  <h2>Subnet screener</h2>
                </div>
                <label className="search">
                  <span>⌕</span>
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search subnet or netuid" />
                </label>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>
                        <button onClick={() => changeSort("netuid")}>Subnet{sortArrow("netuid")}</button>
                      </th>
                      <th>
                        <button onClick={() => changeSort("price_tao")}>
                          Price {currency === "usd" ? "$" : "τ"}
                          {sortArrow("price_tao")}
                        </button>
                      </th>
                      <th>
                        <button onClick={() => changeSort("market_cap_tao")}>Market Cap{sortArrow("market_cap_tao")}</button>
                      </th>
                      <th>
                        <button onClick={() => changeSort("change_10m")}>10 Minutes{sortArrow("change_10m")}</button>
                      </th>
                      <th>
                        <button onClick={() => changeSort("change_1h")}>1 Hour{sortArrow("change_1h")}</button>
                      </th>
                      <th>
                        <button onClick={() => changeSort("change_24h")}>1 Day{sortArrow("change_24h")}</button>
                      </th>
                      <th>
                        <button onClick={() => changeSort("change_7d")}>7 Day{sortArrow("change_7d")}</button>
                      </th>
                      <th>
                        <button onClick={() => changeSort("emission_pct")}>Emission %{sortArrow("emission_pct")}</button>
                      </th>
                      <th title="Annualized latest on-chain validator dividends per tempo, divided by subnet alpha stake.">
                        <button onClick={() => changeSort("apy")}>Staker APY{sortArrow("apy")}</button>
                      </th>
                      <th title="Percentage of the subnet's full on-chain Alpha supply currently conviction locked.">
                        <button onClick={() => changeSort("conviction_locked_pct")}>Supply Locked{sortArrow("conviction_locked_pct")}</button>
                      </th>
                      <th>
                        <button onClick={() => changeSort("volume_24h_tao")}>Volume{sortArrow("volume_24h_tao")}</button>
                      </th>
                      <th>
                        <button onClick={() => changeSort("tao_reserve")}>Liquidity{sortArrow("tao_reserve")}</button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r, i) => (
                      <tr
                        key={r.netuid}
                        className={r.netuid === selected ? "selected" : ""}
                        onPointerEnter={() => warmSubnetChart(r.netuid)}
                        onFocus={() => warmSubnetChart(r.netuid)}
                        onClick={() => openSubnetChart(r.netuid)}
                        tabIndex={0}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            openSubnetChart(r.netuid);
                          }
                        }}
                      >
                        <td>{i + 1}</td>
                        <td>
                          <div>
                            <b>{r.name || `Subnet ${r.netuid}`}</b>
                            <small>SN{r.netuid}</small>
                          </div>
                        </td>
                        <td>{money(r.price_tao, true)}</td>
                        <td>{money(r.market_cap_tao)}</td>
                        {[r.change_10m, r.change_1h, r.change_24h, r.change_7d].map((v, j) => (
                          <td key={j} className={changeClass(v)}>
                            {Number(v || 0) > 0 ? "+" : ""}
                            {fmt(v)}%
                          </td>
                        ))}
                        <td className="emission-cell">
                          {r.emission_pct == null ? "—" : `${fmt(r.emission_pct, 4)}%`}
                          <small>of each block</small>
                        </td>
                        <td className="apy-cell" title="Annualized latest on-chain validator dividends per tempo, divided by subnet alpha stake.">
                          {r.apy == null ? "—" : `${fmt(r.apy, Number(r.apy) < 1 ? 4 : 2)}%`}
                          <small>latest realized tempo</small>
                        </td>
                        <td>{r.conviction_locked_pct == null ? "—" : `${fmt(r.conviction_locked_pct, 2)}%`}</td>
                        <td>{money(r.volume_24h_tao)}</td>
                        <td>{money(r.tao_reserve)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </>
      ) : view === "activity" ? (
        <section className="activity-page">
          <div className="activity-hero">
            <div>
              <p className="eyebrow">Live from your node</p>
              <h1>
                Chain activity.
                <br />
                <span>Finalized and transparent.</span>
              </h1>
            </div>
            <p>Follow stake flows, conviction locks, hotkey changes, and subnet ownership events across Finney as they finalize.</p>
          </div>
          <section className="chain-intel-grid" aria-label="Subnet chain intelligence">
            <article className="conviction-board panel">
              <div className="intel-panel-head">
                <div>
                  <p className="eyebrow">Conviction leaderboard</p>
                  <h2>Supply locked by subnet</h2>
                </div>
                <span>All {convictionLeaders.length} subnets · Live finalized state</span>
              </div>
              <div className="conviction-ranking">
                {convictionLeaders.map((row, index) => (
                  <button key={row.netuid} onClick={() => openSubnetChart(row.netuid)}>
                    <em>{String(index + 1).padStart(2, "0")}</em>
                    <span>
                      <b>{row.name || `Subnet ${row.netuid}`}</b>
                      <small>SN{row.netuid}</small>
                    </span>
                    <i>
                      <u
                        style={{
                          width: `${Math.min(100, Number(row.conviction_locked_pct || 0))}%`,
                        }}
                      />
                    </i>
                    <strong>{fmt(row.conviction_locked_pct, 2)}%</strong>
                  </button>
                ))}
                {!convictionLeaders.length && <div className="intel-empty">Waiting for finalized conviction data…</div>}
              </div>
            </article>
            <div className="flow-panels">
              <article className="flow-board panel">
                <div className="intel-panel-head">
                  <div>
                    <p className="eyebrow">Emission movement</p>
                    <h2>Largest 1-hour changes</h2>
                  </div>
                  <span>Percentage points</span>
                </div>
                <div className="flow-ranking">
                  {emissionMovers.map((row) => (
                    <button key={row.netuid} onClick={() => openSubnetChart(row.netuid)}>
                      <span>
                        <b>{row.name || `Subnet ${row.netuid}`}</b>
                        <small>SN{row.netuid}</small>
                      </span>
                      <strong className={changeClass(row.emission_change_1h)}>
                        {Number(row.emission_change_1h || 0) > 0 ? "+" : ""}
                        {fmt(row.emission_change_1h, 4)}
                      </strong>
                    </button>
                  ))}
                </div>
              </article>
              <article className="flow-board panel">
                <div className="intel-panel-head">
                  <div>
                    <p className="eyebrow">Liquidity movement</p>
                    <h2>Largest 1-hour changes</h2>
                  </div>
                  <span>TAO reserves</span>
                </div>
                <div className="flow-ranking">
                  {liquidityMovers.map((row) => (
                    <button key={row.netuid} onClick={() => openSubnetChart(row.netuid)}>
                      <span>
                        <b>{row.name || `Subnet ${row.netuid}`}</b>
                        <small>SN{row.netuid}</small>
                      </span>
                      <strong className={changeClass(row.liquidity_change_1h)}>
                        {Number(row.liquidity_change_1h || 0) > 0 ? "+" : ""}
                        {fmt(row.liquidity_change_1h, 2)}%
                      </strong>
                    </button>
                  ))}
                </div>
              </article>
            </div>
          </section>
          <section className="chain-activity panel" aria-labelledby="activity-title">
            <div className="activity-head">
              <div>
                <p className="eyebrow">Finalized chain intelligence</p>
                <h2 id="activity-title">Conviction, keys, and ownership</h2>
              </div>
              <span>{activityPeriod} · Refreshes every 60 seconds</span>
            </div>
            <div className="activity-summary">
              <article>
                <span>Conviction locked</span>
                <strong>{fmt(activitySummary?.locked_tao_24h, 3)} τ</strong>
                <small>Locks worth at least 10 TAO · {activityPeriod}</small>
              </article>
              <article>
                <span>Conviction unlocked</span>
                <strong>{fmt(activitySummary?.unlocked_tao_24h, 3)} τ</strong>
                <small>Unlocks worth at least 10 TAO · {activityPeriod}</small>
              </article>
              <article>
                <span>Net conviction flow</span>
                <strong className={Number(activitySummary?.net_locked_tao_24h || 0) >= 0 ? "positive" : "negative"}>
                  {Number(activitySummary?.net_locked_tao_24h || 0) > 0 ? "+" : ""}
                  {fmt(activitySummary?.net_locked_tao_24h, 3)} τ
                </strong>
                <small>
                  {fmt(activitySummary?.locked_tao_24h, 2)} locked · {fmt(activitySummary?.unlocked_tao_24h, 2)} unlocked
                </small>
              </article>
              <article>
                <span>Key & owner changes</span>
                <strong>{keyChangeCount}</strong>
                <small>{convictionEventCount} conviction events collected</small>
              </article>
            </div>
            <div className="activity-toolbar">
              <div role="group" aria-label="Filter chain events">
                {[
                  ["all", "All activity"],
                  ["locks", "Conviction"],
                  ["keys", "Keys & owners"],
                ].map(([value, label]) => (
                  <button key={value} className={activityFilter === value ? "active" : ""} onClick={() => setActivityFilter(value as typeof activityFilter)}>
                    {label}
                  </button>
                ))}
              </div>
              <span>{visibleActivity.length} recent events</span>
            </div>
            {visibleActivity.length ? (
              <div className="activity-list">
                {visibleActivity.map((event) => (
                  <article key={`${event.block_number}-${event.event_index}`}>
                    <time>
                      {new Date(event.time).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                      <small>Block {event.block_number.toLocaleString()}</small>
                    </time>
                    <span className={`event-badge ${event.event_type.toLowerCase()}`}>{eventLabel(event)}</span>
                    <div>
                      <b>{eventDescription(event)}</b>
                      <small>{eventIdentity(event)}</small>
                    </div>
                    <strong>{event.tao_value != null ? `${fmt(event.tao_value, 3)} τ` : "—"}</strong>
                  </article>
                ))}
              </div>
            ) : (
              <div className="activity-empty">
                <b>No {activityFilter === "all" ? "" : activityFilter} events in the collected window.</b>
                <span>Try another filter. New finalized events appear automatically.</span>
              </div>
            )}
            <p className="activity-note">All tracked finalized stake movements are included. Conviction lock and unlock events worth less than 10 TAO are excluded. TAO values use the subnet price at the finalized event time. Collection began {activityCollectingSince ? new Date(activityCollectingSince).toLocaleString() : "with this deployment"}.</p>
          </section>
        </section>
      ) : view === "bubbles" ? (
        <section className="bubbles-page">
          <div className="bubbles-hero">
            <div>
              <p className="eyebrow">All 128 subnets · live market map</p>
              <h1>
                Subnet <span>bubbles.</span>
              </h1>
              <p>Every subnet in one view. Subnet numbers lead, names stay compact, and only exceptional green movers grow large.</p>
            </div>
            <div className="bubble-controls" role="group" aria-label="Bubble performance period">
              {[
                { value: "change_10m", label: "10 Minutes" },
                { value: "change_1h", label: "1 Hour" },
                { value: "change_24h", label: "1 Day" },
              ].map((period) => (
                <button key={period.value} className={bubbleTimeframe === period.value ? "active" : ""} onClick={() => setBubbleTimeframe(period.value as typeof bubbleTimeframe)}>
                  {period.label}
                </button>
              ))}
            </div>
          </div>
          <div className="bubble-legend">
            <span>
              <i className="gain" />
              Gaining
            </span>
            <span>
              <i className="flat" />
              Flat
            </span>
            <span>
              <i className="loss" />
              Falling
            </span>
            <b>Drag any bubble · big bubbles = exceptional gains</b>
            <button onClick={() => setBubbleOffsets({})}>Reset layout</button>
          </div>
          <section ref={bubbleCloudRef} className="bubble-cloud panel" aria-label="Draggable subnet market bubbles">
            {dataState !== "live" && (
              <div className="market-loading" role="status">
                <i />
                <strong>{dataState === "loading" ? "Building the live market map" : "Bubble data unavailable"}</strong>
                <span>{dataState === "loading" ? "Waiting for all finalized subnets…" : "We’ll reconnect automatically."}</span>
              </div>
            )}
            {bubbleRows.map((row) => {
              const movement = Number(bubbleChange(row) || 0);
              const size = bubbleSize(row);
              const offset = bubbleOffsets[row.netuid] || { x: 0, y: 0 };
              const bubbleStyle = {
                width: size,
                height: size,
                "--bubble-x": `${offset.x}px`,
                "--bubble-y": `${offset.y}px`,
              } as CSSProperties;
              return (
                <button
                  key={row.netuid}
                  style={bubbleStyle}
                  className={`market-bubble ${size < 58 ? "compact" : ""} ${movement > 0.005 ? "gain" : movement < -0.005 ? "loss" : "flat"} ${selected === row.netuid ? "selected" : ""} ${draggingBubble === row.netuid ? "dragging" : ""}`}
                  onPointerDown={(event) => startBubbleDrag(event, row.netuid)}
                  onPointerMove={moveBubbleDrag}
                  onPointerUp={endBubbleDrag}
                  onPointerCancel={endBubbleDrag}
                  onClick={() => {
                    if (suppressBubbleClick.current) {
                      suppressBubbleClick.current = false;
                      return;
                    }
                    setSelected(row.netuid);
                  }}
                  aria-label={`${row.name || `Subnet ${row.netuid}`}, draggable, ${money(row.market_cap_tao)} market cap, ${movement >= 0 ? "+" : ""}${fmt(movement)} percent`}
                >
                  <small>{row.name || "Unknown"}</small>
                  <strong>SN{row.netuid}</strong>
                  <em>
                    {movement > 0 ? "+" : ""}
                    {fmt(movement)}%
                  </em>
                  <span>{money(row.market_cap_tao)}</span>
                </button>
              );
            })}
          </section>
          {active && (
            <aside className="bubble-detail panel">
              <div>
                <span className="bubble-token">{active.symbol?.replace("α", "") || active.netuid}</span>
                <div>
                  <small>SN{active.netuid}</small>
                  <h2>{active.name || `Subnet ${active.netuid}`}</h2>
                </div>
              </div>
              <dl>
                <div>
                  <dt>Price</dt>
                  <dd>{money(active.price_tao, true)}</dd>
                </div>
                <div>
                  <dt>Market cap</dt>
                  <dd>{money(active.market_cap_tao)}</dd>
                </div>
                <div>
                  <dt>Liquidity</dt>
                  <dd>{money(active.tao_reserve)}</dd>
                </div>
                <div>
                  <dt>{bubbleTimeframe === "change_10m" ? "10 minutes" : bubbleTimeframe === "change_1h" ? "1 hour" : "1 day"}</dt>
                  <dd className={changeClass(bubbleChange(active))}>
                    {Number(bubbleChange(active) || 0) > 0 ? "+" : ""}
                    {fmt(bubbleChange(active))}%
                  </dd>
                </div>
              </dl>
              <button onClick={() => openSubnetChart(active.netuid)}>Open market chart →</button>
            </aside>
          )}
        </section>
      ) : view === "wallets" ? (
        <section className="wallet-page">
          <div className="wallet-intro">
            <p className="eyebrow">Portfolio intelligence</p>
            <h1>
              See every wallet.
              <br />
              <span>See the whole position.</span>
            </h1>
            <p>Paste up to 100 Bittensor coldkeys. We’ll combine free TAO, alpha positions, subnet exposure, and spot-value estimates at one finalized block.</p>
          </div>
          <form className="wallet-form panel" onSubmit={checkWallets}>
            <label htmlFor="wallets">Coldkey addresses</label>
            <p className="wallet-safety">Read-only lookup. Never enter a seed phrase, private key, or password.</p>
            <textarea id="wallets" value={walletInput} onChange={(e) => setWalletInput(e.target.value)} placeholder={"5F...\n5G...\n5H..."} />
            <div className="form-foot">
              <span>One public coldkey per line, space, or comma</span>
              <button disabled={checking}>{checking ? walletProgress || "Checking chain…" : "Check wallets →"}</button>
            </div>
            {walletError && <p className="form-error">{walletError}</p>}
          </form>
          {wallets.length > 0 && (
            <div className="portfolio-summary panel">
              <div>
                <span>Total wallets</span>
                <strong>{wallets.length}</strong>
              </div>
              <div>
                <span>Free balance</span>
                <strong>{privateMoney(wallets.reduce((s, w) => s + Number(w.free_tao || 0), 0))}</strong>
              </div>
              <div>
                <span>Staked value</span>
                <strong>{privateMoney(wallets.reduce((s, w) => s + Number(w.staked_tao_value || 0), 0))}</strong>
              </div>
              <div>
                <span>Total portfolio</span>
                <strong className="accent">{privateMoney(wallets.reduce((s, w) => s + Number(w.total_tao_value || 0), 0))}</strong>
              </div>
            </div>
          )}
          {wallets.length > 0 && (
            <div className="wallet-view-tabs" role="tablist" aria-label="Wallet results views">
              <div>
                <button role="tab" aria-selected={walletDisplay === "wallets"} className={walletDisplay === "wallets" ? "active" : ""} onClick={() => setWalletDisplay("wallets")}>
                  Wallets
                </button>
                <button role="tab" aria-selected={walletDisplay === "portfolio"} className={walletDisplay === "portfolio" ? "active" : ""} onClick={() => setWalletDisplay("portfolio")}>
                  Portfolio
                </button>
              </div>
              <button className={`balance-privacy ${hideBalances ? "active" : ""}`} aria-pressed={hideBalances} onClick={() => setHideBalances((value) => !value)}>
                {hideBalances ? "◉ Show balances" : "◉ Hide balances"}
              </button>
            </div>
          )}
          {walletDisplay === "wallets" && (
            <div className="wallet-results">
              {wallets.map((w) => (
                <article className="wallet-card panel" key={w.address}>
                  <div className="wallet-card-head">
                    <span className="wallet-ident">{w.address.slice(0, 6)}</span>
                    <div>
                      <b>
                        {w.address.slice(0, 12)}…{w.address.slice(-8)}
                      </b>
                      <small>{w.stakes.length} positions</small>
                    </div>
                    <strong>{privateMoney(w.total_tao_value)}</strong>
                  </div>
                  <div className="wallet-split">
                    <span>
                      Free <b>{privateMoney(w.free_tao)}</b>
                    </span>
                    <span>
                      Staked <b>{privateMoney(w.staked_tao_value)}</b>
                    </span>
                  </div>
                  <div className="positions">
                    {w.stakes.slice(0, 8).map((s, i) => (
                      <div key={`${s.hotkey}-${s.netuid}-${i}`}>
                        <span>
                          <b>SN{s.netuid}</b>
                          <small>{s.name || s.hotkey.slice(0, 7) + "…"}</small>
                        </span>
                        <span>
                          {hideBalances ? "•••• α" : `${fmt(s.alpha, 4)} α`}
                          <small>{privateMoney(s.tao_value)}</small>
                        </span>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
          {wallets.length > 0 && walletDisplay === "portfolio" && (
            <section className="portfolio-view portfolio-snapshot panel" role="tabpanel">
              <div className="portfolio-chart-head">
                <div>
                  <p className="eyebrow">Portfolio allocation</p>
                  <span>
                    {portfolioAssets.length} assets grouped across {wallets.length} wallets
                  </span>
                </div>
                <div className="portfolio-metric" aria-label="Portfolio display">
                  <button className={portfolioMetric === "allocation" ? "active" : ""} onClick={() => setPortfolioMetric("allocation")}>
                    Allocation %
                  </button>
                  <button className={portfolioMetric === "value" ? "active" : ""} onClick={() => setPortfolioMetric("value")}>
                    Value
                  </button>
                </div>
              </div>
              <div className="portfolio-snapshot-body">
                <div
                  className="portfolio-donut"
                  style={
                    {
                      "--portfolio-gradient": portfolioGradient,
                    } as CSSProperties
                  }
                  role="img"
                  aria-label={`Portfolio allocation across ${portfolioAssets.length} assets`}
                >
                  <div>
                    <span>{hideBalances ? "Balance hidden" : "Combined value"}</span>
                    <strong>{privateMoney(portfolioTotal)}</strong>
                    <small>{portfolioAssets.length} assets</small>
                  </div>
                </div>
                <div className="portfolio-legend">
                  {portfolioChartAssets.map((asset, index) => {
                    const allocation = portfolioTotal ? (asset.taoValue / portfolioTotal) * 100 : 0;
                    return (
                      <div key={asset.key}>
                        <em>{String(index + 1).padStart(2, "0")}</em>
                        <i
                          style={{
                            background: portfolioColors[index % portfolioColors.length],
                          }}
                        />
                        <span>
                          <b>
                            {asset.netuid == null ? asset.symbol : `SN${asset.netuid}`} <small>· {asset.name}</small>
                          </b>
                          <span className="portfolio-mini-bar">
                            <i
                              style={{
                                width: `${Math.max(1, allocation)}%`,
                                background: portfolioColors[index % portfolioColors.length],
                              }}
                            />
                          </span>
                        </span>
                        <span className="portfolio-amount">
                          <strong>{portfolioMetric === "allocation" ? `${allocation.toFixed(1)}%` : privateMoney(asset.taoValue)}</strong>
                          {portfolioMetric === "value" && <small>{hideBalances ? `•••• ${asset.netuid == null ? "TAO" : "α"}` : `${fmt(asset.alpha, 4)} ${asset.netuid == null ? "TAO" : "α"}`}</small>}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}
          {!wallets.length && (
            <div className="wallet-empty">
              <div className="radar">
                <i />
                <i />
                <i />
              </div>
              <p>Your combined portfolio will appear here.</p>
            </div>
          )}
        </section>
      ) : view === "videos" ? (
        <section className="videos-page">
          <div className="videos-intro">
            <div>
              <p className="eyebrow">Shizzy Unchained TV</p>
              <h1>
                Watch the latest.
                <br />
                <span>Stay ahead of TAO.</span>
              </h1>
            </div>
            <p>Deep dives, subnet updates, interviews, and the 10 to 100 TAO challenge—watch every episode right here.</p>
          </div>
          <div className="featured-video panel">
            <div className="video-frame">
              <iframe key={activeVideo.id} src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?rel=0`} title={activeVideo.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
            </div>
            <div className="video-caption">
              <span>Now playing</span>
              <h2>{activeVideo.title}</h2>
              <small>{activeVideo.meta}</small>
            </div>
          </div>
          <div className="live-library">
            <div className="library-head">
              <div>
                <p className="eyebrow">Shizzy live</p>
                <h2>Live streams & replays</h2>
              </div>
              <span>{liveStreams.length} streams</span>
            </div>
            <div className="live-grid">
              {liveStreams.map((video, index) => (
                <button
                  key={video.id}
                  className={video.id === activeVideo.id ? "active" : ""}
                  onClick={() => {
                    setActiveVideo(video);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <span className="video-thumb">
                    <img src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt="" />
                    <i>▶</i>
                    <em className="stream-badge">Live replay</em>
                  </span>
                  <span className="video-info">
                    <small>{String(index + 1).padStart(2, "0")}</small>
                    <span>
                      <b>{video.title}</b>
                      <em>{video.meta}</em>
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="video-library">
            <div className="library-head">
              <div>
                <p className="eyebrow">From the channel</p>
                <h2>Recent videos</h2>
              </div>
              <span>{channelVideos.length} episodes</span>
            </div>
            <div className="video-grid">
              {channelVideos.map((video, index) => (
                <button
                  key={video.id}
                  className={video.id === activeVideo.id ? "active" : ""}
                  onClick={() => {
                    setActiveVideo(video);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <span className="video-thumb">
                    <img src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt="" />
                    <i>▶</i>
                    <em>{video.meta.split(" · ")[0]}</em>
                  </span>
                  <span className="video-info">
                    <small>{String(index + 1).padStart(2, "0")}</small>
                    <b>{video.title}</b>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : view === "partners" ? (
        <section className="partners-page">
          <div className="partners-hero">
            <p className="eyebrow">Tools Shizzy trusts</p>
            <h1>
              Power your journey.
              <br />
              <span>Meet our partners.</span>
            </h1>
            <p>Research smarter, protect your assets, strengthen your privacy, and put your TAO to work with handpicked products from across the ecosystem.</p>
          </div>
          <div className="partner-grid">
            {partners.map((partner, index) => (
              <a className={`partner-banner ${partner.key}`} href={partner.href} target="_blank" rel="sponsored noreferrer" key={partner.name}>
                <div className="partner-number">0{index + 1}</div>
                <div className="partner-logo" aria-hidden="true">
                  {partner.key === "mentat" ? (
                    <>
                      <span className="mentat-mark">
                        <b />
                        <b />
                        <b />
                        <b />
                      </span>
                      <span>Mentat</span>
                    </>
                  ) : (
                    <>
                      <i />
                      {partner.name}
                    </>
                  )}
                </div>
                <div className="partner-copy">
                  <span>{partner.kicker}</span>
                  <h2>{partner.name}</h2>
                  <p>{partner.description}</p>
                </div>
                <strong>
                  {partner.cta}
                  <b>↗</b>
                </strong>
              </a>
            ))}
          </div>
          <div className="partner-note">
            <span>Shizzy-approved resources</span>
            <p>Some links are affiliate links. If you use them, Shizzy Unchained may earn a commission at no additional cost to you.</p>
          </div>
        </section>
      ) : (
        <section className="university-page">
          <div className="university-hero">
            <div className="university-copy">
              <p className="eyebrow">Private education · Real experience</p>
              <h1>
                Private strategy sessions.
                <br />
                <span>Built around you.</span>
              </h1>
              <p>Choose one focused, one-on-one class with Shizzy covering Bittensor, portfolio construction, content, or crypto security. Bring your questions and leave with a clearer, practical next step.</p>
              <div className="university-actions">
                <a className="university-primary" href="#classes">
                  Choose your class →
                </a>
                <a className="university-secondary" href="#how-it-works">
                  How it works
                </a>
              </div>
              <div className="university-proof">
                <span>
                  <b>$100</b> per session
                </span>
                <span>
                  <b>Private</b> 1-on-1
                </span>
                <span>
                  <b>Card or TAO</b> payment
                </span>
              </div>
            </div>
            <img src="/Copy%20of%20new%20shizzy%20logo.png" alt="Shiz University" />
          </div>
          <section className="university-trust" aria-label="Why learn with Shizzy">
            <div>
              <strong>Real market experience</strong>
              <span>Lessons shaped by ongoing Bittensor research and participation.</span>
            </div>
            <div>
              <strong>Your questions first</strong>
              <span>A private conversation focused on where you need the most clarity.</span>
            </div>
            <div>
              <strong>Practical takeaways</strong>
              <span>Frameworks and next steps designed to be useful after the session.</span>
            </div>
          </section>
          <div className="course-heading" id="classes">
            <div>
              <p className="eyebrow">Choose your class</p>
              <h2>Pick your focus</h2>
            </div>
            <p>Start with the session that matches your current goal. You can always book another topic later.</p>
          </div>
          <div className="course-grid">
            {universityCourses.map((course) => (
              <article className="course-card panel" key={course.number}>
                <div className="course-top">
                  <span>{course.number}</span>
                  <em>{course.tag}</em>
                </div>
                <small className="course-best">{course.bestFor}</small>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className="course-outcome">
                  <b>Your takeaway</b>
                  <span>{course.outcome}</span>
                </div>
                <ul>
                  {course.lessons.map((lesson) => (
                    <li key={lesson}>{lesson}</li>
                  ))}
                </ul>
                <div className="course-foot">
                  <div>
                    <strong>$100</strong>
                    <small>Private session</small>
                  </div>
                  <button
                    onClick={() => {
                      setCheckoutCourse(course);
                      setWalletCopied(false);
                    }}
                  >
                    Book this session →
                  </button>
                </div>
              </article>
            ))}
          </div>
          <section className="university-process" id="how-it-works">
            <div className="course-heading">
              <div>
                <p className="eyebrow">Simple booking</p>
                <h2>How it works</h2>
              </div>
              <p>Choose your topic, complete payment, and coordinate your private session directly.</p>
            </div>
            <div className="process-grid">
              {[
                ["01", "Choose a class", "Select the topic that best matches your current goal."],
                ["02", "Pay securely", "Use the card checkout or pay the live $100 equivalent in TAO."],
                ["03", "Send your details", "TAO buyers submit their transaction confirmation and preferred class."],
                ["04", "Meet with Shizzy", "Join your private session ready with your goals and questions."],
              ].map((step) => (
                <div key={step[0]}>
                  <span>{step[0]}</span>
                  <strong>{step[1]}</strong>
                  <p>{step[2]}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="university-about">
            <img src="/about-shizzy.png" alt="Shizzy Unchained" />
            <div>
              <p className="eyebrow">Your instructor</p>
              <h2>Learn directly from Shizzy</h2>
              <p>Shizzy Unchained creates practical Bittensor market coverage, subnet deep dives, interviews, and educational content. These sessions bring that same direct approach into a private conversation centered on your questions.</p>
              <div>
                <span>Bittensor research</span>
                <span>Subnet deep dives</span>
                <span>Creator experience</span>
              </div>
            </div>
          </section>
          <section className="university-faq">
            <div className="course-heading">
              <div>
                <p className="eyebrow">Before you book</p>
                <h2>Frequently asked questions</h2>
              </div>
            </div>
            <div>
              {[
                ["Do I need Bittensor experience?", "No. Choose Subnets 101 if you are beginning, or select another class if you already have a specific goal."],
                ["Can I pay with TAO?", "Yes. The checkout shows the live TAO equivalent of $100 and the wallet address. Submit your transaction confirmation afterward."],
                ["Is this financial advice?", "No. Sessions provide education, perspective, and personal guidance. Every financial decision remains your responsibility."],
                ["Can the session cover my specific questions?", "Yes. The one-on-one format is designed around your goals, while staying within the selected class topic."],
                ["What happens after payment?", "Card buyers continue through the secure checkout. TAO buyers receive instructions to submit payment confirmation and coordinate their class."],
              ].map((item) => (
                <details key={item[0]}>
                  <summary>{item[0]}</summary>
                  <p>{item[1]}</p>
                </details>
              ))}
            </div>
          </section>
          <section className="university-final">
            <p className="eyebrow">Ready when you are</p>
            <h2>Choose the skill you want to sharpen.</h2>
            <p>Book one focused private session and bring the questions that matter most to you.</p>
            <a href="#classes">View the classes →</a>
          </section>
          <div className="university-note">
            <span>Education, perspective, and personal guidance.</span>
            <p>Nothing here is financial or life advice. Every decision remains yours.</p>
          </div>
          {checkoutCourse && (
            <div
              className="checkout-backdrop"
              role="presentation"
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) setCheckoutCourse(null);
              }}
            >
              <section className="course-checkout panel" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
                <button className="checkout-close" aria-label="Close checkout" onClick={() => setCheckoutCourse(null)}>
                  ×
                </button>
                <p className="eyebrow">Shiz University enrollment</p>
                <h2 id="checkout-title">{checkoutCourse.title}</h2>
                <div className="checkout-price">
                  <strong>$100</strong>
                  <span>One private class</span>
                </div>
                <a className="card-checkout" href={stripeCheckout} target="_blank" rel="noreferrer">
                  Pay securely with card →
                </a>
                <div className="checkout-divider">
                  <span>or pay with TAO</span>
                </div>
                <div className="tao-payment">
                  <div>
                    <span>Send exactly</span>
                    <strong>{taoUsd ? `${fmt(100 / taoUsd, 4)} TAO` : "$100 in TAO"}</strong>
                    <small>{taoUsd ? `Based on the current $${fmt(taoUsd)} TAO price` : "Use the live TAO price when sending"}</small>
                  </div>
                  <code>{universityWallet}</code>
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(universityWallet);
                      setWalletCopied(true);
                    }}
                  >
                    {walletCopied ? "Wallet copied ✓" : "Copy wallet address"}
                  </button>
                </div>
                <div className="schedule-step">
                  <span>Paid with TAO? Schedule your class</span>
                  <p>After sending your TAO, use the calendar below. You must include your transaction hash or transaction confirmation in the booking form so payment can be verified.</p>
                  <a className="card-checkout" href={universityCalendly} target="_blank" rel="noreferrer">
                    Open scheduling calendar →
                  </a>
                  <b>Bookings without transaction confirmation will not be accepted.</b>
                </div>
              </section>
            </div>
          )}
        </section>
      )}
      <footer>
        <span>SHIZZYUNCHAINED</span>
        <p>Finalized on-chain data · {currency === "usd" ? "USD values use the live TAO spot rate" : "TAO-denominated values"} · Not financial advice</p>
        <b>Built on Bittensor</b>
      </footer>
    </main>
  );
}
