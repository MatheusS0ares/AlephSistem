import Link from 'next/link'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { ProductCard } from '@/components/shop/ProductCard'
import { getProdutosDestaque } from '@/lib/firebase/produtos-db'
import Image from 'next/image'

export async function BestSellers() {
  const produtosDestaque = await getProdutosDestaque()

  return (
    <section className="relative py-32 overflow-hidden bg-paizao-navy-deep">
      {/* Immersive Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg-1.jpeg"
          alt="Destaques Background"
          fill
          className="object-cover object-center opacity-40 mix-blend-luminosity scale-105"
        />
        {/* Luxury Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-paizao-navy-deep via-paizao-navy-deep/70 to-paizao-navy-deep" />
        <div className="absolute inset-0 bg-gradient-to-r from-paizao-navy-deep via-transparent to-paizao-navy-deep" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,169,58,0.15),transparent_70%)] mix-blend-color-dodge" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 z-10">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-8 h-[2px] bg-paizao-gold" />
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-paizao-gold">
                  Coleção Premium
                </span>
              </div>
              <h2
                className="text-[clamp(3rem,8vw,5.5rem)] text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50 leading-[0.9] drop-shadow-2xl"
                style={{ fontFamily: 'var(--font-bebas-neue), sans-serif' }}
              >
                MAIS VENDIDOS
              </h2>
            </div>
            <Link
              href="/loja"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-paizao-gold/30 text-paizao-gold font-bold uppercase tracking-widest hover:bg-paizao-gold hover:text-paizao-navy transition-all duration-300 shadow-[0_0_20px_rgba(212,169,58,0.1)] hover:shadow-[0_0_30px_rgba(212,169,58,0.4)] backdrop-blur-sm"
            >
              Ver Todos
            </Link>
          </div>
        </FadeIn>

        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {produtosDestaque.map((produto) => (
            <StaggerItem key={produto.id}>
              <ProductCard produto={produto} />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
