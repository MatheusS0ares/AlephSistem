export interface Produto {
  id: string
  slug: string
  nome: string
  descricao: string
  preco: number
  precoOriginal?: number
  categoria: string
  imagem: string
  imagens: string[]
  tamanhos: string[]
  cores?: string[]
  badge?: 'Novo' | 'Copa' | 'Sale' | 'Hot'
  destaque: boolean
  estoque: boolean
}

export interface Categoria {
  id: string
  nome: string
  slug: string
  descricao: string
  icone: string
  total: number
}

export const categorias: Categoria[] = [
  {
    id: 'camisetas',
    nome: 'Camisetas',
    slug: 'camisetas',
    descricao: 'Básicas, estampadas e camisas',
    icone: '👕',
    total: 48,
  },
  {
    id: 'times',
    nome: 'Camisas de Times',
    slug: 'times',
    descricao: 'Brasil, clubes nacionais e internacionais',
    icone: '⚽',
    total: 62,
  },
  {
    id: 'conjuntos',
    nome: 'Conjuntos',
    slug: 'conjuntos',
    descricao: 'Agasalho e moletons coordenados',
    icone: '🧥',
    total: 24,
  },
  {
    id: 'bermudas',
    nome: 'Bermudas',
    slug: 'bermudas',
    descricao: 'Tactel, moletom e jeans',
    icone: '🩳',
    total: 35,
  },
  {
    id: 'polos',
    nome: 'Polos',
    slug: 'polos',
    descricao: 'Polo social e casual premium',
    icone: '🎽',
    total: 18,
  },
  {
    id: 'tenis',
    nome: 'Tênis',
    slug: 'tenis',
    descricao: 'Casual e esportivo',
    icone: '👟',
    total: 22,
  },
]

