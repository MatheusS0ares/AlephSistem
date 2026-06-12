'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { ShoppingBag } from 'lucide-react'
import { PriceTag } from './PriceTag'
import { BuyOnWhatsApp } from './BuyOnWhatsApp'
import { useCartStore } from '@/store/useCartStore'
import { gerarLinkProduto } from '@/lib/whatsapp/gerar-link'
import { cn } from '@/lib/utils'
import type { Produto } from '@/lib/data/produtos'

const BADGE_STYLES: Record<string, string> = {
  Novo: 'bg-paizao-navy text-paizao-gold border border-paizao-gold/30',
  Copa: 'bg-paizao-green text-white',
  Sale: 'bg-paizao-red text-white',
  Hot: 'bg-paizao-gold text-paizao-navy',
}

interface ProductCardProps {
  produto: Produto
}

export function ProductCard({ produto }: ProductCardProps) {
  const [hovered, setHovered] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const { add, open } = useCartStore()

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!selectedSize && produto.tamanhos.length > 0) {
      setHovered(true)
      return
    }
    const size = selectedSize ?? produto.tamanhos[0]
    add(produto, size)
    open()
  }

  return (
    <motion.article
      className="group relative rounded-xl overflow-hidden bg-paizao-surface border border-paizao-surface-2"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <Link href={`/produto/${produto.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-paizao-surface-2">
          <Image
            src={produto.imagem}
            alt={produto.nome}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />

          {/* Badge */}
          {produto.badge && (
            <span
              className={cn(
                'absolute top-2 left-2 text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 rounded',
                BADGE_STYLES[produto.badge]
              )}
            >
              {produto.badge}
            </span>
          )}

          {/* Size selector on hover */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                key="sizes"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-paizao-navy-deep/95 to-transparent"
                onClick={(e) => e.preventDefault()}
              >
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {produto.tamanhos.map((sz) => (
                    <button
                      key={sz}
                      onClick={(e) => {
                        e.preventDefault()
                        setSelectedSize(sz)
                      }}
                      className={cn(
                        'px-2 py-1 text-[11px] font-bold rounded border transition-all',
                        selectedSize === sz
                          ? 'bg-paizao-gold text-paizao-navy border-paizao-gold'
                          : 'bg-paizao-surface/80 text-paizao-ink border-paizao-surface-2 hover:border-paizao-gold/50'
                      )}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-paizao-ink text-sm font-medium truncate">{produto.nome}</p>
          <PriceTag
            preco={produto.preco}
            precoOriginal={produto.precoOriginal}
            size="sm"
            className="mt-1.5"
          />
        </div>
      </Link>

      {/* Action buttons */}
      <div className="px-3 pb-3 flex gap-2">
        <BuyOnWhatsApp
          href={gerarLinkProduto(produto, selectedSize ?? undefined)}
          label="WhatsApp"
          size="sm"
          className="flex-1 text-xs"
        />
        <button
          onClick={addToCart}
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-paizao-surface-2 hover:bg-paizao-navy transition-colors border border-paizao-surface-2 hover:border-paizao-gold/30"
          aria-label="Adicionar à sacola"
        >
          <ShoppingBag size={15} className="text-paizao-ink-dim group-hover:text-paizao-gold" />
        </button>
      </div>
    </motion.article>
  )
}
