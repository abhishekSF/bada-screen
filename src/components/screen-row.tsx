import { Link } from "@tanstack/react-router";
import { Check, Plus, Star } from "lucide-react";
import type { Screen } from "@/data/types";
import { cityName } from "@/data/screens";
import { confidenceLabel, pairLabel } from "@/lib/measure";
import { useCompare, usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/cn";

export function ScreenRow({
  screen,
  showCity = false,
}: {
  screen: Screen;
  showCity?: boolean;
}) {
  const { unit, shortlist, toggleShortlist } = usePrefs();
  const compare = useCompare();
  const saved = shortlist.includes(screen.id);
  const picked = compare.ids.includes(screen.id);

  return (
    <article className="grid gap-3 border-b border-line py-4 sm:grid-cols-[1fr_auto] sm:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/screens/$id"
            params={{ id: screen.id }}
            className="font-display text-lg leading-tight text-fg hover:text-accent"
          >
            {screen.venue}
          </Link>
          <span className="rounded-sm border border-line px-1.5 py-0.5 text-xs text-muted">
            {screen.brand}
          </span>
          {!screen.commercial ? (
            <span className="rounded-sm bg-accent px-1.5 py-0.5 text-xs text-accent-ink">
              Not a release house
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-muted">
          {screen.name}
          {" · "}
          {showCity ? `${cityName(screen.citySlug)} · ` : ""}
          {screen.locality}
          {screen.pin ? ` · ${screen.pin}` : ""}
        </p>
        <p className="tabular mt-1 text-sm text-fg">{pairLabel(screen, unit)}</p>
        <p className="mt-1 text-xs text-faint">
          {screen.projector} · {confidenceLabel(screen.confidence)}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => toggleShortlist(screen.id)}
          className={cn(
            "inline-flex h-11 items-center gap-1.5 rounded-md border px-3 text-sm",
            saved ? "border-accent text-accent" : "border-line text-muted",
          )}
          aria-pressed={saved}
        >
          <Star className="size-4" strokeWidth={1.75} fill={saved ? "currentColor" : "none"} />
          {saved ? "Saved" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => compare.toggle(screen.id)}
          className={cn(
            "inline-flex h-11 items-center gap-1.5 rounded-md px-3 text-sm",
            picked ? "bg-accent text-accent-ink" : "bg-bg-raised text-fg",
          )}
          aria-pressed={picked}
        >
          {picked ? <Check className="size-4" /> : <Plus className="size-4" />}
          {picked ? "In compare" : "Compare"}
        </button>
      </div>
    </article>
  );
}
