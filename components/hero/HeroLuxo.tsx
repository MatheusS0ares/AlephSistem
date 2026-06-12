'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import Link from 'next/link'
import Image from 'next/image'
import { FadeIn } from '@/components/motion/FadeIn'
import { Crown, ArrowRight, Sparkles } from 'lucide-react'
import { getTenant } from '@/tenants'

const tenant = getTenant()
const { hero, stats: STATS } = tenant

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let frame: number
    let start: number | null = null
    const duration = 1800

    const animate = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) frame = requestAnimationFrame(animate)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          frame = requestAnimationFrame(animate)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [target])

  return (
    <span ref={ref}>
      {count.toLocaleString('pt-BR')}
      {suffix}
    </span>
  )
}

function MagneticButton({ href, children }: { href: string; children: React.ReactNode }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 20 })
  const sy = useSpring(y, { stiffness: 200, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * 0.35)
    y.set((e.clientY - cy) * 0.35)
  }

  return (
    <motion.a
      href={href}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-paizao-gold-soft via-paizao-gold to-paizao-gold-bright text-black font-extrabold text-lg tracking-wide shadow-[0_8px_30px_rgba(212,175,55,0.35)] hover:shadow-[0_8px_40px_rgba(212,175,55,0.55)] transition-shadow"
    >
      {children}
      <ArrowRight className="w-5 h-5" />
    </motion.a>
  )
}

// Poeira dourada flutuante — substitui o confete da versão Copa.
function GoldDust() {
  const pieces = Array.from({ length: 26 }, (_, i) => ({
    id: i,
    left: `${(i * 3.8 + 2) % 100}%`,
    delay: (i * 0.27) % 4,
    duration: 6 + (i % 5),
    size: 2 + (i % 4),
  }))
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-paizao-gold"
          style={{ left: p.left, bottom: -10, width: p.size, height: p.size, boxShadow: '0 0 8px rgba(212,175,55,0.8)' }}
          animate={{ y: ['0vh', '-105vh'], opacity: [0, 0.9, 0.9, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  )
}

// Emblema central de luxo: monograma da marca com anéis dourados girando.
function LuxoEmblem() {
  return (
    <div className="relative w-[36rem] h-[36rem] flex items-center justify-center">
      {/* halo */}
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.35),transparent_65%)] blur-2xl" />

      {/* anel externo girando */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 rounded-full border border-paizao-gold/30" />
        <div className="absolute inset-2 rounded-full border border-dashed border-paizao-gold/20" />
      </motion.div>

      {/* anel interno girando ao contrário */}
      <motion.div
        className="absolute inset-8"
        animate={{ rotate: -360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 rounded-full border border-paizao-gold/25" />
      </motion.div>

      {/* monograma */}
      <motion.div
        className="relative w-[28rem] h-[28rem] rounded-full overflow-hidden border-2 border-paizao-gold/40 shadow-[0_0_80px_rgba(212,175,55,0.5)]"
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Image src={tenant.logoSrc} alt={tenant.nome} fill className="object-cover" priority />
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -rotate-45"
          animate={{ left: ['-200%', '200%'] }}
          transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
          style={{ mixBlendMode: 'overlay' }}
        />
      </motion.div>
    </div>
  )
}

export function HeroLuxo() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-paizao-navy-deep">
      {/* Fundo de luxo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_40%,rgba(212,175,55,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_70%,rgba(212,175,55,0.10),transparent_50%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-paizao-bg/40 to-paizao-bg" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay" />
      </div>

      <div className="z-10 absolute inset-0">
        <GoldDust />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-32 grid lg:grid-cols-2 gap-16 items-center w-full z-20">
        <div>
          <FadeIn delay={0}>
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-black/40 border border-paizao-gold/30 mb-8 backdrop-blur-md shadow-2xl">
              <Crown className="w-4 h-4 text-paizao-gold" />
              <span className="text-xs font-black tracking-[0.4em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-paizao-gold-soft via-paizao-gold-bright to-paizao-gold-soft">
                {hero.badge}
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1
              className="text-[clamp(4.5rem,13vw,8.5rem)] leading-[0.85] tracking-tight text-paizao-ink drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: 'var(--font-bebas-neue), sans-serif' }}
            >
              {hero.titulo}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-paizao-gold-bright via-paizao-gold to-paizao-gold-soft drop-shadow-[0_0_30px_rgba(212,175,55,0.7)]">
                {hero.tituloAccent}
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mt-8 text-paizao-ink/85 text-xl max-w-lg leading-relaxed font-light backdrop-blur-xl bg-black/30 p-5 rounded-2xl border border-paizao-gold/10 shadow-2xl">
              {hero.descricao}
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-12 flex flex-col sm:flex-row gap-6">
              <MagneticButton href={hero.ctaPrimario.href}>{hero.ctaPrimario.label}</MagneticButton>
              <Link
                href={hero.ctaSecundario.href}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl border border-paizao-gold/30 text-paizao-ink font-bold uppercase tracking-widest overflow-hidden hover:bg-paizao-gold/10 transition-all shadow-xl backdrop-blur-md"
              >
                <Sparkles className="w-4 h-4 text-paizao-gold group-hover:scale-110 transition-transform" />
                {hero.ctaSecundario.label}
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="mt-16 grid grid-cols-3 gap-6 relative">
              <div className="absolute inset-0 bg-black/20 blur-3xl rounded-full" />
              {STATS.map((s) => (
                <div key={s.label} className="relative p-5 rounded-2xl border border-paizao-gold/15 bg-black/40 backdrop-blur-xl shadow-2xl hover:-translate-y-1 transition-transform">
                  <p
                    className="text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-br from-paizao-gold-bright to-paizao-gold-soft drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                    style={{ fontFamily: 'var(--font-bebas-neue), sans-serif' }}
                  >
                    <AnimatedCounter target={s.valor} suffix={s.sufixo} />
                  </p>
                  <p className="text-[10px] text-paizao-ink/70 uppercase tracking-[0.2em] mt-2 font-black">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.3} direction="left" className="hidden lg:flex justify-center items-center relative">
          <LuxoEmblem />
        </FadeIn>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-[9px] uppercase tracking-[0.3em] text-paizao-gold font-bold">Descubra</span>
        <div className="w-px h-12 bg-gradient-to-b from-paizao-gold to-transparent relative overflow-hidden">
          <motion.div
            className="absolute top-0 w-full h-1/2 bg-paizao-ink"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </motion.div>
    </section>
  )
}
