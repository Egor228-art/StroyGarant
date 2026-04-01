"use client";

export const dynamic = 'force-dynamic'

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const portfolioItems = [
  {
    id: 1,
    category: "exterior",
    title: "Фасад дома в современном стиле",
    description: "Отделка керамогранитом и композитными панелями",
    image: "🏠",
    year: 2024
  },
  {
    id: 2,
    category: "interior",
    title: "Интерьер в стиле минимализм",
    description: "Гостиная с панорамными окнами",
    image: "🛋️",
    year: 2024
  },
  {
    id: 3,
    category: "exterior",
    title: "Загородный дом в скандинавском стиле",
    description: "Деревянная отделка, большая терраса",
    image: "🏡",
    year: 2023
  },
  {
    id: 4,
    category: "interior",
    title: "Кухня-гостиная в стиле лофт",
    description: "Кирпичная стена, деревянные балки",
    image: "🍳",
    year: 2024
  },
  {
    id: 5,
    category: "landscape",
    title: "Ландшафтный дизайн участка",
    description: "Альпийская горка, дорожки, зона отдыха",
    image: "🌳",
    year: 2023
  },
  {
    id: 6,
    category: "exterior",
    title: "Коттедж в классическом стиле",
    description: "Лепина, колонны, мраморная отделка",
    image: "🏰",
    year: 2024
  }
];

export default function PortfolioPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");
  const categories = ["all", "exterior", "interior", "landscape"];

  const filteredItems = activeCategory === "all"
    ? portfolioItems
    : portfolioItems.filter(item => item.category === activeCategory);

  const getCategoryName = (cat) => {
    const names = {
      all: "Все работы",
      exterior: "🏠 Фасады",
      interior: "🛋️ Интерьеры",
      landscape: "🌳 Ландшафт"
    };
    return names[cat] || cat;
  };

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
        <h1>Портфолио работ</h1>
        <p>Более 200 реализованных проектов за 10 лет</p>
      </div>

      <div className="container">
        <div className="blog-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {getCategoryName(cat)}
            </button>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {filteredItems.map(item => (
            <div key={item.id} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{item.image}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>{item.year}</p>
              <button className="btn-outline" onClick={handleConsultation} style={{ marginTop: '1rem' }}>
                Заказать похожий проект
              </button>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button className="btn" onClick={handleConsultation}>
            Получить консультацию
          </button>
        </div>
      </div>
    </div>
  );
}