import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageLoader from '../components/feedback/PageLoader';
import StatusPanel from '../components/feedback/StatusPanel';
import ProjectCard from '../components/projects/ProjectCard';
import PaginationControls from '../components/projects/PaginationControls';
import ProjectCardSkeleton from '../components/projects/ProjectCardSkeleton';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import PageSection from '../components/ui/PageSection';
import Select from '../components/ui/Select';
import { PROJECT_STATUS_OPTIONS } from '../constants/projects';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../hooks/useAuth';
import { listarCategorias } from '../services/categoriaService';
import { listarProjetos } from '../services/projetoService';
import { getErrorMessage } from '../utils/http';
import {
  areProjectFiltersEqual,
  buildProjectListSearchParams,
  createProjectFilters,
  hasProjectFiltersApplied,
  parseProjectListQuery,
} from '../utils/projectFilterQuery';

const PAGE_SIZE = 6;

function ProjectsPage() {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => parseProjectListQuery(searchParams).filters);
  const [activeFilters, setActiveFilters] = useState(() => parseProjectListQuery(searchParams).filters);
  const [projectPage, setProjectPage] = useState({
    items: [],
    page: parseProjectListQuery(searchParams).page,
    size: PAGE_SIZE,
    totalElements: 0,
    totalPages: 0,
    isFirst: true,
    isLast: true,
    isEmpty: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoriesErrorMessage, setCategoriesErrorMessage] = useState('');

  useEffect(() => {
    const nextQueryState = parseProjectListQuery(searchParams);

    setFilters((currentFilters) =>
      areProjectFiltersEqual(currentFilters, nextQueryState.filters)
        ? currentFilters
        : nextQueryState.filters,
    );
    setActiveFilters((currentFilters) =>
      areProjectFiltersEqual(currentFilters, nextQueryState.filters)
        ? currentFilters
        : nextQueryState.filters,
    );
    setProjectPage((currentPage) => (
      currentPage.page === nextQueryState.page
        ? currentPage
        : { ...currentPage, page: nextQueryState.page }
    ));
  }, [searchParams]);

  useEffect(() => {
    let shouldIgnore = false;

    async function loadCategories() {
      setIsLoadingCategories(true);
      setCategoriesErrorMessage('');

      try {
        const response = await listarCategorias();

        if (!shouldIgnore) {
          setCategories(response);
        }
      } catch (error) {
        if (!shouldIgnore) {
          setCategories([]);
          setCategoriesErrorMessage(
            getErrorMessage(error, 'Não foi possível carregar as categorias.'),
          );
        }
      } finally {
        if (!shouldIgnore) {
          setIsLoadingCategories(false);
        }
      }
    }

    loadCategories();

    return () => {
      shouldIgnore = true;
    };
  }, []);

  useEffect(() => {
    if (filters.termo === activeFilters.termo) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setSearchParams(buildProjectListSearchParams(filters, 0), { replace: true });
    }, 450);

    return () => window.clearTimeout(timeoutId);
  }, [activeFilters.termo, filters, setSearchParams]);

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
          getErrorMessage(error, 'Não foi possível carregar os projetos no momento.'),
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
    setSearchParams(buildProjectListSearchParams(filters, 0));
  }

  function handleResetFilters() {
    const nextFilters = createProjectFilters();
    setFilters(nextFilters);
    setSearchParams(buildProjectListSearchParams(nextFilters, 0));
  }

  function handleRetry() {
    setActiveFilters((currentFilters) => ({ ...currentFilters }));
  }

  function goToPreviousPage() {
    setSearchParams(
      buildProjectListSearchParams(activeFilters, Math.max(0, projectPage.page - 1)),
    );
  }

  function goToNextPage() {
    setSearchParams(buildProjectListSearchParams(activeFilters, projectPage.page + 1));
  }

  const categoryOptions = [
    { value: '', label: isLoadingCategories ? 'Carregando categorias...' : 'Todas as categorias' },
    ...categories.map((category) => ({
      value: String(category.id),
      label: category.name,
    })),
  ];
  const projectStatusOptions = PROJECT_STATUS_OPTIONS.map((option) => ({
    value: option.value,
    label: `${option.label}s`,
  }));
  const canClearFilters = hasProjectFiltersApplied(filters, projectPage.page);

  return (
    <div className="space-y-8">
      <PageSection
        eyebrow="Projetos"
        title="Encontre oportunidades alinhadas ao seu perfil."
        description="Busque por tema, filtre por categoria e acompanhe projetos ativos, encerrados ou cancelados."
        actions={!isAuthenticated ? <Button to={ROUTES.LOGIN} variant="ghost">Entrar para se inscrever</Button> : null}
      >
        <form
          className="surface-card grid gap-4 p-6 lg:grid-cols-[1.1fr_0.9fr_0.9fr_0.75fr_auto]"
          onSubmit={handleSubmit}
        >
          <Input
            id="termo"
            label="Busca rápida"
            name="termo"
            onChange={updateField}
            placeholder="Título, descrição ou causa"
            value={filters.termo}
          />
          <Input
            id="local"
            label="Cidade ou UF"
            name="local"
            onChange={updateField}
            placeholder="Ex.: São Paulo ou SP"
            value={filters.local}
          />
          <Select
            disabled={isLoadingCategories}
            error={categoriesErrorMessage}
            id="categoria"
            label="Categoria"
            name="categoria"
            onChange={updateField}
            options={categoryOptions}
            value={filters.categoria}
          />
          <Select
            id="status"
            label="Status"
            name="status"
            onChange={updateField}
            options={projectStatusOptions}
            value={filters.status}
          />
          <div className="flex flex-col justify-end gap-3 sm:flex-row lg:flex-col">
            <Button className="w-full lg:w-auto" type="submit" variant="secondary">
              Buscar
            </Button>
            <Button
              className="w-full lg:w-auto"
              disabled={!canClearFilters}
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
            description="Buscando oportunidades disponíveis para a listagem pública."
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
          title="Não foi possível carregar a listagem"
          tone="error"
        />
      ) : null}

      {!isLoading && !errorMessage && projectPage.isEmpty ? (
        <StatusPanel
          actions={<Button onClick={handleResetFilters}>Limpar filtros</Button>}
          description="Nenhum projeto foi encontrado com os filtros atuais. Tente outra busca ou ajuste a localização e o status."
          title="Nenhum projeto encontrado"
        />
      ) : null}

      {!errorMessage && projectPage.items.length ? (
        <>
          {isLoading ? (
            <div
              className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
              role="status"
            >
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
