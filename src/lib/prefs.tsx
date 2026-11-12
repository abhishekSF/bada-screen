import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Unit } from "@/data/types";

const KEY = "bada-screen-v1";

type Persisted = { unit: Unit; shortlist: string[] };

type Prefs = {
  unit: Unit;
  setUnit: (unit: Unit) => void;
  shortlist: string[];
  toggleShortlist: (id: string) => void;
  ready: boolean;
};

const PrefsContext = createContext<Prefs | null>(null);

function readPersisted(): Persisted {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { unit: "ft", shortlist: [] };
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    return {
      unit: parsed.unit === "m" ? "m" : "ft",
      shortlist: Array.isArray(parsed.shortlist)
        ? parsed.shortlist.filter((id): id is string => typeof id === "string")
        : [],
    };
  } catch {
    return { unit: "ft", shortlist: [] };
  }
}

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [unit, setUnitState] = useState<Unit>("ft");
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readPersisted();
    setUnitState(stored.unit);
    setShortlist(stored.shortlist);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify({ unit, shortlist }));
  }, [unit, shortlist, ready]);

  const value = useMemo<Prefs>(
    () => ({
      unit,
      setUnit: setUnitState,
      shortlist,
      toggleShortlist: (id) =>
        setShortlist((current) =>
          current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
        ),
      ready,
    }),
    [unit, shortlist, ready],
  );

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs(): Prefs {
  const value = useContext(PrefsContext);
  if (!value) throw new Error("usePrefs must be used inside PrefsProvider");
  return value;
}

type CompareState = {
  ids: string[];
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  notice: string | null;
};

const CompareContext = createContext<CompareState | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  const value = useMemo<CompareState>(
    () => ({
      ids,
      notice,
      toggle: (id) => {
        setIds((current) => {
          if (current.includes(id)) {
            setNotice(null);
            return current.filter((item) => item !== id);
          }
          if (current.length >= 3) {
            setNotice("Compare holds three screens. Remove one first.");
            return current;
          }
          setNotice(null);
          return [...current, id];
        });
      },
      remove: (id) => setIds((current) => current.filter((item) => item !== id)),
      clear: () => {
        setIds([]);
        setNotice(null);
      },
    }),
    [ids, notice],
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare(): CompareState {
  const value = useContext(CompareContext);
  if (!value) throw new Error("useCompare must be used inside CompareProvider");
  return value;
}
