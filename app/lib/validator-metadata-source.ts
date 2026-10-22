import "server-only";
import { getCache } from "@vercel/functions";
import { validatorMetadataName, type ValidatorNames } from "./seo";

let lastNames = "", lastWrite = 0;
const cache = () => getCache({ namespace: "validator-metadata-names-v1" });
// Filled by existing directory/background research. Never starts an RPC or
// provider lookup just to render a title. Preserve the provider observation time.
export async function rememberValidatorNames(rows: { hotkey: string; name: string | null; timestamp: string }[]) {
  const names: ValidatorNames = {};
  for (const row of rows) if (row.name) names[row.hotkey] = { name: row.name, observedAt: row.timestamp };
  const signature = JSON.stringify(names);
  if (signature === lastNames && Date.now() - lastWrite < 60_000) return;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([cache().set("names", names, { ttl: 7200 }), new Promise<void>(resolve => { timer = setTimeout(resolve, 100); })]);
    lastNames = signature; lastWrite = Date.now();
  } catch { /* Optional metadata cannot interrupt research. */ }
  finally { if (timer) clearTimeout(timer); }
}

export async function getValidatorMetadataName(hotkey: string) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const names = await Promise.race([
      cache().get("names") as Promise<ValidatorNames | null>,
      new Promise<null>(resolve => { timer = setTimeout(() => resolve(null), 100); }),
    ]);
    return validatorMetadataName(names, hotkey);
  } catch { return null; }
  finally { if (timer) clearTimeout(timer); }
}
