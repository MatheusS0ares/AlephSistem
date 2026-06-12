import Link from 'next/link'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { ProductCard } from '@/components/shop/ProductCard'
import { getProdutos } from '@/lib/firebase/produtos-db'
import { Crown, Sparkles, ArrowRight } from 'lucide-react'
import { getTenant } from '@/tenants'

export async function LuxoShowcase() {
  const { colecaoDestaque: cd } = getTenant()
  const todos = await getProdutos()
  // Curadoria premium: prioriza lançamentos/destaques, com fallback nos primeiros.
  const destaque = todos.filter((p) => p.badge === 'Novo' || p.badge === 'Hot' || p.destaque)
  const showcase = (destaque.length > 0 ? destaque : todos).slice(0, 4)

  return (
    <section className="relative py-32 overflow-hidden bg-paizao-bg">
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.14),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(212,175,55,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 z-10">
        <ScrollReveal>
          <div className="text-center mb-16 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-paizao-gold/25 mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.25)]">
              <Crown className="w-4 h-4 text-paizao-gold" />
              <span className="text-xs font-black tracking-[0.3em] uppercase text-paizao-gold">
                {cd.badge}
              </span>
              <Sparkles className="w-4 h-4 text-paizao-gold" />
            </div>

            <h2
              className="mt-2 text-[clamp(3.5rem,8vw,6rem)] text-paizao-ink leading-[0.9] drop-shadow-2xl"
              style={{ fontFamily: 'var(--font-bebas-neue), sans-serif' }}
            >
              {cd.titulo}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-paizao-gold-bright via-paizao-gold to-paizao-gold-soft drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">
                {cd.tituloAccent}
              </span>
            </h2>

            <p className="mt-6 text-paizao-ink/75 max-w-2xl mx-auto text-lg leading-relaxed font-light backdrop-blur-sm bg-black/20 p-5 rounded-2xl border border-paizao-gold/10 shadow-xl">
              {cd.descricao}
            </p>
          </div>
        </ScrollReveal>

        {showcase.length > 0 ? (
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {showcase.map((produto) => (
              <StaggerItem key={produto.id}>
                <ProductCard produto={produto} />
              </StaggerItem>
            ))}
          </StaggerChildren>
        ) : (
          <div className="text-center p-12 rounded-3xl border border-paizao-gold/10 bg-black/40 backdrop-blur-xl shadow-2xl">
            <Sparkles className="w-12 h-12 text-paizao-gold mx-auto mb-4 opacity-70 animate-pulse" />
            <p className="text-2xl text-paizao-gold font-bold tracking-wide">Novos drops chegando em breve...</p>
          </div>
        )}

        <div className="mt-16 text-center flex justify-center">
          <Link
            href={cd.ctaHref}
            className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl border border-paizao-gold/40 bg-black/40 text-paizao-ink font-bold uppercase tracking-widest overflow-hidden hover:bg-paizao-gold/15 hover:border-paizao-gold transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] backdrop-blur-md"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-paizao-gold/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12" />
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
