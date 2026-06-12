import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { ProductCard } from '@/components/shop/ProductCard'
import { getProdutosByCategoria } from '@/lib/firebase/produtos-db'
import { getTenant } from '@/tenants'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ categoria: string }>
}

export async function generateStaticParams() {
  return getTenant().categorias.map((cat) => ({ categoria: cat.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categoria } = await params
  const t = getTenant()
  const cat = t.categorias.find((c) => c.slug === categoria)
  if (!cat) return {}
  return {
    title: `${cat.nome} — ${t.nome}`,
    description: `Confira a seleção de ${cat.nome.toLowerCase()} na ${t.nome}.`,
  }
}

export default async function CategoriaPage({ params }: PageProps) {
  const { categoria } = await params
  const cat = getTenant().categorias.find((c) => c.slug === categoria)
  if (!cat) notFound()

  const prods = await getProdutosByCategoria(categoria)

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <FadeIn>
          <nav className="text-sm text-paizao-ink-dim mb-6" aria-label="Breadcrumb">
            <Link href="/loja" className="hover:text-paizao-gold transition-colors">
              Loja
            </Link>
            <span className="mx-2">/</span>
            <span className="text-paizao-ink">{cat.nome}</span>
          </nav>

          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{cat.icone}</span>
            <h1
              className="text-[clamp(2rem,5vw,3.5rem)] text-paizao-ink"
              style={{ fontFamily: 'var(--font-bebas-neue), sans-serif' }}
            >
              {cat.nome.toUpperCase()}
            </h1>
          </div>
          <p className="text-paizao-ink-dim mb-10">
            {prods.length > 0
              ? `${prods.length} ${prods.length === 1 ? 'peça disponível' : 'peças disponíveis'}`
              : 'Novidades chegando em breve'}
          </p>
        </FadeIn>

        {prods.length > 0 ? (
          <StaggerChildren className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {prods.map((produto) => (
              <StaggerItem key={produto.id}>
                <ProductCard produto={produto} />
              </StaggerItem>
            ))}
          </StaggerChildren>
        ) : (
          <FadeIn>
            <div className="text-center py-24">
              <p className="text-6xl mb-4">{cat.icone}</p>
              <p className="text-paizao-ink-dim text-lg">
                Novidades chegando em breve para esta categoria!
              </p>
              <Link
                href="/loja"
                className="mt-6 inline-block text-sm text-paizao-gold border border-paizao-gold/30 px-6 py-3 rounded-lg hover:bg-paizao-gold/10 transition-colors"
              >
                Ver todos os produtos
              </Link>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  )
}
