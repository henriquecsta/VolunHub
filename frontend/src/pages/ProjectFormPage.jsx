import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import PageSection from '../components/ui/PageSection';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import { ROUTES } from '../constants/routes';
import { criarProjeto } from '../services/projetoService';
import { getErrorMessage } from '../utils/http';

const PARTICIPATION_OPTIONS = [
  { value: 'PRESENCIAL', label: 'Presencial' },
  { value: 'REMOTO', label: 'Remoto' },
  { value: 'HIBRIDO', label: 'Hibrido' },
];

const STATUS_OPTIONS = [
  { value: 'ATIVO', label: 'Ativo' },
  { value: 'ENCERRADO', label: 'Encerrado' },
  { value: 'CANCELADO', label: 'Cancelado' },
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
  status: STATUS_OPTIONS[0].value,
  idCategoria: '',
};

function ProjectFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(() => ({ ...INITIAL_FORM }));
  const [formErrors, setFormErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await criarProjeto(form);
      setSuccessMessage('Projeto criado com sucesso.');
      window.setTimeout(() => {
        navigate(ROUTES.DASHBOARD_ORGANIZATION, { replace: true });
      }, 700);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Nao foi possivel salvar este projeto.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageSection
        actions={<Button to={ROUTES.DASHBOARD_ORGANIZATION} variant="ghost">Cancelar</Button>}
        description="Preencha os dados principais da oportunidade para publicar ou atualizar um projeto da organizacao."
        eyebrow="Projetos"
        title="Novo projeto"
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
            label="Titulo"
            maxLength={150}
            name="titulo"
            onChange={handleChange}
            placeholder="Ex.: Mutirao de arrecadacao"
            required
            value={form.titulo}
          />
          <Input
            error={formErrors.idCategoria}
            disabled={isSubmitting}
            id="idCategoria"
            label="Categoria"
            min={1}
            name="idCategoria"
            onChange={handleChange}
            placeholder="ID da categoria"
            required
            type="number"
            value={form.idCategoria}
          />
        </div>

        <Textarea
          error={formErrors.descricao}
          disabled={isSubmitting}
          id="descricao"
          label="Descricao"
          name="descricao"
          onChange={handleChange}
          placeholder="Descreva o objetivo, atividades e perfil esperado dos voluntarios."
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
            placeholder="Endereco ou referencia"
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
            label="Data inicio"
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
            label="Data fim"
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
            options={STATUS_OPTIONS}
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
    errors.titulo = 'Informe o titulo.';
  }

  if (!form.descricao.trim()) {
    errors.descricao = 'Informe a descricao.';
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
    errors.dataInicio = 'Informe a data de inicio.';
  }

  if (!form.dataFim) {
    errors.dataFim = 'Informe a data de fim.';
  }

  if (form.dataInicio && form.dataFim && form.dataFim < form.dataInicio) {
    errors.dataFim = 'Data fim nao pode ser anterior a data inicio.';
  }

  if (!Number.isInteger(vacancies) || vacancies <= 0) {
    errors.vagas = 'Informe uma quantidade de vagas maior que zero.';
  }

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    errors.idCategoria = 'Informe uma categoria valida.';
  }

  return errors;
}

export default ProjectFormPage;
