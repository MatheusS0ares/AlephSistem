'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  label: string
  currentUrl?: string
  onFileSelect: (file: File) => void
  onClear?: () => void
  className?: string
}

export function ImageUpload({
  label,
  currentUrl,
  onFileSelect,
  onClear,
  className,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const displayUrl = preview ?? currentUrl

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    onFileSelect(file)
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleClear = () => {
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ''
    onClear?.()
  }

  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-sm font-medium text-paizao-ink-dim block">{label}</label>

      {displayUrl ? (
        <div className="relative w-32 h-40 rounded-lg overflow-hidden border border-paizao-surface-2 group">
          <Image src={displayUrl} alt="Preview" fill className="object-cover" sizes="128px" />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-1 right-1 w-6 h-6 bg-paizao-red rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remover imagem"
          >
            <X size={12} className="text-white" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center w-32 h-40 rounded-lg border-2 border-dashed border-paizao-surface-2 hover:border-paizao-gold/40 text-paizao-ink-dim hover:text-paizao-gold transition-colors"
        >
          <Upload size={24} />
          <span className="text-xs mt-2">Escolher</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}
