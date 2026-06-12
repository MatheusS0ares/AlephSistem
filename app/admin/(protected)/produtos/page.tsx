import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil } from 'lucide-react'
import { getProdutos } from '@/lib/firebase/produtos-db'
import { formatPrice } from '@/lib/utils'
import { DeleteProduto } from '@/components/admin/DeleteProduto'

export const dynamic = 'force-dynamic'

export default async function AdminProdutosPage() {
  const prods = await getProdutos()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-paizao-ink">Produtos</h1>
          <p className="text-paizao-ink-dim text-sm mt-0.5">{prods.length} cadastrados</p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-paizao-gold text-paizao-navy font-bold text-sm hover:bg-paizao-gold-bright transition-colors"
        >
          <Plus size={16} />
          Novo produto
        </Link>
      </div>

      <div className="rounded-xl border border-paizao-surface-2 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-paizao-surface-2">
            <tr>
              <th className="text-left px-4 py-3 text-paizao-ink-dim font-medium">Produto</th>
              <th className="text-left px-4 py-3 text-paizao-ink-dim font-medium hidden sm:table-cell">
                Categoria
              </th>
              <th className="text-left px-4 py-3 text-paizao-ink-dim font-medium">Preço</th>
              <th className="text-left px-4 py-3 text-paizao-ink-dim font-medium hidden md:table-cell">
                Estoque
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-paizao-surface-2 bg-paizao-surface">
            {prods.map((p) => (
              <tr key={p.id} className="hover:bg-paizao-surface-2 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-12 rounded overflow-hidden shrink-0 bg-paizao-surface-2">
                      <Image
                        src={p.imagem}
                        alt={p.nome}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div>
                      <p className="text-paizao-ink font-medium leading-tight">{p.nome}</p>
                      {p.badge && (
                        <span className="text-[10px] text-paizao-gold">{p.badge}</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-paizao-ink-dim capitalize hidden sm:table-cell">
                  {p.categoria}
                </td>
                <td className="px-4 py-3 text-paizao-gold font-semibold">{formatPrice(p.preco)}</td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span
                    className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                      p.estoque
                        ? 'bg-paizao-green/15 text-paizao-green'
                        : 'bg-paizao-red/15 text-paizao-red'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {p.estoque ? 'Disponível' : 'Indisponível'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <Link
                      href={`/admin/produtos/${p.id}`}
                      className="p-1.5 rounded text-paizao-ink-dim hover:text-paizao-gold hover:bg-paizao-gold/10 transition-colors"
                      aria-label="Editar"
                    >
                      <Pencil size={15} />
                    </Link>
                    <DeleteProduto id={p.id} nome={p.nome} />
                  </div>
                </td>
              </tr>
            ))}
            {prods.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-paizao-ink-dim">
                  Nenhum produto cadastrado.{' '}
                  <Link href="/admin/produtos/novo" className="text-paizao-gold hover:underline">
                    Criar o primeiro →
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
