'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X, ShoppingBag } from 'lucide-react'
import { InstagramIcon } from '@/components/brand/InstagramIcon'
import { Logo } from '@/components/brand/Logo'
import { BrandTicker } from '@/components/brand/BrandTicker'
import { useCartStore } from '@/store/useCartStore'
import { cn } from '@/lib/utils'
import { getTenant } from '@/tenants'

const tenant = getTenant()
const NAV_LINKS = tenant.nav.links
const INSTAGRAM_URL = tenant.contato.instagramUrl
const INSTAGRAM_HANDLE = tenant.contato.instagram

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { open, count } = useCartStore()
  const cartCount = count()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <AnimatePresence initial={false}>
        {!scrolled && (
          <motion.div
            key="ticker"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <BrandTicker />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={cn(
          'transition-all duration-300',
          scrolled ? 'glass h-16' : 'h-24 bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <Link href="/" onClick={() => setMobileOpen(false)}>
            <Logo size={scrolled ? 'sm' : 'lg'} />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-paizao-ink-dim hover:text-paizao-gold transition-colors text-sm tracking-wide font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex text-paizao-ink-dim hover:text-paizao-gold transition-colors"
              aria-label={`Instagram ${INSTAGRAM_HANDLE}`}
            >
              <InstagramIcon size={20} />
            </a>

            <button
              onClick={open}
              className="relative p-2 text-paizao-ink hover:text-paizao-gold transition-colors"
              aria-label="Abrir sacola"
            >
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-paizao-gold text-paizao-navy text-[10px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            <button
              className="md:hidden p-2 text-paizao-ink"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-72 bg-paizao-surface z-50 md:hidden flex flex-col pt-20 px-6 gap-2"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-4 text-lg text-paizao-ink hover:text-paizao-gold border-b border-paizao-surface-2 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center gap-3 text-paizao-ink-dim hover:text-paizao-gold transition-colors"
              >
                <InstagramIcon size={20} />
                {INSTAGRAM_HANDLE}
              </a>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
