export const siteOrigin = "https://shizzyunchained.com";
export const chartPaths = ["/charts/tao", ...Array.from({ length: 128 }, (_, i) => `/charts/${i + 1}`)];

export function chartPageTitle(netuid: number | "tao", name?: string | null) {
  return netuid === "tao" ? "Bittensor TAO Chart" : `SN${netuid} ${name?.trim() || "Subnet"} Chart`;
}

export type ValidatorNames = Record<string, { name: string; observedAt: string }>;
export function validatorMetadataName(names: ValidatorNames | null, hotkey: string, now = Date.now()) {
  const item = names?.[hotkey];
  if (!item || typeof item.name !== "string") return null;
  const time = Date.parse(item.observedAt);
  const name = item.name.replace(/[\u0000-\u001f\u007f]/g, "").trim();
  return Number.isFinite(time) && time <= now + 60_000 && now - time <= 7200_000 && name && name !== hotkey ? name.slice(0, 100) : null;
}
