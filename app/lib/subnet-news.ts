import "server-only";

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

export type NewsImportance = "high" | "medium" | "informational";
export type NewsStatus = "verified" | "developing" | "rumor";

export type NewsSource = {
  label: string;
  url: string;
};

export type NewsItem = {
  headline: string;
  summary: string;
  importance: NewsImportance;
  status: NewsStatus;
  sources: NewsSource[];
};

export type SubnetNews = {
  netuid: number;
  name: string;
  updates: NewsItem[];
};

export type SubnetNewsBrief = {
  version: 1;
  date: string;
  title: string;
  summary: string;
  publishedAt: string;
  coverageStart: string;
  coverageEnd: string;
  highlights: NewsItem[];
  subnets: SubnetNews[];
  ecosystem: NewsItem[];
  coverage: {
    searched: string[];
    gaps: string[];
  };
};

const reportsDirectory = join(process.cwd(), "content", "subnet-news");
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertString(value: unknown, field: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Subnet News: ${field} must be a non-empty string.`);
  }
}

function assertSource(value: unknown, field: string) {
  if (!isRecord(value)) throw new Error(`Subnet News: ${field} must be an object.`);
  assertString(value.label, `${field}.label`);
  assertString(value.url, `${field}.url`);
  const url = new URL(value.url as string);
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error(`Subnet News: ${field}.url must use http or https.`);
  }
}

function assertNewsItem(value: unknown, field: string) {
  if (!isRecord(value)) throw new Error(`Subnet News: ${field} must be an object.`);
  assertString(value.headline, `${field}.headline`);
  assertString(value.summary, `${field}.summary`);
  if (!["high", "medium", "informational"].includes(value.importance as string)) {
    throw new Error(`Subnet News: ${field}.importance is invalid.`);
  }
  if (!["verified", "developing", "rumor"].includes(value.status as string)) {
    throw new Error(`Subnet News: ${field}.status is invalid.`);
  }
  if (!Array.isArray(value.sources) || value.sources.length === 0) {
    throw new Error(`Subnet News: ${field}.sources must include at least one source.`);
  }
  value.sources.forEach((source, index) => assertSource(source, `${field}.sources[${index}]`));
}

export function validateSubnetNewsBrief(value: unknown): asserts value is SubnetNewsBrief {
  if (!isRecord(value)) throw new Error("Subnet News: report must be an object.");
  if (value.version !== 1) throw new Error("Subnet News: version must be 1.");
  assertString(value.date, "date");
  if (!datePattern.test(value.date as string)) throw new Error("Subnet News: date must use YYYY-MM-DD.");
  assertString(value.title, "title");
  assertString(value.summary, "summary");
  assertString(value.publishedAt, "publishedAt");
  assertString(value.coverageStart, "coverageStart");
  assertString(value.coverageEnd, "coverageEnd");
  for (const field of ["publishedAt", "coverageStart", "coverageEnd"] as const) {
    if (Number.isNaN(Date.parse(value[field] as string))) {
      throw new Error(`Subnet News: ${field} must be an ISO timestamp.`);
    }
  }
  if (!Array.isArray(value.highlights)) throw new Error("Subnet News: highlights must be an array.");
  value.highlights.forEach((item, index) => assertNewsItem(item, `highlights[${index}]`));
  if (!Array.isArray(value.ecosystem)) throw new Error("Subnet News: ecosystem must be an array.");
  value.ecosystem.forEach((item, index) => assertNewsItem(item, `ecosystem[${index}]`));
  if (!Array.isArray(value.subnets)) throw new Error("Subnet News: subnets must be an array.");
  const seenNetuids = new Set<number>();
  value.subnets.forEach((subnet, index) => {
    if (!isRecord(subnet)) throw new Error(`Subnet News: subnets[${index}] must be an object.`);
    if (!Number.isInteger(subnet.netuid) || (subnet.netuid as number) < 0) {
      throw new Error(`Subnet News: subnets[${index}].netuid must be a non-negative integer.`);
    }
    if (seenNetuids.has(subnet.netuid as number)) {
      throw new Error(`Subnet News: duplicate SN${subnet.netuid}.`);
    }
    seenNetuids.add(subnet.netuid as number);
    assertString(subnet.name, `subnets[${index}].name`);
    if (!Array.isArray(subnet.updates)) throw new Error(`Subnet News: subnets[${index}].updates must be an array.`);
    subnet.updates.forEach((item, itemIndex) => assertNewsItem(item, `subnets[${index}].updates[${itemIndex}]`));
  });
  if (!isRecord(value.coverage)) throw new Error("Subnet News: coverage must be an object.");
  for (const field of ["searched", "gaps"] as const) {
    if (!Array.isArray(value.coverage[field]) || !(value.coverage[field] as unknown[]).every((entry) => typeof entry === "string")) {
      throw new Error(`Subnet News: coverage.${field} must be an array of strings.`);
    }
  }
}

function readBrief(filename: string) {
  const raw = JSON.parse(readFileSync(join(reportsDirectory, filename), "utf8")) as unknown;
  validateSubnetNewsBrief(raw);
  if (filename !== `${raw.date}.json`) {
    throw new Error(`Subnet News: ${filename} must match its report date (${raw.date}.json).`);
  }
  return raw;
}

export function getSubnetNewsBriefs() {
  try {
    return readdirSync(reportsDirectory)
      .filter((filename) => datePattern.test(filename.replace(/\.json$/, "")) && filename.endsWith(".json"))
      .map(readBrief)
      .sort((a, b) => b.date.localeCompare(a.date));
  } catch (error) {
    if (isRecord(error) && "code" in error && error.code === "ENOENT") return [];
    throw error;
  }
}

export function getSubnetNewsBrief(date: string) {
  if (!datePattern.test(date)) return null;
  return getSubnetNewsBriefs().find((brief) => brief.date === date) ?? null;
}

export function formatBriefDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "America/New_York",
  }).format(new Date(`${date}T12:00:00-04:00`));
}
