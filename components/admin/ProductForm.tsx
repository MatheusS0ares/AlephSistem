'use client'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ImageUpload } from './ImageUpload'
import { criarProduto, atualizarProduto } from '@/lib/firebase/produtos-client'
import { categorias } from '@/lib/data/produtos'
import { cn } from '@/lib/utils'
import type { Produto } from '@/lib/data/produtos'

const BADGES = ['Novo', 'Copa', 'Sale', 'Hot'] as const
const TAMANHOS_ROUPA = ['PP', 'P', 'M', 'G', 'GG', 'XGG']
const TAMANHOS_CALCADO = ['38', '39', '40', '41', '42', '43', '44']

const schema = z.object({
  nome: z.string().min(3, 'Mínimo 3 caracteres'),
  descricao: z.string().min(10, 'Mínimo 10 caracteres'),
  preco: z.number().positive('Preço deve ser positivo'),
  precoOriginal: z.number().positive('Preço deve ser positivo').optional(),
  categoria: z.string().min(1, 'Selecione uma categoria'),
  tamanhos: z.array(z.string()).min(1, 'Selecione ao menos um tamanho'),
  imagem: z.string().refine(
    (v) => v === '' || v.split(',').map(s => s.trim()).filter(Boolean).every(u => { try { new URL(u); return true } catch { return false } }),
    'Uma ou mais URLs são inválidas'
  ),
  badge: z.enum(['Novo', 'Copa', 'Sale', 'Hot']).optional(),
  destaque: z.boolean(),
  estoque: z.boolean(),
})

type FormData = z.infer<typeof schema>

interface ProductFormProps {
  produto?: Produto
}

