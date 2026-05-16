import Button from '../ui/Button';

function PaginationControls({ page, totalPages, totalElements, isFirstPage, isLastPage, onPrevious, onNext }) {
  if (!totalElements) {
    return null;
  }

  return (
    <div className="surface-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-slate-600">
        <p className="font-semibold text-ink-900">Paginacao preparada para o endpoint real</p>
        <p>
          Pagina {page + 1} de {Math.max(totalPages, 1)} com {totalElements} projetos encontrados.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button disabled={isFirstPage} onClick={onPrevious} size="sm" variant="ghost">
          Pagina anterior
        </Button>
        <Button disabled={isLastPage} onClick={onNext} size="sm" variant="secondary">
          Proxima pagina
        </Button>
      </div>
    </div>
  );
}

export default PaginationControls;
