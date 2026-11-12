import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const PIN_EXAMPLES = [
  { pin: "500004", label: "Prasads, Necklace Road" },
  { pin: "500084", label: "AMB, Kondapur" },
  { pin: "500075", label: "Allu, Kokapet" },
  { pin: "500020", label: "RTC X Roads" },
  { pin: "500081", label: "Madhapur" },
] as const;

export function PinField({ initial = "" }: { initial?: string }) {
  const navigate = useNavigate();
  const [pin, setPin] = useState(initial);
  const [error, setError] = useState("");

  function go(value: string) {
    if (!/^\d{6}$/.test(value)) {
      setError("A PIN is six digits.");
      return;
    }
    setError("");
    void navigate({ to: "/pin/$pin", params: { pin: value } });
  }

  return (
    <form
      className="max-w-xl"
      onSubmit={(event) => {
        event.preventDefault();
        go(pin);
      }}
    >
      <label htmlFor="pin" className="text-sm text-muted">
        PIN code
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          id="pin"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          value={pin}
          placeholder="500084"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "pin-error" : undefined}
          onChange={(event) => {
            const next = event.target.value.replace(/\D/g, "").slice(0, 6);
            setPin(next);
            setError("");
            if (next.length === 6) go(next);
          }}
          className="tabular h-14 w-full rounded-md border border-line bg-bg-raised px-4 text-2xl tracking-wide text-fg outline-none placeholder:text-faint"
        />
        <button
          type="submit"
          className="inline-flex h-14 shrink-0 items-center justify-center rounded-md bg-accent px-5 text-base text-accent-ink"
        >
          See screens
        </button>
      </div>
      {error ? (
        <p id="pin-error" className="mt-2 text-sm text-muted">
          {error}
        </p>
      ) : null}
    </form>
  );
}
