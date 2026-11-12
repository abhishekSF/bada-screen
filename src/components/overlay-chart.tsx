import { useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { RectangleHorizontal } from "lucide-react";
import type { Screen, Unit } from "@/data/types";
import { areaSqFt, lengthNumber, pairLabel } from "@/lib/measure";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/cn";

const NESTS = [0, 1, 2, 3, 4, 5, 6, 7] as const;

/** Ordinary scope wall, the dashed reference in the middle of the floor. */
const STANDARD = { w: 35, h: 14.6 };

export type ChartMode = "picture" | "wide" | "all";

export function chartSelection(screens: Screen[], mode: ChartMode): Screen[] {
  const measured = screens
    .filter((screen) => screen.widthFt != null && screen.heightFt != null)
    .slice()
    .sort((a, b) => (areaSqFt(b) ?? 0) - (areaSqFt(a) ?? 0));
  if (mode === "all") return measured;
  if (mode === "wide") {
    const wide = measured.filter((screen) => (screen.widthFt ?? 0) >= 50);
    return wide.length > 0 ? wide : measured.slice(0, 12);
  }
  return measured.slice(0, 12);
}

type OverlayChartProps = {
  screens: Screen[];
  title: string;
  /** Dashed ordinary-scope rectangle. Off when the stack is already crowded. */
  standard?: boolean;
  /** Page-level heading when this chart is the whole view. */
  titleAs?: "h1" | "h3";
};

type Box = {
  screen: Screen;
  index: number;
  x: number;
  y: number;
  rw: number;
  rh: number;
};

type Rect = { x: number; y: number; w: number; h: number };

type Placed = Rect & { kind: "top" | "side" };

function niceCeil(n: number): number {
  if (n <= 10) return 10;
  return Math.ceil((n - 0.001) / 10) * 10;
}

function nestColor(index: number): string {
  return `var(--nest-${NESTS[index % NESTS.length]})`;
}

function overlaps(occupied: Rect[], rect: Rect): boolean {
  return occupied.some(
    (other) =>
      rect.x < other.x + other.w - 2 &&
      rect.x + rect.w > other.x + 2 &&
      rect.y < other.y + other.h - 2 &&
      rect.y + rect.h > other.y + 2,
  );
}

function sizeLine(screen: Screen, unit: Unit): string {
  const unitWord = unit === "ft" ? "ft" : "m";
  const height = `${screen.heightInferred ? "≈" : ""}${lengthNumber(screen.heightFt ?? 0, unit)}`;
  return `${lengthNumber(screen.widthFt ?? 0, unit)} × ${height} ${unitWord}`;
}

function displayName(screen: Screen, all: Screen[]): string {
  const shared = all.some((other) => other.id !== screen.id && other.venue === screen.venue);
  if (!shared) return screen.venue;
  const hall = screen.brand !== "Digital" ? screen.brand : screen.name;
  return `${screen.venue} · ${hall}`;
}

function fitVertical(text: string, heightPx: number): string {
  const max = Math.max(10, Math.floor(heightPx / 7));
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

function exposeTop(box: Box, boxes: Box[]): number {
  const cx = box.x + box.rw / 2;
  let cover = box.y + box.rh;
  for (const other of boxes) {
    if (other.index <= box.index) continue;
    const coversCenter = cx >= other.x + 4 && cx <= other.x + other.rw - 4;
    if (!coversCenter) continue;
    if (other.y <= box.y + 2) return 0;
    cover = Math.min(cover, other.y);
  }
  return cover - box.y;
}

function sideGutter(box: Box, boxes: Box[], side: "left" | "right"): Rect | null {
  let edge = side === "left" ? box.x : box.x + box.rw;
  let found = false;
  for (const other of boxes) {
    if (other.index <= box.index) continue;
    const vertical = other.y < box.y + box.rh - 8 && other.y + other.rh > box.y + 12;
    if (!vertical) continue;
    if (side === "left") edge = Math.min(edge, other.x);
    else edge = Math.max(edge, other.x + other.rw);
    found = true;
  }
  if (!found || box.rh < 84) return null;
  const raw = side === "left" ? edge - box.x : box.x + box.rw - edge;
  if (raw < 16) return null;
  const w = Math.min(raw, 22);
  const h = Math.min(box.rh - 12, 180);
  const x = side === "left" ? box.x + 1 : box.x + box.rw - w - 1;
  return { x, y: box.y + 6, w, h };
}

function placeLabels(boxes: Box[]): Map<string, Placed> {
  const placed = new Map<string, Placed>();
  const occupied: Rect[] = [];
  const byTop = boxes.slice().sort((a, b) => a.y - b.y || b.rw - a.rw);

  for (const box of byTop) {
    const exposed = exposeTop(box, boxes);
    const roomy = exposed >= 38 && box.rw >= 140;
    const compact = !roomy && exposed >= 22 && box.rw >= 110;
    if (!roomy && !compact) continue;
    const h = roomy ? Math.min(36, exposed - 4) : Math.min(18, exposed - 2);
    const attempts: Rect[] = [];
    const fullW = Math.min(box.rw - 16, 280);
    attempts.push({ x: box.x + (box.rw - fullW) / 2, y: box.y + 4, w: fullW, h });
    const half = Math.min((box.rw - 24) / 2, 200);
    if (half >= 108) {
      attempts.push({ x: box.x + 8, y: box.y + 4, w: half, h });
      attempts.push({ x: box.x + box.rw - 8 - half, y: box.y + 4, w: half, h });
    }
    const slot = attempts.find((rect) => !overlaps(occupied, rect));
    if (!slot) continue;
    occupied.push(slot);
    placed.set(box.screen.id, { kind: "top", ...slot });
  }

  const byWidth = boxes.slice().sort((a, b) => b.rw - a.rw);
  for (const box of byWidth) {
    if (placed.has(box.screen.id)) continue;
    const options = [sideGutter(box, boxes, "left"), sideGutter(box, boxes, "right")].filter(
      (rect): rect is Rect => rect != null,
    );
    options.sort((a, b) => b.w - a.w);
    const slot = options.find((rect) => rect.h >= 72 && !overlaps(occupied, rect));
    if (!slot) continue;
    occupied.push(slot);
    placed.set(box.screen.id, { kind: "side", ...slot });
  }

  return placed;
}

export function OverlayChart({ screens, title, standard = true, titleAs = "h3" }: OverlayChartProps) {
  const { unit } = usePrefs();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const labelId = useId();
  const TitleTag = titleAs;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const drawable = screens
    .filter((screen) => screen.widthFt != null && screen.heightFt != null)
    .slice()
    .sort((a, b) => (areaSqFt(b) ?? 0) - (areaSqFt(a) ?? 0));

  if (drawable.length === 0) {
    return (
      <p className="text-sm text-paper-muted">
        Nothing in this set has both a width and a height, so the wall chart stays blank.
      </p>
    );
  }

  const maxW = niceCeil(Math.max(...drawable.map((screen) => screen.widthFt ?? 0), standard ? STANDARD.w : 0));
  const maxH = niceCeil(
    Math.max(...drawable.map((screen) => screen.heightFt ?? 0), standard ? STANDARD.h : 0, 10),
  );

  const padL = 56;
  const padR = 14;
  const padT = 14;
  const padB = 36;
  const plotBudgetW = Math.max(220, width - padL - padR);
  const plotBudgetH = width > 0 && width < 640 ? 420 : 520;
  const scale = width > 0 ? Math.min(plotBudgetW / maxW, plotBudgetH / maxH) : 0;
  const plotW = maxW * scale;
  const plotH = maxH * scale;
  const svgW = padL + plotW + padR;
  const svgH = padT + plotH + padB;
  const unitWord = unit === "ft" ? "ft" : "m";
  const tickStep = scale > 0 && scale * 10 < 28 ? 20 : 10;

  const open = (id: string) => {
    void navigate({ to: "/screens/$id", params: { id } });
  };

  const yTicks: number[] = [];
  for (let tick = 0; tick <= maxH; tick += tickStep) yTicks.push(tick);
  const xTicks: number[] = [];
  for (let tick = 0; tick <= maxW; tick += tickStep) xTicks.push(tick);

  const boxes: Box[] =
    scale > 0
      ? drawable.map((screen, index) => {
          const w = screen.widthFt ?? 0;
          const h = screen.heightFt ?? 0;
          return {
            screen,
            index,
            x: padL + ((maxW - w) / 2) * scale,
            y: padT + (maxH - h) * scale,
            rw: w * scale,
            rh: h * scale,
          };
        })
      : [];

  const placed = scale > 0 ? placeLabels(boxes) : new Map<string, Placed>();
  const anyInferred = drawable.some((screen) => screen.heightInferred);
  const missed = boxes.filter((box) => !placed.has(box.screen.id));

  const stdX = padL + ((maxW - STANDARD.w) / 2) * scale;
  const stdY = padT + (maxH - STANDARD.h) * scale;
  const stdW = STANDARD.w * scale;
  const stdH = STANDARD.h * scale;
  const stdLabel: Rect = { x: stdX + stdW * 0.12, y: stdY + stdH / 2 - 10, w: stdW * 0.76, h: 20 };
  const showStandardText =
    standard &&
    scale > 0 &&
    stdW >= 128 &&
    stdH >= 26 &&
    ![...placed.values()].some((label) => overlaps([label], stdLabel));

  const largest = boxes[0];
  const mark: Rect | null = largest
    ? { x: largest.x + largest.rw - 118, y: largest.y + 8, w: 108, h: 16 }
    : null;
  const showMark =
    mark != null &&
    largest != null &&
    largest.rw > 220 &&
    ![...placed.values()].some((label) => overlaps([label], mark));

  return (
    <div ref={ref} className="min-w-0">
      <div className="flex items-start gap-2">
        <RectangleHorizontal className="mt-1 size-5 shrink-0 text-accent" aria-hidden />
        <TitleTag id={labelId} className={cn("font-display text-paper-ink", titleAs === "h1" ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl")}>
          {title}
        </TitleTag>
      </div>
      <div className={cn("relative mt-3", scale === 0 && "min-h-72")}>
        {scale > 0 ? (
          <>
            <svg
              width="100%"
              viewBox={`0 0 ${svgW} ${svgH}`}
              role="img"
              aria-labelledby={labelId}
              className="block max-w-full"
            >
              {yTicks.map((tick) => {
                const y = padT + (maxH - tick) * scale;
                return (
                  <g key={`y-${tick}`}>
                    <line
                      x1={padL}
                      x2={padL + plotW}
                      y1={y}
                      y2={y}
                      stroke="var(--color-paper-line)"
                      strokeWidth={tick === 0 ? 1.25 : 1}
                    />
                    <text
                      x={padL - 8}
                      y={y + 4}
                      textAnchor="end"
                      fill="var(--color-paper-muted)"
                      fontSize={12}
                      fontFamily="Outfit, system-ui, sans-serif"
                    >
                      {lengthNumber(tick, unit)}
                      {unitWord}
                    </text>
                  </g>
                );
              })}
              {xTicks.map((tick) => {
                const x = padL + (tick / maxW) * plotW;
                return (
                  <text
                    key={`x-${tick}`}
                    x={x}
                    y={padT + plotH + 20}
                    textAnchor="middle"
                    fill="var(--color-paper-muted)"
                    fontSize={12}
                    fontFamily="Outfit, system-ui, sans-serif"
                  >
                    {lengthNumber(tick, unit)}
                    {unitWord}
                  </text>
                );
              })}
              <Person x={8} baseline={padT + plotH} height={6 * scale} />
              {boxes.map((box) => {
                const dashed = box.screen.confidence === "community";
                const nest = nestColor(box.index);
                return (
                  <rect
                    key={box.screen.id}
                    x={box.x}
                    y={box.y}
                    width={box.rw}
                    height={box.rh}
                    fill={nest}
                    fillOpacity={0.55}
                    stroke={nest}
                    strokeWidth={2}
                    strokeDasharray={dashed ? "5 4" : undefined}
                    className="cursor-pointer"
                    role="link"
                    tabIndex={placed.has(box.screen.id) ? -1 : 0}
                    aria-label={`${box.screen.venue} ${box.screen.name}, ${pairLabel(box.screen, unit)}`}
                    onClick={() => open(box.screen.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") open(box.screen.id);
                    }}
                  >
                    <title>
                      {box.screen.venue} · {box.screen.name} · {pairLabel(box.screen, unit)}
                    </title>
                  </rect>
                );
              })}
              {standard && maxW >= STANDARD.w && maxH >= STANDARD.h ? (
                <rect
                  x={stdX}
                  y={stdY}
                  width={stdW}
                  height={stdH}
                  fill="none"
                  stroke="var(--color-paper-ink)"
                  strokeOpacity={0.55}
                  strokeWidth={1.25}
                  strokeDasharray="4 3"
                />
              ) : null}
              {showStandardText ? (
                <text
                  x={stdX + stdW / 2}
                  y={stdY + stdH / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="var(--color-paper-ink)"
                  fontSize={12}
                  fontFamily="Outfit, system-ui, sans-serif"
                >
                  Standard · {lengthNumber(STANDARD.w, unit)} × {lengthNumber(STANDARD.h, unit)} {unitWord}
                </text>
              ) : null}
              {showMark && largest ? (
                <text
                  x={largest.x + largest.rw - 10}
                  y={largest.y + 20}
                  textAnchor="end"
                  fill="var(--color-paper-muted)"
                  fontSize={12}
                  fontFamily="Outfit, system-ui, sans-serif"
                >
                  Bada Screen
                </text>
              ) : null}
            </svg>
            <div className="pointer-events-none absolute inset-0">
              {boxes.map((box) => {
                const slot = placed.get(box.screen.id);
                if (!slot) return null;
                const name = displayName(box.screen, drawable);
                const size = sizeLine(box.screen, unit);
                const full = `${name}, ${size}`;
                if (slot.kind === "side") {
                  return (
                    <button
                      key={box.screen.id}
                      type="button"
                      title={full}
                      aria-label={full}
                      onClick={() => open(box.screen.id)}
                      className="pointer-events-auto absolute overflow-hidden"
                      style={{
                        left: `${(slot.x / svgW) * 100}%`,
                        top: `${(slot.y / svgH) * 100}%`,
                        width: `${(slot.w / svgW) * 100}%`,
                        height: `${(slot.h / svgH) * 100}%`,
                      }}
                    >
                      <span
                        className="absolute top-1/2 left-1/2 text-xs font-medium whitespace-nowrap text-paper-ink"
                        style={{ transform: "translate(-50%, -50%) rotate(90deg)" }}
                      >
                        {fitVertical(`${name} · ${size}`, slot.h)}
                      </span>
                    </button>
                  );
                }
                return (
                  <button
                    key={box.screen.id}
                    type="button"
                    title={full}
                    aria-label={full}
                    onClick={() => open(box.screen.id)}
                    className="pointer-events-auto absolute overflow-hidden px-1 text-center leading-4"
                    style={{
                      left: `${(slot.x / svgW) * 100}%`,
                      top: `${(slot.y / svgH) * 100}%`,
                      width: `${(slot.w / svgW) * 100}%`,
                      height: `${(slot.h / svgH) * 100}%`,
                    }}
                  >
                    {slot.h <= 22 ? (
                      <span className="block truncate text-xs font-medium text-paper-ink">
                        {name}
                        <span className="font-normal text-paper-muted"> · {size}</span>
                      </span>
                    ) : (
                      <>
                        <span className="block truncate text-xs font-medium text-paper-ink">{name}</span>
                        <span className="mt-0.5 flex min-w-0 items-center justify-center gap-1 text-xs text-paper-muted">
                          {box.screen.brand !== "Digital" ? (
                            <span className="inline-flex h-4 shrink-0 items-center rounded-sm bg-paper-ink px-1 leading-none text-paper">
                              {box.screen.brand}
                            </span>
                          ) : null}
                          <span className="min-w-0 truncate">{size}</span>
                        </span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        ) : null}
      </div>
      {missed.length > 0 && missed.length <= 8 ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {missed.map((box) => (
            <li key={box.screen.id}>
              <button
                type="button"
                onClick={() => open(box.screen.id)}
                className="inline-flex h-11 items-center gap-2 rounded-md px-2 text-sm text-paper-ink"
              >
                <span className="size-2.5 rounded-sm" style={{ background: nestColor(box.index) }} aria-hidden />
                {displayName(box.screen, drawable)}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <ul className="sr-only">
        {drawable.map((screen) => (
          <li key={screen.id}>
            {screen.venue}, {screen.name}, {pairLabel(screen, unit)}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs leading-5 text-paper-muted">
        One floor, centered. The figure is {lengthNumber(6, unit)} {unitWord} tall. The dashed box is an ordinary 35 ×
        14.6 ft scope screen, not a hall in this set.
        {anyInferred ? " ≈ means that height was calculated from the stated aspect." : ""}
      </p>
    </div>
  );
}

function Person({ x, baseline, height }: { x: number; baseline: number; height: number }) {
  const h = Math.max(height, 8);
  const w = h * 0.38;
  return (
    <g transform={`translate(${x} ${baseline - h})`} fill="var(--color-paper-ink)" opacity={0.85} aria-hidden>
      <circle cx={w / 2} cy={h * 0.1} r={h * 0.09} />
      <rect x={w * 0.28} y={h * 0.2} width={w * 0.44} height={h * 0.38} rx={w * 0.08} />
      <rect x={w * 0.12} y={h * 0.58} width={w * 0.28} height={h * 0.4} rx={w * 0.06} />
      <rect x={w * 0.58} y={h * 0.58} width={w * 0.28} height={h * 0.4} rx={w * 0.06} />
    </g>
  );
}

const MODES: { id: ChartMode; label: string }[] = [
  { id: "picture", label: "Largest 12" },
  { id: "wide", label: "50 ft and up" },
  { id: "all", label: "Every measured hall" },
];

export function ChartModeSwitch({
  mode,
  onChange,
  showPicture,
}: {
  mode: ChartMode;
  onChange: (mode: ChartMode) => void;
  showPicture: boolean;
}) {
  const options = MODES.filter((option) => showPicture || option.id !== "picture");
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Which screens to draw">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={mode === option.id}
          onClick={() => onChange(option.id)}
          className={cn(
            "inline-flex h-11 items-center rounded-md border px-3 text-sm",
            mode === option.id ? "border-accent bg-accent text-accent-ink" : "border-line text-muted",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
