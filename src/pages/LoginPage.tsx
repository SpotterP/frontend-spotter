import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ApiError } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { AuthShell } from '../components/AuthShell';

interface LocationState {
  from?: string;
  registered?: boolean;
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const state = (useLocation().state ?? {}) as LocationState;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(email.trim(), password);
      navigate(state.from && state.from !== '/login' ? state.from : '/rutinas', { replace: true });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'No se ha podido iniciar sesión');
      setBusy(false);
    }
  }

  return (
    <AuthShell title="Inicia sesión" intro="Entra para ver tus rutinas.">
      {state.registered && (
        <p className="notice notice--ok" role="status">
          Cuenta creada. Ya puedes iniciar sesión.
        </p>
      )}
      <form className="form" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && (
          <p className="notice notice--error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="button button--primary button--block" disabled={busy}>
          {busy ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
      <p className="auth__alt body-sm muted">
        ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
      </p>
    </AuthShell>
  );
}
