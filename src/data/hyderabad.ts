import type { Brand, Frame, Projector, Screen } from "@/data/types";

/**
 * Sized halls from the Hyderabad Theatres specs table
 * (https://www.hyderabadtheatres.com/specs/), read November 2026.
 * Heights are the pair printed on a theatre or screen page when we have one.
 * Otherwise height is width ÷ the aspect that table prints.
 * Halls with a blank width are listed and not drawn.
 * Neighbourhood pins are approximate, not a surveyed seat.
 */

const SOURCE =
  "Hyderabad Theatres specs table, hyderabadtheatres.com/specs, read November 2026. Premium pairs that the same site prints on a theatre page (Prasads 98.6 × 64, 59.2 × 31.3, 55 × 23; Allu Dolby 75 × 40) use those heights. Every other height is width divided by the printed aspect.";

const INFERRED =
  "Width is printed. Height is that width divided by the aspect on the same row, not a second measurement.";

type Place = {
  venue: string;
  chain: string;
  locality: string;
  pin: string;
  lat: number;
  lng: number;
  address: string;
};

const places = {
  aaa: {
    venue: "AAA Cinemas",
    chain: "AAA",
    locality: "Ameerpet",
    pin: "500016",
    lat: 17.4374,
    lng: 78.4482,
    address: "AAA Cinemas, Ameerpet, Hyderabad 500016",
  },
  amb: {
    venue: "AMB Cinemas",
    chain: "AMB",
    locality: "Kondapur",
    pin: "500084",
    lat: 17.4582,
    lng: 78.3642,
    address: "AMB Cinemas, Sarath City Capital Mall, Gachibowli–Miyapur Road, Kondapur, Hyderabad 500084",
  },
  ambClassic: {
    venue: "AMB Classic Victory",
    chain: "AMB",
    locality: "RTC X Roads",
    pin: "500020",
    lat: 17.4068,
    lng: 78.4978,
    address: "AMB Classic Victory, RTC X Roads, Hyderabad 500020",
  },
  art: {
    venue: "ART Cinemas",
    chain: "ART",
    locality: "Vanasthalipuram",
    pin: "500070",
    lat: 17.329,
    lng: 78.574,
    address: "ART Cinemas, Vanasthalipuram, Hyderabad 500070",
  },
  allu: {
    venue: "Allu Cinemas",
    chain: "Allu Cinemas",
    locality: "Kokapet",
    pin: "500075",
    lat: 17.392,
    lng: 78.34,
    address: "Allu Cinemas, Allu Studios complex, Kokapet, Hyderabad 500075",
  },
  aparnaNalla: {
    venue: "Aparna Cinemas Nallagandla",
    chain: "Aparna",
    locality: "Nallagandla",
    pin: "500019",
    lat: 17.468,
    lng: 78.308,
    address: "Aparna Cinemas, Nallagandla, Hyderabad 500019",
  },
  aparnaSham: {
    venue: "Aparna Cinemas Shamshabad",
    chain: "Aparna",
    locality: "Shamshabad",
    pin: "501218",
    lat: 17.251,
    lng: 78.429,
    address: "Aparna Cinemas, Shamshabad, Hyderabad 501218",
  },
  lakshmikala: {
    venue: "Asian Lakshmikala Cinepride",
    chain: "Asian",
    locality: "Moosapet",
    pin: "500018",
    lat: 17.472,
    lng: 78.426,
    address: "Asian Lakshmikala Cinepride, Moosapet, Hyderabad 500018",
  },
  cineplanet: {
    venue: "Asian Cineplanet",
    chain: "Asian",
    locality: "Kompally",
    pin: "500014",
    lat: 17.546,
    lng: 78.489,
    address: "Asian Cineplanet, Kompally, Hyderabad 500014",
  },
  br: {
    venue: "BR Hitech 70MM",
    chain: "BR Hitech",
    locality: "Madhapur",
    pin: "500081",
    lat: 17.448,
    lng: 78.391,
    address: "BR Hitech 70MM, Madhapur, Hyderabad 500081",
  },
  bhramaramba: {
    venue: "Bhramaramba 70MM",
    chain: "Bhramaramba",
    locality: "Kukatpally",
    pin: "500072",
    lat: 17.494,
    lng: 78.399,
    address: "Bhramaramba 70MM, Kukatpally, Hyderabad 500072",
  },
  cineTown: {
    venue: "Cine Town Indra Nagendra",
    chain: "Cine Town",
    locality: "Karmanghat",
    pin: "500079",
    lat: 17.34,
    lng: 78.548,
    address: "Cine Town Indra Nagendra, Karmanghat, Hyderabad 500079",
  },
  cinepolis: {
    venue: "Cinepolis TNR North City",
    chain: "Cinepolis",
    locality: "Suchitra",
    pin: "500067",
    lat: 17.504,
    lng: 78.478,
    address: "Cinepolis, TNR North City, Suchitra Junction, Hyderabad 500067",
  },
  devi: {
    venue: "Devi 70MM",
    chain: "Devi",
    locality: "RTC X Roads",
    pin: "500020",
    lat: 17.4065,
    lng: 78.4985,
    address: "Devi 70MM, RTC X Roads, Hyderabad 500020",
  },
  gpr: {
    venue: "GPR Multiplex",
    chain: "GPR",
    locality: "Nizampet",
    pin: "500090",
    lat: 17.515,
    lng: 78.382,
    address: "GPR Multiplex, Nizampet, Hyderabad 500090",
  },
  ashoka: {
    venue: "INOX Ashoka One Mall",
    chain: "INOX",
    locality: "Kukatpally",
    pin: "500072",
    lat: 17.493,
    lng: 78.393,
    address: "INOX Ashoka One Mall, Kukatpally, Hyderabad 500072",
  },
  necklace: {
    venue: "INOX Sattva Necklace Mall",
    chain: "INOX",
    locality: "Kavadiguda",
    pin: "500080",
    lat: 17.428,
    lng: 78.492,
    address: "INOX Sattva Necklace Mall, Kavadiguda, Hyderabad 500080",
  },
  laxmi: {
    venue: "Laxmi 70MM",
    chain: "Laxmi",
    locality: "Shamshabad",
    pin: "501218",
    lat: 17.255,
    lng: 78.435,
    address: "Laxmi 70MM, Shamshabad, Hyderabad 501218",
  },
  ranga: {
    venue: "Mythri Ranga",
    chain: "Mythri",
    locality: "Jeedimetla",
    pin: "500055",
    lat: 17.518,
    lng: 78.448,
    address: "Mythri Ranga, Jeedimetla, Hyderabad 500055",
  },
  shiva: {
    venue: "Mythri Shiva Ganga",
    chain: "Mythri",
    locality: "Dilsukhnagar",
    pin: "500060",
    lat: 17.368,
    lng: 78.525,
    address: "Mythri Shiva Ganga, Dilsukhnagar, Hyderabad 500060",
  },
  vimal: {
    venue: "Mythri Vimal 70MM",
    chain: "Mythri",
    locality: "Balanagar",
    pin: "500037",
    lat: 17.468,
    lng: 78.448,
    address: "Mythri Vimal 70MM, Balanagar, Hyderabad 500037",
  },
  atrium: {
    venue: "PVR Atrium Mall",
    chain: "PVR",
    locality: "Gachibowli",
    pin: "500032",
    lat: 17.44,
    lng: 78.349,
    address: "PVR Atrium Mall, Gachibowli, Hyderabad 500032",
  },
  icon: {
    venue: "PVR ICON Hitech",
    chain: "PVR",
    locality: "Madhapur",
    pin: "500081",
    lat: 17.444,
    lng: 78.386,
    address: "PVR ICON, Hitech City, Madhapur, Hyderabad 500081",
  },
  irrum: {
    venue: "PVR Irrum Manzil",
    chain: "PVR",
    locality: "Khairatabad",
    pin: "500004",
    lat: 17.412,
    lng: 78.462,
    address: "PVR Irrum Manzil, Khairatabad, Hyderabad 500004",
  },
  lakeshore: {
    venue: "PVR Lakeshore Mall",
    chain: "PVR",
    locality: "Kukatpally",
    pin: "500072",
    lat: 17.493,
    lng: 78.401,
    address: "PVR Lakeshore Mall, Y Junction, Kukatpally, Hyderabad 500072",
  },
  preston: {
    venue: "PVR Preston Prime",
    chain: "PVR",
    locality: "Gachibowli",
    pin: "500032",
    lat: 17.444,
    lng: 78.356,
    address: "PVR Preston Prime, Gachibowli, Hyderabad 500032",
  },
  inorbit: {
    venue: "PVR Superplex Inorbit",
    chain: "PVR",
    locality: "Madhapur",
    pin: "500081",
    lat: 17.434,
    lng: 78.387,
    address: "PVR Superplex, Inorbit Mall, Madhapur, Hyderabad 500081",
  },
  platinum: {
    venue: "Platinum Movietime",
    chain: "Platinum",
    locality: "Gachibowli",
    pin: "500032",
    lat: 17.441,
    lng: 78.358,
    address: "Platinum Movietime, Gachibowli, Hyderabad 500032",
  },
  prasads: {
    venue: "Prasads Multiplex",
    chain: "Prasads",
    locality: "Khairatabad",
    pin: "500004",
    lat: 17.413,
    lng: 78.465,
    address: "Prasads Multiplex, NTR Gardens, Necklace Road, Khairatabad, Hyderabad 500004",
  },
  sudarshan: {
    venue: "Sudarshan 35MM",
    chain: "Sudarshan",
    locality: "RTC X Roads",
    pin: "500020",
    lat: 17.407,
    lng: 78.497,
    address: "Sudarshan 35MM, RTC X Roads, Hyderabad 500020",
  },
  saiRanga: {
    venue: "Sai Ranga 70MM",
    chain: "Sai Ranga",
    locality: "Miyapur",
    pin: "500049",
    lat: 17.496,
    lng: 78.376,
    address: "Sai Ranga 70MM, Miyapur, Hyderabad 500049",
  },
  sandhya: {
    venue: "Sandhya 70MM",
    chain: "Sandhya",
    locality: "RTC X Roads",
    pin: "500020",
    lat: 17.406,
    lng: 78.499,
    address: "Sandhya 70MM, RTC X Roads, Hyderabad 500020",
  },
  ramulu: {
    venue: "Sree Ramulu 70MM",
    chain: "Sree Ramulu",
    locality: "Moosapet",
    pin: "500018",
    lat: 17.474,
    lng: 78.428,
    address: "Sree Ramulu 70MM, Moosapet, Hyderabad 500018",
  },
  vijetha: {
    venue: "Vijetha 70MM",
    chain: "Vijetha",
    locality: "Borabanda",
    pin: "500018",
    lat: 17.444,
    lng: 78.418,
    address: "Vijetha 70MM, Borabanda, Hyderabad 500018",
  },
  viswanath: {
    venue: "Viswanath 70MM",
    chain: "Viswanath",
    locality: "Kukatpally",
    pin: "500072",
    lat: 17.498,
    lng: 78.405,
    address: "Viswanath 70MM, Kukatpally, Hyderabad 500072",
  },
  saiRam: {
    venue: "Sri Sai Ram 70MM",
    chain: "Sri Sai Ram",
    locality: "Malkajgiri",
    pin: "500047",
    lat: 17.451,
    lng: 78.536,
    address: "Sri Sai Ram 70MM, Malkajgiri, Hyderabad 500047",
  },
} satisfies Record<string, Place>;

