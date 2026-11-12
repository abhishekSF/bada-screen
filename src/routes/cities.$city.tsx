import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { getCity } from "@/data/cities";
import { screensInCity } from "@/data/screens";
import { ChartModeSwitch, OverlayChart, chartSelection, type ChartMode } from "@/components/overlay-chart";
import { ScreenRow } from "@/components/screen-row";
import type { Screen } from "@/data/types";

export const Route = createFileRoute("/cities/$city")({ component: CityPage });

function pinGroups(list: Screen[]) {
  const map = new Map<string, { pin: string; localities: string[]; count: number }>();
  for (const screen of list) {
    if (!screen.pin) continue;
    const row = map.get(screen.pin);
    if (!row) {
      map.set(screen.pin, { pin: screen.pin, localities: [screen.locality], count: 1 });
    } else {
      row.count += 1;
      if (!row.localities.includes(screen.locality)) row.localities.push(screen.locality);
    }
  }
  return [...map.values()].sort((a, b) => a.pin.localeCompare(b.pin));
}

function CityPage() {
  const { city: slug } = Route.useParams();
  const city = getCity(slug);
  const [mode, setMode] = useState<ChartMode>("picture");

  const list = city ? screensInCity(city.slug) : [];
  const measuredCount = list.filter((screen) => screen.widthFt != null && screen.heightFt != null).length;

  useEffect(() => {
    setMode(measuredCount > 12 ? "picture" : "all");
  }, [slug, measuredCount]);

  const shown = useMemo(() => chartSelection(list, mode), [list, mode]);
  const pins = pinGroups(list);

  if (!city) {
    return (
      <div>
        <h1 className="font-display text-3xl">That city is not in this set</h1>
        <p className="mt-3 text-muted">
          <Link to="/cities" className="text-accent">
            Back to cities
          </Link>
        </p>
      </div>
    );
  }

  const picks = list
    .filter((screen) => screen.pickRank != null)
    .slice()
    .sort((a, b) => (a.pickRank ?? 99) - (b.pickRank ?? 99));
  const ordered = list.slice().sort((a, b) => {
    const width = (b.widthFt ?? -1) - (a.widthFt ?? -1);
    if (width !== 0) return width;
    return a.venue.localeCompare(b.venue) || a.name.localeCompare(b.name);
  });
  const undrawn = list.length - measuredCount;

  return (
    <div>
      <p className="text-xs tracking-[0.16em] text-accent uppercase">{city.region}</p>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl">{city.name}</h1>
      <p className="mt-4 max-w-2xl text-muted">{city.intro}</p>

      {pins.length > 0 ? (
        <div className="mt-6">
          <p className="text-xs tracking-[0.14em] text-faint uppercase">By PIN</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {pins.map((group) => (
              <li key={group.pin}>
                <Link
                  to="/pin/$pin"
                  params={{ pin: group.pin }}
                  className="inline-flex h-11 items-center rounded-md border border-line px-3 text-sm text-fg hover:border-accent"
                >
                  {group.pin}
                  <span className="ml-2 text-faint">
                    {group.localities.join(", ")} · {group.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl">To scale</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              {measuredCount} halls have a width and a height. {undrawn > 0 ? `${undrawn} more are listed with no size and stay off the drawing. ` : ""}
              The chart stacks them on one floor, largest behind.
            </p>
          </div>
        </div>
        <div className="mt-4">
          <ChartModeSwitch mode={mode} onChange={setMode} showPicture={measuredCount > 12} />
        </div>
        <div className="mt-4 rounded-lg bg-paper p-4 sm:p-6">
          <OverlayChart
            screens={shown}
            title={
              mode === "all"
                ? `Every measured screen in ${city.name}`
                : `Large format screens near ${city.name}`
            }
            standard={shown.length <= 16}
          />
        </div>
      </section>

      {picks.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-display text-2xl">Editor’s order</h2>
          <ol className="mt-4 grid gap-3">
            {picks.map((screen, index) => (
              <li key={screen.id}>
                <Link
                  to="/screens/$id"
                  params={{ id: screen.id }}
                  className="grid gap-2 rounded-lg border border-line p-4 hover:border-accent sm:grid-cols-[3rem_1fr]"
                >
                  <span className="tabular font-display text-2xl text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block font-display text-xl">{screen.venue}</span>
                    <span className="mt-1 block text-sm text-muted">{screen.blurb}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="font-display text-2xl">Every hall in this city set</h2>
        <div className="mt-2">
          {ordered.map((screen) => (
            <ScreenRow key={screen.id} screen={screen} />
          ))}
        </div>
      </section>
    </div>
  );
}
