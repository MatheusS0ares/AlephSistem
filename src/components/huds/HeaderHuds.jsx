import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'
import styles from './HeaderHuds.module.css'

const NAV = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Como Agendar', href: '#como-agendar' },
  { label: 'Depoimentos', href: '#depoimentos' },
  { label: 'Contato', href: '#contato' },
]

export default function HeaderHuds({ whatsapp = '5500000000000' }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const wppLink = `https://wa.me/${whatsapp}?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20hor%C3%A1rio%20na%20Barbearia%20HUD%27S.`

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <a href="#inicio" className={styles.logo}>
          <span className={styles.logoSub}>BARBEARIA</span>
          <span className={styles.logoMain}>HUD'S</span>
        </a>

        <nav className={styles.nav}>
          {NAV.map(n => (
            <a key={n.label} href={n.href} className={styles.navLink}>{n.label}</a>
          ))}
        </nav>

        <div className={styles.actions}>
          <a href={wppLink} target="_blank" rel="noopener noreferrer" className={styles.ctaBtn}>
            <FaWhatsapp /> Agendar
          </a>
          <button
            className={styles.burger}
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Menu"
          >
            <span className={`${styles.burgerLine} ${mobileOpen ? styles.burgerOpen1 : ''}`} />
            <span className={`${styles.burgerLine} ${mobileOpen ? styles.burgerOpen2 : ''}`} />
            <span className={`${styles.burgerLine} ${mobileOpen ? styles.burgerOpen3 : ''}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {NAV.map(n => (
              <a
                key={n.label}
                href={n.href}
                className={styles.mobileLink}
                onClick={() => setMobileOpen(false)}
              >
                {n.label}
              </a>
            ))}
            <a href={wppLink} target="_blank" rel="noopener noreferrer" className={styles.mobileCta} onClick={() => setMobileOpen(false)}>
              <FaWhatsapp /> Agendar pelo WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
