import type { TenantConfig } from './types'

export const station061Config: TenantConfig = {
  id: 'station061',
  nome: 'Station 061',
  slogan: 'Original é original. Sem réplica.',
  tema: 'street',
  logoSrc: '/station061logo.png',

  whatsappFloat: true,

  marca: {
    nome: 'STATION',
    sufixo: '061 · Moda e Cia',
  },

  ticker: [
    'Original. Sem réplica.',
    'Lacoste · Jordan · Adidas · Nike',
    'Entrega em todo DF e Entorno',
    'Kit completo pra sair do jeito certo',
    'Loja no Núcleo Bandeirante — Rua 7 L1 L3',
    'Peça no Zap ou no Direct',
    'Copa 2026 — Camisas chegando',
    'Novidade toda semana',
  ],

  // primary → paizao-gold (destaque), accent → paizao-navy (fundos de seção)
  cores: {
    primary: '#004526',        // Verde Lacoste — todos os destaques
    primaryBright: '#006b3c',  // Verde Lacoste brilhante
    primarySoft: '#003d21',    // Verde Lacoste suave
    accent: '#141720',         // Superfície de seção (navy slot)
    accentDeep: '#0c0e14',     // Deep navy/black
    bg: '#0c0e14',             // Fundo principal
    surface: '#141720',        // Cards
    surface2: '#1e2130',       // Bordas
    ink: '#ffffff',            // Texto branco puro
    inkDim: '#8892a4',         // Texto secundário
    success: '#25D366',        // Verde WhatsApp
    green: '#004526',          // Verde Lacoste temático
    yellow: '#ffdf00',         // Amarelo Brasil (kits)
    red: '#cc1111',            // Vermelho sale/badge
  },

  hero: {
    badge: 'Núcleo Bandeirante · Brasília-DF',
    titulo: 'ORIGINAL',
    tituloAccent: 'SEM RÉPLICA',
    descricao: 'Lacoste, Jordan, Nike e Adidas do jeito certo. Kit completo, entrega em todo DF. Sem enganação.',
    ctaPrimario: { label: 'Ver os Kits', href: '/loja' },
    ctaSecundario: { label: 'Chamar no Zap', href: '#whatsapp' },
    // videoSrc: '/station061-hero.mp4'  // descomente ao subir o vídeo
  },

  stats: [
    { valor: 1261, label: 'clientes atendidos', sufixo: '+' },
    { valor: 100, label: 'original', sufixo: '%' },
    { valor: 300, label: 'entregas no DF', sufixo: '+' },
  ],

  categorias: [
    { id: 'conjuntos', slug: 'conjuntos', nome: 'Conjuntos', icone: '👔', total: 0, corRgb: '0,69,38' },
    { id: 'camisetas', slug: 'camisetas', nome: 'Camisetas', icone: '👕', total: 0, corRgb: '0,69,38' },
    { id: 'bermudas', slug: 'bermudas', nome: 'Bermudas', icone: '🩳', total: 0, corRgb: '0,61,33' },
    { id: 'tenis', slug: 'tenis', nome: 'Tênis', icone: '👟', total: 0, corRgb: '0,69,38' },
    { id: 'polos', slug: 'polos', nome: 'Polo', icone: '🎽', total: 0, corRgb: '0,61,33' },
    { id: 'kits', slug: 'kits', nome: 'Kits Brasil', icone: '🇧🇷', total: 0, corRgb: '0,156,59' },
    { id: 'times', slug: 'times', nome: 'Camisas de Time', icone: '⚽', total: 0, corRgb: '0,69,38' },
  ],

  categoriasBadge: 'Do que você precisa?',
  categoriasTitle: 'NOSSOS KITS',

  colecaoDestaque: {
    badge: 'Só Relíquia',
    titulo: 'LANÇAMENTO',
    tituloAccent: 'DO CORRE',
    descricao: 'O que tá chegando agora. Lacoste, Jordan e os kits mais pedidos do DF. Enquanto tem.',
    ctaLabel: 'Ver Tudo',
    ctaHref: '/loja',
  },

  atacado: {
    badge: 'Revendedor',
    titulo: 'QUER',
    tituloAccent: 'REVENDER?',
    descricao: 'Compra em quantidade e revende com margem. Sem burocracia — fala direto com a gente no Zap.',
    contadores: [
      { valor: 30, label: 'desconto', sufixo: '%', prefixo: 'até' },
      { valor: 5, label: 'peças mínimo', sufixo: '', prefixo: 'a partir de' },
      { valor: 48, label: 'entrega', sufixo: 'h', prefixo: 'em até' },
    ],
    ctaPrimario: { label: 'Falar no Zap', href: '/atacado' },
    whatsappMsg: 'Salve!%20Quero%20revender%20produtos%20da%20Station%20061.',
  },

  lojaFisica: {
    badge: 'Cola aqui',
    titulo: 'LOJA FÍSICA',
    tituloAccent: 'NÚCLEO BANDEIRANTE',
    enderecoRua: 'Rua 7 Lote 1 Loja 3',
    enderecoCidadeEstado: 'Núcleo Bandeirante, Brasília-DF',
    enderecoFooter: 'Rua 7 Lote 1 Loja 3 — Núcleo Bandeirante, Brasília-DF',
    horarios: [
      { dias: 'Segunda a Sábado', horas: '9h às 19h' },
      { dias: 'Domingo', horas: '9h às 14h' },
    ],
    horarioSumario: 'Seg–Sáb 9h–19h · Dom 9h–14h',
    mapsUrl: 'https://maps.google.com/?q=Rua+7+Lote+1+Nucleo+Bandeirante+Brasilia+DF',
    mapTitle: 'Núcleo Bandeirante, DF',
    mapSubtitle: 'Rua 7 Lote 1 Loja 3',
  },

  contato: {
    whatsapp: '5561982059679',
    whatsappFormatado: '(61) 9 8205-9679',
    instagram: '@station061',
    instagramUrl: 'https://instagram.com/station061',
    instagramSeguidores: '1.261',
  },

  nav: {
    links: [
      { href: '/loja', label: 'Loja' },
      { href: '/loja/conjuntos', label: 'Conjuntos' },
      { href: '/loja/tenis', label: 'Tênis' },
      { href: '/loja/polos', label: 'Polo' },
      { href: '/loja/kits', label: 'Kits Brasil' },
      { href: '/loja/times', label: 'Camisas de Time' },
      { href: '/sobre', label: 'Sobre' },
    ],
  },

  sobre: {
    historia: [
      'Station 061 surgiu no Núcleo Bandeirante com um propósito direto: trazer o original de verdade pra quem é do DF.',
      'Lacoste, Jordan, Adidas, Nike — só o que é certo, sem réplica. Quem compra aqui sabe exatamente o que tá levando.',
      'Loja física no Núcleo, entrega em todo DF e entorno. Chega no direct ou no Zap e a gente resolve na hora.',
    ],
    valores: [
      { titulo: '100% Original', desc: 'Sem réplica, sem enganação. Só original e importado — você não corre risco aqui.' },
      { titulo: 'Entrega em Todo DF', desc: 'Você pediu, a gente entrega. Todo DF e entorno, você combina o horário.' },
      { titulo: 'Direto com a Loja', desc: 'Sem bot, sem robô. Fala direto com quem vende no Zap ou no direct.' },
    ],
    ctaTitulo: 'BORA MONTAR O KIT?',
  },

  footer: {
    descricao: 'Original e importado. Do Núcleo pro DF inteiro.',
    copyright: '© {year} Station 061. Todos os direitos reservados.',
    tagline: 'Rua 7 Lote 1 Loja 3 · Núcleo Bandeirante-DF',
    navLoja: [
      { label: 'Conjuntos', href: '/loja/conjuntos' },
      { label: 'Camisetas', href: '/loja/camisetas' },
      { label: 'Bermudas', href: '/loja/bermudas' },
      { label: 'Tênis', href: '/loja/tenis' },
      { label: 'Polo', href: '/loja/polos' },
      { label: 'Kits Brasil', href: '/loja/kits' },
      { label: 'Camisas de Time', href: '/loja/times' },
    ],
    navEmpresa: [
      { label: 'Sobre nós', href: '/sobre' },
      { label: 'Atacado', href: '/atacado' },
      { label: 'Privacidade', href: '/privacidade' },
    ],
  },

  seo: {
    title: 'Station 061 — Original Sem Réplica · Núcleo Bandeirante-DF',
    titleTemplate: '%s | Station 061',
    description: 'Lacoste, Jordan, Adidas e Nike originais no Núcleo Bandeirante, Brasília-DF. Kits completos, camisas de time, entrega em todo DF. Peça no WhatsApp.',
    keywords: ['kits lacoste', 'camisas de time', 'roupas originais', 'Brasília', 'DF', 'Lacoste', 'Jordan', 'Copa 2026', 'Nucleo Bandeirante'],
    ogTitle: 'Station 061 — Original Sem Réplica',
    ogDescription: 'Lacoste, Jordan e Nike originais. Kits completos pra sair do jeito certo. Entrega em todo DF.',
    ogImage: '/og-image.jpg',
    twitterTitle: 'Station 061',
    twitterDescription: 'Original sem réplica. Do Núcleo pro DF inteiro.',
    baseUrl: 'https://station061.vercel.app',
  },
}
