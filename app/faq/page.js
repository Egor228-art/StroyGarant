"use client";

export const dynamic = 'force-dynamic'

import { useState } from "react";
import { useRouter } from "next/navigation";

const faqs = [
  {
    question: "Сколько времени занимает строительство дома?",
    answer: "Сроки зависят от типа дома и площади. В среднем строительство дома под ключ занимает от 4 до 12 месяцев. Мы всегда соблюдаем оговоренные сроки по договору."
  },
  {
    question: "Можно ли внести изменения в проект в процессе строительства?",
    answer: "Да, мы можем вносить изменения в проект. Все изменения оформляются дополнительным соглашением. Важно понимать, что некоторые изменения могут повлиять на сроки и стоимость."
  },
  {
    question: "Какие гарантии вы предоставляете?",
    answer: "Мы предоставляем гарантию 10 лет на все виды строительных работ. На материалы действует заводская гарантия производителей."
  },
  {
    question: "Нужно ли получать разрешение на строительство?",
    answer: "Для большинства объектов требуется разрешение на строительство. Мы помогаем нашим клиентам с оформлением всех необходимых документов и получением разрешений."
  },
  {
    question: "Как происходит оплата?",
    answer: "Мы работаем по этапной оплате. Вы вносите предоплату, а затем оплачиваете по завершении каждого этапа работ. Это безопасно и прозрачно."
  },
  {
    question: "Можно ли посмотреть реализованные объекты?",
    answer: "Да, мы организуем экскурсии на наши объекты. Вы можете увидеть качество работ своими глазами и пообщаться с нашими клиентами."
  },
  {
    question: "Что входит в стоимость строительства?",
    answer: "Стоимость включает все материалы, работу бригады, контроль прораба, вывоз мусора. В смете детально расписаны все позиции, никаких скрытых платежей."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const router = useRouter();

  return (
    <div>
      <div className="page-hero">
        <h1>Часто задаваемые вопросы</h1>
        <p>Ответы на самые популярные вопросы о строительстве</p>
      </div>

      <div className="container">
        <div className="faq-list" style={{ maxWidth: '800px', margin: '0 auto' }}>
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item" style={{
              background: 'white',
              borderRadius: '1rem',
              marginBottom: '1rem',
              overflow: 'hidden',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div
                className="faq-question"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                style={{
                  padding: '1.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontWeight: 600,
                  transition: 'background 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gray-100)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <span>{faq.question}</span>
                <span style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>
                  {openIndex === index ? '−' : '+'}
                </span>
              </div>
              {openIndex === index && (
                <div className="faq-answer" style={{
                  padding: '0 1.5rem 1.5rem',
                  color: 'var(--gray-600)',
                  lineHeight: '1.6',
                  borderTop: '1px solid var(--gray-200)'
                }}>
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="faq-contact" style={{
          textAlign: 'center',
          marginTop: '3rem',
          padding: '2rem',
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>Не нашли ответ?</h3>
          <p style={{ marginBottom: '1rem' }}>Свяжитесь с нашим специалистом</p>
          <button className="btn" onClick={() => router.push('/contacts')}>
            Задать вопрос
          </button>
        </div>
      </div>
    </div>
  );
}