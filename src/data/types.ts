export type Brand =
  | "IMAX"
  | "Dolby Cinema"
  | "PXL"
  | "PCX"
  | "BigPix"
  | "4DX"
  | "HDR"
  | "EPIQ"
  | "Digital";

export type Projector =
  | "IMAX 15/70"
  | "IMAX XT Laser"
  | "IMAX CoLa"
  | "IMAX Laser"
  | "IMAX Xenon"
  | "Dolby Vision laser"
  | "Barco HDR"
  | "Dual 4K laser"
  | "4K laser"
  | "4K xenon"
  | "2K laser"
  | "2K xenon"
  | "LED"
  | "Unspecified";

/** How sure the foot-measurement is. Unpublished sizes are simply null. */
export type Confidence = "guide" | "press" | "community";

export type Frame =
  | "1.43:1"
  | "1.54:1"
  | "1.85:1"
  | "1.89:1"
  | "1.90:1"
  | "2.10:1"
  | "2.20:1"
  | "2.39:1"
  | "2.76:1";

export type Screen = {
  id: string;
  /** Auditorium name, e.g. "IMAX". */
  name: string;
  venue: string;
  chain: string;
  citySlug: string;
  locality: string;
  /** Indian PIN, when we have one for the complex. */
  pin?: string | null;
  address: string;
  lat: number | null;
  lng: number | null;
  brand: Brand;
  projector: Projector;
  audio: string;
  widthFt: number | null;
  heightFt: number | null;
  /** True when height was calculated from a stated aspect, not published. */
  heightInferred: boolean;
  /** Native picture shape this system is built to show, when we know it. */
  frame: Frame | null;
  seats: number | null;
  /** False for documentary-only houses that do not play new releases. */
  commercial: boolean;
  confidence: Confidence;
  source: string;
  caveat: string | null;
  blurb: string;
  /** 1 is the first editor's pick in that city. Null if unranked. */
  pickRank: number | null;
};

export type Unit = "ft" | "m";