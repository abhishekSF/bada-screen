import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({ component: PrivacyPage });

function PrivacyPage() {
  return (
    <div className="max-w-2xl">
      <p className="text-xs tracking-[0.16em] text-accent uppercase">Privacy</p>
      <h1 className="mt-2 font-display text-4xl">What this site stores</h1>
      <div className="mt-4 space-y-3 text-sm text-muted">
        <p>
          There is no account. Feet-or-metres, your shortlist, and any correction note are saved in
          this browser’s local storage and are not sent to a server by this app.
        </p>
        <p>
          “Use my location” asks the browser for a one-time position so the directory can sort by
          straight-line distance. That position is not written into the saved shortlist.
        </p>
        <p>
          Venue links open Google Maps in a new tab. That site has its own policy. Bada Screen does
          not sell tickets and does not sit inside a cinema chain’s booking system.
        </p>
      </div>
    </div>
  );
}
