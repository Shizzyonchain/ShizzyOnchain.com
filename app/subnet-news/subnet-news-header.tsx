"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteHeader } from "../site-header";

export function SubnetNewsHeader() {
  const pathname = usePathname();
  const etaoActive = pathname === "/subnet-news/etao" || pathname.startsWith("/subnet-news/etao/");
  const tabs = [
    { href: "/subnet-news", label: "Daily news", active: !etaoActive },
    { href: "/subnet-news/etao", label: "eTAO Changes →", active: etaoActive },
  ];
  return <><SiteHeader /><nav aria-label="Subnet news tools" style={{ display: "flex", gap: 12, flexWrap: "wrap", padding: "16px 24px" }}>
    {tabs.map(tab => <Link key={tab.href} href={tab.href} aria-current={tab.active ? "page" : undefined} style={{ padding: "12px 18px", border: `1px solid ${tab.active ? "#fff" : "#444"}`, background: tab.active ? "#fff" : "#000", color: tab.active ? "#000" : "#fff", fontWeight: 700, textDecoration: "none" }}>{tab.label}</Link>)}
  </nav></>;
}
