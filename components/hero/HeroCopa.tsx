'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import Link from 'next/link'
import { FadeIn } from '@/components/motion/FadeIn'
import { Sparkles, Play } from 'lucide-react'
import Image from 'next/image'
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
      className="inline-block px-8 py-4 rounded-xl bg-paizao-gold text-paizao-navy font-extrabold text-lg tracking-wide shadow-lg hover:bg-paizao-gold-bright transition-colors"
    >
      {children}
    </motion.a>
  )
}

function Confetti() {
  const { cores } = tenant
  const pieces = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    color: i % 4 === 0 ? cores.yellow : i % 4 === 1 ? cores.green : i % 4 === 2 ? cores.primary : cores.ink,
    left: `${5 + i * 4.5}%`,
    delay: (i * 0.15) % 2,
    duration: 3 + (i % 3),
    size: 6 + (i % 8),
    shape: i % 3,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-0"
          style={{ left: p.left, width: p.size, height: p.size, backgroundColor: p.color, borderRadius: p.shape === 0 ? '50%' : p.shape === 1 ? 0 : '2px' }}
          animate={{
            y: ['0vh', '110vh'],
            rotate: [0, p.id % 2 === 0 ? 360 : -360],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}


export function HeroCopa() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-paizao-navy-deep">
      <div className="absolute inset-0 z-0">
        <Image
          src="/world_cup_hero_bg.png"
          alt="Coleção Copa 2026 Background"
          fill
          priority
          className="object-cover object-[center_30%] opacity-60 mix-blend-luminosity scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-paizao-navy-deep via-paizao-navy-deep/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-paizao-navy-deep via-transparent to-paizao-navy-deep/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(0,156,59,0.2),transparent_70%)] mix-blend-color-dodge" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(212,169,58,0.2),transparent_70%)] mix-blend-color-dodge" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.06] mix-blend-overlay" />
      </div>

      <motion.div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        animate={{ rotate: 360, scale: [1, 1.05, 1] }}
        transition={{ rotate: { duration: 150, repeat: Infinity, ease: 'linear' }, scale: { duration: 10, repeat: Infinity, ease: 'easeInOut' } }}
      >
        <div className="relative w-[min(90vw,90vh)] h-[min(90vw,90vh)] opacity-[0.12] mix-blend-screen">
          <div className="absolute inset-0 rounded-full border border-paizao-gold/30 shadow-[0_0_100px_rgba(212,169,58,0.3)]" />
          <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="22" cy="22" r="19" stroke="#d4a93a" strokeWidth="1.5" fill="none" />
            <circle cx="22" cy="22" r="17" stroke="#d4a93a" strokeWidth="0.5" fill="none" />
            <path
              d="M15 12h8.5c2.2 0 3.9.5 5 1.6 1.1 1 1.6 2.4 1.6 4.2 0 1.8-.6 3.2-1.7 4.3C27.3 23.2 25.6 23.7 23.3 23.7H18.2V32H15V12zm3.2 2.8v6.2h4.8c1.3 0 2.3-.3 3-.9.7-.6 1.1-1.4 1.1-2.4 0-1-.4-1.8-1.1-2.3-.7-.6-1.7-.8-3-.8h-4.8z"
              fill="#d4a93a"
            />
          </svg>
        </div>
      </motion.div>

      <div className="z-10 absolute inset-0">
        <Confetti />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-32 grid lg:grid-cols-2 gap-16 items-center w-full z-20">
        <div>
          <FadeIn delay={0}>
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-black/40 border border-white/20 mb-8 backdrop-blur-md shadow-2xl">
              <Sparkles className="w-4 h-4 text-paizao-gold animate-pulse" />
              <span className="text-xs font-black tracking-[0.4em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-paizao-gold via-white to-paizao-gold-soft drop-shadow-md">
                {hero.badge}
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1
              className="text-[clamp(4.5rem,13vw,8.5rem)] leading-[0.85] tracking-tight text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: 'var(--font-bebas-neue), sans-serif' }}
            >
              {hero.titulo}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#25d366] via-paizao-yellow to-[#009c3b] filter drop-shadow-[0_0_30px_rgba(0,156,59,0.8)]">
                {hero.tituloAccent}
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mt-8 text-white/90 text-xl max-w-lg leading-relaxed font-light backdrop-blur-xl bg-black/30 p-5 rounded-2xl border border-white/10 shadow-2xl">
              {hero.descricao}
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-12 flex flex-col sm:flex-row gap-6">
              <MagneticButton href={hero.ctaPrimario.href}>{hero.ctaPrimario.label}</MagneticButton>
              <Link
                href={hero.ctaSecundario.href}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl border border-white/20 text-white font-bold uppercase tracking-widest overflow-hidden hover:bg-white/10 transition-all shadow-xl backdrop-blur-md"
              >
                <div className="absolute inset-0 bg-white/5 group-hover:bg-transparent transition-colors" />
                <Play className="w-4 h-4 text-paizao-gold group-hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(212,169,58,0.8)]" fill="currentColor" />
                {hero.ctaSecundario.label}
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="mt-16 grid grid-cols-3 gap-6 relative">
              <div className="absolute inset-0 bg-black/20 blur-3xl rounded-full" />
              {STATS.map((s) => (
                <div key={s.label} className="relative p-5 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl hover:-translate-y-1 transition-transform">
                  <p
                    className="text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-br from-paizao-gold-bright to-paizao-gold-soft drop-shadow-[0_0_15px_rgba(212,169,58,0.6)]"
                    style={{ fontFamily: 'var(--font-bebas-neue), sans-serif' }}
                  >
                    <AnimatedCounter target={s.valor} suffix={s.sufixo} />
                  </p>
                  <p className="text-[10px] text-white/80 uppercase tracking-[0.2em] mt-2 font-black drop-shadow-md">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.3} direction="left" className="hidden lg:flex justify-center items-center relative">
          <div className="absolute w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,rgba(0,156,59,0.3),transparent_70%)] blur-[100px] -z-10 mix-blend-color-dodge" />
          <motion.div
            className="relative w-[24rem] h-[30rem] z-10 rounded-2xl overflow-hidden border border-paizao-gold/40 shadow-[0_0_60px_rgba(212,169,58,0.4)]"
            animate={{
              y: [-10, 10, -10],
              rotateZ: [-1, 1, -1],
              rotateY: [-5, 5, -5]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Image
              src="/premium_gold_shirt.png"
              alt="Camisa Premium Gold Seleção Brasileira"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-paizao-navy-deep/80 via-transparent to-paizao-navy-deep/20 mix-blend-overlay" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -rotate-45"
              animate={{ left: ['-200%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut' }}
              style={{ mixBlendMode: 'overlay' }}
            />
          </motion.div>
        </FadeIn>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-[9px] uppercase tracking-[0.3em] text-paizao-gold font-bold drop-shadow-md">Descubra</span>
        <div className="w-px h-12 bg-gradient-to-b from-paizao-gold to-transparent relative overflow-hidden">
          <motion.div
            className="absolute top-0 w-full h-1/2 bg-white"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </motion.div>
    </section>
  )
}
