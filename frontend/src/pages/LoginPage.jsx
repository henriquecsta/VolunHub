import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BrandLogo from '../components/common/BrandLogo';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ROUTES, getDashboardPathByRole } from '../constants/routes';
import { useAuth } from '../hooks/useAuth';
import { hasValidationErrors, validateLoginForm } from '../utils/authValidation';
import { getErrorMessage } from '../utils/http';

function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: '',
    senha: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setForm((currentForm) => ({ ...currentForm, email: location.state.email }));
    }
  }, [location.state]);

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

    const validationErrors = validateLoginForm(form);
    setFormErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) {
      setErrorMessage('Revise os campos destacados.');
      return;
    }

    setIsSubmitting(true);

    try {
      const authData = await login(form);
      const fallbackDestination = getDashboardPathByRole(authData.profile);
      const destination = location.state?.from?.pathname ?? fallbackDestination;

      navigate(destination, { replace: true });
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Não foi possível entrar. Confira e-mail e senha.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <BrandLogo linkTo={null} size="md" />
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-clay-700">Acesso</p>
        <h2 className="font-display text-3xl font-semibold text-ink-900">Entrar no VolunHub</h2>
        <p className="text-slate-600">Acesse sua conta para acompanhar projetos, inscrições e ações da sua organização.</p>
      </div>

      {location.state?.registered ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Cadastro realizado. Agora você já pode entrar.
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <form className="space-y-4" noValidate onSubmit={handleSubmit}>
        <Input
          autoComplete="email"
          disabled={isSubmitting}
          error={formErrors.email}
          id="email"
          label="E-mail"
          maxLength={150}
          name="email"
          onChange={handleChange}
          placeholder="nome@exemplo.com"
          required
          type="email"
          value={form.email}
        />
        <Input
          autoComplete="current-password"
          disabled={isSubmitting}
          error={formErrors.senha}
          id="senha"
          label="Senha"
          maxLength={100}
          minLength={6}
          name="senha"
          onChange={handleChange}
          placeholder="Digite sua senha"
          required
          type="password"
          value={form.senha}
        />

        <Button disabled={isSubmitting} fullWidth type="submit">
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      <p className="text-sm text-slate-600">
        Ainda não possui conta?{' '}
        <Link className="font-semibold text-clay-700 hover:text-clay-600" to={ROUTES.REGISTER}>
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
