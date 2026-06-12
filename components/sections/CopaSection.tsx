import Link from 'next/link'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { ProductCard } from '@/components/shop/ProductCard'
import { getProdutos } from '@/lib/firebase/produtos-db'
import { Sparkles, Trophy, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { getTenant } from '@/tenants'

export async function CopaSection() {
  const { colecaoDestaque: cd } = getTenant()
  const todos = await getProdutos()
  const copaProducts = todos.filter((p) => p.badge === 'Copa')

  return (
    <section className="relative py-32 overflow-hidden bg-paizao-navy-deep">
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg-4.jpeg"
          alt="Copa do Mundo Background"
          fill
          className="object-cover object-[center_top] opacity-25 mix-blend-luminosity scale-105"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#011406]/90 via-[#02240a]/80 to-[#011406]/95"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,156,59,0.3),transparent_60%)] pointer-events-none mix-blend-color-dodge"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,223,0,0.2),transparent_50%)] pointer-events-none mix-blend-color-dodge"
          aria-hidden="true"
        />
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 z-10">
        <ScrollReveal>
          <div className="text-center mb-16 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(0,156,59,0.4)]">
              <Trophy className="w-4 h-4 text-paizao-yellow" />
              <span className="text-xs font-black tracking-[0.3em] uppercase text-paizao-yellow drop-shadow-md">
                {cd.badge}
              </span>
              <Sparkles className="w-4 h-4 text-paizao-yellow" />
            </div>

            <h2
              className="mt-2 text-[clamp(3.5rem,8vw,6rem)] text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/40 leading-[0.9] drop-shadow-2xl"
              style={{ fontFamily: 'var(--font-bebas-neue), sans-serif' }}
            >
              {cd.titulo}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-paizao-green via-paizao-yellow to-paizao-green drop-shadow-[0_0_20px_rgba(0,156,59,0.6)]">
                {cd.tituloAccent}
              </span>
            </h2>

            <p className="mt-6 text-white/80 max-w-2xl mx-auto text-lg leading-relaxed font-light backdrop-blur-sm bg-black/20 p-5 rounded-2xl border border-white/5 shadow-xl">
              {cd.descricao}
            </p>
          </div>
        </ScrollReveal>

        {copaProducts.length > 0 ? (
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {copaProducts.map((produto) => (
              <StaggerItem key={produto.id}>
                <ProductCard produto={produto} />
              </StaggerItem>
            ))}
          </StaggerChildren>
        ) : (
          <div className="text-center p-12 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
            <Sparkles className="w-12 h-12 text-paizao-gold mx-auto mb-4 opacity-70 animate-pulse" />
            <p className="text-2xl text-paizao-gold font-bold tracking-wide">Grandes novidades em breve...</p>
          </div>
        )}

        <div className="mt-16 text-center flex justify-center">
          <Link
            href={cd.ctaHref}
            className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl border border-paizao-green/40 bg-black/40 text-white font-bold uppercase tracking-widest overflow-hidden hover:bg-paizao-green/20 hover:border-paizao-green transition-all shadow-[0_0_20px_rgba(0,156,59,0.2)] hover:shadow-[0_0_30px_rgba(0,156,59,0.4)] backdrop-blur-md"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-paizao-yellow/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12" />
            <span className="relative z-10 flex items-center gap-2">
              {cd.ctaLabel}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
