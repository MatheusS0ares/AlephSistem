import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProdutoBySlug, getProdutosByCategoria } from '@/lib/firebase/produtos-db'
import { ProdutoPageClient } from '@/components/shop/ProdutoPageClient'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const produto = await getProdutoBySlug(slug)
  if (!produto) return {}
  return {
    title: `${produto.nome} — Paizão Modas`,
    description: produto.descricao,
  }
}

export default async function ProdutoPage({ params }: PageProps) {
  const { slug } = await params
  const produto = await getProdutoBySlug(slug)
  if (!produto) notFound()

  const relacionados = (await getProdutosByCategoria(produto.categoria))
    .filter((p) => p.id !== produto.id)
    .slice(0, 4)

  return <ProdutoPageClient produto={produto} relacionados={relacionados} />
}
