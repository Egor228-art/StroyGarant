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
  const [activeTab, setActiveTab] = useState('overview');
  const [calcData, setCalcData] = useState({ projectType: 'house', area: 100, quality: 'standard' });
  const [calcResult, setCalcResult] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && session?.user?.id) {
      fetchProjects();
      fetchEstimates();
    }
  }, [mounted, session]);

  const fetchProjects = async () => {
    const res = await fetch('/api/projects');
    const data = await res.json();
    if (data.success) setProjects(data.projects);
  };

  const fetchEstimates = async () => {
    const res = await fetch('/api/estimates');
    const data = await res.json();
    if (data.success) setEstimates(data.estimates);
  };

  const calculateCost = () => {
    const rates = {
      house: { economy: 35000, standard: 50000, premium: 80000 },
      cottage: { economy: 40000, standard: 60000, premium: 100000 },
      renovation: { economy: 8000, standard: 15000, premium: 25000 }
    };
    const rate = rates[calcData.projectType]?.[calcData.quality] || 50000;
    const total = rate * calcData.area;
    setCalcResult(total);
  };

  const getStatusClass = (status) => {
    const classes = {
      in_progress: 'status-in_progress',
      completed: 'status-completed',
      planning: 'status-planning'
    };
    return classes[status] || '';
  };

  const getStatusText = (status) => {
    const texts = {
      in_progress: 'В работе',
      completed: 'Завершен',
      planning: 'Планируется'
    };
    return texts[status] || status;
  };

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
          <h2>Здравствуйте, {session.user.name || session.user.email.split('@')[0]}!</h2>
          <div className="user-email">📧 {session.user.email}</div>
        </div>
        <button onClick={() => signOut({ callbackUrl: "/" })} style={{ background: "#ef4444" }}>
          Выйти
        </button>
      </div>

      <div className="form-tabs" style={{ marginBottom: '2rem' }}>
        <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          📊 Обзор
        </button>
        <button className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
          🏗️ Мои проекты ({projects.length})
        </button>
        <button className={`tab-btn ${activeTab === 'estimates' ? 'active' : ''}`} onClick={() => setActiveTab('estimates')}>
          📋 Мои сметы ({estimates.length})
        </button>
        <button className={`tab-btn ${activeTab === 'calculator' ? 'active' : ''}`} onClick={() => setActiveTab('calculator')}>
          🧮 Калькулятор
        </button>
        <button className={`tab-btn ${activeTab === 'new' ? 'active' : ''}`} onClick={() => setActiveTab('new')}>
          ➕ Новый проект
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid">
          <div className="card">
            <h3>🏗️ Активные проекты</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{projects.filter(p => p.status === 'in_progress').length}</p>
            <button onClick={() => setActiveTab('projects')}>Управлять</button>
          </div>
          <div className="card">
            <h3>📋 Сохраненных смет</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{estimates.length}</p>
            <button onClick={() => setActiveTab('estimates')}>Смотреть</button>
          </div>
          <div className="card">
            <h3>🏆 Построено объектов</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{projects.filter(p => p.status === 'completed').length}</p>
            <button onClick={() => setActiveTab('projects')}>Детали</button>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div>
          {projects.length === 0 ? (
            <div className="card" style={{ textAlign: 'center' }}>
              <p>У вас пока нет проектов</p>
              <button onClick={() => setActiveTab('new')}>Создать проект</button>
            </div>
          ) : (
            projects.map(project => (
              <div key={project.id} className="project-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0 }}>{project.project_name}</h3>
                  <span className={`project-status ${getStatusClass(project.status)}`}>
                    {getStatusText(project.status)}
                  </span>
                </div>
                <p><strong>Тип:</strong> {project.project_type === 'house' ? 'Дом' : project.project_type === 'cottage' ? 'Коттедж' : 'Ремонт'}</p>
                <p><strong>Площадь:</strong> {project.area} м²</p>
                <p><strong>Смета:</strong> {project.estimated_cost?.toLocaleString()} ₽</p>
                {project.start_date && <p><strong>Начало:</strong> {new Date(project.start_date).toLocaleDateString()}</p>}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'estimates' && (
        <div>
          {estimates.length === 0 ? (
            <div className="card" style={{ textAlign: 'center' }}>
              <p>У вас пока нет сохраненных смет</p>
              <button onClick={() => setActiveTab('calculator')}>Рассчитать смету</button>
            </div>
          ) : (
            estimates.map(estimate => (
              <div key={estimate.id} className="project-card">
                <h3>{estimate.project_type === 'house' ? '🏠 Дом' : estimate.project_type === 'cottage' ? '🏰 Коттедж' : '🔨 Ремонт'}</h3>
                <p><strong>Площадь:</strong> {estimate.area} м²</p>
                <p><strong>Качество:</strong> {estimate.material_quality === 'economy' ? 'Эконом' : estimate.material_quality === 'standard' ? 'Стандарт' : 'Премиум'}</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>{estimate.total_cost.toLocaleString()} ₽</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>{new Date(estimate.created_at).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'calculator' && (
        <div className="form-container" style={{ maxWidth: '600px' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '2rem' }}>🧮 Калькулятор стоимости строительства</h3>
          <select
            value={calcData.projectType}
            onChange={(e) => setCalcData({ ...calcData, projectType: e.target.value })}
          >
            <option value="house">🏠 Дом</option>
            <option value="cottage">🏰 Коттедж</option>
            <option value="renovation">🔨 Ремонт квартиры</option>
          </select>
          <input
            type="number"
            placeholder="Площадь (м²)"
            value={calcData.area}
            onChange={(e) => setCalcData({ ...calcData, area: Number(e.target.value) })}
          />
          <select
            value={calcData.quality}
            onChange={(e) => setCalcData({ ...calcData, quality: e.target.value })}
          >
            <option value="economy">Эконом (базовые материалы)</option>
            <option value="standard">Стандарт (оптимальное соотношение)</option>
            <option value="premium">Премиум (элитные материалы)</option>
          </select>
          <button onClick={calculateCost}>Рассчитать стоимость</button>
          {calcResult && (
            <div className="estimate-result">
              <p>Предварительная стоимость:</p>
              <div className="estimate-amount">{calcResult.toLocaleString()} ₽</div>
              <button
                className="btn-outline"
                style={{ background: 'white', marginTop: '1rem' }}
                onClick={async () => {
                  await fetch('/api/estimates', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      projectType: calcData.projectType,
                      area: calcData.area,
                      materialQuality: calcData.quality,
                      totalCost: calcResult
                    })
                  });
                  fetchEstimates();
                  alert('Смета сохранена!');
                }}
              >
                Сохранить смету
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'new' && (
        <div className="form-container">
          <h3 style={{ textAlign: 'center', marginBottom: '2rem' }}>Создание нового проекта</h3>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const res = await fetch('/api/projects', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                projectName: formData.get('projectName'),
                projectType: formData.get('projectType'),
                area: parseFloat(formData.get('area')),
                estimatedCost: parseFloat(formData.get('estimatedCost')),
                startDate: formData.get('startDate')
              })
            });
            if (res.ok) {
              fetchProjects();
              setActiveTab('projects');
              e.target.reset();
            }
          }}>
            <input name="projectName" placeholder="Название проекта" required />
            <select name="projectType" required>
              <option value="house">🏠 Дом</option>
              <option value="cottage">🏰 Коттедж</option>
              <option value="renovation">🔨 Ремонт</option>
            </select>
            <input name="area" type="number" placeholder="Площадь (м²)" required />
            <input name="estimatedCost" type="number" placeholder="Смета (₽)" required />
            <input name="startDate" type="date" placeholder="Дата начала" />
            <button type="submit" style={{ width: '100%' }}>Создать проект</button>
          </form>
        </div>
      )}
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