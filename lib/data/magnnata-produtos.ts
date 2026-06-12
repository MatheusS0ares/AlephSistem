import type { Produto } from './produtos'

// Produtos de exemplo da Magnnata (placeholder preto/dourado).
// Serão substituídos pelos produtos reais quando o Firebase da loja for conectado.
const img = (texto: string) =>
  `https://placehold.co/400x533/0a0908/d4af37?text=${encodeURIComponent(texto)}`

export const magnnataProdutos: Produto[] = [
  {
    id: 'm1', slug: 'tenis-runner-premium-bege', nome: 'Tênis Runner Premium — Bege',
    descricao: 'Tênis chunky premium com sola robusta e acabamento em couro e mesh. Conforto e estilo urbano de alto padrão.',
    preco: 299.9, precoOriginal: 399.9, categoria: 'tenis', imagem: img('Runner Bege'),
    imagens: [img('Runner Bege')], tamanhos: ['38', '39', '40', '41', '42', '43'], cores: [],
    badge: 'Hot', destaque: true, estoque: true,
  },
  {
    id: 'm2', slug: 'tenis-dad-shoe-preto', nome: 'Tênis Dad Shoe — Preto/Branco',
    descricao: 'Dad shoe clássico em preto e branco, design atemporal com amortecimento premium para o dia a dia.',
    preco: 279.9, categoria: 'tenis', imagem: img('Dad Shoe'),
    imagens: [img('Dad Shoe')], tamanhos: ['39', '40', '41', '42', '43'], cores: [],
    badge: 'Novo', destaque: true, estoque: true,
  },
  {
    id: 'm3', slug: 'camiseta-txc-premium-preta', nome: 'Camiseta TXC Premium — Preta',
    descricao: 'Camiseta TXC de algodão pima, caimento perfeito e bordado discreto. O básico que todo magnata tem.',
    preco: 119.9, categoria: 'camisetas', imagem: img('TXC Preta'),
    imagens: [img('TXC Preta')], tamanhos: ['P', 'M', 'G', 'GG', 'XGG'], cores: [],
    badge: 'Hot', destaque: true, estoque: true,
  },
  {
    id: 'm4', slug: 'camisa-boss-slim-branca', nome: 'Camisa Boss Slim — Branca',
    descricao: 'Camisa social slim fit em algodão premium com etiqueta Boss. Elegância para qualquer ocasião.',
    preco: 189.9, precoOriginal: 249.9, categoria: 'camisas', imagem: img('Boss Branca'),
    imagens: [img('Boss Branca')], tamanhos: ['P', 'M', 'G', 'GG'], cores: [],
    badge: 'Sale', destaque: true, estoque: true,
  },
  {
    id: 'm5', slug: 'calca-jogger-cargo-preta', nome: 'Calça Jogger Cargo — Preta',
    descricao: 'Jogger cargo com bolsos laterais e punho ajustável. Streetwear premium com tecido resistente.',
    preco: 159.9, categoria: 'calcas', imagem: img('Jogger Cargo'),
    imagens: [img('Jogger Cargo')], tamanhos: ['38', '40', '42', '44'], cores: [],
    badge: 'Novo', destaque: false, estoque: true,
  },
  {
    id: 'm6', slug: 'bermuda-sarja-premium-bege', nome: 'Bermuda Sarja Premium — Bege',
    descricao: 'Bermuda de sarja com elastano, corte moderno e conforto. Ideal para os dias quentes do DF.',
    preco: 99.9, categoria: 'bermudas', imagem: img('Bermuda Bege'),
    imagens: [img('Bermuda Bege')], tamanhos: ['38', '40', '42', '44'], cores: [],
    badge: 'Hot', destaque: false, estoque: true,
  },
  {
    id: 'm7', slug: 'conjunto-moletom-dry-grafite', nome: 'Conjunto Moletom Dry — Grafite',
    descricao: 'Conjunto moletom + jogger em tecido dry premium. Look monocromático grafite com detalhes refletivos.',
    preco: 229.9, precoOriginal: 299.9, categoria: 'conjuntos', imagem: img('Conjunto Grafite'),
    imagens: [img('Conjunto Grafite')], tamanhos: ['P', 'M', 'G', 'GG'], cores: [],
    badge: 'Sale', destaque: true, estoque: true,
  },
  {
    id: 'm8', slug: 'camiseta-oversized-streetwear-off', nome: 'Camiseta Oversized Streetwear — Off',
    descricao: 'Oversized de gola alta com estampa minimalista. Algodão pesado, caimento street premium.',
    preco: 109.9, categoria: 'camisetas', imagem: img('Oversized Off'),
    imagens: [img('Oversized Off')], tamanhos: ['P', 'M', 'G', 'GG', 'XGG'], cores: [],
    badge: 'Novo', destaque: false, estoque: true,
  },
]
