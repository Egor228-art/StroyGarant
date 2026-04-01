import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { Providers } from './providers'
import Navigation from './components/Navigation'
import UserInfo from './components/UserInfo'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'СтройГарант | Строительство домов и коттеджей',
  description: 'Строительство домов под ключ, ремонт квартир, отделка. Гарантия качества 10 лет.',
}

function Header() {
  return (
    <header className="main-header">
      <div className="header-content">
        <Link href="/" className="logo-link" style={{ textDecoration: 'none' }}>
          <div className="logo">
            <h1>🏗️ СтройГарант</h1>
            <p className="logo-subtitle">Строим надежно с 2010 года</p>
          </div>
        </Link>
        <UserInfo />
      </div>
      <Navigation />
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>СтройГарант</h3>
          <p>Лицензия Минстроя № 12345</p>
          <p>© 2024 Все права защищены</p>
        </div>
        <div className="footer-section">
          <h3>Услуги</h3>
          <Link href="/services#house">Строительство домов</Link>
          <Link href="/services#renovation">Ремонт квартир</Link>
          <Link href="/services#design">Дизайн интерьера</Link>
          <Link href="/estimate">Расчет сметы</Link>
        </div>
        <div className="footer-section">
          <h3>О компании</h3>
          <Link href="/about">О нас</Link>
          <Link href="/projects">Наши проекты</Link>
          <Link href="/portfolio">Портфолио</Link>
          <Link href="/contacts">Контакты</Link>
        </div>
        <div className="footer-section">
          <h3>Контакты</h3>
          <p>📞 8-800-555-35-35</p>
          <p>📧 info@stroygarant.ru</p>
          <p>📍 Москва, ул. Строителей, 5</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Бесплатная консультация | Выезд специалиста на объект</p>
      </div>
    </footer>
  )
}

function RootLayoutContent({ children }) {
  return (
    <>
      <Header />
      <main className="container">{children}</main>
      <Footer />
    </>
  )
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Providers>
          <RootLayoutContent>{children}</RootLayoutContent>
        </Providers>
      </body>
    </html>
  )
}