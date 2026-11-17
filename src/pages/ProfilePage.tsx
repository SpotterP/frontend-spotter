import { useAuth } from '../auth/AuthContext';

export function ProfilePage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <>
      <h1 className="display-lg">Perfil</h1>
      <dl className="card profile">
        <div>
          <dt className="overline muted">Nombre</dt>
          <dd>{user.name}</dd>
        </div>
        <div>
          <dt className="overline muted">Email</dt>
          <dd>{user.email}</dd>
        </div>
      </dl>
    </>
  );
}
