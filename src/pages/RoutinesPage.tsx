import { useEffect, useState } from 'react';
import { api, ApiError } from '../api/client';
import type { DayOfWeek, Workout } from '../types';

const DAYS: Record<DayOfWeek, string> = {
  MONDAY: 'Lunes',
  TUESDAY: 'Martes',
  WEDNESDAY: 'Miércoles',
  THURSDAY: 'Jueves',
  FRIDAY: 'Viernes',
  SATURDAY: 'Sábado',
  SUNDAY: 'Domingo',
};
const ORDER = Object.keys(DAYS) as DayOfWeek[];

export function RoutinesPage() {
  const [workouts, setWorkouts] = useState<Workout[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .workouts()
      .then((page) => {
        if (!cancelled) {
          setWorkouts([...page.workouts].sort((a, b) => ORDER.indexOf(a.dayOfWeek) - ORDER.indexOf(b.dayOfWeek)));
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof ApiError ? e.message : 'No se han podido cargar las rutinas');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <h1 className="display-lg">Mis rutinas</h1>
      {error && (
        <p className="notice notice--error" role="alert">
          {error}
        </p>
      )}
      {!error && !workouts && <p className="muted">Cargando…</p>}
      {workouts && workouts.length === 0 && <p className="muted">Todavía no hay rutinas.</p>}
      {workouts && workouts.length > 0 && (
        <ul className="cards">
          {workouts.map((w) => (
            <li key={w._id} className="card">
              <span className="overline muted">{DAYS[w.dayOfWeek]}</span>
              <h2 className="display-sm">{w.name}</h2>
              {w.description && <p className="body-sm muted">{w.description}</p>}
              <span className="status">
                {w.exercises.length} {w.exercises.length === 1 ? 'ejercicio' : 'ejercicios'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
