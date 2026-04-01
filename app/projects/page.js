"use client";

export const dynamic = 'force-dynamic'

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const projectsList = [
  {
    id: 1,
    title: "Коттедж «Сосновый бор»",
    type: "Коттедж",
    area: 180,
    description: "Двухэтажный дом из газобетона с террасой и мансардой",
    image: "🏰",
    year: 2024,
    location: "Московская область"
  },
  {
    id: 2,
    title: "Жилой комплекс «Зеленый квартал»",
    type: "Многоквартирный",
    area: 5000,
    description: "3 корпуса переменной этажности, подземный паркинг",
    image: "🏢",
    year: 2023,
    location: "г. Москва"
  },
  {
    id: 3,
    title: "Дом «Скандинавский стиль»",
    type: "Частный дом",
    area: 120,
    description: "Одноэтажный дом с панорамными окнами и террасой",
    image: "🏡",
    year: 2024,
    location: "Ленинградская область"
  },
  {
    id: 4,
    title: "Ремонт квартиры «Лофт»",
    type: "Ремонт",
    area: 85,
    description: "Капитальный ремонт в стиле лофт с перепланировкой",
    image: "🛋️",
    year: 2024,
    location: "г. Москва"
  },
  {
    id: 5,
    title: "Таунхаус «Озерный»",
    type: "Таунхаус",
    area: 150,
    description: "Секционный дом с придомовым участком",
    image: "🏘️",
    year: 2023,
    location: "Московская область"
  }
];

export default function ProjectsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const types = ["all", "Коттедж", "Частный дом", "Многоквартирный", "Ремонт", "Таунхаус"];

  const filteredProjects = filter === "all" 
    ? projectsList 
    : projectsList.filter(p => p.type === filter);

  const handleConsultation = () => {
    if (session) {
      router.push('/dashboard?tab=new');
    } else {
      router.push('/?login=true');
    }
  };

  return (
    <div>
      <div className="page-hero">
        <h1>Наши проекты</h1>
        <p>Реализованные объекты, которыми мы гордимся</p>
      </div>

      <div className="container">
        <div className="blog-filters">
          {types.map(type => (
            <button
              key={type}
              className={`filter-btn ${filter === type ? 'active' : ''}`}
              onClick={() => setFilter(type)}
            >
              {type === 'all' ? 'Все проекты' : type}
            </button>
          ))}
        </div>

        <div className="projects-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem'
        }}>
          {filteredProjects.map(project => (
            <div key={project.id} className="card">
              <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>{project.image}</div>
              <h3>{project.title}</h3>
              <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{project.type} | {project.area} м²</p>
              <p>{project.description}</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>📍 {project.location}</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>📅 {project.year}</p>
              <button className="btn-outline" onClick={handleConsultation} style={{ marginTop: '1rem' }}>
                Хочу такой же
              </button>
            </div>
          ))}
        </div>

        <div className="consultation-banner" style={{
          marginTop: '3rem',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
          color: 'white',
          textAlign: 'center',
          padding: '3rem',
          borderRadius: '1rem'
        }}>
          <h3>Хотите реализовать свой проект?</h3>
          <p>Получите бесплатную консультацию и предварительную смету</p>
          <button className="btn" onClick={handleConsultation} style={{ background: 'white', color: 'var(--primary)', marginTop: '1rem' }}>
            Связаться с нами
          </button>
        </div>
      </div>
    </div>
  );
}