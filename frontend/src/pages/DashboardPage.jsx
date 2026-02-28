import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import api from '../services/api';

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get('/projects').then((response) => setProjects(response.data.projects)).catch(() => setProjects([]));
  }, []);

  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        <TopBar title="Dashboard" />
        <section className="dashboard-grid">
          <Link className="project-card project-card--new" to="/editor">+ New Project</Link>
          {projects.map((project) => (
            <article key={project._id} className="project-card">
              <h3>{project.name}</h3>
              <p>{project.status}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
