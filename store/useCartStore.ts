'use client'
import { create } from 'zustand'
import type { Produto } from '@/lib/data/produtos'

export interface CartItem {
  produto: Produto
  quantidade: number
  tamanho: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  add: (produto: Produto, tamanho: string) => void
  remove: (id: string, tamanho: string) => void
  updateQty: (id: string, tamanho: string, quantidade: number) => void
  clear: () => void
  open: () => void
  close: () => void
  total: () => number
  count: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,

  add: (produto, tamanho) =>
    set((state) => {
      const exists = state.items.find(
        (i) => i.produto.id === produto.id && i.tamanho === tamanho
      )
      if (exists) {
        return {
          items: state.items.map((i) =>
            i.produto.id === produto.id && i.tamanho === tamanho
              ? { ...i, quantidade: i.quantidade + 1 }
              : i
          ),
        }
      }
      return { items: [...state.items, { produto, quantidade: 1, tamanho }] }
    }),

  remove: (id, tamanho) =>
    set((state) => ({
      items: state.items.filter(
        (i) => !(i.produto.id === id && i.tamanho === tamanho)
      ),
    })),

  updateQty: (id, tamanho, quantidade) =>
    set((state) => ({
      items:
        quantidade <= 0
          ? state.items.filter(
              (i) => !(i.produto.id === id && i.tamanho === tamanho)
            )
          : state.items.map((i) =>
              i.produto.id === id && i.tamanho === tamanho
                ? { ...i, quantidade }
                : i
            ),
    })),

  clear: () => set({ items: [] }),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),

  total: () =>
    get().items.reduce((sum, i) => sum + i.produto.preco * i.quantidade, 0),

  count: () => get().items.reduce((sum, i) => sum + i.quantidade, 0),
}))
