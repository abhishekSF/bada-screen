import type { Screen } from "@/data/types";
import { screensForPin, screensInCity } from "@/data/screens";
import { areaSqFt, distanceKm } from "@/lib/measure";

/** Short drive in a city this size. Far enough to include a genuinely bigger wall. */
export const RECOMMEND_RADIUS_KM = 12;

const PREMIUM = new Set<Screen["brand"]>([
  "IMAX",
  "Dolby Cinema",
  "PCX",
  "PXL",
  "EPIQ",
  "HDR",
  "4DX",
  "BigPix",
]);

export type RecommendPick = {
  kicker: string;
  screen: Screen;
  line: string;
};

export type Recommendation = {
  exact: Screen[];
  chart: Screen[];
  picks: RecommendPick[];
  unpublished: Screen[];
  locality: string;
  radiusKm: number;
};

function measured(screen: Screen): boolean {
  return screen.widthFt != null && screen.heightFt != null;
}

function byArea(a: Screen, b: Screen): number {
  return (areaSqFt(b) ?? 0) - (areaSqFt(a) ?? 0);
}

function centroid(list: Screen[]): { lat: number; lng: number } | null {
  const pinned = list.filter((screen) => screen.lat != null && screen.lng != null);
  if (pinned.length === 0) return null;
  return {
    lat: pinned.reduce((sum, screen) => sum + (screen.lat ?? 0), 0) / pinned.length,
    lng: pinned.reduce((sum, screen) => sum + (screen.lng ?? 0), 0) / pinned.length,
  };
}

function firstSentence(text: string): string {
  const trimmed = text.trim();
  const cut = trimmed.search(/\.\s/);
  if (cut === -1 || cut > 200) return trimmed;
  return trimmed.slice(0, cut + 1);
}

/** Two walls this close in height read as one rectangle. */
function distinctEnough(candidate: Screen, picked: Screen[]): boolean {
  return picked.every((other) => {
    if (other.heightFt == null || candidate.heightFt == null) return true;
    return Math.abs(other.heightFt - candidate.heightFt) >= 10;
  });
}

function awayLine(screen: Screen, origin: { lat: number; lng: number } | null, pin: string): string {
  const note = firstSentence(screen.blurb);
  if (screen.pin === pin) {
    return screen.widthFt == null ? "Size unpublished, so this hall is not drawn." : note;
  }
  if (origin == null || screen.lat == null || screen.lng == null) return note;
  const km = distanceKm(origin, { lat: screen.lat, lng: screen.lng });
  const where = km < 0.5 ? "" : `About ${Math.max(1, Math.round(km))} km from this PIN. `;
  if (screen.widthFt == null) return `${where}Size unpublished, so this hall is not drawn.`;
  return `${where}${note}`;
}

export function recommendForPin(pin: string): Recommendation | null {
  const digits = pin.replace(/\D/g, "");
  if (!/^\d{6}$/.test(digits)) return null;

  const exact = screensForPin(digits);
  const origin = centroid(exact);
  const citySlug = exact[0]?.citySlug;
  const pool = [...exact];

  if (origin && citySlug) {
    for (const screen of screensInCity(citySlug)) {
      if (pool.some((row) => row.id === screen.id)) continue;
      if (screen.lat == null || screen.lng == null) continue;
      if (distanceKm(origin, { lat: screen.lat, lng: screen.lng }) > RECOMMEND_RADIUS_KM) continue;
      pool.push(screen);
    }
  }

  const ranked = pool.filter(measured).slice().sort(byArea);
  const chart: Screen[] = [];

  const pinLargest = exact.filter(measured).slice().sort(byArea)[0];
  const pinPremium = exact
    .filter((screen) => measured(screen) && PREMIUM.has(screen.brand))
    .slice()
    .sort(byArea)[0];

  for (const seed of [pinLargest, pinPremium]) {
    if (seed && !chart.some((row) => row.id === seed.id) && distinctEnough(seed, chart)) chart.push(seed);
  }

  for (const screen of ranked) {
    if (chart.length >= 4) break;
    if (chart.some((row) => row.id === screen.id)) continue;
    if (!distinctEnough(screen, chart)) continue;
    if ((screen.widthFt ?? 0) < 55 && !PREMIUM.has(screen.brand)) continue;
    chart.push(screen);
  }

  const picks: RecommendPick[] = [];
  const here = pinLargest ?? exact[0];
  if (here) {
    picks.push({
      kicker: "At this PIN",
      screen: here,
      line: awayLine(here, origin, digits),
    });
  }

  const biggest = ranked.find((screen) => chart.some((row) => row.id === screen.id) && screen.id !== here?.id);
  if (biggest) {
    const hereArea = here ? (areaSqFt(here) ?? 0) : 0;
    picks.push({
      kicker: (areaSqFt(biggest) ?? 0) > hereArea ? "Biggest wall nearby" : "Also on this floor",
      screen: biggest,
      line: awayLine(biggest, origin, digits),
    });
  }

  const premium = ranked.find(
    (screen) => PREMIUM.has(screen.brand) && !picks.some((pick) => pick.screen.id === screen.id),
  );
  if (premium) {
    picks.push({
      kicker: premium.brand,
      screen: premium,
      line: awayLine(premium, origin, digits),
    });
  }

  const localities = [...new Set(exact.map((screen) => screen.locality))];

  return {
    exact,
    chart,
    picks,
    unpublished: exact.filter((screen) => screen.widthFt == null),
    locality: localities.length === 1 ? localities[0] : localities.slice(0, 2).join(" · "),
    radiusKm: RECOMMEND_RADIUS_KM,
  };
}
