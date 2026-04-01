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
  const [showEstimateForm, setShowEstimateForm] = useState(false);
  const [estimateForm, setEstimateForm] = useState({
    projectType: 'house',
    area: 100,
    materialQuality: 'standard'
  });
  const [calculatedPrice, setCalculatedPrice] = useState(null);

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

  const calculateEstimate = () => {
    const rates = {
      house: { standard: 35000, premium: 55000, luxury: 85000 },
      renovation: { standard: 8000, premium: 15000, luxury: 25000 },
      facade: { standard: 5000, premium: 8000, luxury: 12000 }
    };
    
    const typeRates = rates[estimateForm.projectType] || rates.house;
    const pricePerM2 = typeRates[estimateForm.materialQuality];
    const total = pricePerM2 * estimateForm.area;
    setCalculatedPrice(total);
  };

  const saveEstimate = async () => {
    const res = await fetch('/api/estimates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectType: estimateForm.projectType,
        area: estimateForm.area,
        materialQuality: estimateForm.materialQuality,
        totalCost: calculatedPrice
      })
    });
    if (res.ok) {
      fetchEstimates();
      setShowEstimateForm(false);
      setCalculatedPrice(null);
    }
  };

  const getProjectTypeName = (type) => {
    const types = {
      house: '🏠 Строительство дома',
      renovation: '🔨 Ремонт квартиры',
      facade: '🏗️ Отделка фасада'
    };
    return types[type] || type;
  };

  const getMaterialQualityName = (quality) => {
    const qualities = {
      standard: 'Стандарт',
      premium: 'Премиум',
      luxury: 'Люкс'
    };
    return qualities[quality] || quality;
  };

  if (status === "loading" || !mounted) {
    return (
      <div style={{ textAlign: "center", padding: "4rem" }}>
        <div className="loading-spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  if (!session) {
    router.push("/");
    return null;
  }

  return (
    <div>
      {/* Приветственная карточка */}
      <div className="welcome-card">
        <div className="welcome-content">
          <div>
            <h1>С возвращением, {session.user.name || session.user.email.split('@')[0]}!</h1>
            <p>Рады видеть вас в личном кабинете. Управляйте проектами и рассчитывайте сметы.</p>
          </div>
          <div className="welcome-stats">
            <div className="stat-item">
              <span className="stat-value">{projects.length}</span>
              <span className="stat-label">Активных проектов</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{estimates.length}</span>
              <span className="stat-label">Расчетов сметы</span>
            </div>
          </div>
        </div>
        <button onClick={() => signOut({ callbackUrl: "/" })} className="logout-btn">
          Выйти из аккаунта
        </button>
      </div>

      {/* Табы навигации */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-dashboard ${activeTab === 'overview' ? 'active' : ''}`} 
          onClick={() => setActiveTab('overview')}
        >
          📊 Обзор
        </button>
        <button 
          className={`tab-dashboard ${activeTab === 'projects' ? 'active' : ''}`} 
          onClick={() => setActiveTab('projects')}
        >
          🏗️ Мои проекты
        </button>
        <button 
          className={`tab-dashboard ${activeTab === 'estimates' ? 'active' : ''}`} 
          onClick={() => setActiveTab('estimates')}
        >
          📐 Сметы
        </button>
        <button 
          className={`tab-dashboard ${activeTab === 'new' ? 'active' : ''}`} 
          onClick={() => setActiveTab('new')}
        >
          ➕ Новый проект
        </button>
      </div>

      {/* Обзор */}
      {activeTab === 'overview' && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🏠</div>
              <div className="stat-info">
                <h3>Всего проектов</h3>
                <p className="stat-number">{projects.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <h3>Сохраненных смет</h3>
                <p className="stat-number">{estimates.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎁</div>
              <div className="stat-info">
                <h3>Бонусная программа</h3>
                <p className="stat-number">5%</p>
                <p>скидка на следующие работы</p>
              </div>
            </div>
          </div>

          {projects.length > 0 && (
            <div className="recent-section">
              <h3>📋 Последние проекты</h3>
              <div className="recent-list">
                {projects.slice(0, 3).map(project => (
                  <div key={project.id} className="recent-item">
                    <div className="recent-info">
                      <strong>{project.project_name}</strong>
                      <span>{getProjectTypeName(project.project_type)}</span>
                      <span>{project.area} м²</span>
                    </div>
                    <div className="recent-price">
                      {project.estimated_cost?.toLocaleString()} ₽
                    </div>
                  </div>
                ))}
              </div>
              {projects.length > 3 && (
                <button className="view-all" onClick={() => setActiveTab('projects')}>
                  Все проекты →
                </button>
              )}
            </div>
          )}

          <div className="quick-actions">
            <h3>⚡ Быстрые действия</h3>
            <div className="quick-actions-grid">
              <button className="action-card" onClick={() => setActiveTab('new')}>
                <span className="action-icon">🏠</span>
                <span>Новый проект</span>
              </button>
              <button className="action-card" onClick={() => setShowEstimateForm(true)}>
                <span className="action-icon">📐</span>
                <span>Рассчитать смету</span>
              </button>
              <button className="action-card" onClick={() => router.push('/services')}>
                <span className="action-icon">🔨</span>
                <span>Наши услуги</span>
              </button>
              <button className="action-card" onClick={() => router.push('/contacts')}>
                <span className="action-icon">📞</span>
                <span>Связаться</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Мои проекты */}
      {activeTab === 'projects' && (
        <div>
          {projects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏗️</div>
              <h3>У вас пока нет проектов</h3>
              <p>Создайте новый проект, чтобы начать планирование</p>
              <button className="btn" onClick={() => setActiveTab('new')}>
                Создать проект
              </button>
            </div>
          ) : (
            <div className="projects-list">
              {projects.map(project => (
                <div key={project.id} className="project-card">
                  <div className="project-header">
                    <h3>{project.project_name}</h3>
                    <span className={`project-status status-${project.status}`}>
                      {project.status === 'in_progress' ? 'В работе' : 
                       project.status === 'completed' ? 'Завершен' : 'Планирование'}
                    </span>
                  </div>
                  <div className="project-details">
                    <div className="detail-item">
                      <span className="detail-label">Тип:</span>
                      <span>{getProjectTypeName(project.project_type)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Площадь:</span>
                      <span>{project.area} м²</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Смета:</span>
                      <span className="detail-price">{project.estimated_cost?.toLocaleString()} ₽</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Дата начала:</span>
                      <span>{new Date(project.start_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="project-actions">
                    <button className="btn-outline-small">Подробнее</button>
                    <button className="btn-outline-small">Загрузить документы</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Сметы */}
      {activeTab === 'estimates' && (
        <div>
          <button className="btn" onClick={() => setShowEstimateForm(true)} style={{ marginBottom: '1.5rem' }}>
            + Новая смета
          </button>
          
          {estimates.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📐</div>
              <h3>У вас пока нет смет</h3>
              <p>Рассчитайте стоимость строительства или ремонта</p>
              <button className="btn" onClick={() => setShowEstimateForm(true)}>
                Рассчитать смету
              </button>
            </div>
          ) : (
            <div className="estimates-list">
              {estimates.map(estimate => (
                <div key={estimate.id} className="estimate-card">
                  <div className="estimate-header">
                    <h3>{getProjectTypeName(estimate.project_type)}</h3>
                    <span className="estimate-quality">{getMaterialQualityName(estimate.material_quality)}</span>
                  </div>
                  <div className="estimate-details">
                    <div>Площадь: <strong>{estimate.area} м²</strong></div>
                    <div className="estimate-total">
                      Итого: <strong>{estimate.total_cost.toLocaleString()} ₽</strong>
                    </div>
                  </div>
                  <div className="estimate-date">
                    {new Date(estimate.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Новый проект */}
      {activeTab === 'new' && (
        <div className="form-card">
          <h2>Создание нового проекта</h2>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const res = await fetch('/api/projects', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                projectName: formData.get('projectName'),
                projectType: formData.get('projectType'),
                area: parseInt(formData.get('area')),
                estimatedCost: parseInt(formData.get('estimatedCost')),
                startDate: formData.get('startDate')
              })
            });
            if (res.ok) {
              fetchProjects();
              setActiveTab('projects');
            }
          }}>
            <input name="projectName" placeholder="Название проекта" required />
            <select name="projectType" required>
              <option value="">Выберите тип работ</option>
              <option value="house">🏠 Строительство дома</option>
              <option value="renovation">🔨 Ремонт квартиры</option>
              <option value="facade">🏗️ Отделка фасада</option>
            </select>
            <input name="area" type="number" placeholder="Площадь (м²)" required />
            <input name="estimatedCost" type="number" placeholder="Ориентировочная стоимость (₽)" required />
            <input name="startDate" type="date" placeholder="Дата начала" required />
            <button type="submit">Создать проект</button>
          </form>
        </div>
      )}

      {/* Модальное окно для расчета сметы */}
      {showEstimateForm && (
        <div className="modal-overlay" onClick={() => setShowEstimateForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowEstimateForm(false)}>×</button>
            <h2>Расчет сметы</h2>
            
            <div className="estimate-form">
              <select 
                value={estimateForm.projectType}
                onChange={(e) => setEstimateForm({...estimateForm, projectType: e.target.value})}
              >
                <option value="house">🏠 Строительство дома</option>
                <option value="renovation">🔨 Ремонт квартиры</option>
                <option value="facade">🏗️ Отделка фасада</option>
              </select>
              
              <input 
                type="number" 
                value={estimateForm.area}
                onChange={(e) => setEstimateForm({...estimateForm, area: parseInt(e.target.value)})}
                placeholder="Площадь (м²)"
              />
              
              <select 
                value={estimateForm.materialQuality}
                onChange={(e) => setEstimateForm({...estimateForm, materialQuality: e.target.value})}
              >
                <option value="standard">Стандарт</option>
                <option value="premium">Премиум</option>
                <option value="luxury">Люкс</option>
              </select>
              
              <button className="btn" onClick={calculateEstimate}>
                Рассчитать стоимость
              </button>
              
              {calculatedPrice && (
                <div className="estimate-result">
                  <p>Ориентировочная стоимость:</p>
                  <div className="estimate-amount">{calculatedPrice.toLocaleString()} ₽</div>
                  <button className="btn-outline" onClick={saveEstimate} style={{ marginTop: '1rem' }}>
                    Сохранить смету
                  </button>
                </div>
              )}
            </div>
          </div>
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