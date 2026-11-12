import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { cities } from "@/data/cities";
import { brandsInUse, cityName, screens } from "@/data/screens";
import type { Screen } from "@/data/types";
import { ScreenRow } from "@/components/screen-row";
import { areaSqFt, distanceKm } from "@/lib/measure";

type ScreenSearch = {
  q: string;
  city: string;
  brand: string;
  sort: "area" | "width" | "city" | "near";
};

export const Route = createFileRoute("/screens/")({
  validateSearch: (search: Record<string, unknown>): ScreenSearch => ({
    q: typeof search.q === "string" ? search.q : "",
    city: typeof search.city === "string" ? search.city : "all",
    brand: typeof search.brand === "string" ? search.brand : "all",
    sort:
      search.sort === "width" || search.sort === "city" || search.sort === "near" || search.sort === "area"
        ? search.sort
        : "area",
  }),
  component: ScreensPage,
});

function ScreensPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/screens/" });
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const brands = brandsInUse();

  const rows = useMemo(() => {
    const q = search.q.trim().toLowerCase();
    const list = screens.filter((screen) => {
      if (search.city !== "all" && screen.citySlug !== search.city) return false;
      if (search.brand !== "all" && screen.brand !== search.brand) return false;
      if (!q) return true;
      return `${screen.venue} ${screen.locality} ${screen.name} ${screen.chain} ${screen.pin ?? ""} ${cityName(screen.citySlug)}`
        .toLowerCase()
        .includes(q);
    });
    const scored = (screen: Screen) => areaSqFt(screen) ?? -1;
    return list.slice().sort((a, b) => {
      if (search.sort === "city") {
        return cityName(a.citySlug).localeCompare(cityName(b.citySlug)) || a.venue.localeCompare(b.venue);
      }
      if (search.sort === "width") return (b.widthFt ?? -1) - (a.widthFt ?? -1);
      if (search.sort === "near" && origin) {
        const da = a.lat == null || a.lng == null ? Infinity : distanceKm(origin, { lat: a.lat, lng: a.lng });
        const db = b.lat == null || b.lng == null ? Infinity : distanceKm(origin, { lat: b.lat, lng: b.lng });
        return da - db;
      }
      return scored(b) - scored(a);
    });
  }, [search, origin]);

  function patch(next: Partial<ScreenSearch>) {
    navigate({ search: { ...search, ...next } });
  }

  function locate() {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError("This browser has no location service.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setOrigin({ lat: position.coords.latitude, lng: position.coords.longitude });
        patch({ sort: "near" });
      },
      () => setGeoError("Location was blocked. You can still filter by city."),
      { enableHighAccuracy: false, timeout: 8000 },
    );
  }

  return (
    <div>
      <p className="text-xs tracking-[0.16em] text-accent uppercase">Directory</p>
      <h1 className="mt-2 font-display text-4xl">Every screen in the set</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        {screens.length} auditoriums. Halls without a published size stay in the list and off the
        scale drawings. Near-me is a straight line from the pin we stored, not drive time.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs text-faint">
          Search
          <input
            value={search.q}
            onChange={(event) => patch({ q: event.target.value })}
            className="mt-1 h-11 w-full rounded-md border border-line bg-bg-raised px-3 text-sm text-fg"
            placeholder="Venue, area, PIN"
          />
        </label>
        <label className="text-xs text-faint">
          City
          <select
            value={search.city}
            onChange={(event) => patch({ city: event.target.value })}
            className="mt-1 h-11 w-full rounded-md border border-line bg-bg-raised px-3 text-sm text-fg"
          >
            <option value="all">All cities</option>
            {cities.map((city) => (
              <option key={city.slug} value={city.slug}>
                {city.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-faint">
          Format
          <select
            value={search.brand}
            onChange={(event) => patch({ brand: event.target.value })}
            className="mt-1 h-11 w-full rounded-md border border-line bg-bg-raised px-3 text-sm text-fg"
          >
            <option value="all">All formats</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-faint">
          Sort
          <select
            value={search.sort}
            onChange={(event) => patch({ sort: event.target.value as ScreenSearch["sort"] })}
            className="mt-1 h-11 w-full rounded-md border border-line bg-bg-raised px-3 text-sm text-fg"
          >
            <option value="area">Largest area</option>
            <option value="width">Widest</option>
            <option value="city">City</option>
            <option value="near">Nearest</option>
          </select>
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={locate}
          className="inline-flex h-11 items-center rounded-md border border-line px-3 text-sm"
        >
          Use my location
        </button>
        {geoError ? <p className="text-sm text-muted">{geoError}</p> : null}
        {origin && search.sort === "near" ? (
          <p className="text-sm text-faint">
            Sorted by straight-line distance. Halls without a pin sink to the bottom.
          </p>
        ) : null}
      </div>

      <p className="mt-6 text-sm text-faint">{rows.length} shown</p>
      <div>
        {rows.map((screen) => (
          <ScreenRow key={screen.id} screen={screen} showCity />
        ))}
      </div>
      {rows.length === 0 ? <p className="mt-6 text-muted">No hall matches those filters.</p> : null}
    </div>
  );
}
