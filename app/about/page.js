"use client";

export const dynamic = 'force-dynamic'

import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();

  const stats = [
    { number: "10+", label: "Лет на рынке", icon: "📅" },
    { number: "200+", label: "Реализованных проектов", icon: "🏗️" },
    { number: "150+", label: "Довольных клиентов", icon: "😊" },
    { number: "100%", label: "Гарантия качества", icon: "⭐" }
  ];

  return (
    <div>
      <div className="page-hero">
        <h1>О компании «СтройГарант»</h1>
        <p>Строим надежно с 2010 года</p>
      </div>

      <div className="container">
        <div className="about-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {stats.map((stat, i) => (
            <div key={i} className="about-card" style={{
              textAlign: 'center',
              padding: '2rem',
              background: 'white',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{stat.icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stat.number}</div>
              <div>{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="about-text" style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          marginBottom: '2rem'
        }}>
          <h2>Наша миссия</h2>
          <p>Создавать качественное и доступное жилье, которое радует своих владельцев десятилетиями. Мы строим не просто дома, мы создаем пространство для жизни, работы и отдыха.</p>
          
          <h2>Наши преимущества</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '0.5rem 0', paddingLeft: '1.5rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: 'var(--primary)' }}>✓</span>
              <strong>Собственное производство</strong> — полный контроль качества материалов
            </li>
            <li style={{ padding: '0.5rem 0', paddingLeft: '1.5rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: 'var(--primary)' }}>✓</span>
              <strong>Фиксированная смета</strong> — никаких скрытых платежей
            </li>
            <li style={{ padding: '0.5rem 0', paddingLeft: '1.5rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: 'var(--primary)' }}>✓</span>
              <strong>Гарантия 10 лет</strong> на все виды работ
            </li>
            <li style={{ padding: '0.5rem 0', paddingLeft: '1.5rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: 'var(--primary)' }}>✓</span>
              <strong>Бесплатный выезд специалиста</strong> на объект
            </li>
          </ul>

          <h2>Наши партнеры</h2>
          <div className="partners" style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            marginTop: '1rem'
          }}>
            <span style={{ background: '#f3f4f6', padding: '0.5rem 1rem', borderRadius: '2rem' }}>Кнауф</span>
            <span style={{ background: '#f3f4f6', padding: '0.5rem 1rem', borderRadius: '2rem' }}>ЦЕМЕНТУМ</span>
            <span style={{ background: '#f3f4f6', padding: '0.5rem 1rem', borderRadius: '2rem' }}>ROCKWOOL</span>
            <span style={{ background: '#f3f4f6', padding: '0.5rem 1rem', borderRadius: '2rem' }}>Tarkett</span>
            <span style={{ background: '#f3f4f6', padding: '0.5rem 1rem', borderRadius: '2rem' }}>Reynaers</span>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button className="btn" onClick={() => router.push('/contacts')}>
            Связаться с нами
          </button>
        </div>
      </div>
    </div>
  );
}