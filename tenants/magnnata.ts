import type { TenantConfig } from './types'

export const magnnataConfig: TenantConfig = {
  id: 'magnnata',
  nome: 'Magnnata',
  slogan: 'A Melhor do Gama — Roupas e Calçados',
  tema: 'luxo',
  logoSrc: '/Magnnata.png',

  marca: {
    nome: 'MAGNNATA',
    sufixo: 'Roupas & Calçados',
  },

  ticker: [
    'Enviamos para todo o Brasil',
    'A Melhor do Gama',
    'Loja Completa',
    'PIX com desconto exclusivo',
    'Parcelamento em até 3x',
    'Lançamentos toda semana',
    'Marcas premium · TXC · Boss',
    '+5.700 clientes no Instagram',
  ],

  cores: {
    primary: '#d4af37',        // ouro metálico
    primaryBright: '#f4d784',  // ouro claro
    primarySoft: '#a8842a',    // ouro escuro
    accent: '#161310',         // preto café
    accentDeep: '#0a0908',     // preto profundo
    bg: '#080706',             // fundo quase preto
    surface: '#13110e',        // card
    surface2: '#231f18',       // bordas
    ink: '#f3ede1',            // marfim quente
    inkDim: '#9a9183',         // texto secundário
    success: '#25D366',        // whatsapp
    green: '#1f9d55',          // acento positivo
    yellow: '#f4d784',         // dourado claro
    red: '#b8362f',            // sale
  },

  hero: {
    badge: 'A Melhor do Gama · Desde 2020',
    titulo: 'VISTA O',
    tituloAccent: 'PODER',
    descricao:
      'Roupas e calçados das melhores marcas, com o padrão que um magnata merece. Estilo urbano premium, entrega para todo o Brasil e atendimento de elite.',
    ctaPrimario: { label: 'Explorar Coleção', href: '/loja' },
    ctaSecundario: { label: 'Ver Lançamentos', href: '/loja/tenis' },
  },

  stats: [
    { valor: 5758, label: 'seguidores', sufixo: '' },
    { valor: 147, label: 'lançamentos', sufixo: '+' },
    { valor: 100, label: 'envio Brasil', sufixo: '%' },
  ],

  categorias: [
    { id: 'tenis', slug: 'tenis', nome: 'Tênis', icone: '👟', total: 40, corRgb: '212,175,55' },
    { id: 'camisetas', slug: 'camisetas', nome: 'Camisetas', icone: '👕', total: 52, corRgb: '226,226,226' },
    { id: 'camisas', slug: 'camisas', nome: 'Camisas', icone: '👔', total: 28, corRgb: '180,180,190' },
    { id: 'calcas', slug: 'calcas', nome: 'Calças', icone: '👖', total: 30, corRgb: '90,110,140' },
    { id: 'bermudas', slug: 'bermudas', nome: 'Bermudas', icone: '🩳', total: 24, corRgb: '200,140,60' },
    { id: 'conjuntos', slug: 'conjuntos', nome: 'Conjuntos', icone: '🧥', total: 18, corRgb: '168,130,210' },
  ],

  categoriasBadge: 'Escolha seu estilo',
  categoriasTitle: 'CATEGORIAS',

  colecaoDestaque: {
    badge: 'Seleção Premium',
    titulo: 'DROP',
    tituloAccent: 'EXCLUSIVO',
    descricao:
      'As peças mais desejadas do momento, reunidas em uma curadoria de luxo. Marcas top, edições limitadas e o melhor do streetwear premium.',
    ctaLabel: 'Ver Coleção Completa',
    ctaHref: '/loja',
  },

  atacado: {
    badge: 'Para Lojistas',
    titulo: 'COMPRE NO',
    tituloAccent: 'ATACADO',
    descricao:
      'Revenda as marcas mais procuradas do Gama com margem de magnata. Tabela exclusiva, lançamentos em primeira mão e envio para todo o Brasil.',
    contadores: [
      { valor: 25, label: 'desconto no atacado', sufixo: '%', prefixo: 'até' },
      { valor: 10, label: 'peças mínimo', sufixo: '', prefixo: 'a partir de' },
      { valor: 24, label: 'envio nacional', sufixo: 'h', prefixo: 'em até' },
    ],
    ctaPrimario: { label: 'Quero Revender', href: '/atacado' },
    whatsappMsg: 'Ol%C3%A1!%20Tenho%20interesse%20no%20atacado%20Magnnata.',
  },

  lojaFisica: {
    badge: 'Visite a Loja',
    titulo: 'LOJA FÍSICA',
    tituloAccent: 'GAMA-DF',
    enderecoRua: 'Quadra 36 lote 15, Gama Leste',
    enderecoCidadeEstado: 'Brasília-DF',
    enderecoFooter: 'Quadra 36 lote 15, Gama Leste, Brasília-DF',
    horarios: [
      { dias: 'Segunda a Sexta', horas: '9h às 18h' },
      { dias: 'Sábado', horas: '9h às 17h' },
      { dias: 'Domingo e Feriado', horas: 'Fechado' },
    ],
    horarioSumario: 'Seg–Sex 9h–18h · Sáb 9h–17h',
    mapsUrl: 'https://maps.google.com/?q=Quadra+36+Gama+Leste+Brasilia+DF',
    mapTitle: 'Gama Leste, Brasília-DF',
    mapSubtitle: 'Quadra 36 lote 15',
  },

  contato: {
    whatsapp: '5561985818667',
    whatsappFormatado: '(61) 9 8581-8667',
    instagram: '@magnnata_gama',
    instagramUrl: 'https://instagram.com/magnnata_gama',
    instagramSeguidores: '5.758',
  },

  nav: {
    links: [
      { href: '/loja', label: 'Loja' },
      { href: '/loja/tenis', label: 'Tênis 👟' },
      { href: '/loja/camisetas', label: 'Camisetas' },
      { href: '/atacado', label: 'Atacado' },
      { href: '/sobre', label: 'Sobre' },
    ],
  },

  sobre: {
    historia: [
      'A Magnnata nasceu no Gama-DF com um propósito claro: trazer o que há de melhor em roupas e calçados, com o padrão que um magnata merece.',
      'Construímos uma comunidade de mais de 5.700 seguidores oferecendo as marcas mais desejadas, lançamentos toda semana e um atendimento que trata cada cliente como VIP. Hoje enviamos para todo o Brasil a partir da nossa loja física no Gama Leste.',
      'Do tênis premium à camisa de marca, cada peça é selecionada para quem leva o estilo a sério. Aqui você não compra só roupa — você veste poder.',
    ],
    valores: [
      { titulo: 'Curadoria premium', desc: 'Só as marcas e os modelos mais desejados entram na vitrine da Magnnata.' },
      { titulo: 'A Melhor do Gama', desc: 'Mais de 5.700 seguidores e clientes fiéis que confiam no nosso padrão.' },
      { titulo: 'Brasil inteiro', desc: 'Loja física no Gama-DF e envio rápido para todo o país.' },
    ],
    ctaTitulo: 'PRONTO PARA VESTIR PODER?',
  },

  footer: {
    descricao:
      'A Melhor do Gama em roupas e calçados. Marcas premium, estilo urbano e envio para todo o Brasil.',
    copyright: '© {year} Magnnata. Todos os direitos reservados.',
    tagline: 'Gama-DF · A Melhor do Gama 👑',
    navLoja: [
      { label: 'Todas as peças', href: '/loja' },
      { label: 'Tênis', href: '/loja/tenis' },
      { label: 'Camisetas', href: '/loja/camisetas' },
      { label: 'Camisas', href: '/loja/camisas' },
      { label: 'Calças', href: '/loja/calcas' },
      { label: 'Bermudas', href: '/loja/bermudas' },
      { label: 'Conjuntos', href: '/loja/conjuntos' },
    ],
    navEmpresa: [
      { label: 'Sobre nós', href: '/sobre' },
      { label: 'Atacado', href: '/atacado' },
      { label: 'Política de troca', href: '/troca' },
      { label: 'Privacidade', href: '/privacidade' },
    ],
  },

  seo: {
    title: 'Magnnata — Roupas e Calçados no Gama-DF',
    titleTemplate: '%s | Magnnata',
    description:
      'A Melhor do Gama em roupas e calçados. Tênis, camisetas, camisas e calças das melhores marcas. Loja física no Gama Leste e envio para todo o Brasil.',
    keywords: [
      'roupas masculinas',
      'calçados',
      'tênis',
      'loja de roupa Gama DF',
      'Brasília',
      'streetwear',
      'moda masculina',
      'TXC',
      'Magnnata',
    ],
    ogTitle: 'Magnnata — A Melhor do Gama',
    ogDescription: 'Roupas e calçados premium. Tênis, camisetas e mais, com envio para todo o Brasil.',
    ogImage: '/og-image.jpg',
    twitterTitle: 'Magnnata — Roupas e Calçados',
    twitterDescription: 'A Melhor do Gama em roupas e calçados premium.',
    baseUrl: 'https://magnnata.com.br',
  },
}