export function ProductForm({ produto }: ProductFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(
    () => (produto?.imagens ?? (produto?.imagem ? [produto.imagem] : []))
  )

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: produto?.nome ?? '',
      descricao: produto?.descricao ?? '',
      preco: produto?.preco ?? 0,
      precoOriginal: produto?.precoOriginal,
      categoria: produto?.categoria ?? '',
      tamanhos: produto?.tamanhos ?? [],
      imagem: produto?.imagens?.join(', ') ?? produto?.imagem ?? '',
      badge: produto?.badge,
      destaque: produto?.destaque ?? false,
      estoque: produto?.estoque ?? true,
    },
  })

  const tamanhosSelecionados = watch('tamanhos')

  const handleFileUpload = async (file: File, index: number) => {
    setUploading(true)
    setError(null)
    try {
      const { uploadProdutoImage } = await import('@/lib/firebase/storage')
      const url = await uploadProdutoImage(file)
      const updated = [...uploadedUrls]
      updated[index] = url
      setUploadedUrls(updated)
      setValue('imagem', updated.filter(Boolean).join(', '), { shouldValidate: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar imagem')
    } finally {
      setUploading(false)
    }
  }

  const handleClearImage = (index: number) => {
    const updated = uploadedUrls.filter((_, i) => i !== index)
    setUploadedUrls(updated)
    setValue('imagem', updated.filter(Boolean).join(', '), { shouldValidate: true })
  }

  const addSlot = () => setUploadedUrls((prev) => [...prev, ''])

  const onSubmit = async (data: FormData) => {
    setSaving(true)
    setError(null)
    const imagens = data.imagem.split(',').map(s => s.trim()).filter(Boolean)
    const imagem = imagens[0] ?? ''
    try {
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout: Firestore não respondeu em 10s. Verifique as regras do banco.')), 10000)
      )
      const save = produto?.id
        ? atualizarProduto(produto.id, { ...data, imagem, imagens })
        : criarProduto({ ...data, imagem, imagens, cores: [] })
      await Promise.race([save, timeout])
      router.push('/admin/produtos')
      router.refresh()
    } catch (err) {
      console.error('[ProductForm] erro ao salvar:', err)
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  const inputCls =
    'w-full px-4 py-2.5 rounded-lg bg-paizao-surface border border-paizao-surface-2 text-paizao-ink placeholder:text-paizao-ink-dim/50 focus:outline-none focus:border-paizao-gold/50 transition-colors text-sm'

  const Field = ({
    label,
    error,
    children,
  }: {
    label: string
    error?: string
    children: React.ReactNode
  }) => (
    <div>
      <label className="text-sm font-medium text-paizao-ink-dim mb-1.5 block">{label}</label>
      {children}
      {error && <p className="text-paizao-red text-xs mt-1">{error}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {error && (
        <div className="p-3 rounded-lg bg-paizao-red/10 border border-paizao-red/30 text-paizao-red text-sm">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-6">
        <Field label="Nome *" error={errors.nome?.message}>
          <input
            {...register('nome')}
            placeholder="Ex: Camiseta Brasil Copa 2026"
            className={inputCls}
          />
        </Field>

        <Field label="Categoria *" error={errors.categoria?.message}>
          <select {...register('categoria')} className={inputCls}>
            <option value="">Selecione...</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Descrição *" error={errors.descricao?.message}>
        <textarea
          {...register('descricao')}
          rows={3}
          placeholder="Descreva o produto..."
          className={cn(inputCls, 'resize-none')}
        />
      </Field>

      <div className="grid sm:grid-cols-2 gap-6">
        <Field label="Preço (R$) *" error={errors.preco?.message}>
          <input
            {...register('preco', { valueAsNumber: true })}
            type="number"
            step="0.01"
            placeholder="0.00"
            className={inputCls}
          />
        </Field>

        <Field label="Preço Original (R$)" error={errors.precoOriginal?.message}>
          <input
            {...register('precoOriginal', {
              setValueAs: (v) => (v === '' || v === null ? undefined : Number(v)),
            })}
            type="number"
            step="0.01"
            placeholder="Deixe vazio se não houver"
            className={inputCls}
          />
        </Field>
      </div>

      {/* Tamanhos */}
      <Field label="Tamanhos *" error={errors.tamanhos?.message}>
        <div className="space-y-2">
          {[TAMANHOS_ROUPA, TAMANHOS_CALCADO].map((grupo, gi) => (
            <div key={gi} className="flex flex-wrap gap-2">
              {grupo.map((sz) => (
                <Controller
                  key={sz}
                  control={control}
                  name="tamanhos"
                  render={({ field }) => (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = field.value.includes(sz)
                          ? field.value.filter((s) => s !== sz)
                          : [...field.value, sz]
                        field.onChange(updated)
                      }}
                      className={cn(
                        'px-3 py-1.5 text-sm rounded-lg border transition-all',
                        field.value.includes(sz)
                          ? 'bg-paizao-gold text-paizao-navy border-paizao-gold font-bold'
                          : 'bg-paizao-surface border-paizao-surface-2 text-paizao-ink-dim hover:border-paizao-gold/40'
                      )}
                    >
                      {sz}
                    </button>
                  )}
                />
              ))}
            </div>
          ))}
          {tamanhosSelecionados.length > 0 && (
            <p className="text-xs text-paizao-ink-dim">
              Selecionados: {tamanhosSelecionados.join(', ')}
            </p>
          )}
        </div>
      </Field>

      {/* Badge + flags */}
      <div className="grid sm:grid-cols-2 gap-6">
        <Field label="Badge">
          <select {...register('badge')} className={inputCls}>
            <option value="">Nenhum</option>
            {BADGES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>

        <div className="flex items-end gap-4 pb-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              {...register('destaque')}
              type="checkbox"
              className="w-4 h-4 accent-paizao-gold rounded"
            />
            <span className="text-sm text-paizao-ink-dim">Destaque</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              {...register('estoque')}
              type="checkbox"
              className="w-4 h-4 accent-paizao-green rounded"
            />
            <span className="text-sm text-paizao-ink-dim">Em estoque</span>
          </label>
        </div>
      </div>

      {/* Imagem */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-paizao-ink-dim block">
          Fotos do produto
        </label>
        <div className="flex gap-4 flex-wrap items-end">
          {(uploadedUrls.length === 0 ? [''] : uploadedUrls).map((url, i) => (
            <ImageUpload
              key={i}
              label={i === 0 ? 'Principal' : `Foto ${i + 1}`}
              currentUrl={url || undefined}
              onFileSelect={(file) => handleFileUpload(file, i)}
              onClear={() => handleClearImage(i)}
            />
          ))}
          <button
            type="button"
            onClick={addSlot}
            className="flex flex-col items-center justify-center w-32 h-40 rounded-lg border-2 border-dashed border-paizao-surface-2 hover:border-paizao-gold/40 text-paizao-ink-dim hover:text-paizao-gold transition-colors text-xs gap-1"
          >
            <span className="text-2xl leading-none">+</span>
            <span>Mais foto</span>
          </button>
        </div>
        {uploading && (
          <p className="text-xs text-paizao-ink-dim animate-pulse">Enviando foto...</p>
        )}
        {errors.imagem && (
          <p className="text-paizao-red text-xs">{errors.imagem.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-lg bg-paizao-gold text-paizao-navy font-bold text-sm hover:bg-paizao-gold-bright disabled:opacity-50 transition-colors"
        >
          {saving ? 'Salvando...' : produto ? 'Atualizar produto' : 'Criar produto'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/produtos')}
          className="px-6 py-2.5 rounded-lg border border-paizao-surface-2 text-paizao-ink-dim text-sm hover:border-paizao-gold/30 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
