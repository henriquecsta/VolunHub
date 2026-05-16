import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { ROLE_OPTIONS } from '../constants/auth';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../hooks/useAuth';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await register(form);
      navigate(ROUTES.LOGIN, {
        replace: true,
        state: { registered: true, email: form.email },
      });
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Nao foi possivel concluir o cadastro.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-clay-700">Cadastro</p>
        <h2 className="font-display text-3xl font-semibold text-ink-900">Criar uma conta base</h2>
        <p className="text-slate-600">Conectado ao endpoint `POST /auth/register`, sem tentar cobrir ainda o fluxo completo do produto.</p>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          id="nome"
          label="Nome"
          name="nome"
          onChange={handleChange}
          placeholder="Nome completo ou da organizacao"
          required
          value={form.nome}
        />
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
          id="telefone"
          label="Telefone"
          name="telefone"
          onChange={handleChange}
          placeholder="(11) 99999-9999"
          value={form.telefone}
        />
        <Select
          id="perfil"
          label="Perfil"
          name="perfil"
          onChange={handleChange}
          options={ROLE_OPTIONS}
          value={form.perfil}
        />
        <Input
          autoComplete="new-password"
          id="senha"
          label="Senha"
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

export default RegisterPage;
