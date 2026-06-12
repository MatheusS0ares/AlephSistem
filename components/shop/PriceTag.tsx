import { formatPrice, formatInstallment, formatPix } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface PriceTagProps {
  preco: number
  precoOriginal?: number
  showInstallment?: boolean
  showPix?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function PriceTag({
  preco,
  precoOriginal,
  showInstallment = false,
  showPix = false,
  size = 'md',
  className,
}: PriceTagProps) {
  const discount =
    precoOriginal && precoOriginal > preco
      ? Math.round(((precoOriginal - preco) / precoOriginal) * 100)
      : null

  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      {precoOriginal && precoOriginal > preco && (
        <span
          className={cn(
            'text-paizao-ink-dim line-through',
            size === 'sm' ? 'text-xs' : 'text-sm'
          )}
        >
          {formatPrice(precoOriginal)}
        </span>
      )}
      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            'font-extrabold text-paizao-gold',
            size === 'sm' && 'text-base',
            size === 'md' && 'text-xl',
            size === 'lg' && 'text-3xl'
          )}
          style={{ fontFamily: 'var(--font-archivo-black), sans-serif' }}
        >
          {formatPrice(preco)}
        </span>
        {discount && (
          <span className="text-xs bg-paizao-red/20 text-paizao-red px-1.5 py-0.5 rounded font-semibold">
            -{discount}%
          </span>
        )}
      </div>
      {showInstallment && (
        <span className="text-xs text-paizao-ink-dim">{formatInstallment(preco)}</span>
      )}
      {showPix && (
        <span className="text-xs text-paizao-green font-medium">{formatPix(preco)}</span>
      )}
    </div>
  )
}
