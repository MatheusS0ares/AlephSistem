'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { deletarProduto } from '@/lib/firebase/produtos-client'

interface DeleteProdutoProps {
  id: string
  nome: string
}

export function DeleteProduto({ id, nome }: DeleteProdutoProps) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deletarProduto(id)
      router.refresh()
    } catch {
      setLoading(false)
      setConfirming(false)
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs px-2 py-1 rounded bg-paizao-red text-white font-bold disabled:opacity-50"
        >
          {loading ? '...' : 'Confirmar'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs px-2 py-1 rounded border border-paizao-surface-2 text-paizao-ink-dim"
        >
          Não
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="p-1.5 rounded text-paizao-ink-dim hover:text-paizao-red hover:bg-paizao-red/10 transition-colors"
      aria-label={`Deletar ${nome}`}
    >
      <Trash2 size={15} />
    </button>
  )
}
