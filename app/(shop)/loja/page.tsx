import type { Metadata } from 'next'
import Link from 'next/link'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { ProductCard } from '@/components/shop/ProductCard'
import { categorias } from '@/lib/data/produtos'
import { getProdutos } from '@/lib/firebase/produtos-db'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Loja — Moda Masculina',
  description: 'Explore toda a coleção da Paizão Modas. Camisetas, conjuntos, bermudas, polos e muito mais.',
}

export default async function LojaPage() {
  const produtos = await getProdutos()

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <FadeIn>
          <h1
            className="text-[clamp(2.5rem,6vw,4rem)] text-paizao-ink"
            style={{ fontFamily: 'var(--font-bebas-neue), sans-serif' }}
          >
            TODA A COLEÇÃO
          </h1>
          <p className="text-paizao-ink-dim mt-2 mb-8">
            {produtos.length} peças disponíveis
          </p>
        </FadeIn>

        {/* Category chips */}
        <FadeIn delay={0.1}>
          <div className="flex flex-wrap gap-2 mb-10">
            <Link
              href="/loja"
              className="px-4 py-2 rounded-full text-sm font-medium bg-paizao-gold text-paizao-navy"
            >
              Todos
            </Link>
            {categorias.map((cat) => (
              <Link
                key={cat.id}
                href={`/loja/${cat.slug}`}
                className="px-4 py-2 rounded-full text-sm font-medium bg-paizao-surface border border-paizao-surface-2 text-paizao-ink-dim hover:border-paizao-gold/40 hover:text-paizao-ink transition-all"
              >
                {cat.icone} {cat.nome}
              </Link>
            ))}
          </div>
        </FadeIn>

        {/* Product grid */}
        <StaggerChildren className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {produtos.map((produto) => (
            <StaggerItem key={produto.id}>
              <ProductCard produto={produto} />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </div>
  )
}