export const produtos: Produto[] = [
  {
    id: '1',
    slug: 'camiseta-brasil-copa-2026-home',
    nome: 'Camisa Brasil Copa 2026 — Home',
    descricao:
      'A camisa oficial da Seleção para a Copa do Mundo 2026. Tecido dry-fit premium com tecnologia de ventilação. Verde e amarelo como nunca viram.',
    preco: 89.9,
    precoOriginal: 129.9,
    categoria: 'times',
    imagem: 'https://placehold.co/400x533/1a2654/d4a93a?text=Brasil+2026',
    imagens: [
      'https://placehold.co/400x533/1a2654/d4a93a?text=Brasil+2026',
      'https://placehold.co/400x533/009c3b/ffdf00?text=Brasil+Costas',
      'https://placehold.co/400x533/0a0e1a/f5f3ef?text=Detalhe',
    ],
    tamanhos: ['P', 'M', 'G', 'GG', 'XGG'],
    badge: 'Copa',
    destaque: true,
    estoque: true,
  },
  {
    id: '2',
    slug: 'camiseta-basica-premium-preta',
    nome: 'Camiseta Básica Premium — Preta',
    descricao:
      'Algodão pima 100%, caimento perfeito. O coringa do guarda-roupa masculino. Disponível em 8 cores.',
    preco: 39.9,
    categoria: 'camisetas',
    imagem: 'https://placehold.co/400x533/0f1424/f5f3ef?text=Básica+Premium',
    imagens: [
      'https://placehold.co/400x533/0f1424/f5f3ef?text=Básica+Premium',
      'https://placehold.co/400x533/161b2e/d4a93a?text=Detalhe+Gola',
    ],
    tamanhos: ['PP', 'P', 'M', 'G', 'GG', 'XGG'],
    cores: ['Preta', 'Branca', 'Navy', 'Verde', 'Cinza'],
    badge: 'Hot',
    destaque: true,
    estoque: true,
  },
  {
    id: '3',
    slug: 'conjunto-agasalho-dry-fit-navy',
    nome: 'Conjunto Agasalho Dry-fit — Navy',
    descricao:
      'Jaqueta + calça. Perfeito para academia, treino ou passeio. Tecido leve e resistente.',
    preco: 149.9,
    precoOriginal: 199.9,
    categoria: 'conjuntos',
    imagem: 'https://placehold.co/400x533/1a2654/f5f3ef?text=Conjunto+Navy',
    imagens: [
      'https://placehold.co/400x533/1a2654/f5f3ef?text=Conjunto+Navy',
      'https://placehold.co/400x533/0f1424/d4a93a?text=Calça',
    ],
    tamanhos: ['P', 'M', 'G', 'GG'],
    badge: 'Sale',
    destaque: true,
    estoque: true,
  },
  {
    id: '4',
    slug: 'bermuda-tactel-camuflada',
    nome: 'Bermuda Tactel Camuflada',
    descricao:
      'Estampa militar premium, caimento solto para o verão. Elástico com cordão, bolsos funcionais.',
    preco: 49.9,
    categoria: 'bermudas',
    imagem: 'https://placehold.co/400x533/2d3a2e/f5f3ef?text=Bermuda+Tactel',
    imagens: [
      'https://placehold.co/400x533/2d3a2e/f5f3ef?text=Bermuda+Tactel',
    ],
    tamanhos: ['P', 'M', 'G', 'GG', 'XGG'],
    badge: 'Novo',
    destaque: true,
    estoque: true,
  },
  {
    id: '5',
    slug: 'polo-social-slim-branca',
    nome: 'Polo Social Slim — Branca',
    descricao:
      'Gola polo bordada, botões resinados. Perfeita para o trabalho e para o happy hour.',
    preco: 69.9,
    precoOriginal: 89.9,
    categoria: 'polos',
    imagem: 'https://placehold.co/400x533/f5f3ef/1a2654?text=Polo+Slim',
    imagens: [
      'https://placehold.co/400x533/f5f3ef/1a2654?text=Polo+Slim',
    ],
    tamanhos: ['P', 'M', 'G', 'GG'],
    cores: ['Branca', 'Preta', 'Navy', 'Vinho'],
    destaque: true,
    estoque: true,
  },
  {
    id: '6',
    slug: 'camiseta-flamengo-2026',
    nome: 'Camisa Flamengo 2026 — Rubro-Negra',
    descricao:
      'A camisa do Mengão para 2026. Tecido dry-fit, sublimação total, escudo bordado.',
    preco: 79.9,
    categoria: 'times',
    imagem: 'https://placehold.co/400x533/e63946/0f1424?text=Flamengo+2026',
    imagens: [
      'https://placehold.co/400x533/e63946/0f1424?text=Flamengo+2026',
    ],
    tamanhos: ['P', 'M', 'G', 'GG', 'XGG'],
    badge: 'Novo',
    destaque: false,
    estoque: true,
  },
  {
    id: '7',
    slug: 'tenis-casual-chunky-branco',
    nome: 'Tênis Casual Chunky — Branco/Dourado',
    descricao:
      'Solado plataforma 4cm, couro sintético premium. O tênis que completa qualquer look.',
    preco: 189.9,
    precoOriginal: 249.9,
    categoria: 'tenis',
    imagem: 'https://placehold.co/400x533/f5f3ef/d4a93a?text=Tênis+Chunky',
    imagens: [
      'https://placehold.co/400x533/f5f3ef/d4a93a?text=Tênis+Chunky',
      'https://placehold.co/400x533/d4a93a/0f1424?text=Lateral',
    ],
    tamanhos: ['38', '39', '40', '41', '42', '43', '44'],
    badge: 'Sale',
    destaque: true,
    estoque: true,
  },
  {
    id: '8',
    slug: 'camisa-brasil-copa-2026-away',
    nome: 'Camisa Brasil Copa 2026 — Away Azul',
    descricao:
      'Segunda uniforme da Seleção. Azul celeste com detalhes em dourado. Edição limitada Copa 2026.',
    preco: 89.9,
    precoOriginal: 119.9,
    categoria: 'times',
    imagem: 'https://placehold.co/400x533/1a2654/f5f3ef?text=Brasil+Away',
    imagens: [
      'https://placehold.co/400x533/1a2654/f5f3ef?text=Brasil+Away',
    ],
    tamanhos: ['P', 'M', 'G', 'GG', 'XGG'],
    badge: 'Copa',
    destaque: true,
    estoque: true,
  },
]

export const produtosDestaque = produtos.filter((p) => p.destaque)

export const produtosPorCategoria = (slug: string) =>
  produtos.filter((p) => p.categoria === slug)

export const produtoPorSlug = (slug: string) =>
  produtos.find((p) => p.slug === slug)
