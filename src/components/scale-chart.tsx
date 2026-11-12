import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { Screen } from "@/data/types";
import { cityName } from "@/data/screens";
import { pairLabel } from "@/lib/measure";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/cn";

type ScaleChartProps = {
  screens: Screen[];
  /** Largest screen width maps to this share of the container, before the height cap. */
  maxShare?: number;
  showCity?: boolean;
};

export function ScaleChart({ screens, maxShare = 0.72, showCity = false }: ScaleChartProps) {
  const { unit } = usePrefs();
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const drawable = screens.filter((screen) => screen.widthFt != null && screen.heightFt != null);
  const maxW = Math.max(...drawable.map((screen) => screen.widthFt ?? 0), 1);
  const maxH = Math.max(...drawable.map((screen) => screen.heightFt ?? 0), 1);
  const heightCap = width > 0 && width < 640 ? 220 : 340;
  const target = Math.max(160, width * maxShare);
  const scale = width > 0 ? Math.min(target / maxW, heightCap / maxH) : 0;

  if (drawable.length === 0) {
    return (
      <p className="text-sm text-muted">
        No screen in this set has both a width and a height we are willing to draw.
      </p>
    );
  }

  return (
    <div ref={ref} className="min-w-0">
      <div className="flex items-end gap-4 overflow-x-auto pb-1">
        {drawable.map((screen) => {
          const w = Math.max((screen.widthFt ?? 0) * scale, 6);
          const h = Math.max((screen.heightFt ?? 0) * scale, 6);
          const dashed = screen.confidence === "community" || screen.heightInferred;
          const col = Math.max(w, 108);
          return (
            <div key={screen.id} className="shrink-0" style={{ width: col }}>
              <Link to="/screens/$id" params={{ id: screen.id }} className="group block" title={screen.venue}>
                <span
                  className={cn(
                    "mx-auto block bg-screen shadow-[inset_0_-16px_28px_rgba(18,16,14,0.22)]",
                    dashed ? "border border-dashed border-faint" : "",
                  )}
                  style={{ width: w, height: h }}
                />
                <span className="mt-3 block h-24 overflow-hidden text-center">
                  <span className="line-clamp-2 text-xs leading-4 text-fg group-hover:text-accent">
                    {screen.venue}
                  </span>
                  <span className="mt-0.5 block text-xs leading-4 text-muted">
                    {showCity ? cityName(screen.citySlug) : screen.locality}
                  </span>
                  <span className="tabular mt-0.5 block text-xs leading-4 text-faint">
                    {pairLabel(screen, unit)}
                  </span>
                </span>
              </Link>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-xs leading-5 text-faint">
        Scroll sideways. Same scale, bottoms aligned. A dashed edge is a community figure, or a height inferred from
        the stated aspect. Halls with a missing side are not drawn.
      </p>
    </div>
  );
}
