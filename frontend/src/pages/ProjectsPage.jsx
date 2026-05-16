import { useEffect, useState } from 'react';
import PageLoader from '../components/feedback/PageLoader';
import StatusPanel from '../components/feedback/StatusPanel';
import ProjectCard from '../components/projects/ProjectCard';
import PaginationControls from '../components/projects/PaginationControls';
import ProjectCardSkeleton from '../components/projects/ProjectCardSkeleton';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import PageSection from '../components/ui/PageSection';
import Select from '../components/ui/Select';
import { ROUTES } from '../constants/routes';
import { listarProjetos } from '../services/projetoService';
import { getErrorMessage } from '../utils/http';

const statusOptions = [
  { value: 'ATIVO', label: 'Ativos' },
  { value: 'ENCERRADO', label: 'Encerrados' },
  { value: 'CANCELADO', label: 'Cancelados' },
];

const INITIAL_FILTERS = {
  termo: '',
  local: '',
  categoria: '',
  status: 'ATIVO',
};

const PAGE_SIZE = 6;

function createInitialFilters() {
  return { ...INITIAL_FILTERS };
}

function ProjectsPage() {
  const [filters, setFilters] = useState(() => createInitialFilters());
  const [activeFilters, setActiveFilters] = useState(() => createInitialFilters());
  const [projectPage, setProjectPage] = useState({
    items: [],
    page: 0,
    size: PAGE_SIZE,
    totalElements: 0,
    totalPages: 0,
    isFirst: true,
    isLast: true,
    isEmpty: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let shouldIgnore = false;

    async function loadProjects() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await listarProjetos({
          page: projectPage.page,
          size: PAGE_SIZE,
          termo: activeFilters.termo,
          categoria: activeFilters.categoria,
          local: activeFilters.local,
          status: activeFilters.status,
        });

        if (shouldIgnore) {
          return;
        }

        setProjectPage((currentPage) => ({
          ...currentPage,
          ...response,
          page: response.page,
          size: response.size,
        }));
      } catch (error) {
        if (shouldIgnore) {
          return;
        }

        setErrorMessage(
          getErrorMessage(error, 'Nao foi possivel carregar os projetos no momento.'),
        );
        setProjectPage((currentPage) => ({
          ...currentPage,
          items: [],
          totalElements: 0,
          totalPages: 0,
          isFirst: true,
          isLast: true,
          isEmpty: true,
        }));
      } finally {
        if (!shouldIgnore) {
          setIsLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      shouldIgnore = true;
    };
  }, [activeFilters, projectPage.page]);

  function updateField(event) {
    const { name, value } = event.target;
    setFilters((currentFilters) => ({ ...currentFilters, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setActiveFilters({ ...filters });
    setProjectPage((currentPage) => ({ ...currentPage, page: 0 }));
  }

  function handleResetFilters() {
    setFilters(createInitialFilters());
    setActiveFilters(createInitialFilters());
    setProjectPage((currentPage) => ({ ...currentPage, page: 0 }));
  }

  function handleRetry() {
    setActiveFilters((currentFilters) => ({ ...currentFilters }));
  }

  function goToPreviousPage() {
    setProjectPage((currentPage) => ({
      ...currentPage,
      page: Math.max(0, currentPage.page - 1),
    }));
  }

  function goToNextPage() {
    setProjectPage((currentPage) => ({
      ...currentPage,
      page: currentPage.page + 1,
    }));
  }

  return (
    <div className="space-y-8">
      <PageSection
        eyebrow="Projetos"
        title="Uma listagem conectada ao backend para explorar projetos reais do VolunHub."
        description="A tela agora consome `GET /projetos`, trata carregamento e erro, e ja nasce preparada para evoluir com filtros e paginacao mais completos."
        actions={<Button to={ROUTES.LOGIN} variant="ghost">Entrar para se inscrever</Button>}
      >
        <form
          className="surface-card grid gap-4 p-6 lg:grid-cols-[1.15fr_0.95fr_0.8fr_auto]"
          onSubmit={handleSubmit}
        >
          <Input
            id="termo"
            label="Busca rapida"
            name="termo"
            onChange={updateField}
            placeholder="Busque por titulo ou descricao"
            value={filters.termo}
          />
          <Input
            id="local"
            label="Cidade ou UF"
            name="local"
            onChange={updateField}
            placeholder="Ex.: Sao Paulo ou SP"
            value={filters.local}
          />
          <Select
            id="status"
            label="Status"
            name="status"
            onChange={updateField}
            options={statusOptions}
            value={filters.status}
          />
          <div className="flex flex-col justify-end gap-3 sm:flex-row lg:flex-col">
            <Button className="w-full lg:w-auto" type="submit" variant="secondary">
              Buscar
            </Button>
            <Button
              className="w-full lg:w-auto"
              onClick={handleResetFilters}
              type="button"
              variant="ghost"
            >
              Limpar
            </Button>
          </div>
        </form>
      </PageSection>

      {isLoading && !projectPage.items.length ? (
        <div className="space-y-6">
          <PageLoader
            description="Consultando o endpoint `GET /projetos` e preparando a paginacao da listagem."
            title="Carregando projetos"
          />
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <ProjectCardSkeleton key={index} />
            ))}
          </section>
        </div>
      ) : null}

      {!isLoading && errorMessage ? (
        <StatusPanel
          actions={<Button onClick={handleRetry}>Tentar novamente</Button>}
          description={errorMessage}
          title="Nao foi possivel carregar a listagem"
          tone="error"
        />
      ) : null}

      {!isLoading && !errorMessage && projectPage.isEmpty ? (
        <StatusPanel
          actions={<Button onClick={handleResetFilters}>Limpar filtros</Button>}
          description="Nenhum projeto foi encontrado com os filtros atuais. Tente outra busca ou ajuste a localizacao e o status."
          title="Nenhum projeto encontrado"
        />
      ) : null}

      {!errorMessage && projectPage.items.length ? (
        <>
          {isLoading ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              Atualizando resultados...
            </div>
          ) : null}

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projectPage.items.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </section>

          <PaginationControls
            isFirstPage={projectPage.isFirst}
            isLastPage={projectPage.isLast}
            onNext={goToNextPage}
            onPrevious={goToPreviousPage}
            page={projectPage.page}
            totalElements={projectPage.totalElements}
            totalPages={projectPage.totalPages}
          />
        </>
      ) : null}
    </div>
  );
}

export default ProjectsPage;
