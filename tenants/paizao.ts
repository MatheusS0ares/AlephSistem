import type { TenantConfig } from './types'

export const paizaoConfig: TenantConfig = {
  id: 'paizao',
  nome: 'Paizão Modas',
  slogan: 'Looks estilosos com preço que cabe no bolso',
  tema: 'copa',
  logoSrc: '/logo.png',

  marca: {
    nome: 'PAIZÃO',
    sufixo: 'Modas',
  },

  ticker: [
    'Frete grátis acima de R$199',
    'Atacado a partir de 5 peças',
    'Parcelamento em 3x sem juros',
    'PIX com 10% de desconto',
    'Troca em até 30 dias',
    'Loja física no Gama-DF',
    'Moda masculina desde 2018',
    '+8.000 clientes satisfeitos',
  ],

  cores: {
    primary: '#d4a93a',
    primaryBright: '#f0c64a',
    primarySoft: '#b89030',
    accent: '#1a2654',
    accentDeep: '#0f1424',
    bg: '#0a0e1a',
    surface: '#0f1424',
    surface2: '#161b2e',
    ink: '#f5f3ef',
    inkDim: '#8a8d9a',
    success: '#25D366',
    green: '#009c3b',
    yellow: '#ffdf00',
    red: '#e63946',
  },

  hero: {
    badge: 'Coleção Exclusiva Copa 2026',
    titulo: 'VESTE A',
    tituloAccent: 'SELEÇÃO',
    descricao:
      'Camisas oficiais e mantos sagrados. Mostre seu amor pelo Brasil com o padrão Premium Gold — uma obra de arte em forma de estilo.',
    ctaPrimario: { label: 'Explorar Mantos', href: '/loja/times' },
    ctaSecundario: { label: 'Ver Bastidores', href: '/loja' },
  },

  stats: [
    { valor: 8324, label: 'seguidores', sufixo: '' },
    { valor: 5, label: 'anos de história', sufixo: '+' },
    { valor: 8000, label: 'clientes', sufixo: '+' },
  ],

  categorias: [
    { id: 'camisetas', slug: 'camisetas', nome: 'Camisetas', icone: '👕', total: 48, corRgb: '59,130,246' },
    { id: 'times', slug: 'times', nome: 'Camisas de Times', icone: '⚽', total: 62, corRgb: '16,185,129' },
    { id: 'conjuntos', slug: 'conjuntos', nome: 'Conjuntos', icone: '🧥', total: 24, corRgb: '168,85,247' },
    { id: 'bermudas', slug: 'bermudas', nome: 'Bermudas', icone: '🩳', total: 35, corRgb: '249,115,22' },
    { id: 'polos', slug: 'polos', nome: 'Polos', icone: '🎽', total: 18, corRgb: '239,68,68' },
    { id: 'tenis', slug: 'tenis', nome: 'Tênis', icone: '👟', total: 22, corRgb: '148,163,184' },
  ],

  categoriasBadge: 'Encontre seu estilo',
  categoriasTitle: 'CATEGORIAS',

  colecaoDestaque: {
    badge: 'Edição Limitada 2026',
    titulo: 'COLEÇÃO',
    tituloAccent: 'BRASIL',
    descricao:
      'Vista as cores da pátria com o mais alto padrão de qualidade. Camisas oficiais e mantos exclusivos para a maior competição do planeta.',
    ctaLabel: 'Explorar Coleção Completa',
    ctaHref: '/loja/times',
  },

  atacado: {
    badge: 'Parceria de Sucesso',
    titulo: 'SEJA UM',
    tituloAccent: 'REVENDEDOR',
    descricao:
      'Junte-se a mais de 200 revendedores de elite no DF. Garanta nossa tabela VIP, lucros extraordinários e suporte dedicado para acelerar o seu negócio.',
    contadores: [
      { valor: 30, label: 'desconto na 1ª compra', sufixo: '%', prefixo: 'até' },
      { valor: 5, label: 'peças mínimo', sufixo: '', prefixo: 'a partir de' },
      { valor: 48, label: 'entrega em Gama-DF', sufixo: 'h', prefixo: 'em até' },
    ],
    ctaPrimario: { label: 'Quero Vender Paizão', href: '/atacado' },
    whatsappMsg: 'Olá!%20Tenho%20interesse%20no%20atacado%20Paizão.',
  },

  lojaFisica: {
    badge: 'Vivencie o Padrão',
    titulo: 'LOJA FÍSICA',
    tituloAccent: 'GAMA-DF',
    enderecoRua: 'Quadra 09 lote 70, Gama Leste',
    enderecoCidadeEstado: 'Brasília-DF, CEP 72440-090',
    enderecoFooter: 'Quadra 09 lote 70, Gama Leste, Brasília-DF',
    horarios: [
      { dias: 'Segunda a Sexta', horas: '9h às 18h' },
      { dias: 'Sábado', horas: '9h às 14h' },
      { dias: 'Domingo e Feriado', horas: 'Fechado' },
    ],
    horarioSumario: 'Seg–Sex 9h–18h · Sáb 9h–14h',
    mapsUrl: 'https://maps.google.com/?q=Gama+Leste+Brasilia+DF',
    mapTitle: 'Gama Leste, Brasília-DF',
    mapSubtitle: 'Quadra 09 lote 70',
  },

  contato: {
    whatsapp: '5561999999999',
    whatsappFormatado: '(61) 9 9999-9999',
    instagram: '@paizaomodas2',
    instagramUrl: 'https://instagram.com/paizaomodas2',
    instagramSeguidores: '8.324',
  },

  nav: {
    links: [
      { href: '/loja', label: 'Loja' },
      { href: '/loja/times', label: 'Times ⚽' },
      { href: '/atacado', label: 'Atacado' },
      { href: '/sobre', label: 'Sobre' },
    ],
  },

  sobre: {
    historia: [
      'A Paizão Modas nasceu do coração do Gama-DF com uma missão simples: looks estilosos com preço que cabe no bolso.',
      'Desde 2018, nos tornamos referência em moda masculina jovem na região. Começamos pequenos, crescemos com a confiança de milhares de clientes, e hoje somos mais de 8.000 seguidores no Instagram e dezenas de revendedores por todo o Distrito Federal.',
      'Nossa seleção vai de básicos premium a camisas de times, conjuntos, bermudas e muito mais. Queremos que cada homem que saia daqui se sinta confiante, estiloso e, acima de tudo, autêntico.',
    ],
    valores: [
      { titulo: 'Paixão pela moda', desc: 'Cada peça é escolhida com cuidado para refletir o estilo jovem do Gama.' },
      { titulo: 'Comunidade', desc: 'Mais de 8 mil seguidores e clientes que confiam no Paizão.' },
      { titulo: 'Crescimento', desc: 'De uma banca de feira a uma loja completa com atacado e catálogo digital.' },
    ],
    ctaTitulo: 'PRONTO PARA O SEU NOVO LOOK?',
  },

  footer: {
    descricao:
      'Looks estilosos com preço que cabe no bolso. Moda masculina jovem no coração do Gama-DF.',
    copyright: '© {year} Paizão Modas. Todos os direitos reservados.',
    tagline: 'Gama-DF · Feito com 💛 pelo Paizão',
    navLoja: [
      { label: 'Todas as peças', href: '/loja' },
      { label: 'Camisetas', href: '/loja/camisetas' },
      { label: 'Camisas de Times', href: '/loja/times' },
      { label: 'Conjuntos', href: '/loja/conjuntos' },
      { label: 'Bermudas', href: '/loja/bermudas' },
      { label: 'Polos', href: '/loja/polos' },
      { label: 'Tênis', href: '/loja/tenis' },
    ],
    navEmpresa: [
      { label: 'Sobre nós', href: '/sobre' },
      { label: 'Atacado', href: '/atacado' },
      { label: 'Política de troca', href: '/troca' },
      { label: 'Privacidade', href: '/privacidade' },
    ],
  },

  seo: {
    title: 'Paizão Modas — Moda Masculina no Gama-DF',
    titleTemplate: '%s | Paizão Modas',
    description:
      'Looks estilosos com preço que cabe no bolso. Camisetas, camisas de times, conjuntos, bermudas e muito mais. Loja física no Gama Leste, Brasília-DF.',
    keywords: [
      'moda masculina',
      'loja de roupa masculina',
      'Gama DF',
      'Brasília',
      'camisetas',
      'camisas de time',
      'bermuda',
      'conjunto masculino',
      'Copa 2026',
      'Paizão Modas',
    ],
    ogTitle: 'Paizão Modas — Moda Masculina no Gama-DF',
    ogDescription: 'Looks estilosos com preço que cabe no bolso. Camisetas, times, conjuntos e mais.',
    ogImage: '/og-image.jpg',
    twitterTitle: 'Paizão Modas — Moda Masculina',
    twitterDescription: 'Looks estilosos com preço que cabe no bolso.',
    baseUrl: 'https://paizaomodas.com.br',
  },
}
