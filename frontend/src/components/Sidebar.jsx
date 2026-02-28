import { Link, useLocation } from 'react-router-dom';

const links = [
  { label: 'Dashboard', path: '/' },
  { label: 'Editor', path: '/editor' },
  { label: 'Pricing', path: '/pricing' }
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <h2>Hollywood</h2>
      <nav>
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={location.pathname === link.path ? 'active' : ''}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
