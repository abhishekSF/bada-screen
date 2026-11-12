import { createFileRoute } from "@tanstack/react-router";
import { DATA_NOTE } from "@/lib/measure";

export const Route = createFileRoute("/method")({ component: MethodPage });

function MethodPage() {
  return (
    <div className="max-w-2xl">
      <p className="text-xs tracking-[0.16em] text-accent uppercase">Method</p>
      <h1 className="mt-2 font-display text-4xl">How a number gets onto the chart</h1>
      <p className="mt-4 text-muted">{DATA_NOTE}</p>

      <h2 className="mt-8 font-display text-2xl">Three grades</h2>
      <ul className="mt-3 space-y-3 text-sm text-muted">
        <li>
          <span className="text-fg">Venue guide.</span> A figure taken from an IMAX venue listing,
          converted from metres when that is how it was published. Science City and Mall of India
          are in this grade.
        </li>
        <li>
          <span className="text-fg">Press or theatre guide.</span> A newspaper, a dated roundup, or
          a theatre spec page that prints width and height. TheatresDB’s August 2026 NCR figures
          and the March 2026 Allu opening reports sit here.
        </li>
        <li>
          <span className="text-fg">Community report.</span> Fan sheets and posts. Drawn with a
          dashed edge. Useful, and wrong often enough that they are not smoothed into a single
          “official” number.
        </li>
      </ul>

      <h2 className="mt-8 font-display text-2xl">What we refuse to do</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
        <li>Invent a height when no aspect was published either. If a specs row prints a width and an aspect, height is width divided by that aspect and the label says inferred. A bare width stays off the drawing.</li>
        <li>Average two disagreeing sizes. The chart uses one cited pair and the caveat names the other.</li>
        <li>Silently “correct” a wall to 1.90:1. If the published shape is taller than the picture frame, the page says so.</li>
        <li>Keep a pre-refit size after a screen was replaced. Palazzo’s old 70 ft figure is not drawn.</li>
        <li>Call PCX, PXL, BigPix, or Dolby Cinema an IMAX because the wall is large.</li>
        <li>Pretend a personal save or a note is a public vote. Both stay in this browser.</li>
      </ul>

      <h2 className="mt-8 font-display text-2xl">Feet and metres</h2>
      <p className="mt-3 text-sm text-muted">
        The header switch is exact: 1 foot = 0.3048 metres. A venue published in metres is stored
        in feet to one decimal after that conversion, and the source line keeps the original
        metres. Area compared with a 65-inch 16:9 television uses the same geometry.
      </p>

      <h2 className="mt-8 font-display text-2xl">Pins</h2>
      <p className="mt-3 text-sm text-muted">
        Near-me sorts by straight-line distance from a public pin. It is not drive time, and a
        hall without a pin we trust is left out of that sort rather than dropped on a city centre.
      </p>
    </div>
  );
}
