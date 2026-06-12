'use client'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/store/useCartStore'
import { formatPrice } from '@/lib/utils'
import { gerarLinkWhatsApp } from '@/lib/whatsapp/gerar-link'

export function CartDrawer() {
  const { items, isOpen, close, remove, updateQty, total, clear } = useCartStore()
  const subtotal = total()

  const checkout = () => {
    const linhas = [
      '🛍️ *Meu pedido na Paizão Modas:*',
      '',
      ...items.map(
        (i) =>
          `• ${i.produto.nome} (Tam. ${i.tamanho}) × ${i.quantidade} = ${formatPrice(i.produto.preco * i.quantidade)}`
      ),
      '',
      `*Total: ${formatPrice(subtotal)}*`,
    ]
    window.open(gerarLinkWhatsApp(linhas.join('\n')), '_blank')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={close}
          />
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-paizao-surface z-50 flex flex-col shadow-2xl"
            aria-label="Sacola de compras"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-paizao-surface-2">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-paizao-gold" />
                <span className="font-semibold text-paizao-ink">
                  Sacola{items.length > 0 && ` (${items.length})`}
                </span>
              </div>
              <button
                onClick={close}
                className="p-1.5 text-paizao-ink-dim hover:text-paizao-ink transition-colors"
                aria-label="Fechar sacola"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-hide">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={48} className="text-paizao-surface-2" />
                  <p className="text-paizao-ink-dim text-sm">Sua sacola está vazia</p>
                  <Link
                    href="/loja"
                    onClick={close}
                    className="text-paizao-gold text-sm hover:underline"
                  >
                    Ver produtos →
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={`${item.produto.id}-${item.tamanho}`}
                    className="flex gap-3 p-3 rounded-lg bg-paizao-surface-2"
                  >
                    <div className="relative w-16 h-20 shrink-0 rounded overflow-hidden">
                      <Image
                        src={item.produto.imagem}
                        alt={item.produto.nome}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-paizao-ink text-sm font-medium truncate">
                        {item.produto.nome}
                      </p>
                      <p className="text-paizao-ink-dim text-xs mt-0.5">
                        Tam. {item.tamanho}
                      </p>
                      <p className="text-paizao-gold font-semibold text-sm mt-1">
                        {formatPrice(item.produto.preco * item.quantidade)}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQty(item.produto.id, item.tamanho, item.quantidade - 1)
                            }
                            className="w-6 h-6 rounded bg-paizao-surface flex items-center justify-center text-paizao-ink-dim hover:text-paizao-ink transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-paizao-ink text-sm w-4 text-center">
                            {item.quantidade}
                          </span>
                          <button
                            onClick={() =>
                              updateQty(item.produto.id, item.tamanho, item.quantidade + 1)
                            }
                            className="w-6 h-6 rounded bg-paizao-surface flex items-center justify-center text-paizao-ink-dim hover:text-paizao-ink transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() => remove(item.produto.id, item.tamanho)}
                          className="text-paizao-ink-dim hover:text-paizao-red transition-colors"
                          aria-label="Remover item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-5 py-5 border-t border-paizao-surface-2 space-y-3">
                <div className="flex justify-between text-sm text-paizao-ink-dim">
                  <span>Subtotal</span>
                  <span className="text-paizao-ink font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-xs text-paizao-ink-dim">
                  Frete calculado no WhatsApp ·{' '}
                  <span className="text-paizao-green">PIX 10% off</span>
                </p>
                <button
                  onClick={checkout}
                  className="w-full bg-wa-green hover:brightness-110 text-white font-bold py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.533 5.848L0 24l6.335-1.511A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.003-1.372l-.359-.213-3.72.887.934-3.62-.234-.372A9.8 9.8 0 012.182 12c0-5.414 4.404-9.818 9.818-9.818 5.414 0 9.818 4.404 9.818 9.818 0 5.414-4.404 9.818-9.818 9.818z" />
                  </svg>
                  Finalizar no WhatsApp
                </button>
                <button
                  onClick={clear}
                  className="w-full text-xs text-paizao-ink-dim hover:text-paizao-red transition-colors py-1"
                >
                  Limpar sacola
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
