import type { Frame, Screen, Unit } from "@/data/types";

const METRES_PER_FOOT = 0.3048;

/** 65-inch 16:9 television, in square feet. */
export const TV65_SQFT = (() => {
  const diagIn = 65;
  const denom = Math.hypot(16, 9);
  const wFt = (diagIn * 16) / denom / 12;
  const hFt = (diagIn * 9) / denom / 12;
  return wFt * hFt;
})();

export function areaSqFt(screen: Pick<Screen, "widthFt" | "heightFt">): number | null {
  if (screen.widthFt == null || screen.heightFt == null) return null;
  return screen.widthFt * screen.heightFt;
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function trim(n: number): string {
  const r = round1(n);
  return Number.isInteger(r) ? String(r) : r.toFixed(1);
}

export function lengthNumber(ft: number, unit: Unit): string {
  if (unit === "ft") return trim(ft);
  return (ft * METRES_PER_FOOT).toFixed(1);
}

export function lengthLabel(ft: number | null, unit: Unit): string {
  if (ft == null) return "—";
  return unit === "ft" ? `${lengthNumber(ft, unit)} ft` : `${lengthNumber(ft, unit)} m`;
}

export function pairLabel(screen: Pick<Screen, "widthFt" | "heightFt" | "heightInferred">, unit: Unit): string {
  if (screen.widthFt == null) return "Size unpublished";
  if (screen.heightFt == null) return `${lengthLabel(screen.widthFt, unit)} wide`;
  const pair = `${lengthNumber(screen.widthFt, unit)} × ${lengthNumber(screen.heightFt, unit)}`;
  const suffix = unit === "ft" ? " ft" : " m";
  return screen.heightInferred ? `${pair}${suffix} · height inferred` : `${pair}${suffix}`;
}

export function areaLabel(screen: Pick<Screen, "widthFt" | "heightFt">, unit: Unit): string {
  const sq = areaSqFt(screen);
  if (sq == null) return "—";
  if (unit === "ft") return `${Math.round(sq).toLocaleString("en-IN")} sq ft`;
  const sqm = sq * METRES_PER_FOOT * METRES_PER_FOOT;
  return `${Math.round(sqm).toLocaleString("en-IN")} sq m`;
}

export function measuredFrame(screen: Pick<Screen, "widthFt" | "heightFt">): string | null {
  if (screen.widthFt == null || screen.heightFt == null || screen.heightFt === 0) return null;
  return `${(screen.widthFt / screen.heightFt).toFixed(2)}:1`;
}

export function frameNumber(frame: Frame): number {
  const value: Record<Frame, number> = {
    "1.43:1": 1.43,
    "1.54:1": 1.54,
    "1.85:1": 1.85,
    "1.89:1": 1.89,
    "1.90:1": 1.9,
    "2.10:1": 2.1,
    "2.20:1": 2.2,
    "2.39:1": 2.39,
    "2.76:1": 2.76,
  };
  return value[frame];
}

/** When published height doesn't match the system's picture shape. */
export function shapeNote(screen: Screen): string | null {
  if (screen.widthFt == null || screen.heightFt == null || screen.frame == null) return null;
  if (screen.heightInferred) return null;
  const expected = frameNumber(screen.frame);
  const got = screen.widthFt / screen.heightFt;
  if (Math.abs(got - expected) < 0.06) return null;
  const pictureTall = screen.widthFt / expected;
  return `Published shape is ${got.toFixed(2)}:1. A ${screen.frame} picture on a ${trim(screen.widthFt)} ft wall would be about ${trim(pictureTall)} ft tall. The extra may be unused screen, or the height may be rounded.`;
}

export function tvTimes(screen: Pick<Screen, "widthFt" | "heightFt">): number | null {
  const sq = areaSqFt(screen);
  if (sq == null) return null;
  return sq / TV65_SQFT;
}

export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const r = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * r * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function confidenceLabel(c: Screen["confidence"]): string {
  if (c === "guide") return "Venue guide";
  if (c === "press") return "Press or theatre guide";
  return "Community report";
}

export const DATA_NOTE =
  "Other cities are still a curated premium set. Hyderabad is a census of halls whose width is printed on the Hyderabad Theatres specs table (checked November 2026), including ordinary screens. When that table prints a width and an aspect but not a height, the height is width divided by the aspect and marked calculated. A blank width is listed and not drawn.";
