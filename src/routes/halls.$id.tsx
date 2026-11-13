import { createFileRoute, Link } from "@tanstack/react-router";
import {
  cityById,
  CONFIDENCE_LABEL,
  formatLine,
  hallById,
  STATUS_LABEL,
} from "@/data/catalog";
import { getScreen } from "@/data/screens";

export const Route = createFileRoute("/halls/$id")({
  component: HallPage,
});

function HallPage() {
  const { id } = Route.useParams();
  const hall = hallById(id);

  if (!hall) {
    return (
      <div>
        <h1 className="font-display text-3xl">That hall is not in the catalog</h1>
        <p className="mt-3 max-w-xl text-sm text-muted">
          The finder only lists IMAX, other premium large-format screens, and iconic houses that
          this pass could source.
        </p>
        <Link to="/" search={{ q: "", city: "all", formats: "all" }} className="mt-4 inline-flex h-11 items-center text-accent">
          Back to the finder
        </Link>
      </div>
    );
  }

  const city = cityById(hall.city);
  const measured = hall.repoScreenId ? getScreen(hall.repoScreenId) : undefined;

  return (
    <article data-testid="hall-detail">
      <p className="text-xs tracking-[0.14em] text-faint uppercase">
        <Link to="/" search={{ q: "", city: hall.city, formats: "all" }} className="hover:text-accent">
          {city?.name ?? hall.city}
        </Link>
        {" · "}
        {hall.area}
      </p>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <h1 className="font-display text-4xl sm:text-5xl">{hall.name}</h1>
        <p
          className={
            hall.status === "open"
              ? "text-xs tracking-[0.14em] text-good uppercase"
              : hall.status === "closed"
                ? "text-xs tracking-[0.14em] text-faint uppercase"
                : "text-xs tracking-[0.14em] text-accent uppercase"
          }
        >
          {STATUS_LABEL[hall.status]}
        </p>
      </div>
      <p className="mt-3 text-lg text-muted">
        {formatLine(hall)} · {hall.chain}
      </p>
      <p className="mt-2 text-sm text-faint">
        Confidence {CONFIDENCE_LABEL[hall.confidence]} · Checked {hall.lastChecked}
      </p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {hall.tags.map((tag) => (
          <li key={tag} className="rounded-sm border border-line px-2 py-1 text-xs text-muted">
            {tag}
          </li>
        ))}
      </ul>

      <p className="mt-6 max-w-2xl text-base leading-7">{hall.why}</p>

      {hall.conflict ? (
        <section className="mt-6 max-w-2xl border-l-2 border-accent pl-4" data-testid="hall-conflict">
          <h2 className="text-xs tracking-[0.14em] text-accent uppercase">Sources disagree</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{hall.conflict}</p>
        </section>
      ) : null}

      <dl className="mt-8 max-w-2xl border-t border-line">
        <div className="grid gap-1 border-b border-line py-4 sm:grid-cols-[9rem_1fr]">
          <dt className="text-xs tracking-wide text-faint uppercase">Address</dt>
          <dd>{hall.address}</dd>
        </div>
        <div className="grid gap-1 border-b border-line py-4 sm:grid-cols-[9rem_1fr]">
          <dt className="text-xs tracking-wide text-faint uppercase">Map</dt>
          <dd className="text-sm text-muted">
            No surveyed pin is stored. Search the address in your maps app rather than trusting a
            dot we did not measure.
          </dd>
        </div>
      </dl>

      <section className="mt-8 max-w-2xl">
        <h2 className="font-display text-2xl">Sources</h2>
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {hall.sources.map((source) => (
            <li key={source.url + source.note} className="py-4">
              <p className="text-xs tracking-[0.14em] text-faint uppercase">{source.type}</p>
              <a href={source.url} className="mt-1 block text-sm break-words text-accent">
                {source.url}
              </a>
              <p className="mt-2 text-sm leading-6 text-muted">{source.note}</p>
            </li>
          ))}
        </ul>
      </section>

      {measured ? (
        <p className="mt-8 text-sm">
          <Link
            to="/screens/$id"
            params={{ id: measured.id }}
            className="inline-flex h-11 items-center text-accent"
          >
            Size notes for this hall
          </Link>
          <span className="mt-1 block text-muted">
            A width is drawn only when a public source printed one. Unpublished figures stay blank.
          </span>
        </p>
      ) : null}
    </article>
  );
}
