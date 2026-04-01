'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function Navigation() {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  useEffect(() => {
    setMounted(true)
  }, [])

  const isActive = (path) => pathname === path ? 'active' : ''

  if (!mounted) {
    return (
      <nav className="main-nav">
        <div className="nav-container">
          <div className="nav-links">
            <Link href="/">Главная</Link>
            <Link href="/services">Услуги</Link>
            <Link href="/projects">Проекты</Link>
            <Link href="/portfolio">Портфолио</Link>
            <Link href="/estimate">Смета</Link>
            <Link href="/about">О компании</Link>
            <Link href="/contacts">Контакты</Link>
          </div>
          <Link href="/?login=true" className="nav-login">Войти</Link>
        </div>
      </nav>
    )
  }

  return (
    <nav className="main-nav">
      <div className="nav-container">
        <div className="nav-links">
          <Link href="/" className={isActive('/')}>Главная</Link>
          <Link href="/services" className={isActive('/services')}>Услуги</Link>
          <Link href="/projects" className={isActive('/projects')}>Проекты</Link>
          <Link href="/portfolio" className={isActive('/portfolio')}>Портфолио</Link>
          <Link href="/estimate" className={isActive('/estimate')}>Смета</Link>
          <Link href="/about" className={isActive('/about')}>О компании</Link>
          <Link href="/contacts" className={isActive('/contacts')}>Контакты</Link>
        </div>
        {session?.user ? (
          <Link href="/dashboard" className="nav-user">
            👷 {session.user.name || session.user.email.split('@')[0]}
          </Link>
        ) : (
          <Link href="/?login=true" className="nav-login">Войти</Link>
        )}
      </div>
    </nav>
  )
}