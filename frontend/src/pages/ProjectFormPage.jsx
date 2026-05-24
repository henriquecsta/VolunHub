import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLoader from '../components/feedback/PageLoader';
import StatusPanel from '../components/feedback/StatusPanel';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import PageSection from '../components/ui/PageSection';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import { PROJECT_STATUS_OPTIONS } from '../constants/projects';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../hooks/useAuth';
import { listarCategorias } from '../services/categoriaService';
import { atualizarProjeto, buscarProjetoPorId, criarProjeto } from '../services/projetoService';
import { getErrorMessage } from '../utils/http';

const PARTICIPATION_OPTIONS = [
  { value: 'PRESENCIAL', label: 'Presencial' },
  { value: 'REMOTO', label: 'Remoto' },
  { value: 'HIBRIDO', label: 'Híbrido' },
];

const INITIAL_FORM = {
  titulo: '',
  descricao: '',
  cidade: '',
  estado: '',
  local: '',
  tipoParticipacao: PARTICIPATION_OPTIONS[0].value,
  dataInicio: '',
  dataFim: '',
  vagas: '',
  status: PROJECT_STATUS_OPTIONS[0].value,
  idCategoria: '',
};

function ProjectFormPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { idUsuario } = useAuth();
  const isEditMode = Boolean(projectId);
  const [form, setForm] = useState(() => ({ ...INITIAL_FORM }));
  const [formErrors, setFormErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProject, setIsLoadingProject] = useState(isEditMode);
  const [loadErrorMessage, setLoadErrorMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoriesErrorMessage, setCategoriesErrorMessage] = useState('');
  const [categoriesRetryCount, setCategoriesRetryCount] = useState(0);

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
  }, [categoriesRetryCount]);

  useEffect(() => {
    let shouldIgnore = false;

    async function loadProject() {
      if (!isEditMode) {
        setIsLoadingProject(false);
        return;
      }

      if (!projectId || Number.isNaN(Number(projectId))) {
        setLoadErrorMessage('Projeto inválido para edição.');
        setIsLoadingProject(false);
        return;
      }

      setIsLoadingProject(true);
      setLoadErrorMessage('');

      try {
        const project = await buscarProjetoPorId(projectId);

        if (shouldIgnore) {
          return;
        }

        if (Number(project.organizationId) !== Number(idUsuario)) {
          setLoadErrorMessage('Você só pode editar projetos criados pela sua organização.');
          return;
        }

        setForm(mapProjectToForm(project));
      } catch (error) {
        if (!shouldIgnore) {
          setLoadErrorMessage(getErrorMessage(error, 'Não foi possível carregar este projeto.'));
        }
      } finally {
        if (!shouldIgnore) {
          setIsLoadingProject(false);
        }
      }
    }

    loadProject();

    return () => {
      shouldIgnore = true;
    };
  }, [idUsuario, isEditMode, projectId]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    setErrorMessage('');
    setSuccessMessage('');
    setFormErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      delete nextErrors[name];
      return nextErrors;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');

    const validationErrors = validateProjectForm(form);
    setFormErrors(validationErrors);

    if (Object.keys(validationErrors).length) {
      setErrorMessage('Revise os campos destacados.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode) {
        await atualizarProjeto(projectId, form);
        setSuccessMessage('Projeto atualizado com sucesso.');
      } else {
        await criarProjeto(form);
        setSuccessMessage('Projeto criado com sucesso.');
      }

      window.setTimeout(() => {
        navigate(ROUTES.DASHBOARD_ORGANIZATION, { replace: true });
      }, 700);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Não foi possível salvar este projeto.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoadingProject || isLoadingCategories) {
    return (
      <PageLoader
        description="Buscando dados necessários para montar o formulário."
        title={isEditMode ? 'Carregando projeto' : 'Carregando formulário'}
      />
    );
  }

  if (loadErrorMessage || categoriesErrorMessage) {
    return (
      <StatusPanel
        actions={
          <>
            <Button to={ROUTES.DASHBOARD_ORGANIZATION}>Voltar ao painel</Button>
            {categoriesErrorMessage ? (
              <Button onClick={() => setCategoriesRetryCount((currentCount) => currentCount + 1)} variant="ghost">
                Tentar novamente
              </Button>
            ) : (
              <Button to={ROUTES.PROJECTS} variant="ghost">Ver projetos</Button>
            )}
          </>
        }
        description={loadErrorMessage || categoriesErrorMessage}
        title="Não foi possível carregar o formulário"
        tone="error"
      />
    );
  }

  const categoryOptions = [
    { value: '', label: 'Selecione uma categoria' },
    ...categories.map((category) => ({
      value: String(category.id),
      label: category.name,
    })),
  ];

  return (
    <div className="space-y-8">
      <PageSection
        actions={<Button to={ROUTES.DASHBOARD_ORGANIZATION} variant="ghost">Cancelar</Button>}
        description="Preencha os dados principais da oportunidade para publicar ou atualizar um projeto da organização."
        eyebrow="Projetos"
        title={isEditMode ? 'Editar projeto' : 'Novo projeto'}
      />

      {successMessage ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {successMessage}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <form className="surface-card space-y-6 p-6 sm:p-8" noValidate onSubmit={handleSubmit}>
        <div className="grid gap-5 lg:grid-cols-2">
          <Input
            error={formErrors.titulo}
            disabled={isSubmitting}
            id="titulo"
            label="Título"
            maxLength={150}
            name="titulo"
            onChange={handleChange}
            placeholder="Ex.: Mutirão de arrecadação"
            required
            value={form.titulo}
          />
          <Select
            error={formErrors.idCategoria}
            disabled={isSubmitting}
            id="idCategoria"
            label="Categoria"
            name="idCategoria"
            onChange={handleChange}
            options={categoryOptions}
            value={form.idCategoria}
          />
        </div>

        <Textarea
          error={formErrors.descricao}
          disabled={isSubmitting}
          id="descricao"
          label="Descrição"
          name="descricao"
          onChange={handleChange}
          placeholder="Descreva o objetivo, as atividades e o perfil esperado dos voluntários."
          required
          value={form.descricao}
        />

        <div className="grid gap-5 lg:grid-cols-[1fr_1fr_120px]">
          <Input
            error={formErrors.local}
            disabled={isSubmitting}
            id="local"
            label="Local"
            maxLength={255}
            name="local"
            onChange={handleChange}
            placeholder="Endereço ou referência"
            required
            value={form.local}
          />
          <Input
            error={formErrors.cidade}
            disabled={isSubmitting}
            id="cidade"
            label="Cidade"
            maxLength={100}
            name="cidade"
            onChange={handleChange}
            placeholder="Cidade"
            required
            value={form.cidade}
          />
          <Input
            error={formErrors.estado}
            disabled={isSubmitting}
            id="estado"
            label="UF"
            maxLength={2}
            name="estado"
            onChange={handleChange}
            placeholder="SP"
            required
            value={form.estado}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          <Select
            error={formErrors.tipoParticipacao}
            disabled={isSubmitting}
            id="tipoParticipacao"
            label="Tipo"
            name="tipoParticipacao"
            onChange={handleChange}
            options={PARTICIPATION_OPTIONS}
            value={form.tipoParticipacao}
          />
          <Input
            error={formErrors.dataInicio}
            disabled={isSubmitting}
            id="dataInicio"
            label="Data de início"
            name="dataInicio"
            onChange={handleChange}
            required
            type="date"
            value={form.dataInicio}
          />
          <Input
            error={formErrors.dataFim}
            disabled={isSubmitting}
            id="dataFim"
            label="Data de fim"
            name="dataFim"
            onChange={handleChange}
            required
            type="date"
            value={form.dataFim}
          />
          <Input
            error={formErrors.vagas}
            disabled={isSubmitting}
            id="vagas"
            label="Vagas"
            min={1}
            name="vagas"
            onChange={handleChange}
            required
            type="number"
            value={form.vagas}
          />
          <Select
            error={formErrors.status}
            disabled={isSubmitting}
            id="status"
            label="Status"
            name="status"
            onChange={handleChange}
            options={PROJECT_STATUS_OPTIONS}
            value={form.status}
          />
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          <Button to={ROUTES.DASHBOARD_ORGANIZATION} type="button" variant="ghost">
            Cancelar
          </Button>
          <Button disabled={isSubmitting} type="submit" variant="secondary">
            {isSubmitting ? 'Salvando...' : 'Salvar projeto'}
          </Button>
        </div>
      </form>
    </div>
  );
}

function validateProjectForm(form) {
  const errors = {};
  const normalizedState = form.estado.trim();
  const vacancies = Number(form.vagas);
  const categoryId = Number(form.idCategoria);

  if (!form.titulo.trim()) {
    errors.titulo = 'Informe o título.';
  }

  if (!form.descricao.trim()) {
    errors.descricao = 'Informe a descrição.';
  }

  if (!form.local.trim()) {
    errors.local = 'Informe o local.';
  }

  if (!form.cidade.trim()) {
    errors.cidade = 'Informe a cidade.';
  }

  if (!/^[a-z]{2}$/i.test(normalizedState)) {
    errors.estado = 'Informe a UF com 2 letras.';
  }

  if (!form.dataInicio) {
    errors.dataInicio = 'Informe a data de início.';
  }

  if (!form.dataFim) {
    errors.dataFim = 'Informe a data de fim.';
  }

  if (form.dataInicio && form.dataFim && form.dataFim < form.dataInicio) {
    errors.dataFim = 'A data de fim não pode ser anterior à data de início.';
  }

  if (!Number.isInteger(vacancies) || vacancies <= 0) {
    errors.vagas = 'Informe uma quantidade de vagas maior que zero.';
  }

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    errors.idCategoria = 'Informe uma categoria válida.';
  }

  return errors;
}

function mapProjectToForm(project) {
  return {
    titulo: project.title ?? '',
    descricao: project.description ?? '',
    cidade: project.city ?? '',
    estado: project.state ?? '',
    local: project.venue ?? '',
    tipoParticipacao: project.participationType ?? PARTICIPATION_OPTIONS[0].value,
    dataInicio: project.startDate ?? '',
    dataFim: project.endDate ?? '',
    vagas: project.vacancies ? String(project.vacancies) : '',
    status: project.status ?? PROJECT_STATUS_OPTIONS[0].value,
    idCategoria: project.categoryId ? String(project.categoryId) : '',
  };
}

export default ProjectFormPage;
