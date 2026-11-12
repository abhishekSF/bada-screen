import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/formats")({ component: FormatsPage });

const FRAMES = [
  {
    ratio: "2.39 / 1",
    label: "2.39:1",
    name: "Scope",
    copy: "The ordinary widescreen shape. A huge scope screen can still be wider than a small IMAX.",
  },
  {
    ratio: "1.85 / 1",
    label: "1.85:1",
    name: "Flat",
    copy: "A common shape for Dolby Cinema and flat premium screens. Allu Cinemas in Kokapet is described as flat 1.85.",
  },
  {
    ratio: "1.90 / 1",
    label: "1.90:1",
    name: "IMAX digital",
    copy: "What commercial IMAX in India actually shows. Taller than scope. Not the 1.43 film frame.",
  },
  {
    ratio: "1.43 / 1",
    label: "1.43:1",
    name: "IMAX 15/70",
    copy: "The tall film frame. In this dataset, only Gujarat Science City — and it does not play new releases.",
  },
];

const BRANDS = [
  {
    name: "IMAX",
    tells: "A branded auditorium, usually with a taller 1.90 picture on digital systems.",
    doesNot: "It does not promise the largest wall, laser projection, 12-channel sound, or 1.43. Most Indian IMAX houses are digital. Xenon and laser are different light engines inside the same brand.",
  },
  {
    name: "IMAX with Laser",
    tells: "XT or commercial laser (CoLa). Better contrast than the older dual-xenon projectors, on the same 1.90 shape.",
    doesNot: "Laser is not 15/70 film, and it is not automatically 1.43. Select Citywalk is laser and much smaller than Logix, which is still xenon.",
  },
  {
    name: "Dolby Cinema",
    tells: "Dolby Vision projection, usually with Dolby Atmos. In this set: Allu Cinemas, Kokapet (75 ft wide, opened March 2026) and an AMB hall in Bengaluru cited around 65 ft.",
    doesNot: "Not an IMAX, and not automatically the biggest screen in the city. A March 2026 report also counted a roughly 55 ft Dolby Cinema in Pune; that hall is not pinned here.",
  },
  {
    name: "PXL",
    tells: "PVR’s own premium large format. Specs are per auditorium. Mani Square in Kolkata is cited, unverified, at 85 × 46 ft.",
    doesNot: "The badge does not fix the width. Ask which screen, not just which multiplex.",
  },
  {
    name: "PCX",
    tells: "Prasads’ in-house giant in Hyderabad, converted from IMAX in 2014. The theatre guide prints Screen 6 at 98.6 × 64 ft.",
    doesNot: "It is not IMAX. The foot-measurement is not from the IMAX venue guide.",
  },
  {
    name: "BigPix and HDR by Barco",
    tells: "Chain or installer premium brands. AMB Gachibowli’s main screen is described as Barco HDR with Dolby Atmos, not as Dolby Cinema and not as IMAX.",
    doesNot: "Atmos is the sound format. It can sit on a modest screen.",
  },
  {
    name: "4DX",
    tells: "Motion seats and effects. Sky City Borivali has a 4DX room next to its IMAX. They are different auditoriums.",
    doesNot: "Not a statement about screen size. PVR Irrum Manzil in Hyderabad lists a 4DX audi at 50 ft. Other 4DX rooms in this set still have no published width.",
  },
  {
    name: "ScreenX, EPIQ, ONYX",
    tells: "ScreenX extends some scenes onto side walls. EPIQ is Cinepolis’s premium brand. ONYX is an LED cinema wall.",
    doesNot: "They matter. In Hyderabad the specs table does print two: AAA Ameerpet’s EPIQ LED at 30 ft, and ART Cinemas’ EPIQ at 57 ft. ScreenX and ONYX are still absent here.",
  },
];

function FormatsPage() {
  return (
    <div>
      <p className="text-xs tracking-[0.16em] text-accent uppercase">Formats</p>
      <h1 className="mt-2 max-w-3xl font-display text-4xl sm:text-5xl">
        The brand is the system. The rectangle is the wall.
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        Same width in the row below, so you can see the extra picture height. Physical screens do
        not always match these shapes — masking and rounded measurements are called out on each
        hall.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FRAMES.map((frame) => (
          <figure key={frame.label} className="rounded-lg border border-line p-3">
            <div className="bg-bg-sunken p-3">
              <div className="w-full bg-screen" style={{ aspectRatio: frame.ratio }} />
            </div>
            <figcaption className="mt-3">
              <span className="tabular text-sm text-accent">{frame.label}</span>
              <span className="mt-1 block font-display text-lg">{frame.name}</span>
              <span className="mt-1 block text-sm text-muted">{frame.copy}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl">What the ticket name does and does not say</h2>
        <ul className="mt-4 grid gap-4">
          {BRANDS.map((brand) => (
            <li key={brand.name} className="rounded-lg border border-line p-4">
              <h3 className="font-display text-xl">{brand.name}</h3>
              <p className="mt-2 text-sm text-fg">{brand.tells}</p>
              <p className="mt-2 text-sm text-muted">{brand.doesNot}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 max-w-2xl">
        <h2 className="font-display text-2xl">A short way to choose</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted">
          <li>If the film was finished for a tall IMAX frame, prefer a real IMAX over a similar-width PXL. In India that tall frame is 1.90, not 1.43, at a commercial house.</li>
          <li>Between two IMAX halls, laser usually beats xenon when the size gap is small. A 15-foot gap the other way can still win.</li>
          <li>Dolby Cinema is a picture-and-sound system. Compare its width on the chart before assuming it is the biggest screen in the city.</li>
          <li>4DX is a different question. Pick it for the effects, not because the wall is larger.</li>
        </ol>
        <p className="mt-4 text-sm">
          <Link to="/true-imax" className="text-accent">
            The 15/70 exception
          </Link>
        </p>
      </section>
    </div>
  );
}
