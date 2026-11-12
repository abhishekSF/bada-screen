export type City = {
  slug: string;
  name: string;
  region: string;
  intro: string;
};

export const cities: City[] = [
  {
    slug: "mumbai",
    name: "Mumbai",
    region: "Maharashtra",
    intro:
      "From the historic Wadala house — India's first IMAX, opened in 2001 — to the 2025 Sky City megaplex in Borivali. Navi Mumbai and Thane sit on this same chart. Rectangles are only as solid as the citation under them.",
  },
  {
    slug: "delhi-ncr",
    name: "Delhi NCR",
    region: "Delhi · Haryana · Uttar Pradesh",
    intro:
      "The deepest IMAX bench in the country. Laser and xenon share the list. A bigger rectangle is not automatically the better picture — Select Citywalk is smaller than Logix and is still the one people cross town for.",
  },
  {
    slug: "bengaluru",
    name: "Bengaluru",
    region: "Karnataka",
    intro:
      "Six IMAX auditoriums in this set, almost all digital xenon rather than laser. A separate Dolby Cinema, about 65 ft wide, is the picture-quality outlier. Fan lists disagree on which IMAX has been upgraded.",
  },
  {
    slug: "hyderabad",
    name: "Hyderabad",
    region: "Telangana",
    intro:
      "Every hall on the Hyderabad Theatres specs table with a printed width is in this set — multiplex audis and single screens, not only a premium badge. Prasads Screen 6 (PCX) is the giant at 98.6 × 64 ft and has not been IMAX since 2014. Devi 70MM at RTC X Roads is the widest scope wall here, 83 ft. Allu Cinemas in Kokapet is the Dolby Cinema. AMB Classic Victory lists an IMAX with Laser whose width is blank, so it is named and not drawn. Rectangles share one floor.",
  },
  {
    slug: "chennai",
    name: "Chennai",
    region: "Tamil Nadu",
    intro:
      "Palazzo at Nexus Vijaya is the city's flagship, refitted to IMAX XT Laser in December 2025. The old 70-foot figure is not drawn — the screen was replaced. Phoenix Marketcity in Velachery is the IMAX whose size we can still show.",
  },
  {
    slug: "pune",
    name: "Pune",
    region: "Maharashtra",
    intro:
      "Phoenix Mall of the Millennium has the laser IMAX. Westend is the older digital house. A March 2026 report also counted a roughly 55 ft Dolby Cinema in the city; that hall is not pinned here.",
  },
  {
    slug: "kolkata",
    name: "Kolkata",
    region: "West Bengal",
    intro:
      "South City's IMAX is the known commercial IMAX. Mani Square's PXL is cited as one of the widest premium screens in India — that width is a community figure, drawn dashed, not a chain measurement.",
  },
  {
    slug: "ahmedabad",
    name: "Ahmedabad",
    region: "Gujarat",
    intro:
      "Gujarat Science City has the only 15-perforation 70mm IMAX in this dataset, and it does not play commercial releases. For a new film, look at PVR Phoenix Palladium in Thaltej.",
  },
  {
    slug: "kochi",
    name: "Kochi",
    region: "Kerala",
    intro:
      "Centre Square's IMAX with Laser is the branded giant. A PXL at Mymoon is cited around 73 ft wide, height unpublished, so it is listed and not drawn.",
  },
  {
    slug: "coimbatore",
    name: "Coimbatore",
    region: "Tamil Nadu",
    intro:
      "Broadway's IMAX with Laser is the room. A community sheet says 66 × 36 ft with 12-channel audio; a fan list says about 71 ft wide. Both are shown as a disagreement, not averaged.",
  },
  {
    slug: "lucknow",
    name: "Lucknow",
    region: "Uttar Pradesh",
    intro:
      "Phoenix Palassio's IMAX is the premium large-format anchor in this set. The size is from a community sheet, not an IMAX venue-guide measurement.",
  },
  {
    slug: "thiruvananthapuram",
    name: "Thiruvananthapuram",
    region: "Kerala",
    intro:
      "PVR at Lulu Mall is the city's IMAX. A November 2025 note lists 65.6 × 36 ft; a community sheet rounds the width to 66 ft.",
  },
  {
    slug: "surat",
    name: "Surat",
    region: "Gujarat",
    intro:
      "Rajhans at Precia Mall is the IMAX with Laser in this set, opened around 2025. Size is from a community sheet.",
  },
];

export function getCity(slug: string): City | undefined {
  return cities.find((city) => city.slug === slug);
}
