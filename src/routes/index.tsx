import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  catalog,
  cityById,
  CONFIDENCE_LABEL,
  FORMAT_LABEL,
  formatLine,
  STATUS_LABEL,
  type FormatKey,
  type Hall,
} from "@/data/catalog";

const ALL_FORMATS: FormatKey[] = ["imax", "plf", "iconic"];

type FinderSearch = {
  q: string;
  city: string;
  formats: string;
};

function parseFormats(value: unknown): FormatKey[] {
  if (typeof value !== "string" || value === "" || value === "all") return [...ALL_FORMATS];
  if (value === "none") return [];
  const picked = value
    .split(",")
    .filter((item): item is FormatKey => item === "imax" || item === "plf" || item === "iconic");
  return picked;
}

function encodeFormats(formats: FormatKey[]): string {
  if (formats.length === ALL_FORMATS.length) return "all";
  if (formats.length === 0) return "none";
  return ALL_FORMATS.filter((format) => formats.includes(format)).join(",");
}

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): FinderSearch => {
    const city = typeof search.city === "string" ? search.city : "all";
    const known = city === "all" || catalog.cities.some((item) => item.id === city);
    return {
      q: typeof search.q === "string" ? search.q : "",
      city: known ? city : "all",
      formats: encodeFormats(parseFormats(search.formats)),
    };
  },
  component: Finder,
});

