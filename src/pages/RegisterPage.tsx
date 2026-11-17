import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, ApiError } from '../api/client';
import { AuthShell } from '../components/AuthShell';

export function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await api.register({ name: name.trim(), email: email.trim(), password });
      navigate('/login', { replace: true, state: { registered: true } });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'No se ha podido crear la cuenta');
      setBusy(false);
    }
  }

  return (
    <AuthShell title="Crea tu cuenta" intro="Regístrate para empezar con tus rutinas.">
      <form className="form" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="name">Nombre</label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
            autoComplete="new-password"
            required
            minLength={8}
            aria-describedby="password-help"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <small id="password-help" className="caption muted">
            Mínimo 8 caracteres.
          </small>
        </div>
        {error && (
          <p className="notice notice--error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="button button--primary button--block" disabled={busy}>
          {busy ? 'Creando…' : 'Crear cuenta'}
        </button>
      </form>
      <p className="auth__alt body-sm muted">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </AuthShell>
  );
}
