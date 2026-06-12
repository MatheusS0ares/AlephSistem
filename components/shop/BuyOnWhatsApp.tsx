'use client'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface BuyOnWhatsAppProps {
  href: string
  label?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function BuyOnWhatsApp({
  href,
  label = 'Comprar no WhatsApp',
  size = 'md',
  className,
}: BuyOnWhatsAppProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-bold text-white bg-wa-green transition-all hover:brightness-110',
        size === 'sm' && 'px-3 py-2 text-sm',
        size === 'md' && 'px-5 py-3 text-sm',
        size === 'lg' && 'px-7 py-4 text-base',
        className
      )}
    >
      <WhatsAppIcon />
      {label}
    </motion.a>
  )
}

function WhatsAppIcon() {
  return (
    <motion.span
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.533 5.848L0 24l6.335-1.511A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.003-1.372l-.359-.213-3.72.887.934-3.62-.234-.372A9.8 9.8 0 012.182 12c0-5.414 4.404-9.818 9.818-9.818 5.414 0 9.818 4.404 9.818 9.818 0 5.414-4.404 9.818-9.818 9.818z" />
      </svg>
    </motion.span>
  )
}
