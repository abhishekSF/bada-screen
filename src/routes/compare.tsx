import { createFileRoute, Link } from "@tanstack/react-router";
import { getScreen } from "@/data/screens";
import { OverlayChart } from "@/components/overlay-chart";
import { areaLabel, confidenceLabel, pairLabel, tvTimes } from "@/lib/measure";
import { useCompare, usePrefs } from "@/lib/prefs";

type CompareSearch = { ids: string };

export const Route = createFileRoute("/compare")({
  validateSearch: (search: Record<string, unknown>): CompareSearch => ({
    ids: typeof search.ids === "string" ? search.ids : "",
  }),
  component: ComparePage,
});

function ComparePage() {
  const { ids: raw } = Route.useSearch();
  const compare = useCompare();
  const { unit } = usePrefs();
  const fromUrl = raw
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  const ids = fromUrl.length > 0 ? fromUrl : compare.ids;
  const picked = ids.map((id) => getScreen(id)).filter((screen) => screen != null);

  return (
    <div>
      <p className="text-xs tracking-[0.16em] text-accent uppercase">Compare</p>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Up to three halls, one floor. A taller rectangle is a taller wall. A missing side is listed, not invented.
      </p>

      {picked.length === 0 ? (
        <div className="mt-8 rounded-lg border border-line p-6">
          <h1 className="font-display text-3xl">Nothing selected yet</h1>
          <p className="mt-3 text-muted">Add halls from a screen page, or start from a PIN.</p>
          <Link to="/" className="mt-4 inline-flex h-11 items-center text-accent">
            Enter a PIN
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 rounded-lg bg-paper p-4 sm:p-6">
            <OverlayChart titleAs="h1" screens={picked} title="Large format screens compared" standard />
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="text-xs text-faint">
                <tr className="border-b border-line">
                  <th className="py-2 pr-3 font-medium"> </th>
                  {picked.map((screen) => (
                    <th key={screen.id} className="py-2 pr-3 font-medium text-fg">
                      <Link to="/screens/$id" params={{ id: screen.id }} className="hover:text-accent">
                        {screen.venue}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <Row label="City" cells={picked.map((screen) => screen.locality)} />
                <Row label="Format" cells={picked.map((screen) => screen.brand)} />
                <Row label="Projector" cells={picked.map((screen) => screen.projector)} />
                <Row label="Size" cells={picked.map((screen) => pairLabel(screen, unit))} />
                <Row label="Area" cells={picked.map((screen) => areaLabel(screen, unit))} />
                <Row
                  label="× a 65″ TV"
                  cells={picked.map((screen) => {
                    const times = tvTimes(screen);
                    return times == null ? "—" : `${Math.round(times).toLocaleString("en-IN")}×`;
                  })}
                />
                <Row label="Audio" cells={picked.map((screen) => screen.audio)} />
                <Row label="Source grade" cells={picked.map((screen) => confidenceLabel(screen.confidence))} />
                <Row
                  label="Releases"
                  cells={picked.map((screen) => (screen.commercial ? "Commercial" : "Not a release house"))}
                />
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function Row({ label, cells }: { label: string; cells: string[] }) {
  return (
    <tr className="border-b border-line align-top">
      <th className="py-3 pr-3 font-medium text-faint">{label}</th>
      {cells.map((cell, index) => (
        <td key={`${label}-${index}`} className="py-3 pr-3 text-fg">
          {cell}
        </td>
      ))}
    </tr>
  );
}
