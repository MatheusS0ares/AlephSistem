import { LogoMark } from './LogoMark'
import { cn } from '@/lib/utils'
import { getTenant } from '@/tenants'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: { mark: 36, text: 'text-lg' },
  md: { mark: 52, text: 'text-xl' },
  lg: { mark: 72, text: 'text-3xl' },
}

export function Logo({ size = 'md', className }: LogoProps) {
  const { mark, text } = sizeMap[size]
  const { marca } = getTenant()
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <LogoMark size={mark} />
      <div className="flex flex-col leading-none">
        <span
          className={cn('font-bebas text-paizao-gold tracking-[0.12em]', text)}
          style={{ fontFamily: 'var(--font-bebas-neue), sans-serif' }}
        >
          {marca.nome}
        </span>
        <span
          className="font-body text-paizao-ink-dim tracking-[0.3em] uppercase text-[10px]"
          style={{ fontFamily: 'var(--font-archivo), sans-serif' }}
        >
          {marca.sufixo}
        </span>
      </div>
    </div>
  )
}