function matchesQuery(hall: Hall, q: string): boolean {
  if (!q) return true;
  const city = cityById(hall.city);
  const haystack = [
    hall.name,
    hall.chain,
    hall.area,
    hall.address,
    hall.why,
    hall.tags.join(" "),
    city?.name ?? "",
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

function Finder() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/" });
  const formats = parseFormats(search.formats);
  const city = search.city === "all" ? undefined : cityById(search.city);

  const rows = useMemo(() => {
    const q = search.q.trim().toLowerCase();
    const active = parseFormats(search.formats);
    return catalog.screens.filter((hall) => {
      if (search.city !== "all" && hall.city !== search.city) return false;
      if (active.length > 0 && !hall.formats.some((format) => active.includes(format))) return false;
      return matchesQuery(hall, q);
    });
  }, [search.city, search.q, search.formats]);

  function patch(next: Partial<FinderSearch>) {
    navigate({ search: { ...search, ...next }, replace: true });
  }

  function toggleFormat(format: FormatKey) {
    const next = formats.includes(format)
      ? formats.filter((item) => item !== format)
      : [...formats, format];
    patch({ formats: encodeFormats(next) });
  }

  const emptyCity = city && catalog.screens.every((hall) => hall.city !== city.id);

  return (
    <div>
      <p className="text-xs tracking-[0.16em] text-accent uppercase">India · checked 13 Nov 2026</p>
      <h1 className="mt-3 max-w-3xl font-display text-4xl text-fg sm:text-5xl">The halls worth the trip</h1>
      <p className="mt-4 max-w-2xl text-base text-muted">
        IMAX, the other premium screens people actually cross town for, and the iconic houses.
        Ordinary multiplex auditoriums are not in this list. A missing city entry means we could
        not verify one, not that the city has no cinema.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_16rem]">
        <label className="text-xs tracking-wide text-faint uppercase">
          Search
          <input
            value={search.q}
            onChange={(event) => patch({ q: event.target.value })}
            placeholder="Hall, area, chain"
            className="mt-1 h-12 w-full rounded-md border border-line bg-bg-raised px-3 text-base text-fg normal-case"
            data-testid="finder-search"
          />
        </label>
        <label className="text-xs tracking-wide text-faint uppercase">
          City
          <select
            value={search.city}
            onChange={(event) => patch({ city: event.target.value })}
            className="mt-1 h-12 w-full rounded-md border border-line bg-bg-raised px-3 text-base text-fg normal-case"
            data-testid="finder-city"
          >
            <option value="all">All cities</option>
            {catalog.cities.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1" data-testid="city-strip">
        <CityChip active={search.city === "all"} onClick={() => patch({ city: "all" })}>
          All
        </CityChip>
        {catalog.cities.map((item) => (
          <CityChip
            key={item.id}
            active={search.city === item.id}
            onClick={() => patch({ city: item.id })}
          >
            {item.name}
          </CityChip>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2" role="group" aria-label="Formats">
        {ALL_FORMATS.map((format) => {
          const on = formats.includes(format);
          return (
            <button
              key={format}
              type="button"
              aria-pressed={on}
              data-testid={`format-${format}`}
              onClick={() => toggleFormat(format)}
              className={
                on
                  ? "h-11 rounded-md bg-accent px-2 text-sm text-accent-ink"
                  : "h-11 rounded-md border border-line px-2 text-sm text-muted"
              }
            >
              {FORMAT_LABEL[format]}
            </button>
          );
        })}
      </div>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Other PLF means the screen itself is the draw: Dolby Cinema, P[XL], BigPix, PCX, EPIQ,
        Barco HDR, ScreenX, Onyx, Macro XE. 4DX and MX4D stay off this list except as a note when
        they share a building.
      </p>

      {city ? <p className="mt-6 max-w-2xl text-sm text-fg">{city.note}</p> : null}

      {formats.length === 0 ? (
        <p className="mt-8 border-t border-line pt-6 text-base" data-testid="finder-empty">
          Choose at least one format: IMAX, other PLF, or iconic.
        </p>
      ) : emptyCity && city ? (
        <p className="mt-8 border-t border-line pt-6 text-base" data-testid="finder-empty">
          {city.empty ??
            `Nothing in this set for ${city.name}. We did not verify an IMAX, a notable premium screen, or an iconic hall.`}
        </p>
      ) : rows.length === 0 ? (
        <p className="mt-8 border-t border-line pt-6 text-base" data-testid="finder-empty">
          No hall matches that search. Try another area, or clear a format.
        </p>
      ) : (
        <div className="mt-6">
          <p className="text-sm text-faint">
            {rows.length} {rows.length === 1 ? "hall" : "halls"}
          </p>
          <ul className="mt-2 border-b border-line">
            {rows.map((hall) => {
              const place = cityById(hall.city);
              return (
                <li key={hall.id} className="border-t border-line">
                  <Link
                    to="/halls/$id"
                    params={{ id: hall.id }}
                    data-testid="hall-card"
                    data-hall={hall.id}
                    className="block py-5"
                  >
                    <p className="text-xs tracking-[0.14em] text-faint uppercase">
                      {place?.name} · {hall.area}
                    </p>
                    <div className="mt-1 flex items-start justify-between gap-3">
                      <h2 className="font-display text-2xl">{hall.name}</h2>
                      <span
                        className={
                          hall.status === "open"
                            ? "mt-1 shrink-0 text-xs tracking-wide text-good uppercase"
                            : hall.status === "closed"
                              ? "mt-1 shrink-0 text-xs tracking-wide text-faint uppercase"
                              : "mt-1 shrink-0 text-xs tracking-wide text-accent uppercase"
                        }
                      >
                        {STATUS_LABEL[hall.status]}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {formatLine(hall)} · {hall.chain}
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {hall.tags.slice(0, 4).map((tag) => (
                        <li
                          key={tag}
                          className="rounded-sm border border-line px-2 py-0.5 text-xs text-muted"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-fg">{hall.why}</p>
                    <p className="mt-3 text-xs text-faint">
                      Confidence {CONFIDENCE_LABEL[hall.confidence]}
                      {hall.conflict ? " · Sources disagree" : ""}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <section className="mt-12 max-w-2xl border-t border-line pt-6">
        <h2 className="font-display text-2xl">Sizes, when someone published one</h2>
        <p className="mt-2 text-sm text-muted">
          This finder does not invent widths. The older directory draws a rectangle only when a
          public source printed a width. Hyderabad there includes ordinary halls; this page does not.
        </p>
        <Link to="/cities" className="mt-3 inline-flex h-11 items-center text-accent">
          Open the size directory
        </Link>
      </section>
    </div>
  );
}

function CityChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "h-11 shrink-0 rounded-full bg-fg px-3 text-sm text-bg"
          : "h-11 shrink-0 rounded-full border border-line px-3 text-sm text-muted"
      }
    >
      {children}
    </button>
  );
}
