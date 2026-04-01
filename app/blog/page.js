"use client";

export const dynamic = 'force-dynamic'

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const articles = [
  {
    id: 1,
    title: "Как выбрать материалы для строительства дома",
    excerpt: "Сравнение кирпича, газобетона, дерева и других материалов",
    date: "25 марта 2024",
    category: "Советы",
    image: "🧱",
    readTime: "5 мин"
  },
  {
    id: 2,
    title: "Этапы строительства дома под ключ",
    excerpt: "От фундамента до финишной отделки — что нужно знать",
    date: "18 марта 2024",
    category: "Инструкции",
    image: "📋",
    readTime: "8 мин"
  },
  {
    id: 3,
    title: "Тренды в дизайне интерьера 2024",
    excerpt: "Натуральные материалы, экологичность, умный дом",
    date: "10 марта 2024",
    category: "Дизайн",
    image: "🎨",
    readTime: "6 мин"
  },
  {
    id: 4,
    title: "Как утеплить фасад правильно",
    excerpt: "Виды утеплителей, технология монтажа, ошибки",
    date: "5 марта 2024",
    category: "Советы",
    image: "❄️",
    readTime: "7 мин"
  },
  {
    id: 5,
    title: "Выбор кровли: что лучше?",
    excerpt: "Металлочерепица, мягкая кровля, композитная черепица",
    date: "28 февраля 2024",
    category: "Материалы",
    image: "🏠",
    readTime: "6 мин"
  },
  {
    id: 6,
    title: "Юридические аспекты строительства",
    excerpt: "Разрешения, документы, ввод в эксплуатацию",
    date: "20 февраля 2024",
    category: "Право",
    image: "⚖️",
    readTime: "10 мин"
  }
];

export default function BlogPage() {
  const [filter, setFilter] = useState("all");
  const { data: session } = useSession();
  const router = useRouter();
  const categories = ["all", ...new Set(articles.map(a => a.category))];

  const filteredArticles = filter === "all"
    ? articles
    : articles.filter(a => a.category === filter);

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
        <h1>Блог о строительстве</h1>
        <p>Полезные статьи, советы и новости</p>
      </div>

      <div className="container">
        <div className="blog-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat === "all" ? "Все статьи" : cat}
            </button>
          ))}
        </div>

        <div className="blog-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem'
        }}>
          {filteredArticles.map(article => (
            <div key={article.id} className="blog-card" style={{
              background: 'white',
              borderRadius: '1rem',
              overflow: 'hidden',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'transform 0.3s',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                fontSize: '4rem',
                textAlign: 'center',
                padding: '2rem',
                background: 'linear-gradient(135deg, var(--gray-100), var(--gray-200))'
              }}>{article.image}</div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                  fontSize: '0.875rem'
                }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 500 }}>{article.category}</span>
                  <span style={{ color: 'var(--gray-600)' }}>{article.date}</span>
                </div>
                <h3 style={{ marginBottom: '0.5rem' }}>{article.title}</h3>
                <p style={{ color: 'var(--gray-600)', marginBottom: '1rem' }}>{article.excerpt}</p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>⏱️ {article.readTime}</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 500 }}>Читать далее →</span>
                </div>
              </div>
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
          <h3>Получайте полезные советы первыми</h3>
          <p>Подпишитесь на нашу рассылку</p>
          <button className="btn" onClick={handleConsultation} style={{ background: 'white', color: 'var(--primary)', marginTop: '1rem' }}>
            Подписаться
          </button>
        </div>
      </div>
    </div>
  );
}