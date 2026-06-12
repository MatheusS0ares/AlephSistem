import type { TenantConfig } from './types'

export const hoomauConfig: TenantConfig = {
  id: 'hoomau',
  nome: 'Hoomau Store',
  slogan: 'Vestimos autoestima e atitude.',
  tema: 'street',
  logoSrc: '/hoomauLogo.png',

  whatsappFloat: true,

  marca: {
    nome: 'HOOMAU',
    sufixo: 'Store · Recanto das Emas',
  },

  ticker: [
    'Vestimos autoestima e atitude 💪',
    'Marca Própria — Do Recanto pro Brasil',
    'Transformando clientes em empreendedores',
    'Uniformes corporativos sob encomenda',
    'Atacado disponível — fale no Zap',
    'Coleção Copa 2026 — Rumo ao Hexa',
    'Trocas em até 7 dias',
    'Meta batida toda semana',
    'A moda é só o começo',
    '20 mil seguidores e crescendo',
  ],

  cores: {
    primary: '#c9a820',        // Ouro da borda do logo
    primaryBright: '#e8c940',  // Ouro brilhante
    primarySoft: '#9a7d18',    // Ouro escuro
    accent: '#0d1a0f',         // Verde escuro do logo
    accentDeep: '#080f09',     // Verde profundo
    bg: '#080f09',             // Fundo principal (verde quase preto)
    surface: '#0d1a0f',        // Cards
    surface2: '#162412',       // Bordas
    ink: '#f5edd8',            // Marfim quente
    inkDim: '#8a9080',         // Texto secundário
    success: '#25D366',        // Verde WhatsApp
    green: '#1f9d55',          // Acento positivo
    yellow: '#c9a820',         // Dourado temático
    red: '#cc1111',            // Sale/badge
  },

  hero: {
    badge: 'Recanto das Emas · Brasília-DF',
    titulo: 'VESTE',
    tituloAccent: 'ATITUDE',
    descricao: 'Marca própria nascida no Recanto, entregue pro Brasil inteiro. Roupas que vestem autoestima, uniformes que profissionalizam, estilo que transforma.',
    ctaPrimario: { label: 'Ver Coleção', href: '/loja' },
    ctaSecundario: { label: 'Chamar no Zap', href: '#whatsapp' },
  },

  stats: [
    { valor: 20000, label: 'seguidores', sufixo: '+' },
    { valor: 100, label: 'marca própria', sufixo: '%' },
    { valor: 7, label: 'anos no mercado', sufixo: '+' },
  ],

  categorias: [
    { id: 'camisetas', slug: 'camisetas', nome: 'Camisetas', icone: '👕', total: 0, corRgb: '201,168,32' },
    { id: 'conjuntos', slug: 'conjuntos', nome: 'Conjuntos', icone: '🧥', total: 0, corRgb: '201,168,32' },
    { id: 'bermudas', slug: 'bermudas', nome: 'Bermudas', icone: '🩳', total: 0, corRgb: '180,150,28' },
    { id: 'uniformes', slug: 'uniformes', nome: 'Uniformes', icone: '🦺', total: 0, corRgb: '150,120,20' },
    { id: 'calcas', slug: 'calcas', nome: 'Calças', icone: '👖', total: 0, corRgb: '120,100,18' },
  ],

  categoriasBadge: 'O que você quer vestir?',
  categoriasTitle: 'NOSSA LINHA',

  colecaoDestaque: {
    badge: 'Marca Própria',
    titulo: 'LINHA',
    tituloAccent: 'PROFETA',
    descricao: 'A coleção que virou símbolo no Recanto. Peças que vestem mais do que o corpo — vestem identidade, propósito e atitude.',
    ctaLabel: 'Ver Tudo',
    ctaHref: '/loja',
  },

  atacado: {
    badge: 'Para Revendedores',
    titulo: 'COMPRE NO',
    tituloAccent: 'ATACADO',
    descricao: 'Revenda a Hoomau com margem real. Uniformes, camisetas e conjuntos em quantidade — entrega em todo DF e Brasil.',
    contadores: [
      { valor: 30, label: 'desconto', sufixo: '%', prefixo: 'até' },
      { valor: 10, label: 'peças mínimo', sufixo: '', prefixo: 'a partir de' },
      { valor: 48, label: 'entrega', sufixo: 'h', prefixo: 'em até' },
    ],
    ctaPrimario: { label: 'Falar no Zap', href: '/atacado' },
    whatsappMsg: 'Salve!%20Quero%20informações%20sobre%20atacado%20da%20Hoomau%20Store.',
  },

  lojaFisica: {
    badge: 'Cola na Loja',
    titulo: 'LOJA FÍSICA',
    tituloAccent: 'RECANTO DAS EMAS',
    enderecoRua: 'Recanto das Emas',
    enderecoCidadeEstado: 'Brasília-DF',
    enderecoFooter: 'Recanto das Emas — Brasília-DF',
    horarios: [
      { dias: 'Segunda a Sábado', horas: '9h às 19h' },
      { dias: 'Domingo', horas: '10h às 15h' },
    ],
    horarioSumario: 'Seg–Sáb 9h–19h · Dom 10h–15h',
    mapsUrl: 'https://maps.google.com/?q=Recanto+das+Emas+Brasilia+DF',
    mapTitle: 'Recanto das Emas, DF',
    mapSubtitle: 'Brasília-DF',
  },

  contato: {
    whatsapp: '5561999999999',
    whatsappFormatado: '(61) 9 9999-9999',
    instagram: '@hoomau_store_recanto',
    instagramUrl: 'https://instagram.com/hoomau_store_recanto',
    instagramSeguidores: '20.000',
  },

  nav: {
    links: [
      { href: '/loja', label: 'Loja' },
      { href: '/loja/camisetas', label: 'Camisetas' },
      { href: '/loja/uniformes', label: 'Uniformes' },
      { href: '/atacado', label: 'Atacado' },
      { href: '/sobre', label: 'Sobre' },
    ],
  },

  sobre: {
    historia: [
      'A Hoomau Store nasceu no Recanto das Emas com um propósito maior que a moda: transformar a autoestima de quem veste.',
      'Com marca própria, uniformes profissionais e uma coleção que cresce toda semana, a Hoomau já tem mais de 20 mil pessoas acompanhando a jornada — e não para.',
      'Do Recanto pro Brasil. A moda é só o começo.',
    ],
    valores: [
      { titulo: 'Marca Própria', desc: 'Cada peça é desenvolvida com identidade. Você não compra roupa — você veste atitude.' },
      { titulo: 'Do Recanto pro Brasil', desc: 'Nascemos na periferia e enviamos para todo o país. Sem complexo, sem limite.' },
      { titulo: 'Transformação Real', desc: 'Transformando clientes em empreendedores. A moda é a porta, o destino é mais longe.' },
    ],
    ctaTitulo: 'BORA VESTIR ATITUDE?',
  },

  footer: {
    descricao: 'Marca própria do Recanto das Emas. Vestimos autoestima e atitude.',
    copyright: '© {year} Hoomau Store. Todos os direitos reservados.',
    tagline: 'Recanto das Emas · Brasília-DF',
    navLoja: [
      { label: 'Camisetas', href: '/loja/camisetas' },
      { label: 'Conjuntos', href: '/loja/conjuntos' },
      { label: 'Bermudas', href: '/loja/bermudas' },
      { label: 'Uniformes', href: '/loja/uniformes' },
      { label: 'Calças', href: '/loja/calcas' },
    ],
    navEmpresa: [
      { label: 'Sobre nós', href: '/sobre' },
      { label: 'Atacado', href: '/atacado' },
      { label: 'Trocas', href: '/troca' },
      { label: 'Privacidade', href: '/privacidade' },
    ],
  },

  seo: {
    title: 'Hoomau Store — Veste Atitude · Recanto das Emas',
    titleTemplate: '%s | Hoomau Store',
    description: 'Marca própria no Recanto das Emas, Brasília-DF. Camisetas, conjuntos, uniformes e atacado. Vestimos autoestima e atitude. Entrega em todo o Brasil.',
    keywords: ['Hoomau', 'marca própria', 'Recanto das Emas', 'Brasília', 'DF', 'uniformes', 'atacado', 'roupas', 'loja de roupa Recanto das Emas', 'uniforme corporativo Brasília', 'atacado de roupa DF', 'camiseta masculina Recanto das Emas', 'marca própria Brasília'],
    ogTitle: 'Hoomau Store — Veste Atitude',
    ogDescription: 'Marca própria do Recanto das Emas. Camisetas, conjuntos e uniformes. A moda é só o começo.',
    ogImage: '/og-image.jpg',
    twitterTitle: 'Hoomau Store',
    twitterDescription: 'Vestimos autoestima e atitude. Do Recanto pro Brasil.',
    baseUrl: 'https://hoomau-store.vercel.app',
  },
}
