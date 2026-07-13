import { Hash, ListTree } from "lucide-react";

export function BylawsDocument({ dict }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_3fr] lg:gap-12">
      {/* Table of contents */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-border bg-card p-5 ring-1 ring-foreground/10">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide uppercase text-muted-foreground">
            <ListTree className="size-4" />
            {dict.tocTitle}
          </h2>
          <nav>
            <ol className="space-y-2 text-sm">
              {dict.intro ? (
                <li>
                  <a
                    href="#intro"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {dict.intro.title}
                  </a>
                </li>
              ) : null}
              {dict.articles.map((art) => (
                <li key={art.id} className="flex gap-2">
                  <span className="shrink-0 text-muted-foreground/70">
                    {art.number}.
                  </span>
                  <a
                    href={`#${art.id}`}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {art.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </aside>

      {/* Document body */}
      <article className="space-y-12">
        {dict.intro ? (
          <section
            id="intro"
            className="scroll-mt-20 space-y-4 rounded-2xl border border-border bg-card p-6 ring-1 ring-foreground/10 sm:p-8"
          >
            <h2 className="text-2xl font-bold tracking-tight">
              {dict.intro.title}
            </h2>
            {dict.intro.paragraphs.map((para, i) => (
              <p key={i} className="leading-relaxed text-muted-foreground">
                {para}
              </p>
            ))}
          </section>
        ) : null}

        {dict.articles.map((art) => (
          <section
            key={art.id}
            id={art.id}
            className="scroll-mt-20 rounded-2xl border border-border bg-card p-6 ring-1 ring-foreground/10 sm:p-8"
          >
            <div className="mb-5 flex items-start gap-3">
              <span className="mt-0.5 inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-3 py-1 text-xs font-semibold text-white">
                <Hash className="size-3" />
                {art.number}
              </span>
              <h2 className="text-2xl font-bold tracking-tight">{art.title}</h2>
            </div>

            <ol className="space-y-3.5">
              {art.sections.map((s) => {
                const headingOnly = s.heading && !s.text;
                return (
                  <li
                    key={s.ref}
                    id={s.ref}
                    className="scroll-mt-20 flex gap-3"
                  >
                    <a
                      href={`#${s.ref}`}
                      className="shrink-0 select-none font-mono text-xs font-semibold text-amber-600 tabular-nums hover:underline"
                      aria-label={`Link to section ${s.ref}`}
                    >
                      {s.ref}
                    </a>
                    <div className="min-w-0 flex-1">
                      {headingOnly ? (
                        <p className="font-semibold">{s.heading}</p>
                      ) : s.heading ? (
                        <>
                          <p className="font-semibold">{s.heading}</p>
                          <p className="mt-1 leading-relaxed text-muted-foreground">
                            {s.text}
                          </p>
                        </>
                      ) : (
                        <p className="leading-relaxed text-muted-foreground">
                          {s.text}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </article>
    </div>
  );
}
