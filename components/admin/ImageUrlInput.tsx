'use client'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImageUrlInputProps {
  label: string
  value: string
  onChange: (url: string) => void
  className?: string
}

function ImagePreview({ src }: { src: string }) {
  return (
    <div className="relative w-24 h-32 rounded-lg overflow-hidden border border-paizao-surface-2 bg-paizao-surface-2 shrink-0">
      <Image
        src={src}
        alt="Preview"
        fill
        className="object-cover"
        sizes="96px"
        unoptimized
      />
    </div>
  )
}

export function ImageUrlInput({ label, value, onChange, className }: ImageUrlInputProps) {
  const urls = value.split(',').map(s => s.trim()).filter(Boolean)

  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-sm font-medium text-paizao-ink-dim block">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://url1.jpg, https://url2.jpg, ..."
        className="w-full px-4 py-2.5 rounded-lg bg-paizao-surface border border-paizao-surface-2 text-paizao-ink placeholder:text-paizao-ink-dim/50 focus:outline-none focus:border-paizao-gold/50 transition-colors text-sm"
      />
      {urls.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {urls.map((url, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <ImagePreview src={url} />
              <span className="text-[10px] text-paizao-ink-dim">Foto {i + 1}{i === 0 ? ' (principal)' : ''}</span>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-paizao-ink-dim">
        Separe múltiplas URLs por vírgula. A primeira será a foto principal.
      </p>
    </div>
  )
}
