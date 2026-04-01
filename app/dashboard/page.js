"use client";

export const dynamic = 'force-dynamic'

import { useSession, signOut, SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
          <div className="stat-number">0</div>
          <button onClick={() => router.push('/estimate')}>Новый проект</button>
        </div>
        <div className="stat-card">
          <h3>📊 Расчеты сметы</h3>
          <div className="stat-number">0</div>
          <button onClick={() => router.push('/estimate')}>Рассчитать</button>
        </div>
        <div className="stat-card">
          <h3>🎁 Бонусная программа</h3>
          <div className="stat-number">5%</div>
          <p>скидка на следующие работы</p>
        </div>
      </div>

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