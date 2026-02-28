export default function TopBar({ title }) {
  return (
    <header className="topbar">
      <h1>{title}</h1>
      <div className="topbar__user">
        <span>Guest Workspace</span>
      </div>
    </header>
  );
}
