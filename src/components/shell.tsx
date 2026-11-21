import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Menu, Ruler, X } from "lucide-react";
import { useState } from "react";
import { getScreen } from "@/data/screens";
import { useCompare, usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/cn";

const NAV = [
  { to: "/cities", label: "Cities" },
  { to: "/screens", label: "Screens" },
  { to: "/formats", label: "Formats" },
  { to: "/true-imax", label: "15/70" },
  { to: "/method", label: "Method" },
] as const;

export function Shell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const { unit, setUnit } = usePrefs();
  const compare = useCompare();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-30 border-b border-line bg-bg/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
          <Link
            to="/"
            search={{ q: "", city: "all", formats: "all" }}
            className="mr-auto flex items-baseline gap-2 sm:mr-0"
          >
            <span className="font-display text-xl tracking-tight">Bada Screen</span>
            <span className="hidden text-xs text-faint sm:inline">India</span>
          </Link>
          <nav className="ml-6 hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-md px-3 py-2 text-sm",
                  path === item.to || path.startsWith(`${item.to}/`)
                    ? "text-fg"
                    : "text-muted hover:text-fg",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setUnit(unit === "ft" ? "m" : "ft")}
              className="inline-flex h-11 items-center gap-1.5 rounded-md border border-line px-3 text-sm text-muted"
              aria-label={unit === "ft" ? "Show metres" : "Show feet"}
            >
              <Ruler className="size-4" />
              {unit === "ft" ? "ft" : "m"}
            </button>
            <Link
              to="/compare"
              search={{ ids: compare.ids.join(",") }}
              className="inline-flex h-11 items-center rounded-md bg-accent px-3 text-sm text-accent-ink"
            >
              Compare{compare.ids.length > 0 ? ` ${compare.ids.length}` : ""}
            </Link>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-md border border-line lg:hidden"
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        {open ? (
          <nav className="border-t border-line px-4 py-3 lg:hidden">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="flex h-11 items-center text-base text-fg"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>

      {compare.ids.length > 0 ? (
        <div className="sticky bottom-0 z-20 border-t border-line bg-bg-raised">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-3">
            <p className="mr-auto text-sm text-muted">
              {compare.notice ?? `${compare.ids.length} of 3 selected`}
            </p>
            <ul className="flex flex-wrap gap-2">
              {compare.ids.map((id) => {
                const screen = getScreen(id);
                if (!screen) return null;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => compare.remove(id)}
                      className="inline-flex h-11 items-center rounded-md border border-line px-3 text-sm"
                    >
                      {screen.venue}
                      <span className="ml-2 text-faint">Remove</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              className="inline-flex h-11 items-center rounded-md bg-accent px-4 text-sm text-accent-ink"
              onClick={() =>
                navigate({ to: "/compare", search: { ids: compare.ids.join(",") } })
              }
            >
              See them to scale
            </button>
          </div>
        </div>
      ) : null}

      <footer className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <p className="max-w-3xl text-xs leading-5 text-faint">
            Bada Screen is an independent size guide for premium cinema screens in India. It is not
            affiliated with, endorsed by, sponsored by, or approved by IMAX Corporation, Dolby
            Laboratories, PVR INOX, Cinepolis, Miraj, Prasads, AMB, Allu Cinemas, or any other chain
            or format owner. Names are used only to identify auditoriums. Dimensions come from public
            reports and can be wrong after a refit.
          </p>
          <p className="mt-3 text-xs text-faint">
            <Link to="/privacy" className="underline underline-offset-2">
              Privacy
            </Link>
            <span className="mx-2">·</span>
            <Link to="/method" className="underline underline-offset-2">
              How sizes are handled
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
