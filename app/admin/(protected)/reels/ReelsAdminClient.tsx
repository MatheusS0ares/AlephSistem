'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Star, Trash2, Plus, Edit2, Eye, EyeOff } from 'lucide-react'
import type { ReelDestaque } from '@/lib/firebase/reels-db'

async function apiPost(data: Record<string, unknown>) {
  const res = await fetch('/api/reels', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

async function apiPatch(id: string, data: Record<string, unknown>) {
  const res = await fetch('/api/reels', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...data }),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

async function apiDelete(id: string) {
  const res = await fetch('/api/reels', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export function ReelsAdminClient({ initialReels }: { initialReels: ReelDestaque[] }) {
  const [reels, setReels] = useState(initialReels)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<ReelDestaque | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleToggleDestaque(id: string, current: boolean) {
    startTransition(async () => {
      await apiPatch(id, { destaque: !current })
      setReels((prev) => prev.map((r) => (r.id === id ? { ...r, destaque: !current } : r)))
    })
  }

  function handleToggleAtivo(id: string, current: boolean) {
    startTransition(async () => {
      await apiPatch(id, { ativo: !current })
      setReels((prev) => prev.map((r) => (r.id === id ? { ...r, ativo: !current } : r)))
    })
  }

  function handleDelete(id: string, nome: string) {
    if (!confirm(`Excluir "${nome}"?`)) return
    startTransition(async () => {
      await apiDelete(id)
      setReels((prev) => prev.filter((r) => r.id !== id))
    })
  }

  return (
    <div>
      <button
        onClick={() => { setEditing(null); setShowForm(true) }}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-paizao-gold text-paizao-navy font-bold rounded-lg hover:bg-paizao-gold-bright transition text-sm"
      >
        <Plus size={16} />
        Adicionar Reel
      </button>

      {reels.length === 0 && (
        <p className="text-paizao-ink-dim text-sm py-12 text-center">
          Nenhum Reel cadastrado.{' '}
          <button
            onClick={() => { setEditing(null); setShowForm(true) }}
            className="text-paizao-gold hover:underline"
          >
            Adicionar o primeiro →
          </button>
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reels.map((reel) => (
          <div
            key={reel.id}
            className={`relative border rounded-xl overflow-hidden ${
              reel.ativo ? 'border-paizao-surface-2' : 'border-paizao-red/30 opacity-60'
            }`}
          >
            <div className="relative aspect-[4/5] bg-paizao-surface-2">
              <Image
                src={reel.thumbnail}
                alt={reel.thumbnailAlt}
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {reel.destaque && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-paizao-gold text-paizao-navy text-[10px] font-bold rounded flex items-center gap-1">
                  <Star size={11} fill="currentColor" />
                  Destaque
                </div>
              )}
              {!reel.ativo && (
                <div className="absolute inset-0 bg-paizao-navy-deep/60 flex items-center justify-center">
                  <span className="text-white font-bold uppercase text-sm">Inativo</span>
                </div>
              )}
            </div>

            <div className="p-3 bg-paizao-surface">
              <p className="font-semibold text-sm mb-1 truncate text-paizao-ink">
                {reel.titulo ?? <span className="text-paizao-ink-dim italic">Sem título</span>}
              </p>
              <p className="text-[11px] text-paizao-ink-dim mb-3">Ordem: {reel.ordem}</p>
              <div className="flex gap-2 flex-wrap">
                <button
                  disabled={isPending}
                  onClick={() => handleToggleDestaque(reel.id, reel.destaque)}
                  title={reel.destaque ? 'Remover destaque' : 'Marcar como destaque'}
                  className={`p-1.5 rounded text-xs border transition-colors ${
                    reel.destaque
                      ? 'bg-paizao-gold text-paizao-navy border-paizao-gold'
                      : 'bg-paizao-surface-2 text-paizao-ink-dim border-paizao-surface-2 hover:border-paizao-gold/40'
                  }`}
                >
                  <Star size={13} fill={reel.destaque ? 'currentColor' : 'none'} />
                </button>
                <button
                  disabled={isPending}
                  onClick={() => handleToggleAtivo(reel.id, reel.ativo)}
                  title={reel.ativo ? 'Desativar' : 'Ativar'}
                  className="p-1.5 rounded border bg-paizao-surface-2 text-paizao-ink-dim border-paizao-surface-2 hover:border-paizao-gold/40 transition-colors"
                >
                  {reel.ativo ? <Eye size={13} /> : <EyeOff size={13} />}
                </button>
                <button
                  onClick={() => { setEditing(reel); setShowForm(true) }}
                  title="Editar"
                  className="p-1.5 rounded border bg-paizao-surface-2 text-paizao-ink-dim border-paizao-surface-2 hover:border-paizao-gold/40 transition-colors"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  disabled={isPending}
                  onClick={() => handleDelete(reel.id, reel.titulo ?? 'este reel')}
                  title="Excluir"
                  className="p-1.5 rounded border bg-paizao-red/10 text-paizao-red border-paizao-red/20 hover:bg-paizao-red/20 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <ReelFormModal
          reel={editing}
          nextOrdem={reels.length + 1}
          onClose={() => setShowForm(false)}
          onSaved={(newReel) => {
            if (editing) {
              setReels((prev) => prev.map((r) => (r.id === editing.id ? newReel : r)))
            } else {
              setReels((prev) => [...prev, newReel])
              router.refresh()
            }
            setShowForm(false)
          }}
        />
      )}
    </div>
  )
}

function ReelFormModal({
  reel,
  nextOrdem,
  onClose,
  onSaved,
}: {
  reel: ReelDestaque | null
  nextOrdem: number
  onClose: () => void
  onSaved: (saved: ReelDestaque) => void
}) {
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(reel?.thumbnail ?? '')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const fd = new FormData(e.currentTarget)
    const payload = {
      thumbnail: fd.get('thumbnail') as string,
      thumbnailAlt: fd.get('thumbnailAlt') as string,
      titulo: (fd.get('titulo') as string) || null,
      instagramUrl: fd.get('instagramUrl') as string,
      destaque: fd.get('destaque') === 'on',
      ordem: Number(fd.get('ordem') ?? nextOrdem),
      ativo: true,
    }

    try {
      if (reel) {
        await apiPatch(reel.id, payload)
        onSaved({ ...reel, ...payload })
      } else {
        const { id } = await apiPost(payload)
        onSaved({ ...payload, id, criadoEm: Date.now() } as ReelDestaque)
      }
    } catch (err) {
      console.error(err)
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-paizao-surface border border-paizao-surface-2 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-paizao-ink mb-5">
          {reel ? 'Editar Reel' : 'Novo Reel'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-paizao-ink mb-1">
              URL da imagem (capa do Reel) *
            </label>
            <input
              type="url"
              name="thumbnail"
              defaultValue={reel?.thumbnail ?? ''}
              required
              placeholder="https://i.ibb.co/..."
              onChange={(e) => setPreview(e.target.value)}
              className="w-full px-3 py-2 bg-paizao-bg border border-paizao-surface-2 rounded-lg text-sm text-paizao-ink placeholder-paizao-ink-dim focus:outline-none focus:border-paizao-gold/60"
            />
            <p className="text-[11px] text-paizao-ink-dim mt-1">
              Proporção ideal: 4:5 (screenshot do Reel)
            </p>
            {preview && (
              <div className="mt-2 relative w-24 h-32 rounded overflow-hidden border border-paizao-surface-2">
                <Image src={preview} alt="Preview" fill unoptimized className="object-cover" sizes="96px" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-paizao-ink mb-1">
              Descrição da imagem *
            </label>
            <input
              type="text"
              name="thumbnailAlt"
              defaultValue={reel?.thumbnailAlt ?? ''}
              required
              placeholder="Ex: Camisa Brasil retro com bermuda jeans"
              className="w-full px-3 py-2 bg-paizao-bg border border-paizao-surface-2 rounded-lg text-sm text-paizao-ink placeholder-paizao-ink-dim focus:outline-none focus:border-paizao-gold/60"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-paizao-ink mb-1">Titulo</label>
            <input
              type="text"
              name="titulo"
              defaultValue={reel?.titulo ?? ''}
              placeholder="Ex: Colecao Copa 2026"
              className="w-full px-3 py-2 bg-paizao-bg border border-paizao-surface-2 rounded-lg text-sm text-paizao-ink placeholder-paizao-ink-dim focus:outline-none focus:border-paizao-gold/60"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-paizao-ink mb-1">
              Link do Reel no Instagram *
            </label>
            <input
              type="url"
              name="instagramUrl"
              defaultValue={reel?.instagramUrl ?? 'https://instagram.com/paizaomodas2'}
              required
              placeholder="https://instagram.com/p/..."
              className="w-full px-3 py-2 bg-paizao-bg border border-paizao-surface-2 rounded-lg text-sm text-paizao-ink placeholder-paizao-ink-dim focus:outline-none focus:border-paizao-gold/60"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-paizao-ink mb-1">Ordem</label>
            <input
              type="number"
              name="ordem"
              defaultValue={reel?.ordem ?? nextOrdem}
              min={1}
              className="w-24 px-3 py-2 bg-paizao-bg border border-paizao-surface-2 rounded-lg text-sm text-paizao-ink focus:outline-none focus:border-paizao-gold/60"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="destaque"
              defaultChecked={reel?.destaque ?? false}
              className="w-4 h-4 accent-paizao-gold"
            />
            <span className="text-sm text-paizao-ink">Marcar como destaque (aparece primeiro)</span>
          </label>

          {error && (
            <p className="text-xs text-paizao-red bg-paizao-red/10 px-3 py-2 rounded border border-paizao-red/20 break-all">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-paizao-gold text-paizao-navy font-bold rounded-lg text-sm disabled:opacity-50 hover:bg-paizao-gold-bright transition"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-paizao-surface-2 rounded-lg text-sm text-paizao-ink-dim hover:border-paizao-gold/30 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
