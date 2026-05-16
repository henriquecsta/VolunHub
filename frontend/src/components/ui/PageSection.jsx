function PageSection({ eyebrow, title, description, actions, children }) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-3">
          {eyebrow ? (
            <span className="inline-flex rounded-full bg-clay-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-clay-700">
              {eyebrow}
            </span>
          ) : null}
          <div className="space-y-2">
            <h1 className="section-title">{title}</h1>
            {description ? <p className="text-lg text-slate-600">{description}</p> : null}
          </div>
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}

export default PageSection;
