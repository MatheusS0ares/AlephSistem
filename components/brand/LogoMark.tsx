import Image from 'next/image'
import { cn } from '@/lib/utils'
import { getTenant } from '@/tenants'

interface LogoMarkProps {
  size?: number
  className?: string
}

export function LogoMark({ size = 40, className }: LogoMarkProps) {
  const tenant = getTenant()
  return (
    <Image
      src={tenant.logoSrc}
      alt={tenant.nome}
      width={size}
      height={size}
      className={cn('rounded-full object-cover', className)}
      priority
    />
  )
}
