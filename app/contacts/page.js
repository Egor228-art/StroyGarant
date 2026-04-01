"use client";

export const dynamic = 'force-dynamic'

import { useState } from "react";

export default function ContactsPage() {
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setFormData({ name: "", phone: "", message: "" });
  };

  return (
    <div>
      <div className="page-hero">
        <h1>Контакты</h1>
        <p>Свяжитесь с нами любым удобным способом</p>
      </div>

      <div className="container">
        <div className="contacts-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          <div className="contact-card" style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📞</div>
            <h3>Телефон</h3>
            <p>8-800-555-35-35</p>
            <p>Бесплатно по России</p>
            <p>Ежедневно 9:00-20:00</p>
          </div>
          
          <div className="contact-card" style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✉️</div>
            <h3>Email</h3>
            <p>info@stroygarant.ru</p>
            <p>support@stroygarant.ru</p>
            <p>Ответ в течение 24 часов</p>
          </div>
          
          <div className="contact-card" style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💬</div>
            <h3>Мессенджеры</h3>
            <p>Telegram: @stroygarant</p>
            <p>WhatsApp: +7-999-123-45-67</p>
            <p>Viber: +7-999-123-45-67</p>
          </div>
          
          <div className="contact-card" style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📍</div>
            <h3>Адрес офиса</h3>
            <p>г. Москва, ул. Строителей, д. 5</p>
            <p>м. Динамо, выход к ТЦ</p>
            <p>Пн-Пт: 10:00-19:00</p>
          </div>
        </div>

        <div className="form-container" style={{ maxWidth: '600px' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '2rem' }}>📝 Обратная связь</h3>
          <form onSubmit={handleSubmit}>
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
              required
            />
            <textarea
              placeholder="Ваше сообщение"
              rows="4"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />
            <button type="submit" style={{ width: '100%' }}>
              {sent ? "✓ Сообщение отправлено!" : "Отправить"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}