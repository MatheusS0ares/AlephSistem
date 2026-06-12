'use client'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface MarqueeTextProps {
  items: string[]
  speed?: number
  separator?: string
  className?: string
  itemClassName?: string
}

export function MarqueeText({
  items,
  speed = 35,
  separator = '★',
  className,
  itemClassName,
}: MarqueeTextProps) {
  const doubled = [...items, ...items]

  return (
    <div className={cn('overflow-hidden', className)}>
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: '-50%' }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
      >
        {doubled.map((item, i) => (
          <span key={i} className={cn('flex items-center shrink-0', itemClassName)}>
            {item}
            <span className="mx-4 opacity-60">{separator}</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}
