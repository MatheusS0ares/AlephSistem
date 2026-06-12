import type { TenantConfig } from './types'

// Duplique este arquivo, renomeie pra [nome-loja].ts e preencha todos os campos.
// Depois importe e registre em tenants/index.ts.

export const templateConfig: TenantConfig = {
  id: 'template',         // slug único: 'loja-x', 'urbano-street'
  nome: 'Nome da Loja',
  slogan: 'Slogan da loja aqui',
  tema: 'copa',           // 'copa' (hero futebol) ou 'luxo' (hero preto/dourado)
  logoSrc: '/logo.png',   // imagem do logo em /public

  marca: {
    nome: 'NOME',         // texto principal do logo
    sufixo: 'Subtítulo',  // subtítulo do logo
  },

  ticker: [
    'Benefício 1',
    'Benefício 2',
    'Benefício 3',
  ],

  cores: {
    primary: '#d4a93a',        // cor principal (botões, destaques)
    primaryBright: '#f0c64a',
    primarySoft: '#b89030',
    accent: '#1a2654',         // cor de fundo dos cards / navbar
    accentDeep: '#0f1424',
    bg: '#0a0e1a',
    surface: '#0f1424',
    surface2: '#161b2e',
    ink: '#f5f3ef',            // texto claro
    inkDim: '#8a8d9a',         // texto secundário
    success: '#25D366',        // WhatsApp green (deixar assim)
    green: '#009c3b',          // cor temática secundária
    yellow: '#ffdf00',
    red: '#e63946',
  },

  hero: {
    badge: 'Coleção em Destaque',
    titulo: 'TÍTULO',
    tituloAccent: 'HERO',
    descricao: 'Descrição principal do hero. Uma frase de impacto sobre a loja.',
    ctaPrimario: { label: 'Ver Coleção', href: '/loja' },
    ctaSecundario: { label: 'Saiba Mais', href: '/sobre' },
  },

  stats: [
    { valor: 0, label: 'seguidores', sufixo: '' },
    { valor: 0, label: 'anos de história', sufixo: '+' },
    { valor: 0, label: 'clientes', sufixo: '+' },
  ],

  categorias: [
    // Adicione as categorias reais da loja:
    { id: 'categoria-1', slug: 'categoria-1', nome: 'Categoria 1', icone: '👕', total: 0, corRgb: '59,130,246' },
  ],

  categoriasBadge: 'Encontre seu estilo',
  categoriasTitle: 'CATEGORIAS',

  colecaoDestaque: {
    badge: 'Novidade',
    titulo: 'COLEÇÃO',
    tituloAccent: 'DESTAQUE',
    descricao: 'Descrição da coleção em destaque.',
    ctaLabel: 'Explorar Coleção',
    ctaHref: '/loja',
  },

  atacado: {
    badge: 'Parceria',
    titulo: 'SEJA UM',
    tituloAccent: 'PARCEIRO',
    descricao: 'Descrição da proposta de atacado/parceria.',
    contadores: [
      { valor: 0, label: 'desconto', sufixo: '%', prefixo: 'até' },
      { valor: 0, label: 'peças mínimo', sufixo: '', prefixo: 'a partir de' },
      { valor: 0, label: 'entrega', sufixo: 'h', prefixo: 'em até' },
    ],
    ctaPrimario: { label: 'Quero Revender', href: '/atacado' },
    whatsappMsg: 'Olá!%20Tenho%20interesse%20no%20atacado.',
  },

  lojaFisica: {
    badge: 'Visite-nos',
    titulo: 'LOJA FÍSICA',
    tituloAccent: 'CIDADE-UF',
    enderecoRua: 'Rua Exemplo, 123',
    enderecoCidadeEstado: 'Cidade-UF, CEP 00000-000',
    enderecoFooter: 'Rua Exemplo, 123, Cidade-UF',
    horarios: [
      { dias: 'Segunda a Sexta', horas: '9h às 18h' },
      { dias: 'Sábado', horas: '9h às 13h' },
      { dias: 'Domingo', horas: 'Fechado' },
    ],
    horarioSumario: 'Seg–Sex 9h–18h · Sáb 9h–13h',
    mapsUrl: 'https://maps.google.com/?q=Rua+Exemplo+Cidade',
    mapTitle: 'Cidade-UF',
    mapSubtitle: 'Rua Exemplo, 123',
  },

  contato: {
    whatsapp: '5500000000000',        // só dígitos, com DDI
    whatsappFormatado: '(00) 0 0000-0000',
    instagram: '@handle',
    instagramUrl: 'https://instagram.com/handle',
    instagramSeguidores: '0',
  },

  nav: {
    links: [
      { href: '/loja', label: 'Loja' },
      { href: '/sobre', label: 'Sobre' },
    ],
  },

  sobre: {
    historia: [
      'Primeiro parágrafo da história da loja.',
      'Segundo parágrafo: crescimento, comunidade, números.',
      'Terceiro parágrafo: missão e diferencial.',
    ],
    valores: [
      { titulo: 'Valor 1', desc: 'Descrição do primeiro valor.' },
      { titulo: 'Valor 2', desc: 'Descrição do segundo valor.' },
      { titulo: 'Valor 3', desc: 'Descrição do terceiro valor.' },
    ],
    ctaTitulo: 'PRONTO PARA COMEÇAR?',
  },

  footer: {
    descricao: 'Slogan ou descrição curta da loja para o rodapé.',
    copyright: '© {year} Nome da Loja. Todos os direitos reservados.',
    tagline: 'Cidade-UF',
    navLoja: [
      { label: 'Todas as peças', href: '/loja' },
    ],
    navEmpresa: [
      { label: 'Sobre nós', href: '/sobre' },
      { label: 'Privacidade', href: '/privacidade' },
    ],
  },

  seo: {
    title: 'Nome da Loja — Moda em Cidade-UF',
    titleTemplate: '%s | Nome da Loja',
    description: 'Descrição SEO da loja. Inclua palavras-chave relevantes.',
    keywords: ['moda', 'cidade', 'uf'],
    ogTitle: 'Nome da Loja — Moda em Cidade-UF',
    ogDescription: 'Descrição curta para redes sociais.',
    ogImage: '/og-image.jpg',
    twitterTitle: 'Nome da Loja',
    twitterDescription: 'Descrição curta para Twitter.',
    baseUrl: 'https://exemplo.com.br',
  },
}
