'use client'
import { useRef, useState, useEffect } from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'
import Image from 'next/image'
import { FadeIn } from '@/components/motion/FadeIn'
import { MessageCircle, ArrowRight, Zap } from 'lucide-react'
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
      ([entry]) => { if (entry.isIntersecting) { frame = requestAnimationFrame(animate); observer.disconnect() } },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => { cancelAnimationFrame(frame); observer.disconnect() }
  }, [target])

  return <span ref={ref}>{count.toLocaleString('pt-BR')}{suffix}</span>
}

// Partículas urbanas — pontos pequenos pulsando como estática
function StreetNoise() {
  const dots = Array.from({ length: 35 }, (_, i) => ({
    id: i,
    left: `${(i * 2.85 + 1) % 100}%`,
    top: `${(i * 7.7 + 5) % 100}%`,
    delay: (i * 0.18) % 3,
    duration: 3 + (i % 5),
  }))
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {dots.map(d => (
        <motion.div
          key={d.id}
          className="absolute w-0.5 h-0.5 rounded-full bg-paizao-gold"
          style={{ left: d.left, top: d.top }}
          animate={{ opacity: [0.08, 0.45, 0.08] }}
          transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

// Logo flutuante — disco metálico com glow verde
function StreetEmblem() {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,69,38,0.45),transparent_60%)] blur-3xl scale-110" />
      <motion.div
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative w-[500px] h-[500px] drop-shadow-[0_0_60px_rgba(0,69,38,0.55)]"
      >
        <Image src={tenant.logoSrc} alt={tenant.nome} fill className="object-contain" priority />
      </motion.div>
    </div>
  )
}

export function HeroStreet() {
  const videoSrc = hero.videoSrc

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-paizao-bg">
      {/* Vídeo em loop (ativo quando videoSrc estiver configurado) */}
      {videoSrc ? (
        <>
          <video
            className="absolute inset-0 w-full h-full object-cover z-0"
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-paizao-bg/80 z-[1]" />
        </>
      ) : (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_55%,rgba(0,69,38,0.22),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_20%,rgba(0,69,38,0.10),transparent_50%)]" />
        </div>
      )}

      {/* Logo gigante em background — watermark centralizada */}
      <div className="absolute inset-0 z-[1] flex items-center justify-center overflow-hidden pointer-events-none" aria-hidden>
        <motion.div
          className="relative w-[950px] h-[950px] opacity-[0.11]"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Image src={tenant.logoSrc} alt="" fill className="object-contain" />
        </motion.div>
      </div>

      {/* Grade urbana */}
      <div
        className="absolute inset-0 z-[2] opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="z-[3] absolute inset-0">
        <StreetNoise />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-32 grid lg:grid-cols-2 gap-12 items-center w-full z-10">
        {/* Coluna esquerda — texto */}
        <div>
          <FadeIn delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-paizao-gold text-paizao-bg text-[10px] font-black tracking-[0.4em] uppercase mb-8 rounded-sm">
              <Zap className="w-3 h-3" />
              {hero.badge}
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1
              className="text-[clamp(4.5rem,13vw,9rem)] leading-[0.85] tracking-tight text-paizao-ink"
              style={{ fontFamily: 'var(--font-bebas-neue), sans-serif' }}
            >
              {hero.titulo}
              <br />
              <span className="text-paizao-gold">{hero.tituloAccent}</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mt-6 text-paizao-ink-dim text-lg max-w-lg leading-relaxed border-l-2 border-paizao-gold pl-4">
              {hero.descricao}
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <motion.a
                href={hero.ctaPrimario.href}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-paizao-gold text-paizao-bg font-extrabold text-base tracking-wide rounded-sm hover:bg-paizao-gold-bright transition-colors"
              >
                {hero.ctaPrimario.label}
                <ArrowRight className="w-5 h-5" />
              </motion.a>
              <Link
                href={hero.ctaSecundario.href}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-paizao-gold/40 text-paizao-ink font-bold text-base tracking-wide rounded-sm hover:bg-paizao-gold/10 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-paizao-gold" />
                {hero.ctaSecundario.label}
              </Link>
            </div>
          </FadeIn>

          {/* Stats */}
          <FadeIn delay={0.4}>
            <div className="mt-14 grid grid-cols-3 gap-px bg-paizao-gold/10">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className="p-4 bg-paizao-bg border border-paizao-gold/15 backdrop-blur-sm"
                  style={{ borderLeftColor: i === 0 ? 'var(--color-paizao-gold)' : undefined, borderLeftWidth: i === 0 ? 2 : undefined }}
                >
                  <p
                    className="text-3xl sm:text-4xl text-paizao-gold"
                    style={{ fontFamily: 'var(--font-bebas-neue), sans-serif' }}
                  >
                    <AnimatedCounter target={s.valor} suffix={s.sufixo} />
                  </p>
                  <p className="text-[9px] text-paizao-ink-dim uppercase tracking-[0.25em] mt-1 font-bold leading-tight">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Coluna direita — logo */}
        <FadeIn delay={0.3} direction="left" className="hidden lg:flex justify-center items-center relative">
          <StreetEmblem />
        </FadeIn>
      </div>

      {/* Indicador de scroll */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-[9px] uppercase tracking-[0.4em] text-paizao-gold font-bold">scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-paizao-gold to-transparent" />
      </motion.div>
    </section>
  )
}
