import { getEtaoSnapshot } from "../../../lib/etao-source";
export const dynamic = "force-dynamic";
export async function GET() {
  const { ownerSnapshot } = await getEtaoSnapshot();
  return Response.json(ownerSnapshot, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } });
}
