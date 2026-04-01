"use client";

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { SessionProvider } from "next-auth/react";

function HomeContentWithParams() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "", name: "", phone: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
    if (searchParams?.get('login') === 'true') {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  if (status === "loading" || !mounted) {
    return <div style={{ textAlign: "center", padding: "4rem" }}>Загрузка...</div>;
  }

  if (session) {
    router.push("/dashboard");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
      if (res?.error) setError("Неверный email или пароль");
      else {
        setIsModalOpen(false);
        router.push("/dashboard");
      }
    } else {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error);
      else {
        await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });
        setIsModalOpen(false);
        router.push("/dashboard");
      }
    }
  };

  return (
    <div>
      <div className="hero">
        <h1>Строим дома вашей мечты</h1>
        <p>Профессиональное строительство под ключ, ремонт и отделка</p>
        <button className="btn" onClick={() => setIsModalOpen(true)} style={{ marginTop: "2rem", fontSize: "1.1rem", padding: "1rem 2rem" }}>
          Получить консультацию
        </button>
      </div>

      <div className="grid">
        <div className="card">
          <h3>🏠 Строительство домов</h3>
          <p>Дома из кирпича, газобетона, дерева под ключ</p>
          <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>от 35 000 ₽/м²</p>
          <button className="btn-outline" onClick={() => setIsModalOpen(true)}>Рассчитать</button>
        </div>
        <div className="card">
          <h3>🔨 Ремонт квартир</h3>
          <p>Косметический, капитальный, евроремонт</p>
          <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>от 8 000 ₽/м²</p>
          <button className="btn-outline" onClick={() => setIsModalOpen(true)}>Заказать</button>
        </div>
        <div className="card">
          <h3>📐 Дизайн интерьера</h3>
          <p>Индивидуальные проекты, 3D-визуализация</p>
          <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>от 1 500 ₽/м²</p>
          <button className="btn-outline" onClick={() => setIsModalOpen(true)}>Подробнее</button>
        </div>
        <div className="card">
          <h3>🏗️ Отделка фасадов</h3>
          <p>Утепление, штукатурка, сайдинг, кирпич</p>
          <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>от 5 000 ₽/м²</p>
          <button className="btn-outline" onClick={() => setIsModalOpen(true)}>Рассчитать</button>
        </div>
      </div>

      {/* Модальное окно (аналогично страховому сайту) */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="form-container"
            style={{ maxWidth: '450px', width: '100%', margin: 0, position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                fontSize: '1.5rem',
                padding: 0,
                width: '2rem',
                height: '2rem',
                boxShadow: 'none',
                color: '#6b7280'
              }}
            >
              ×
            </button>

            <div className="form-tabs">
              <button className={`tab-btn ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>Вход</button>
              <button className={`tab-btn ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>Регистрация</button>
            </div>

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <input
                    type="text"
                    placeholder="Ваше имя"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Телефон"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </>
              )}
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Пароль"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              {error && <p style={{ color: "#dc2626", marginBottom: "1rem" }}>{error}</p>}
              <button type="submit" style={{ width: "100%" }}>
                {isLogin ? "Войти" : "Зарегистрироваться"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function HomeContent() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "4rem" }}>Загрузка...</div>}>
      <HomeContentWithParams />
    </Suspense>
  );
}

export default function Home() {
  return (
    <SessionProvider>
      <HomeContent />
    </SessionProvider>
  );
}