type PlaceId = keyof typeof places;

type Hall = {
  id: string;
  place: PlaceId;
  name: string;
  w: number | null;
  h?: number;
  aspect?: number;
  frame?: Frame;
  brand?: Brand;
  projector: Projector;
  audio: string;
  seats?: number;
  pickRank?: number;
  blurb?: string;
  caveat?: string;
};

const halls: Hall[] = [
  { id: "aaa-s1", place: "aaa", name: "Screen 1", w: 67, aspect: 2.39, projector: "4K laser", audio: "Dolby Atmos" },
  { id: "aaa-epiq", place: "aaa", name: "Screen 2 (EPIQ LED)", w: 30, aspect: 1.89, brand: "EPIQ", projector: "LED", audio: "Dolby Atmos" },
  { id: "aaa-s3", place: "aaa", name: "Screen 3", w: 53.3, aspect: 2.39, projector: "4K laser", audio: "Dolby 7.1" },

  {
    id: "amb-hyderabad",
    place: "amb",
    name: "Screen 1 (HDR by Barco)",
    w: 60.3,
    aspect: 2.39,
    brand: "HDR",
    projector: "Barco HDR",
    audio: "Dolby Atmos",
    pickRank: 4,
    blurb:
      "Sarath City’s main wall, listed as HDR by Barco at 60.3 ft, scope. The house people recommend for seats and upkeep, not for being the widest.",
  },
  { id: "amb-s2", place: "amb", name: "Screen 2", w: 40, aspect: 1.9, projector: "4K laser", audio: "Dolby Atmos" },
  { id: "amb-s3", place: "amb", name: "Screen 3", w: 40, aspect: 1.9, projector: "4K laser", audio: "Dolby Atmos" },
  { id: "amb-s4", place: "amb", name: "Screen 4", w: 33, aspect: 2.39, projector: "4K laser", audio: "Dolby Atmos" },
  { id: "amb-s5", place: "amb", name: "Screen 5 (VIP)", w: 33, aspect: 1.9, projector: "4K laser", audio: "Dolby Atmos" },
  { id: "amb-s6", place: "amb", name: "Screen 6", w: 40, aspect: 1.9, projector: "4K laser", audio: "Dolby Atmos" },
  { id: "amb-s7", place: "amb", name: "Screen 7", w: 33, aspect: 2.39, projector: "4K laser", audio: "Dolby Atmos" },
  { id: "amb-s8", place: "amb", name: "Screen 8 (MB LUXE)", w: 18, aspect: 2.39, projector: "4K laser", audio: "Dolby 5.1" },

  {
    id: "amb-classic-imax",
    place: "ambClassic",
    name: "Screen 1 (IMAX Laser)",
    w: null,
    frame: "1.90:1",
    brand: "IMAX",
    projector: "IMAX Laser",
    audio: "IMAX 12-channel",
    blurb:
      "Listed as IMAX with Laser at AMB Classic Victory, RTC X Roads. The specs table leaves the width blank, so it is not on the wall chart.",
    caveat:
      "Not drawn. A blank width is not a guess. Confirm the hall is actually open before you travel — this row is the specs listing, not a visit.",
  },

  { id: "art-s1", place: "art", name: "Screen 1", w: 38, aspect: 2.39, projector: "4K laser", audio: "Dolby 7.1" },
  { id: "art-s2", place: "art", name: "Screen 2", w: 43, aspect: 2.39, projector: "2K laser", audio: "Dolby 7.1" },
  { id: "art-s3", place: "art", name: "Screen 3", w: 43, aspect: 2.39, projector: "4K laser", audio: "Dolby Atmos" },
  { id: "art-s4", place: "art", name: "Screen 4", w: 43, aspect: 2.39, projector: "4K laser", audio: "Dolby Atmos" },
  { id: "art-s5", place: "art", name: "Screen 5", w: 43, aspect: 2.39, projector: "4K laser", audio: "Dolby 7.1" },
  { id: "art-epiq", place: "art", name: "Screen 6 (EPIQ)", w: 57, aspect: 1.89, brand: "EPIQ", projector: "4K laser", audio: "Dolby Atmos" },

  {
    id: "allu-dolby",
    place: "allu",
    name: "Dolby Cinema",
    w: 75,
    h: 40,
    aspect: 1.85,
    brand: "Dolby Cinema",
    projector: "Dolby Vision laser",
    audio: "Dolby Atmos",
    seats: 644,
    pickRank: 1,
    blurb:
      "Hyderabad’s Dolby Cinema, 75 × 40 ft on the screen page, flat 1.85. The widest Dolby Cinema cited in India after the March 2026 opening. Not an IMAX.",
    caveat:
      "75 divided by 1.85 is 40.5 ft, and the screen page prints 40 ft. One side is rounded. A 64-channel Atmos count is on that page, not in the newspaper reports.",
  },
  { id: "allu-s2", place: "allu", name: "Screen 2", w: 46, aspect: 1.85, projector: "4K laser", audio: "Dolby Atmos" },
  { id: "allu-s3", place: "allu", name: "Screen 3", w: 46, aspect: 1.85, projector: "4K laser", audio: "Dolby Atmos" },
  { id: "allu-s4", place: "allu", name: "Screen 4", w: 46, aspect: 1.85, projector: "4K laser", audio: "Dolby Atmos" },

  { id: "aparna-nalla-s5", place: "aparnaNalla", name: "Screen 5", w: 48.4, aspect: 2.39, projector: "4K laser", audio: "Dolby Atmos" },

  { id: "aparna-sham-s1", place: "aparnaSham", name: "Screen 1", w: 32, aspect: 2.39, projector: "4K laser", audio: "Dolby 7.1" },
  { id: "aparna-sham-s2", place: "aparnaSham", name: "Screen 2", w: 32, aspect: 1.85, projector: "4K laser", audio: "Dolby 7.1" },
  { id: "aparna-sham-s3", place: "aparnaSham", name: "Screen 3", w: 53.5, aspect: 2.39, projector: "4K laser", audio: "Dolby Atmos" },
  { id: "aparna-sham-s4", place: "aparnaSham", name: "Screen 4", w: 36.4, aspect: 2.39, projector: "4K laser", audio: "Dolby 7.1" },
  { id: "aparna-sham-s5", place: "aparnaSham", name: "Screen 5", w: 60, aspect: 2.39, projector: "4K laser", audio: "Dolby Atmos" },
  { id: "aparna-sham-s6", place: "aparnaSham", name: "Screen 6", w: 32, aspect: 2.39, projector: "4K laser", audio: "Dolby 7.1" },
  { id: "aparna-sham-s7", place: "aparnaSham", name: "Screen 7 (VIP)", w: 18.5, aspect: 2.39, projector: "4K laser", audio: "Dolby 7.1" },

  { id: "lakshmikala", place: "lakshmikala", name: "Lakshmikala", w: 58.2, aspect: 2.39, projector: "4K laser", audio: "Dolby Atmos" },

  { id: "cineplanet-s1", place: "cineplanet", name: "Screen 1", w: 60, aspect: 2.39, projector: "4K xenon", audio: "Dolby Atmos" },
  { id: "cineplanet-s2", place: "cineplanet", name: "Screen 2", w: 50, aspect: 2.39, projector: "2K xenon", audio: "Dolby 7.1" },
  { id: "cineplanet-s3", place: "cineplanet", name: "Screen 3", w: 45, aspect: 2.39, projector: "2K xenon", audio: "Dolby 7.1" },
  { id: "cineplanet-s4", place: "cineplanet", name: "Screen 4", w: 45, aspect: 2.39, projector: "2K xenon", audio: "Dolby 7.1" },

  { id: "br-hitech", place: "br", name: "BR Hitech", w: 65, aspect: 2.39, projector: "2K xenon", audio: "Dolby 7.1" },
  { id: "bhramaramba", place: "bhramaramba", name: "Bhramaramba 70MM", w: 70, aspect: 2.2, projector: "4K xenon", audio: "Dolby 7.1" },

  { id: "cinetown-indra", place: "cineTown", name: "Indra", w: 57, aspect: 2.39, projector: "2K xenon", audio: "Dolby 7.1" },
  { id: "cinetown-nagendra", place: "cineTown", name: "Nagendra", w: 65, aspect: 2.39, projector: "2K xenon", audio: "Dolby 7.1" },

  { id: "cinepolis-macro", place: "cinepolis", name: "Audi 7 (Macro XE)", w: 57, aspect: 2.39, projector: "4K laser", audio: "Dolby Atmos" },

  {
    id: "devi-70mm",
    place: "devi",
    name: "Devi 70MM",
    w: 83,
    aspect: 2.39,
    projector: "4K laser",
    audio: "Dolby Atmos",
    pickRank: 3,
    blurb:
      "The widest scope wall in this Hyderabad set, 83 ft, at RTC X Roads. A single-screen house, not an IMAX badge.",
  },

  { id: "gpr-s1", place: "gpr", name: "Screen 1", w: 37, aspect: 2.39, projector: "4K xenon", audio: "Dolby 7.1" },
  { id: "gpr-s2", place: "gpr", name: "Screen 2", w: 37, aspect: 2.39, projector: "2K xenon", audio: "Dolby 7.1" },
  { id: "gpr-s3", place: "gpr", name: "Screen 3", w: 54, aspect: 2.39, projector: "4K laser", audio: "Dolby Atmos" },

  { id: "inox-ashoka-s1", place: "ashoka", name: "Screen 1", w: 60, aspect: 2.39, projector: "4K laser", audio: "Dolby Atmos" },

  { id: "inox-neck-s1", place: "necklace", name: "Screen 1", w: 40, aspect: 2.39, projector: "4K laser", audio: "Dolby Atmos" },
  { id: "inox-neck-s2", place: "necklace", name: "Screen 2", w: 40, aspect: 2.39, projector: "4K laser", audio: "Dolby Atmos" },
  { id: "inox-neck-s3", place: "necklace", name: "Screen 3", w: 45, aspect: 2.39, projector: "4K laser", audio: "Dolby Atmos" },
  { id: "inox-neck-s4", place: "necklace", name: "Screen 4", w: 48, aspect: 2.39, projector: "4K laser", audio: "Dolby Atmos" },
  { id: "inox-neck-s5", place: "necklace", name: "Screen 5", w: 40, aspect: 2.39, projector: "4K laser", audio: "Dolby Atmos" },
  { id: "inox-neck-s6", place: "necklace", name: "Screen 6", w: 40, aspect: 2.39, projector: "4K laser", audio: "Dolby Atmos" },
  { id: "inox-neck-s7", place: "necklace", name: "Screen 7", w: 35, aspect: 2.39, projector: "4K laser", audio: "Dolby Atmos" },

  { id: "laxmi-70mm", place: "laxmi", name: "Laxmi 70MM", w: 40, aspect: 2.39, projector: "2K laser", audio: "Dolby 7.1" },

  {
    id: "mythri-ranga",
    place: "ranga",
    name: "Dolby Cinema",
    w: 70,
    aspect: 2.1,
    brand: "Dolby Cinema",
    projector: "Dolby Vision laser",
    audio: "Dolby Atmos",
    blurb: "Listed at 70 ft and a 2.1 hybrid shape, Dolby Vision. A site note has also called this hall a renovation.",
    caveat:
      "Treat it as listed, not as a hall you can assume is open tonight. The 2.1 aspect is what the specs row prints.",
  },

  { id: "shiva-ganga", place: "shiva", name: "Screen 1 (Ganga)", w: 66.8, aspect: 2.39, projector: "4K laser", audio: "Dolby Atmos" },
  { id: "shiva-shiva", place: "shiva", name: "Screen 2 (Shiva)", w: 58, aspect: 2.39, projector: "4K xenon", audio: "Dolby 7.1" },
  { id: "mythri-vimal", place: "vimal", name: "Vimal 70MM", w: 70, aspect: 2.39, projector: "4K laser", audio: "Dolby Atmos" },

  { id: "atrium-1", place: "atrium", name: "Audi 1", w: 45, aspect: 2.39, projector: "4K xenon", audio: "Dolby Atmos" },
  { id: "atrium-2", place: "atrium", name: "Audi 2", w: 45, aspect: 2.39, projector: "4K xenon", audio: "Dolby Atmos" },
  { id: "atrium-3", place: "atrium", name: "Audi 3", w: 45, aspect: 2.39, projector: "4K xenon", audio: "Dolby Atmos" },
  { id: "atrium-4", place: "atrium", name: "Audi 4", w: 45, aspect: 2.39, projector: "4K xenon", audio: "Dolby Atmos" },
  { id: "atrium-5", place: "atrium", name: "Audi 5", w: 48, aspect: 2.39, projector: "4K xenon", audio: "Dolby Atmos" },

  { id: "icon-1", place: "icon", name: "Audi 1", w: 45, aspect: 2.39, projector: "4K xenon", audio: "Dolby Atmos" },
  { id: "icon-2", place: "icon", name: "Audi 2", w: 45, aspect: 2.39, projector: "4K xenon", audio: "Dolby Atmos" },
  { id: "icon-3", place: "icon", name: "Audi 3", w: 45, aspect: 2.39, projector: "4K xenon", audio: "Dolby Atmos" },
  { id: "icon-4", place: "icon", name: "Audi 4", w: 45, aspect: 2.39, projector: "4K xenon", audio: "Dolby Atmos" },
  { id: "icon-5", place: "icon", name: "Audi 5", w: 45, aspect: 2.39, projector: "4K xenon", audio: "Dolby Atmos" },

  { id: "irrum-4dx", place: "irrum", name: "Audi 1 (4DX)", w: 50, aspect: 2.39, brand: "4DX", projector: "4K xenon", audio: "Dolby 7.1" },
  { id: "irrum-5", place: "irrum", name: "Audi 5", w: 38, aspect: 2.39, projector: "4K xenon", audio: "Dolby 7.1" },

  { id: "lakeshore-play", place: "lakeshore", name: "Audi 5 (Play House)", w: 31, aspect: 1.85, projector: "2K xenon", audio: "Dolby 7.1" },
  { id: "lakeshore-pxl", place: "lakeshore", name: "Audi 6 (PXL)", w: 55, aspect: 1.89, brand: "PXL", projector: "4K laser", audio: "Dolby Atmos" },

  { id: "preston-1", place: "preston", name: "Audi 1", w: 42, aspect: 2.39, projector: "4K xenon", audio: "Dolby Atmos" },
  { id: "preston-2", place: "preston", name: "Audi 2", w: 42, aspect: 2.39, projector: "4K xenon", audio: "Dolby Atmos" },
  { id: "preston-3", place: "preston", name: "Audi 3", w: 42, aspect: 2.39, projector: "4K xenon", audio: "Dolby Atmos" },
  { id: "preston-4", place: "preston", name: "Audi 4", w: 42, aspect: 2.39, projector: "4K xenon", audio: "Dolby Atmos" },

  { id: "inorbit-s1", place: "inorbit", name: "Screen 1", w: 26, aspect: 2.39, projector: "2K xenon", audio: "Dolby 7.1" },
  { id: "inorbit-pxl", place: "inorbit", name: "Screen 11 (PXL)", w: 55, aspect: 2.39, brand: "PXL", projector: "4K laser", audio: "Dolby Atmos" },

  { id: "platinum-s1", place: "platinum", name: "Screen 1", w: 50, aspect: 2.39, projector: "4K laser", audio: "Dolby Atmos" },
  { id: "platinum-s2", place: "platinum", name: "Screen 2", w: 45, aspect: 2.39, projector: "4K laser", audio: "Dolby Atmos" },
  { id: "platinum-s3", place: "platinum", name: "Screen 3", w: 42, aspect: 2.39, projector: "4K xenon", audio: "Dolby Atmos" },
  { id: "platinum-s4", place: "platinum", name: "Screen 4", w: 40, aspect: 2.39, projector: "4K xenon", audio: "Dolby Atmos" },
  { id: "platinum-s5", place: "platinum", name: "Screen 5", w: 38, aspect: 2.39, projector: "4K xenon", audio: "Dolby Atmos" },

  { id: "prasads-s1", place: "prasads", name: "Screen 1", w: 55, h: 23, aspect: 2.39, projector: "4K xenon", audio: "Dolby Atmos", seats: 364 },
  { id: "prasads-s2", place: "prasads", name: "Screen 2", w: 55, aspect: 2.39, projector: "4K xenon", audio: "Dolby Atmos" },
  { id: "prasads-s3", place: "prasads", name: "Screen 3", w: 59.2, h: 31.3, aspect: 1.89, projector: "4K laser", audio: "Dolby Atmos", seats: 392 },
  {
    id: "prasads-hdr",
    place: "prasads",
    name: "Screen 4 (HDR by Barco)",
    w: 59.2,
    h: 31.3,
    aspect: 1.89,
    brand: "HDR",
    projector: "Barco HDR",
    audio: "Dolby Atmos",
    seats: 392,
    blurb: "Prasads’ Barco HDR hall, 59.2 × 31.3 ft, flat. Not the PCX giant.",
  },
  { id: "prasads-s5", place: "prasads", name: "Screen 5", w: 38, aspect: 2.39, projector: "4K xenon", audio: "Dolby 7.1" },
  {
    id: "prasads-pcx",
    place: "prasads",
    name: "Screen 6 (PCX)",
    w: 98.6,
    h: 64,
    aspect: 1.54,
    brand: "PCX",
    projector: "Dual 4K laser",
    audio: "Dolby Atmos",
    seats: 629,
    pickRank: 2,
    blurb:
      "The biggest wall in this set, 98.6 × 64 ft. Opened as IMAX in July 2003 and converted to Prasads’ own PCX in 2014. Not IMAX.",
    caveat:
      "The theatre page prints 98.6 × 64 ft and about 1.54:1. It is not an IMAX-certified system. A later blurb on the same site says 101.6 ft; the chart uses the specs row, not that sentence.",
  },

  { id: "sudarshan", place: "sudarshan", name: "Sudarshan 35MM", w: 55, aspect: 2.39, projector: "4K laser", audio: "Dolby Atmos" },
  { id: "sai-ranga", place: "saiRanga", name: "Sai Ranga 70MM", w: 58.6, aspect: 2.39, projector: "4K laser", audio: "Dolby 7.1" },
  { id: "sandhya-70", place: "sandhya", name: "Sandhya 70MM", w: 68, aspect: 2.76, projector: "4K xenon", audio: "Dolby Atmos" },
  { id: "ramulu", place: "ramulu", name: "Sree Ramulu 70MM", w: 70, aspect: 2.39, projector: "4K laser", audio: "Dolby 7.1" },
  { id: "vijetha", place: "vijetha", name: "Vijetha 70MM", w: 52, aspect: 2.39, projector: "4K xenon", audio: "Dolby Atmos" },
  { id: "viswanath", place: "viswanath", name: "Viswanath 70MM", w: 66, aspect: 2.2, projector: "4K laser", audio: "Dolby Atmos" },

  {
    id: "sri-sai-ram",
    place: "saiRam",
    name: "Sri Sai Ram 70MM",
    w: null,
    aspect: 2.2,
    projector: "4K xenon",
    audio: "Dolby 7.1",
    blurb: "A well-known Malkajgiri single screen. The specs row prints a 2.20 shape and leaves the width blank, so it is not drawn.",
    caveat: "Not drawn. No width was published on the specs table.",
  },
];

