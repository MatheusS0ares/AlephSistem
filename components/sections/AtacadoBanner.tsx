'use client'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FadeIn } from '@/components/motion/FadeIn'
import { Sparkles, TrendingUp } from 'lucide-react'
import { getTenant } from '@/tenants'

const tenant = getTenant()
const { atacado, contato } = tenant

function Counter({ value, suffix, prefix }: { value: number; suffix: string; prefix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame: number
    let start: number | null = null

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const animate = (ts: number) => {
            if (!start) start = ts
            const progress = Math.min((ts - start) / 1500, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * value))
            if (progress < 1) frame = requestAnimationFrame(animate)
          }
          frame = requestAnimationFrame(animate)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [value])

  return <div ref={ref}>{count}{suffix}</div>
}

export function AtacadoBanner() {
  return (
    <section className="relative py-32 overflow-hidden bg-paizao-navy-deep">
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg-2.jpeg"
          alt="Atacado Background"
          fill
          className="object-cover object-center opacity-30 mix-blend-screen scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-paizao-navy-deep via-paizao-navy-deep/80 to-paizao-navy-deep/40" />
        <div className="absolute inset-0 bg-gradient-to-l from-paizao-navy-deep/90 via-transparent to-paizao-navy-deep/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(212,169,58,0.1),transparent_70%)] mix-blend-color-dodge" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-paizao-gold/10 border border-paizao-gold/20 mb-8 backdrop-blur-md">
              <TrendingUp className="w-4 h-4 text-paizao-gold" />
              <span className="text-xs font-black tracking-[0.3em] uppercase text-paizao-gold drop-shadow-md">
                {atacado.badge}
              </span>
            </div>

            <h2
              className="text-[clamp(3rem,8vw,5rem)] text-transparent bg-clip-text bg-gradient-to-r from-white via-paizao-gold-soft to-white/40 leading-[0.9] drop-shadow-2xl"
              style={{ fontFamily: 'var(--font-bebas-neue), sans-serif' }}
            >
              {atacado.titulo}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-paizao-gold to-paizao-gold-bright drop-shadow-[0_0_15px_rgba(212,169,58,0.3)]">
                {atacado.tituloAccent}
              </span>
            </h2>

            <p className="mt-8 text-white/80 text-lg leading-relaxed max-w-md font-light backdrop-blur-sm bg-black/20 p-5 rounded-2xl border border-white/5">
              {atacado.descricao}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-5">
              <Link
                href={atacado.ctaPrimario.href}
                className="group relative inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-paizao-gold to-paizao-gold-bright text-paizao-navy font-black text-sm uppercase tracking-widest overflow-hidden hover:shadow-[0_0_30px_rgba(212,169,58,0.5)] transition-all"
              >
                <div className="absolute inset-0 bg-white/30 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {atacado.ctaPrimario.label}
                </span>
              </Link>

              <a
                href={`https://wa.me/${contato.whatsapp}?text=${atacado.whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-white/10 text-white font-bold text-sm uppercase tracking-widest hover:bg-white/10 hover:border-paizao-gold/50 transition-all backdrop-blur-md"
              >
                Falar com Consultor
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} direction="left">
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6 relative">
              <div className="absolute inset-0 bg-paizao-gold/5 blur-[100px] rounded-full pointer-events-none" />

              {atacado.contadores.map((c) => (
                <div
                  key={c.label}
                  className="group flex flex-col sm:flex-row lg:flex-row items-center sm:items-start lg:items-center gap-6 p-6 rounded-[2rem] bg-black/40 border border-white/10 backdrop-blur-xl hover:bg-black/60 hover:border-paizao-gold/40 transition-all duration-300 shadow-xl"
                >
                  <div className="text-center sm:text-left shrink-0">
                    <p className="text-[10px] text-paizao-gold font-bold uppercase tracking-[0.2em] mb-1">
                      {c.prefixo}
                    </p>
                    <p
                      className="text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 group-hover:from-paizao-gold-bright group-hover:to-paizao-gold-soft drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:drop-shadow-[0_0_20px_rgba(212,169,58,0.5)] transition-all"
                      style={{ fontFamily: 'var(--font-bebas-neue), sans-serif' }}
                    >
                      <Counter value={c.valor} suffix={c.sufixo} prefix={c.prefixo} />
                    </p>
                  </div>
                  <div className="w-px h-12 bg-white/10 hidden sm:block" />
                  <p className="text-sm text-white/80 font-medium tracking-wide text-center sm:text-left leading-relaxed">
                    {c.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
