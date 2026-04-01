"use client";

export const dynamic = 'force-dynamic'

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const services = [
  { icon: '🏠', title: 'Строительство домов', description: 'Дома из кирпича, газобетона, дерева под ключ', price: 'от 35 000 ₽/м²' },
  { icon: '🔨', title: 'Ремонт квартир', description: 'Косметический, капитальный, евроремонт', price: 'от 8 000 ₽/м²' },
  { icon: '📐', title: 'Дизайн интерьера', description: 'Индивидуальные проекты, 3D-визуализация', price: 'от 1 500 ₽/м²' },
  { icon: '🏗️', title: 'Отделка фасадов', description: 'Утепление, штукатурка, сайдинг, кирпич', price: 'от 5 000 ₽/м²' },
  { icon: '🛠️', title: 'Монтаж инженерии', description: 'Электрика, сантехника, отопление', price: 'от 15 000 ₽' },
  { icon: '🏡', title: 'Ландшафтный дизайн', description: 'Озеленение, дорожки, освещение', price: 'от 25 000 ₽' }
];

export default function ServicesPage() {
  const { data: session } = useSession();
  const router = useRouter();

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
        <h1>Наши услуги</h1>
        <p>Профессиональное строительство и ремонт под ключ</p>
      </div>
      <div className="container">
        <div className="grid">
          {services.map((service, i) => (
            <div key={i} className="card">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>{service.price}</p>
              <button className="btn-outline" onClick={handleConsultation}>Получить консультацию</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}