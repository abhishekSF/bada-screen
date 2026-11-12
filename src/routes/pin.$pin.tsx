import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { getCity } from "@/data/cities";
import { OverlayChart } from "@/components/overlay-chart";
import { PIN_EXAMPLES, PinField } from "@/components/pin-field";
import { pairLabel } from "@/lib/measure";
import { recommendForPin } from "@/lib/recommend";
import { usePrefs } from "@/lib/prefs";

export const Route = createFileRoute("/pin/$pin")({ component: PinPage });

function PinPage() {
  const { pin: raw } = Route.useParams();
  const pin = raw.replace(/\D/g, "");
  const { unit } = usePrefs();
  const rec = useMemo(() => recommendForPin(pin), [pin]);
  const valid = /^\d{6}$/.test(pin);
  const telangana =
    pin.startsWith("500") || pin.startsWith("501") || pin.startsWith("502") || pin.startsWith("509");

  if (!valid || !rec) {
    return (
      <div className="mx-auto max-w-xl">
        <h1 className="font-display text-3xl">PIN codes are six digits</h1>
        <p className="mt-3 text-muted">Try 500084 for AMB Kondapur, or 500004 for Prasads.</p>
        <div className="mt-6">
          <PinField initial={pin} />
        </div>
      </div>
    );
  }

  if (rec.exact.length === 0) {
    return (
      <div className="mx-auto max-w-xl">
        <p className="text-xs tracking-[0.16em] text-accent uppercase">PIN {pin}</p>
        <h1 className="mt-2 font-display text-4xl">No hall in this set lists {pin}</h1>
        <p className="mt-4 text-muted">
          {telangana
            ? "That Hyderabad PIN is not on a complex in this set. Pick one that is, or open the city chart."
            : "PIN lookup is filled in for Hyderabad complexes. This code is not one of them."}
        </p>
        <ul className="mt-6 border-t border-line">
          {PIN_EXAMPLES.map((example) => (
            <li key={example.pin} className="border-b border-line">
              <Link
                to="/pin/$pin"
                params={{ pin: example.pin }}
                className="flex h-14 items-center justify-between gap-3"
              >
                <span>{example.label}</span>
                <span className="tabular text-muted">{example.pin}</span>
              </Link>
            </li>
          ))}
        </ul>
        {telangana ? (
          <p className="mt-6">
            <Link to="/cities/$city" params={{ city: "hyderabad" }} className="text-accent">
              Open the Hyderabad wall chart
            </Link>
          </p>
        ) : (
          <p className="mt-6">
            <Link to="/cities" className="text-accent">
              Browse cities
            </Link>
          </p>
        )}
      </div>
    );
  }

  const city = rec.exact[0]?.citySlug ? getCity(rec.exact[0].citySlug) : undefined;
  const place = rec.locality || pin;

  return (
    <div>
      <p className="text-xs tracking-[0.16em] text-accent uppercase">
        PIN {pin}
        {city ? ` · ${city.name}` : ""}
      </p>
      <div className="mt-4 rounded-lg bg-paper p-4 sm:p-6">
        <OverlayChart
          titleAs="h1"
          screens={rec.chart}
          title={`Large format screens near ${place}`}
          standard
        />
      </div>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        {rec.exact.length} {rec.exact.length === 1 ? "hall lists" : "halls list"} {pin}
        {rec.locality ? ` in ${rec.locality}` : ""}. The floor shows the size steps you can tell apart within{" "}
        {rec.radiusKm} km. A bigger rectangle is only a bigger wall.
      </p>

      {rec.unpublished.length > 0 ? (
        <ul className="mt-4 max-w-2xl space-y-2 text-sm text-muted">
          {rec.unpublished.map((screen) => (
            <li key={screen.id}>
              {screen.venue} {screen.name} is listed at this PIN, but the width was never published, so it stays off
              the chart.
            </li>
          ))}
        </ul>
      ) : null}

      {rec.picks.length > 0 ? (
        <section className="mt-10 max-w-2xl">
          <h2 className="font-display text-2xl">Recommendation</h2>
          <ol className="mt-2">
            {rec.picks.map((pick) => (
              <li key={pick.screen.id} className="border-b border-line py-4">
                <p className="text-xs tracking-[0.14em] text-accent uppercase">{pick.kicker}</p>
                <Link
                  to="/screens/$id"
                  params={{ id: pick.screen.id }}
                  className="mt-1 inline-flex min-h-11 items-center font-display text-2xl text-fg hover:text-accent"
                >
                  {pick.screen.venue}
                </Link>
                <p className="text-sm text-muted">
                  {pick.screen.name}
                  {" · "}
                  {pick.screen.locality}
                  {pick.screen.pin ? ` · ${pick.screen.pin}` : ""}
                  {" · "}
                  {pairLabel(pick.screen, unit)}
                </p>
                <p className="mt-2 text-sm text-fg">{pick.line}</p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section className="mt-10 max-w-2xl">
        <h2 className="font-display text-2xl">Every hall at {pin}</h2>
        <ul className="mt-2 border-t border-line">
          {rec.exact.map((screen) => (
            <li key={screen.id} className="border-b border-line">
              <Link
                to="/screens/$id"
                params={{ id: screen.id }}
                className="flex min-h-14 items-center justify-between gap-3 py-3"
              >
                <span className="min-w-0">
                  <span className="block text-fg">{screen.venue}</span>
                  <span className="block truncate text-sm text-muted">
                    {screen.name}
                    {screen.brand !== "Digital" ? ` · ${screen.brand}` : ""}
                  </span>
                </span>
                <span className="tabular shrink-0 text-sm text-fg">{pairLabel(screen, unit)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {city ? (
        <p className="mt-8">
          <Link to="/cities/$city" params={{ city: city.slug }} className="text-accent">
            All of {city.name}
          </Link>
        </p>
      ) : null}

      <section className="mt-10 max-w-xl border-t border-line pt-8">
        <h2 className="font-display text-2xl">Different PIN</h2>
        <div className="mt-4">
          <PinField />
        </div>
      </section>
    </div>
  );
}
