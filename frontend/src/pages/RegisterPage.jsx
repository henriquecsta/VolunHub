import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BrandLogo from '../components/common/BrandLogo';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { ROLE_OPTIONS, USER_ROLES } from '../constants/auth';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../hooks/useAuth';
import { hasValidationErrors, validateRegisterForm } from '../utils/authValidation';
import { getErrorMessage } from '../utils/http';

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    perfil: ROLE_OPTIONS[0].value,
    senha: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    setFormErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      delete nextErrors[name];
      return nextErrors;
    });
    setErrorMessage('');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setErrorMessage('');

    const validationErrors = validateRegisterForm(form);
    setFormErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) {
      setErrorMessage('Revise os campos destacados.');
      return;
    }

    setIsSubmitting(true);

    try {
      await register(form);
      navigate(ROUTES.LOGIN, {
        replace: true,
        state: { registered: true, email: form.email.trim().toLowerCase() },
      });
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Nao foi possivel concluir o cadastro.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <BrandLogo linkTo={null} size="md" />
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-clay-700">Cadastro</p>
        <h2 className="font-display text-3xl font-semibold text-ink-900">Criar conta no VolunHub</h2>
        <p className="text-slate-600">Escolha seu perfil e comece a participar ou publicar oportunidades de voluntariado.</p>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <form className="space-y-4" noValidate onSubmit={handleSubmit}>
        <Input
          disabled={isSubmitting}
          error={formErrors.nome}
          id="nome"
          label={getNameLabel(form.perfil)}
          maxLength={150}
          name="nome"
          onChange={handleChange}
          placeholder="Nome completo ou da organizacao"
          required
          value={form.nome}
        />
        <Input
          autoComplete="email"
          disabled={isSubmitting}
          error={formErrors.email}
          id="email"
          label="Email"
          maxLength={150}
          name="email"
          onChange={handleChange}
          placeholder="voce@exemplo.com"
          required
          type="email"
          value={form.email}
        />
        <Input
          disabled={isSubmitting}
          error={formErrors.telefone}
          id="telefone"
          label="Telefone"
          maxLength={20}
          name="telefone"
          onChange={handleChange}
          placeholder="(11) 99999-9999"
          value={form.telefone}
        />
        <Select
          disabled={isSubmitting}
          error={formErrors.perfil}
          id="perfil"
          label="Perfil"
          name="perfil"
          onChange={handleChange}
          options={ROLE_OPTIONS}
          value={form.perfil}
        />
        <Input
          autoComplete="new-password"
          disabled={isSubmitting}
          error={formErrors.senha}
          id="senha"
          label="Senha"
          maxLength={100}
          minLength={6}
          name="senha"
          onChange={handleChange}
          placeholder="Crie uma senha"
          required
          type="password"
          value={form.senha}
        />

        <Button disabled={isSubmitting} fullWidth type="submit" variant="secondary">
          {isSubmitting ? 'Criando conta...' : 'Cadastrar'}
        </Button>
      </form>

      <p className="text-sm text-slate-600">
        Ja possui conta?{' '}
        <Link className="font-semibold text-clay-700 hover:text-clay-600" to={ROUTES.LOGIN}>
          Entrar
        </Link>
      </p>
    </div>
  );
}

function getNameLabel(profile) {
  return profile === USER_ROLES.ORGANIZACAO ? 'Nome da organizacao' : 'Nome completo';
}

export default RegisterPage;
