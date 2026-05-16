import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ROUTES, getDashboardPathByRole } from '../constants/routes';
import { useAuth } from '../hooks/useAuth';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setForm((currentForm) => ({ ...currentForm, email: location.state.email }));
    }
  }, [location.state]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const authData = await login(form);
      const fallbackDestination = getDashboardPathByRole(authData.profile);
      const destination = location.state?.from?.pathname ?? fallbackDestination;

      navigate(destination, { replace: true });
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Nao foi possivel entrar. Confira email e senha.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-clay-700">Acesso</p>
        <h2 className="font-display text-3xl font-semibold text-ink-900">Entrar no VolunHub</h2>
        <p className="text-slate-600">Conectado ao endpoint `POST /auth/login` para autenticar e persistir o JWT.</p>
      </div>

      {location.state?.registered ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Cadastro realizado. Agora voce ja pode entrar.
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          autoComplete="email"
          id="email"
          label="Email"
          name="email"
          onChange={handleChange}
          placeholder="voce@exemplo.com"
          required
          type="email"
          value={form.email}
        />
        <Input
          autoComplete="current-password"
          id="senha"
          label="Senha"
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
        Ainda nao possui conta?{' '}
        <Link className="font-semibold text-clay-700 hover:text-clay-600" to={ROUTES.REGISTER}>
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
