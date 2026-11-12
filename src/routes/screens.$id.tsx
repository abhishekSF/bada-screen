import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { cityName, getScreen, screensInCity } from "@/data/screens";
import { getCity } from "@/data/cities";
import { OverlayChart, chartSelection } from "@/components/overlay-chart";
import {
  areaLabel,
  confidenceLabel,
  measuredFrame,
  pairLabel,
  shapeNote,
  tvTimes,
} from "@/lib/measure";
import { usePrefs } from "@/lib/prefs";
import type { Screen } from "@/data/types";

const NOTE_KEY = "bada-screen-notes";
const EMPTY_SEARCH = { q: "", city: "all", brand: "all", sort: "area" } as const;

export const Route = createFileRoute("/screens/$id")({ component: ScreenPage });

function ScreenPage() {
  const { id } = Route.useParams();
  const found = getScreen(id);
  const { unit } = usePrefs();
  const [note, setNote] = useState("");
  const [savedNote, setSavedNote] = useState<string | null>(null);

  if (!found) {
    return (
      <div>
        <h1 className="font-display text-3xl">That screen is not in the set</h1>
        <Link to="/screens" search={EMPTY_SEARCH} className="mt-3 inline-block text-accent">
          Back to the directory
        </Link>
      </div>
    );
  }

  return <ScreenDetail screen={found} unit={unit} note={note} setNote={setNote} savedNote={savedNote} setSavedNote={setSavedNote} />;
}

function ScreenDetail({
  screen,
  unit,
  note,
  setNote,
  savedNote,
  setSavedNote,
}: {
  screen: Screen;
  unit: "ft" | "m";
  note: string;
  setNote: (value: string) => void;
  savedNote: string | null;
  setSavedNote: (value: string | null) => void;
}) {
  const city = getCity(screen.citySlug);
  const times = tvTimes(screen);
  const shape = shapeNote(screen);
  const peers = screensInCity(screen.citySlug).filter((item) => item.id !== screen.id).slice(0, 4);
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${screen.venue} ${screen.address}`,
  )}`;

  function saveNote() {
    const text = note.trim();
    if (!text) return;
    try {
      const raw = localStorage.getItem(NOTE_KEY);
      const existing = raw ? (JSON.parse(raw) as Record<string, string>) : {};
      existing[screen.id] = text;
      localStorage.setItem(NOTE_KEY, JSON.stringify(existing));
      setSavedNote(text);
      setNote("");
    } catch {
      setSavedNote(null);
    }
  }

  const citySet = screensInCity(screen.citySlug);
  const drawn = chartSelection(citySet, "picture");
  if (screen.widthFt != null && screen.heightFt != null && !drawn.some((item) => item.id === screen.id)) {
    if (drawn.length === 0) drawn.push(screen);
    else drawn[drawn.length - 1] = screen;
  }

  return (
    <div>
      <p className="text-xs text-faint">
        <Link to="/cities/$city" params={{ city: screen.citySlug }} className="hover:text-accent">
          {cityName(screen.citySlug)}
        </Link>
        {" · "}
        {screen.locality}
      </p>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl">{screen.venue}</h1>
      <p className="mt-2 text-lg text-muted">
        {screen.name} · {screen.chain}
      </p>
      <p className="mt-4 max-w-2xl text-base text-fg">{screen.blurb}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <span className="rounded-md border border-line px-2 py-1 text-sm">{screen.brand}</span>
        <span className="rounded-md border border-line px-2 py-1 text-sm">{screen.projector}</span>
        <span className="rounded-md border border-line px-2 py-1 text-sm">{confidenceLabel(screen.confidence)}</span>
        {!screen.commercial ? (
          <span className="rounded-md bg-accent px-2 py-1 text-sm text-accent-ink">Not a release house</span>
        ) : null}
      </div>

      <section className="mt-8 rounded-lg border border-line bg-bg-sunken p-4 sm:p-6">
        <h2 className="font-display text-xl">On the same floor as the large halls here</h2>
        <div className="mt-4 rounded-lg bg-paper p-4 sm:p-6">
          <OverlayChart screens={drawn} title={`Large format screens near ${cityName(screen.citySlug)}`} standard={drawn.length <= 16} />
        </div>
      </section>

      <dl className="mt-8 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
        <Spec k="Size" v={pairLabel(screen, unit)} />
        <Spec k="Area" v={areaLabel(screen, unit)} />
        <Spec k="Published shape" v={measuredFrame(screen) ?? "—"} />
        <Spec k="System frame" v={screen.frame ?? "Not stated"} />
        <Spec k="Audio" v={screen.audio} />
        <Spec k="Seats" v={screen.seats != null ? String(screen.seats) : "Not published here"} />
        <Spec
          k="Versus a 65-inch TV"
          v={times != null ? `About ${Math.round(times).toLocaleString("en-IN")}× the area` : "Need both dimensions"}
        />
        <Spec k="PIN" v={screen.pin ?? "Not stored"} />
        <Spec k="Address" v={screen.address} />
      </dl>

      {shape ? <p className="mt-4 max-w-2xl text-sm text-muted">{shape}</p> : null}
      {screen.caveat ? (
        <p className="mt-4 max-w-2xl rounded-md border border-line bg-bg-raised p-4 text-sm text-muted">
          {screen.caveat}
        </p>
      ) : null}

      <section className="mt-8 max-w-2xl">
        <h2 className="font-display text-xl">Where this number comes from</h2>
        <p className="mt-2 text-sm text-muted">{screen.source}</p>
        <p className="mt-4">
          <a href={maps} className="text-sm text-accent underline underline-offset-2" target="_blank" rel="noreferrer">
            Open the venue in Google Maps
          </a>
        </p>
      </section>

      {peers.length > 0 && city ? (
        <section className="mt-10">
          <h2 className="font-display text-xl">Also in {city.name}</h2>
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {peers.map((peer) => (
              <li key={peer.id}>
                <Link
                  to="/screens/$id"
                  params={{ id: peer.id }}
                  className="flex items-baseline justify-between gap-3 py-3"
                >
                  <span>{peer.venue}</span>
                  <span className="tabular text-sm text-faint">{pairLabel(peer, unit)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-10 max-w-xl">
        <h2 className="font-display text-xl">A correction</h2>
        <p className="mt-2 text-sm text-muted">
          Stored on this device only. Nothing is uploaded. Use it as a note to yourself until a
          public source can be checked.
        </p>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={3}
          className="mt-3 w-full rounded-md border border-line bg-bg-raised p-3 text-sm"
          placeholder="What looks wrong, and where you saw the better figure"
        />
        <button
          type="button"
          onClick={saveNote}
          className="mt-2 inline-flex h-11 items-center rounded-md bg-accent px-4 text-sm text-accent-ink"
        >
          Save note on this device
        </button>
        {savedNote ? <p className="mt-3 text-sm text-good">Saved. It stays in this browser.</p> : null}
      </section>
    </div>
  );
}

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <div className="bg-bg px-4 py-3">
      <dt className="text-xs text-faint">{k}</dt>
      <dd className="mt-1 text-sm text-fg">{v}</dd>
    </div>
  );
}
