import { createFileRoute, Link } from "@tanstack/react-router";
import { PIN_EXAMPLES, PinField } from "@/components/pin-field";
import { OverlayChart } from "@/components/overlay-chart";
import { cities } from "@/data/cities";
import { measuredScreens, screens, screensInCity } from "@/data/screens";
import type { Screen } from "@/data/types";
import { areaSqFt } from "@/lib/measure";

export const Route = createFileRoute("/")({ component: Home });

/** A few walls with a real height gap, so the home floor stays readable. */
function distinctFloor(list: Screen[]): Screen[] {
  const ranked = measuredScreens(list)
    .filter((screen) => (screen.widthFt ?? 0) >= 50)
    .slice()
    .sort((a, b) => (areaSqFt(b) ?? 0) - (areaSqFt(a) ?? 0));
  const picked: Screen[] = [];
  for (const screen of ranked) {
    if (picked.length >= 4) break;
    const height = screen.heightFt ?? 0;
    if (picked.every((other) => Math.abs((other.heightFt ?? 0) - height) >= 10)) picked.push(screen);
  }
  return picked;
}

function Home() {
  const hyderabad = screensInCity("hyderabad");
  const floor = distinctFloor(hyderabad);
  const measured = measuredScreens(hyderabad).length;
  const elsewhere = screens.length - hyderabad.length;
  const ordered = [...cities].sort((a, b) => Number(b.slug === "hyderabad") - Number(a.slug === "hyderabad"));

  return (
    <div>
      <p className="text-xs tracking-[0.16em] text-accent uppercase">India · based in Hyderabad</p>
      <h1 className="mt-3 max-w-3xl font-display text-4xl text-fg sm:text-5xl">
        The large screens, at the size they actually are
      </h1>
      <p className="mt-4 max-w-2xl text-base text-muted">
        A size repository. Hyderabad is the full set: every hall with a published width, not only a
        premium badge. The other cities are the premium large-format rooms — IMAX, Dolby Cinema,
        PXL, PCX — that we can cite.
      </p>

      <section className="mt-8">
        <div className="rounded-lg bg-paper p-4 sm:p-6">
          <OverlayChart screens={floor} title="Hyderabad, the walls you can tell apart" standard />
        </div>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          {hyderabad.length} halls in the city set, {measured} with a width. The floor is the size
          steps, not every audi. Unpublished widths stay off the drawing.
        </p>
        <Link
          to="/cities/$city"
          params={{ city: "hyderabad" }}
          className="mt-3 inline-flex h-11 items-center text-accent"
        >
          Open the Hyderabad directory
        </Link>
      </section>

      <section className="mt-10 max-w-xl">
        <h2 className="font-display text-2xl">Near a Hyderabad PIN</h2>
        <p className="mt-2 text-sm text-muted">
          Six digits. The large walls within a short drive go on one floor.
        </p>
        <div className="mt-4">
          <PinField />
        </div>
        <ul className="mt-3 flex flex-wrap gap-2">
          {PIN_EXAMPLES.map((example) => (
            <li key={example.pin}>
              <Link
                to="/pin/$pin"
                params={{ pin: example.pin }}
                className="inline-flex h-11 items-center rounded-md border border-line px-3 text-sm text-fg"
              >
                {example.label}
                <span className="ml-2 tabular text-faint">{example.pin}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl">The rest of the repository</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          {elsewhere} premium halls outside Hyderabad, across {cities.length - 1} cities. A missing
          city means we do not have a set we will stand behind yet.
        </p>
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {ordered.map((city) => {
            const list = screensInCity(city.slug);
            const full = city.slug === "hyderabad";
            const top = list.find((screen) => screen.pickRank === 1);
            return (
              <li key={city.slug}>
                <Link
                  to="/cities/$city"
                  params={{ city: city.slug }}
                  className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr_auto] sm:items-baseline sm:gap-4"
                >
                  <span className="font-display text-xl">{city.name}</span>
                  <span className="text-sm text-muted">
                    {full ? "Full directory, every published width" : top ? `Start with ${top.venue}` : city.region}
                  </span>
                  <span className="text-sm text-faint">
                    {list.length} {full ? "halls" : "premium"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