const ASPECTS: Array<[number, Frame]> = [
  [1.54, "1.54:1"],
  [1.85, "1.85:1"],
  [1.89, "1.89:1"],
  [1.9, "1.90:1"],
  [2.1, "2.10:1"],
  [2.2, "2.20:1"],
  [2.39, "2.39:1"],
  [2.76, "2.76:1"],
];

function frameFor(aspect: number | undefined, explicit?: Frame): Frame | null {
  if (explicit) return explicit;
  if (aspect == null) return null;
  const hit = ASPECTS.find(([value]) => Math.abs(value - aspect) < 0.02);
  return hit ? hit[1] : null;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export const hyderabadScreens: Screen[] = halls.map((hall) => {
  const place = places[hall.place];
  const heightInferred = hall.w != null && hall.h == null && hall.aspect != null;
  const heightFt =
    hall.w == null ? null : hall.h != null ? hall.h : hall.aspect != null ? round1(hall.w / hall.aspect) : null;
  return {
    id: hall.id,
    name: hall.name,
    venue: place.venue,
    chain: place.chain,
    citySlug: "hyderabad",
    locality: place.locality,
    pin: place.pin,
    address: place.address,
    lat: place.lat,
    lng: place.lng,
    brand: hall.brand ?? "Digital",
    projector: hall.projector,
    audio: hall.audio,
    widthFt: hall.w,
    heightFt,
    heightInferred,
    frame: frameFor(hall.aspect, hall.frame),
    seats: hall.seats ?? null,
    commercial: true,
    confidence: "press",
    source: SOURCE,
    caveat: hall.caveat ?? (heightInferred ? INFERRED : null),
    blurb:
      hall.blurb ??
      `${hall.name} at ${place.venue}, ${place.locality}. ${
        hall.w == null ? "Width unpublished on the specs table." : `${hall.w} ft wide on the Hyderabad Theatres specs table.`
      }`,
    pickRank: hall.pickRank ?? null,
  };
});
