import { ProductForm } from '@/components/admin/ProductForm'

export default function NovoProdutoPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-paizao-ink mb-6">Novo produto</h1>
      <ProductForm />
    </div>
  )
}
