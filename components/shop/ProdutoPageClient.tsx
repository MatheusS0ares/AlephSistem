'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ShoppingBag, Shield, RefreshCcw, Truck, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { PriceTag } from './PriceTag'
import { BuyOnWhatsApp } from './BuyOnWhatsApp'
import { ProductCard } from './ProductCard'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { useCartStore } from '@/store/useCartStore'
import { gerarLinkProduto } from '@/lib/whatsapp/gerar-link'
import { cn } from '@/lib/utils'
import type { Produto } from '@/lib/data/produtos'

const TRUST_BADGES = [
  { icon: Shield, label: 'Compra segura' },
  { icon: RefreshCcw, label: 'Troca em 30 dias' },
  { icon: Truck, label: 'Entrega rápida' },
  { icon: Star, label: '5★ no atendimento' },
]

const BADGE_STYLES: Record<string, string> = {
  Copa: 'bg-paizao-green text-white',
  Sale: 'bg-paizao-red text-white',
  Novo: 'bg-paizao-navy text-paizao-gold border border-paizao-gold/30',
  Hot: 'bg-paizao-gold text-paizao-navy',
}

interface Props {
  produto: Produto
  relacionados: Produto[]
}

export function ProdutoPageClient({ produto, relacionados }: Props) {
  const [activeImg, setActiveImg] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [added, setAdded] = useState(false)
  const { add, open } = useCartStore()

  const handleAddToCart = () => {
    if (!selectedSize) return
    add(produto, selectedSize)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
    open()
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-paizao-ink-dim mb-8" aria-label="Breadcrumb">
          <Link href="/loja" className="hover:text-paizao-gold transition-colors">
            Loja
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/loja/${produto.categoria}`}
            className="hover:text-paizao-gold transition-colors capitalize"
          >
            {produto.categoria}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-paizao-ink truncate">{produto.nome}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">
          {/* Gallery */}
          <FadeIn direction="right">
            <div className="space-y-3">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-paizao-surface-2">
                <Image
                  src={produto.imagens[activeImg] ?? produto.imagem}
                  alt={produto.nome}
                  fill
                  unoptimized
                  className="object-cover transition-opacity duration-300"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                {produto.badge && (
                  <span className={cn('absolute top-3 left-3 text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded', BADGE_STYLES[produto.badge])}>
                    {produto.badge}
                  </span>
                )}
                {produto.imagens.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImg(i => (i - 1 + produto.imagens.length) % produto.imagens.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
                      aria-label="Foto anterior"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => setActiveImg(i => (i + 1) % produto.imagens.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
                      aria-label="Próxima foto"
                    >
                      <ChevronRight size={20} />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                      {produto.imagens.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImg(i)}
                          className={cn('w-1.5 h-1.5 rounded-full transition-all', activeImg === i ? 'bg-white scale-125' : 'bg-white/50')}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              {produto.imagens.length > 1 && (
                <div className="flex gap-2">
                  {produto.imagens.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={cn(
                        'relative w-16 h-20 rounded-lg overflow-hidden border-2 transition-all',
                        activeImg === i
                          ? 'border-paizao-gold'
                          : 'border-paizao-surface-2 opacity-70 hover:opacity-100'
                      )}
                    >
                      <Image src={img} alt={`Foto ${i + 1}`} fill unoptimized className="object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </FadeIn>

          {/* Info */}
          <FadeIn>
            <div className="lg:sticky lg:top-24">
              <h1 className="text-2xl sm:text-3xl font-semibold text-paizao-ink leading-tight">
                {produto.nome}
              </h1>

              <PriceTag
                preco={produto.preco}
                precoOriginal={produto.precoOriginal}
                showInstallment
                showPix
                size="lg"
                className="mt-4"
              />

              {/* Size selector */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-paizao-ink">
                    Tamanho
                    {!selectedSize && (
                      <span className="ml-2 text-paizao-ink-dim font-normal">— selecione</span>
                    )}
                  </p>
                  <button className="text-xs text-paizao-gold hover:underline">
                    Guia de tamanhos
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {produto.tamanhos.map((sz) => (
                    <motion.button
                      key={sz}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSize(sz)}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-semibold border transition-all',
                        selectedSize === sz
                          ? 'bg-paizao-gold text-paizao-navy border-paizao-gold'
                          : 'bg-paizao-surface border-paizao-surface-2 text-paizao-ink-dim hover:border-paizao-gold/40 hover:text-paizao-ink'
                      )}
                    >
                      {sz}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-6 flex flex-col gap-3">
                <BuyOnWhatsApp
                  href={gerarLinkProduto(produto, selectedSize ?? undefined)}
                  label="Comprar no WhatsApp"
                  size="lg"
                  className="w-full"
                />
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddToCart}
                  disabled={!selectedSize}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 py-4 rounded-xl border-2 font-bold text-base transition-all',
                    selectedSize
                      ? 'border-paizao-gold/40 text-paizao-gold hover:bg-paizao-gold/10'
                      : 'border-paizao-surface-2 text-paizao-ink-dim cursor-not-allowed'
                  )}
                >
                  <ShoppingBag size={18} />
                  {added ? 'Adicionado! ✓' : 'Adicionar à sacola'}
                </motion.button>
              </div>

              {/* Description */}
              <div className="mt-6 pt-6 border-t border-paizao-surface-2">
                <p className="text-paizao-ink-dim text-sm leading-relaxed">{produto.descricao}</p>
              </div>

              {/* Trust badges */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                {TRUST_BADGES.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-xs text-paizao-ink-dim">
                    <Icon size={14} className="text-paizao-gold shrink-0" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Related products */}
        {relacionados.length > 0 && (
          <div className="mt-20">
            <h2
              className="text-[clamp(1.5rem,4vw,2.5rem)] text-paizao-ink mb-8"
              style={{ fontFamily: 'var(--font-bebas-neue), sans-serif' }}
            >
              VOCÊ TAMBÉM VAI GOSTAR
            </h2>
            <StaggerChildren className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relacionados.map((p) => (
                <StaggerItem key={p.id}>
                  <ProductCard produto={p} />
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        )}
      </div>
    </div>
  )
}
