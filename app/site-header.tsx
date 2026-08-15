"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Currency = "usd" | "tao";
type DataState = "loading" | "live" | "stale" | "error";

type SiteHeaderProps = {
  currency?: Currency;
  onCurrencyChange?: (currency: Currency) => void;
  currencyTitle?: string;
  dataState?: DataState;
  lastUpdated?: Date | null;
};

type NavItem = {
  href: string;
  label: string;
  exact?: boolean;
  external?: boolean;
};

const navigation: readonly NavItem[] = [
  { href: "/", label: "Market", exact: true },
  { href: "/subnet-news", label: "Subnet News" },
  { href: "/bubbles", label: "Bubbles" },
  { href: "/video", label: "Videos" },
  { href: "/deep-dives", label: "Deep Dives" },
  { href: "https://shizzyunchained.printful.me/", label: "Shop", external: true },
  { href: "/university", label: "Shiz University" },
  { href: "/wallet-tracker", label: "Wallet Tracker" },
  { href: "/about", label: "About" },
  { href: "/partners", label: "Partners" },
];

export function SiteHeader({ currency, onCurrencyChange, currencyTitle, dataState, lastUpdated }: SiteHeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localCurrency, setLocalCurrency] = useState<Currency>("usd");
  const [localDataState, setLocalDataState] = useState<DataState>("loading");
  const activeCurrency = currency ?? localCurrency;
  const activeDataState = dataState ?? localDataState;

  useEffect(() => {
    if (dataState) return;
    let cancelled = false;

    const checkFinney = async () => {
      if (document.hidden) return;
      try {
        const response = await fetch("/api/backend/v1/screener", {
          cache: "no-store",
          signal: AbortSignal.timeout(6_000),
        });
        if (!response.ok) throw new Error(`Market status failed: ${response.status}`);
        const json = await response.json();
        const newest = Math.max(...(json.data || []).map((row: { time?: string }) => Date.parse(row.time || "")).filter(Number.isFinite));
        if (!cancelled) setLocalDataState(Number.isFinite(newest) && Date.now() - newest <= 120_000 ? "live" : "stale");
      } catch {
        if (!cancelled) setLocalDataState("error");
      }
    };

    void checkFinney();
    const timer = window.setInterval(checkFinney, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [dataState]);

  const changeCurrency = (nextCurrency: Currency) => {
    if (onCurrencyChange) onCurrencyChange(nextCurrency);
    else setLocalCurrency(nextCurrency);
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="topbar site-header">
      <Link className="brand" href="/" aria-label="Shizzy Unchained home">
        <Image src="/shizzy-unchained-logo.svg" alt="Shizzy Unchained" width={220} height={74} priority />
      </Link>
      <button
        className={`mobile-menu-toggle ${mobileMenuOpen ? "open" : ""}`}
        type="button"
        aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={mobileMenuOpen}
        aria-controls="primary-navigation"
        onClick={() => setMobileMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>
      <nav id="primary-navigation" className={mobileMenuOpen ? "mobile-open" : ""} aria-label="Primary navigation">
        {navigation.map((item) => item.external ? (
          <a href={item.href} target="_blank" rel="noreferrer" key={item.label} onClick={() => setMobileMenuOpen(false)}>
            {item.label}
          </a>
        ) : (
          <Link
            className={isActive(item.href, item.exact) ? "active" : ""}
            href={item.href}
            key={item.label}
            onClick={() => setMobileMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="header-actions">
        <div className="currency-toggle" role="group" aria-label="Display currency" title={currencyTitle}>
          <button className={activeCurrency === "usd" ? "active" : ""} type="button" aria-pressed={activeCurrency === "usd"} onClick={() => changeCurrency("usd")}>USD</button>
          <button className={activeCurrency === "tao" ? "active" : ""} type="button" aria-pressed={activeCurrency === "tao"} onClick={() => changeCurrency("tao")}>TAO</button>
        </div>
        <div
          className={`status ${activeDataState === "live" ? "live" : "demo"}`}
          title={lastUpdated ? `Market data updated ${lastUpdated.toLocaleTimeString()}` : undefined}
        >
          <i aria-hidden="true" />
          {activeDataState === "live" ? "Finney live" : activeDataState === "stale" ? "Finney delayed" : activeDataState === "loading" ? "Connecting…" : "Reconnecting…"}
        </div>
      </div>
    </header>
  );
}
