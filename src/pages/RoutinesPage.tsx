import { useEffect, useState } from 'react';
import type { SyntheticEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, ApiError } from '../api/client';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { Workout } from '../types';

function countLabel(n: number): string {
  return `${n} ${n === 1 ? 'ejercicio' : 'ejercicios'}`;
}

export function RoutinesPage() {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<Workout[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [toDelete, setToDelete] = useState<Workout | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .myWorkouts()
      .then(({ workouts }) => {
        if (!cancelled) setWorkouts(workouts);
      })
      .catch((e) => {
        if (!cancelled) {
          setLoadError(e instanceof ApiError ? e.message : 'No se han podido cargar las rutinas');
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function onCreate(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setCreateError(null);
    setCreating(true);
    try {
      const { workout } = await api.createMyWorkout(trimmed);
      navigate(`/rutinas/${workout._id}`);
    } catch (e) {
      setCreateError(e instanceof ApiError ? e.message : 'No se ha podido crear la rutina');
      setCreating(false);
    }
  }

  async function onConfirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await api.deleteMyWorkout(toDelete._id);
      setWorkouts((current) => current?.filter((w) => w._id !== toDelete._id) ?? null);
      setToDelete(null);
    } catch (e) {
      setDeleteError(e instanceof ApiError ? e.message : 'No se ha podido borrar la rutina');
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <h1 className="display-lg">Mis rutinas</h1>

      <form className="create" onSubmit={onCreate}>
        <div className="field create__field">
          <label htmlFor="new-routine">Nueva rutina</label>
          <input
            id="new-routine"
            type="text"
            placeholder="Por ejemplo, Pierna"
            required
            maxLength={80}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button type="submit" className="button button--primary" disabled={creating || !name.trim()}>
          {creating ? 'Creando…' : 'Crear rutina'}
        </button>
      </form>
      {createError && (
        <p className="notice notice--error" role="alert">
          {createError}
        </p>
      )}
      {deleteError && (
        <p className="notice notice--error" role="alert">
          {deleteError}
        </p>
      )}

      {loadError && (
        <p className="notice notice--error" role="alert">
          {loadError}
        </p>
      )}
      {!loadError && !workouts && <p className="muted">Cargando…</p>}

      {workouts && workouts.length === 0 && (
        <p className="empty">Todavía no tienes rutinas. Crea una para empezar.</p>
      )}

      {workouts && workouts.length > 0 && (
        <ul className="cards">
          {workouts.map((w) => (
            <li key={w._id} className="card card--row">
              <Link to={`/rutinas/${w._id}`} className="card__link">
                <h2 className="display-sm">{w.name}</h2>
                {w.description && <p className="body-sm muted">{w.description}</p>}
                <span className="status">{countLabel(w.exercises.length)}</span>
              </Link>
              <button
                type="button"
                className="button button--secondary button--small"
                onClick={() => setToDelete(w)}
                aria-label={`Borrar la rutina ${w.name}`}
              >
                Borrar
              </button>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title="Borrar rutina"
        message={`¿Seguro que quieres borrar «${toDelete?.name ?? ''}»?`}
        confirmLabel="Borrar"
        busy={deleting}
        onConfirm={onConfirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
