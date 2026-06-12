import { notFound } from 'next/navigation'
import { ProductForm } from '@/components/admin/ProductForm'
import { getProdutos } from '@/lib/firebase/produtos-db'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditarProdutoPage({ params }: PageProps) {
  const { id } = await params
  const todos = await getProdutos()
  const produto = todos.find((p) => p.id === id)

  if (!produto) notFound()

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-paizao-ink mb-6">Editar produto</h1>
      <ProductForm produto={produto} />
    </div>
  )
}
