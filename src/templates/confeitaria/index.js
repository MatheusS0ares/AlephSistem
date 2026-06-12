/**
 * Template: Confeitaria / Doceria
 * Demo de referência baseado na Delicias da Emely.
 * Slug: delicias-da-emely
 */

export const STORE_DATA = {
  id: 'delicias-da-emely',
  name: 'Delicias da Emely',
  slug: 'delicias-da-emely',
  tagline: 'Doces e Confeitarias',
  whatsapp: '5561992235201',
  instagram: '@deliciasdaemely',
  instagram_url: 'https://instagram.com/deliciasdaemely',
  address: 'Brasília - DF',
  active: true,
}

export const SETTINGS = {
  hero_title: 'Doces feitos com amor ❤️',
  hero_desc: 'Brigadeiros gourmet, kits presente e caixas especiais para cada momento. Peça pelo WhatsApp!',
  sobre_titulo: 'Delicias da Emely',
  sobre_desc: 'Confeitaria artesanal especializada em brigadeiros gourmet, kits de namorados e encomendas para festas e eventos corporativos em Brasília.',
  cor_primaria: '#d4006e',
  cor_secundaria: '#fce4ec',
}

export const CATEGORIAS = [
  { id: 1, slug: 'brigadeiros',     nome: 'Brigadeiros',      icone: '🍫', corRgb: '212,0,110',   total: null },
  { id: 2, slug: 'kits-presente',   nome: 'Kits Presente',    icone: '🎁', corRgb: '156,39,176',  total: null },
  { id: 3, slug: 'festas',          nome: 'Festas',           icone: '🎂', corRgb: '233,30,99',   total: null },
  { id: 4, slug: 'namorados',       nome: 'Dia dos Namorados',icone: '❤️', corRgb: '198,40,40',   total: null },
  { id: 5, slug: 'corporativo',     nome: 'Corporativo',      icone: '🏢', corRgb: '63,81,181',   total: null },
  { id: 6, slug: 'chocolates',      nome: 'Chocolates',       icone: '🍬', corRgb: '121,85,72',   total: null },
]

export const PRODUTOS_DEMO = [
  {
    id: 1, slug: 'jogo-do-prazer-ferrero',
    nome: 'Jogo do Prazer — Ferrero Rocher',
    imagem: null,
    preco: 95.00, precoOriginal: null,
    badge: 'Hot',
    tamanhos: [],
    descricao: 'Caixa com 12 Ferrero Rocher + 2 dados do prazer. Pedido sob encomenda.',
    whatsapp: '5561992235201',
  },
  {
    id: 2, slug: 'jogo-do-prazer-brigadeiro',
    nome: 'Jogo do Prazer — Brigadeiros Gourmet',
    imagem: null,
    preco: 80.00, precoOriginal: null,
    badge: 'Novo',
    tamanhos: [],
    descricao: '12 brigadeiros nos sabores Ninho, Castanho, Brigadeiro e Morango + 2 dados do prazer.',
    whatsapp: '5561992235201',
  },
]
