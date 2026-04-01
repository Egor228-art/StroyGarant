"use client";

export const dynamic = 'force-dynamic'

import { useSession, signOut, SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [projects, setProjects] = useState([]);
  const [estimates, setEstimates] = useState([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && session?.user?.id) {
      fetch('/api/projects')
        .then(res => res.json())
        .then(data => {
          if (data.success) setProjects(data.projects);
        })
        .catch(console.error);
      
      fetch('/api/estimates')
        .then(res => res.json())
        .then(data => {
          if (data.success) setEstimates(data.estimates);
        })
        .catch(console.error);
    }
  }, [mounted, session]);

  if (status === "loading" || !mounted) {
    return <div style={{ textAlign: "center", padding: "4rem" }}>Загрузка...</div>;
  }

  if (!session) {
    router.push("/");
    return null;
  }

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h2>Добро пожаловать, {session.user.name || session.user.email.split('@')[0]}!</h2>
          <div className="user-email">📧 {session.user.email}</div>
        </div>
        <button onClick={() => signOut({ callbackUrl: "/" })} style={{ background: "#ef4444" }}>
          Выйти
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>🏠 Мои проекты</h3>
          <div className="stat-number">{projects.length}</div>
          <button onClick={() => router.push('/estimate')}>Новый проект</button>
        </div>
        <div className="stat-card">
          <h3>📊 Расчеты сметы</h3>
          <div className="stat-number">{estimates.length}</div>
          <button onClick={() => router.push('/estimate')}>Рассчитать</button>
        </div>
        <div className="stat-card">
          <h3>🎁 Бонусная программа</h3>
          <div className="stat-number">5%</div>
          <p>скидка на следующие работы</p>
        </div>
      </div>

      {projects.length > 0 && (
        <div className="item-card" style={{ marginTop: '1.5rem' }}>
          <h3>📋 Последние проекты</h3>
          {projects.slice(0, 3).map(project => (
            <div key={project.id} style={{ 
              padding: '0.75rem 0', 
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <span><strong>{project.project_name}</strong> - {project.project_type}</span>
              <span>{project.area} м²</span>
              <span style={{ color: 'var(--primary)' }}>{project.estimated_cost?.toLocaleString()} ₽</span>
            </div>
          ))}
        </div>
      )}

      <div className="quick-actions">
        <h3>⚡ Быстрые действия</h3>
        <div className="quick-actions-buttons">
          <button onClick={() => router.push('/estimate')}>Рассчитать смету</button>
          <button onClick={() => router.push('/services')}>Наши услуги</button>
          <button onClick={() => router.push('/contacts')}>Связаться с нами</button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <SessionProvider>
      <Suspense fallback={<div style={{ textAlign: "center", padding: "4rem" }}>Загрузка...</div>}>
        <DashboardContent />
      </Suspense>
    </SessionProvider>
  );
}