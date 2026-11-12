import { createFileRoute, Link } from "@tanstack/react-router";
import { cities } from "@/data/cities";
import { screensInCity } from "@/data/screens";

export const Route = createFileRoute("/cities/")({ component: CitiesPage });

function CitiesPage() {
  return (
    <div>
      <p className="text-xs tracking-[0.16em] text-accent uppercase">Cities</p>
      <h1 className="mt-2 font-display text-4xl">The screens worth crossing town for</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Hyderabad is the full directory. Every other city is the premium large-format set we can
        cite, not every multiplex screen in that city.
      </p>
      <ul className="mt-8 divide-y divide-line border-y border-line">
        {[...cities]
          .sort((a, b) => Number(b.slug === "hyderabad") - Number(a.slug === "hyderabad"))
          .map((city) => {
          const list = screensInCity(city.slug);
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
                  {city.slug === "hyderabad"
                    ? "Full directory, every published width"
                    : top
                      ? `Start with ${top.venue}`
                      : city.region}
                </span>
                <span className="text-sm text-faint">{list.length} screens</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
