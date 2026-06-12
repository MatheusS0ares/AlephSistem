import type { Produto } from '@/lib/data/produtos'
import { formatPrice } from '@/lib/utils'
import { getTenant } from '@/tenants'

// Número de WhatsApp vem da config da loja ativa (override opcional via env).
const waNumber = () => process.env.NEXT_PUBLIC_WA_NUMBER ?? getTenant().contato.whatsapp

export function gerarLinkProduto(produto: Produto, tamanho?: string): string {
  const linhas = [
    'Olá! Tenho interesse no produto:',
    `*${produto.nome}*`,
    tamanho ? `Tamanho: *${tamanho}*` : '',
    `Preço: *${formatPrice(produto.preco)}*`,
    '',
    `Vi no site da ${getTenant().nome}.`,
    'Poderia me passar mais informações?',
  ].filter(Boolean)

  return `https://wa.me/${waNumber()}?text=${encodeURIComponent(linhas.join('\n'))}`
}

export function gerarLinkWhatsApp(mensagem: string): string {
  return `https://wa.me/${waNumber()}?text=${encodeURIComponent(mensagem)}`
}

export function gerarLinkAtacado(nome: string, empresa?: string, cidade?: string): string {
  const linhas = [
    `Olá! Tenho interesse no *Atacado ${getTenant().nome}*.`,
    '',
    `Nome: *${nome}*`,
    empresa ? `Empresa/Loja: *${empresa}*` : '',
    cidade ? `Cidade: *${cidade}*` : '',
    '',
    'Gostaria de saber mais sobre tabela de preços e condições.',
  ].filter(Boolean)

  return `https://wa.me/${waNumber()}?text=${encodeURIComponent(linhas.join('\n'))}`
}
