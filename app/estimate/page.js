"use client";

export const dynamic = 'force-dynamic'

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function EstimatePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    projectType: "house",
    area: 100,
    quality: "standard",
    floors: 1,
    hasGarage: false,
    hasBasement: false
  });
  const [result, setResult] = useState(null);

  const calculatePrice = () => {
    const baseRates = {
      house: { economy: 35000, standard: 50000, premium: 80000 },
      cottage: { economy: 40000, standard: 60000, premium: 100000 },
      renovation: { economy: 8000, standard: 15000, premium: 25000 }
    };
    
    let rate = baseRates[formData.projectType]?.[formData.quality] || 50000;
    let total = rate * formData.area;
    
    if (formData.floors > 1) total *= 0.95;
    if (formData.hasGarage) total += 500000;
    if (formData.hasBasement) total += 800000;
    
    setResult(total);
  };

  const handleSave = async () => {
    if (!session) {
      router.push('/?login=true');
      return;
    }
    
    await fetch('/api/estimates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectType: formData.projectType,
        area: formData.area,
        materialQuality: formData.quality,
        totalCost: result
      })
    });
    
    alert('Смета сохранена! Вы можете посмотреть её в личном кабинете');
    router.push('/dashboard');
  };

  return (
    <div>
      <div className="page-hero">
        <h1>Калькулятор стоимости строительства</h1>
        <p>Рассчитайте предварительную стоимость вашего проекта</p>
      </div>

      <div className="container">
        <div className="form-container" style={{ maxWidth: '600px' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '2rem' }}>Параметры объекта</h3>
          
          <select
            value={formData.projectType}
            onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
          >
            <option value="house">🏠 Дом</option>
            <option value="cottage">🏰 Коттедж</option>
            <option value="renovation">🔨 Ремонт квартиры</option>
          </select>
          
          <input
            type="number"
            placeholder="Площадь (м²)"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
          />
          
          <select
            value={formData.quality}
            onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
          >
            <option value="economy">Эконом (базовые материалы)</option>
            <option value="standard">Стандарт (оптимальное соотношение)</option>
            <option value="premium">Премиум (элитные материалы)</option>
          </select>
          
          {formData.projectType !== "renovation" && (
            <>
              <select
                value={formData.floors}
                onChange={(e) => setFormData({ ...formData, floors: Number(e.target.value) })}
              >
                <option value={1}>1 этаж</option>
                <option value={2}>2 этажа</option>
                <option value={3}>3 этажа</option>
              </select>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="checkbox"
                  checked={formData.hasGarage}
                  onChange={(e) => setFormData({ ...formData, hasGarage: e.target.checked })}
                />
                Гараж
              </label>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="checkbox"
                  checked={formData.hasBasement}
                  onChange={(e) => setFormData({ ...formData, hasBasement: e.target.checked })}
                />
                Цокольный этаж / подвал
              </label>
            </>
          )}
          
          <button className="btn" onClick={calculatePrice}>Рассчитать стоимость</button>
          
          {result && (
            <div className="estimate-result" style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
              color: 'white',
              padding: '1.5rem',
              borderRadius: '1rem',
              textAlign: 'center',
              marginTop: '1rem'
            }}>
              <p>Предварительная стоимость:</p>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>
                {result.toLocaleString()} ₽
              </div>
              <button
                className="btn-outline"
                style={{ background: 'white', color: 'var(--primary)', marginTop: '1rem' }}
                onClick={handleSave}
              >
                Сохранить смету
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}