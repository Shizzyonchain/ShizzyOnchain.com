import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { CreatorFooter } from "./creator-footer";

// Server shell: content pages do not initialize market, chart or wallet clients.
export function CreatorShell({ children }: { children: ReactNode }) {
 return <main className="shell home-monochrome creator-shell"><SiteHeader hideCurrency />{children}<CreatorFooter /></main>;
}
