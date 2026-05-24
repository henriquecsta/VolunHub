function PageLoader({ title = 'Carregando...', description = 'Buscando informações.' }) {
  return (
    <section className="surface-card p-8 text-center">
      <div className="mx-auto max-w-xl space-y-4">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-mist-200 border-t-clay-500" />
        <h2 className="font-display text-2xl font-semibold text-ink-900">{title}</h2>
        <p className="text-slate-600">{description}</p>
      </div>
    </section>
  );
}

export default PageLoader;
