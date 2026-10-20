import Link from "next/link";
import { SiteHeader } from "../site-header";
export function SubnetNewsHeader() {
  return <><SiteHeader /><nav aria-label="Subnet news tools" style={{display:"flex",gap:12,flexWrap:"wrap",padding:"16px 0"}}><Link href="/subnet-news" style={{padding:"12px 18px",border:"1px solid #444",color:"#fff",textDecoration:"none"}}>Daily news</Link><Link href="/subnet-news/etao" style={{padding:"12px 18px",background:"#fff",color:"#000",fontWeight:700,textDecoration:"none"}}>eTAO Changes →</Link></nav></>;
}
