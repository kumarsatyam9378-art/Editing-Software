import { useAuth } from '../context/AuthContext';

export default function TopBar({ title }) {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <h1>{title}</h1>
      <div className="topbar__user">
        <span>{user?.email}</span>
        <button type="button" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}
