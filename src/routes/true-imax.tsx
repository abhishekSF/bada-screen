import { createFileRoute, Link } from "@tanstack/react-router";
import { getScreen } from "@/data/screens";
import { OverlayChart } from "@/components/overlay-chart";

export const Route = createFileRoute("/true-imax")({ component: TrueImaxPage });

function TrueImaxPage() {
  const science = getScreen("science-city-imax");
  const peers = ["pvr-mall-of-india", "miraj-wadala", "allu-dolby", "prasads-pcx"]
    .map((id) => getScreen(id))
    .filter((screen) => screen != null);
  const chart = science ? [science, ...peers] : peers;

  return (
    <div>
      <p className="text-xs tracking-[0.16em] text-accent uppercase">15/70</p>
      <h1 className="mt-2 max-w-3xl font-display text-4xl sm:text-5xl">
        One true IMAX film screen. It does not play the Friday film.
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        15-perforation 70mm runs sideways through the projector. The frame is about three times the
        area of standard 70mm and it fills a 1.43:1 screen. Digital IMAX, including laser, shows
        1.90:1. Those are different pictures, not a brightness setting.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-line p-4">
          <h2 className="font-display text-xl">Standard 70mm</h2>
          <p className="mt-2 text-sm text-muted">
            Film runs vertically, five perforations a frame, usually a 2.20 picture. Rare in Indian
            commercial programmes. It is not IMAX.
          </p>
        </div>
        <div className="rounded-lg border border-accent p-4">
          <h2 className="font-display text-xl">IMAX 15/70</h2>
          <p className="mt-2 text-sm text-muted">
            Film runs horizontally, fifteen perforations a frame, made for a 1.43 screen. In this
            dataset that is Gujarat Science City, and the venue guide marks commercial films as no.
          </p>
        </div>
      </div>

      {science ? (
        <section className="mt-10">
          <h2 className="font-display text-2xl">Science City against large commercial screens</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Same floor, true scale. Science City is the tall 1.43 film screen. Prasads PCX is wider
            and has not been IMAX since 2014. Allu is the Kokapet Dolby Cinema, 75 × 40 ft.
          </p>
          <div className="mt-4 rounded-lg bg-paper p-4 sm:p-6">
            <OverlayChart screens={chart} title="Science City against large commercial screens" />
          </div>
          <p className="mt-4 max-w-2xl text-sm text-muted">{science.caveat}</p>
          <p className="mt-3">
            <Link to="/screens/$id" params={{ id: science.id }} className="text-sm text-accent">
              Science City details
            </Link>
          </p>
        </section>
      ) : null}

      <section className="mt-10 max-w-2xl">
        <h2 className="font-display text-2xl">What people mix up</h2>
        <ul className="mt-3 space-y-3 text-sm text-muted">
          <li>
            <span className="text-fg">Prasads, Hyderabad.</span> Opened as IMAX in July 2003.
            Converted to PCX in 2014. A giant screen there is not a reason to expect an IMAX print.
          </li>
          <li>
            <span className="text-fg">“IMAX with Laser” on a multiplex.</span> Still 1.90 digital.
            Wadala, Priya, Palazzo, Sky City, and Mall of India are in that family.
          </li>
          <li>
            <span className="text-fg">Hyderabad’s IMAX listing.</span> AMB Classic Victory at RTC X
            Roads is on the Hyderabad Theatres specs table as IMAX with Laser, width blank, so it
            is not drawn. Prasads is PCX, not IMAX. Confirm the Victory hall is open before you go.
          </li>
          <li>
            <span className="text-fg">Palazzo, Chennai.</span> Laser since the December 2025 screen
            replacement. The old ~70 ft figure belonged to the screen that was removed.
          </li>
        </ul>
      </section>
    </div>
  );
}
