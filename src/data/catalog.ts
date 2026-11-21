import data from "./india-screen-catalog.json";

export type FormatKey = "imax" | "plf" | "iconic";
export type HallStatus = "open" | "closed" | "uncertain";
export type HallConfidence = "high" | "medium" | "low";

export type HallSource = {
  type: string;
  url: string;
  note: string;
};

export type Hall = {
  id: string;
  name: string;
  chain: string;
  city: string;
  area: string;
  address: string;
  formats: FormatKey[];
  tags: string[];
  status: HallStatus;
  confidence: HallConfidence;
  why: string;
  sources: HallSource[];
  lastChecked: string;
  conflict?: string;
  repoScreenId?: string;
};

export type CatalogCity = {
  id: string;
  name: string;
  note: string;
  empty?: string;
};

export const FORMAT_LABEL: Record<FormatKey, string> = {
  imax: "IMAX",
  plf: "Other PLF",
  iconic: "Iconic",
};

export const STATUS_LABEL: Record<HallStatus, string> = {
  open: "Open",
  closed: "Closed",
  uncertain: "Uncertain",
};

export const CONFIDENCE_LABEL: Record<HallConfidence, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

type CatalogFile = {
  lastChecked: string;
  cities: CatalogCity[];
  screens: Hall[];
};

export const catalog = data as CatalogFile;

export function cityById(id: string): CatalogCity | undefined {
  return catalog.cities.find((city) => city.id === id);
}

export function hallById(id: string): Hall | undefined {
  return catalog.screens.find((hall) => hall.id === id);
}

export function formatLine(hall: Hall): string {
  return hall.formats.map((format) => FORMAT_LABEL[format]).join(" · ");
}
