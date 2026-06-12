import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { FaSun, FaMoon } from 'react-icons/fa'
import { useStore } from '../context/StoreContext'
import StoreLogo from './StoreLogo'
import styles from './Header.module.css'

const navLinks = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#categorias', label: 'Categorias' },
  { href: '#catalogo', label: 'Catálogo' },
  { href: '#depoimentos', label: 'Depoimentos' },
  { href: '#contato', label: 'Contato' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('ri-theme') || 'dark')
  const navigate = useNavigate()
  const { store } = useStore() || {}

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('ri-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  const closeMenu = () => setOpen(false)

  return (
    <motion.header
      className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.inner}>
        <a href="#inicio" className={styles.logo}>
          <StoreLogo slug={store?.slug} size="sm" />
        </a>

        <nav className={styles.nav}>
          {navLinks.map((link, i) => (
            <motion.a
              key={link.href}
              href={link.href}
              className={styles.navLink}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
              whileHover={{ color: '#ffffff' }}
            >
              {link.label}
            </motion.a>
          ))}
          <motion.button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55 }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
                transition={{ duration: 0.25 }}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                {theme === 'dark' ? <FaSun /> : <FaMoon />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
          <motion.a
            href="#pedido"
            className={styles.navCta}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.65 }}
            whileHover={{ backgroundColor: 'rgba(201,168,76,0.12)' }}
          >
            Fazer Pedido
          </motion.a>
        </nav>

        <button
          className={`${styles.hamburger} ${open ? styles.hamburgerActive : ''}`}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className={styles.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />
            <motion.nav
              className={styles.mobileNav}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className={styles.mobileNavLink}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={closeMenu}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#pedido"
                className={`${styles.mobileNavLink} ${styles.mobileNavCta}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.07 }}
                onClick={closeMenu}
              >
                Fazer Pedido
              </motion.a>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
