import { Link, useParams } from 'react-router-dom';

export function RoutineEditPage() {
  const { id } = useParams();

  return (
    <>
      <Link to="/rutinas" className="body-sm">
        ← Mis rutinas
      </Link>
      <h1 className="display-lg">Editar rutina</h1>
      <p className="muted">En desarrollo. Rutina: {id}</p>
    </>
  );
}
