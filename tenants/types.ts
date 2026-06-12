export interface TenantConfig {
  id: string
  nome: string
  slogan: string
  tema: 'copa' | 'luxo' | 'street'   // define hero e seção de destaque na home
  logoSrc: string         // caminho da imagem do logo (ex: /logo.png)

  marca: {
    nome: string          // texto principal do logo (ex: PAIZÃO)
    sufixo: string        // subtítulo do logo (ex: Modas)
  }

  ticker: string[]        // benefícios rolando no topo do header

  cores: {
    primary: string        // gold / cor principal
    primaryBright: string  // gold bright
    primarySoft: string    // gold soft
    accent: string         // navy
    accentDeep: string     // navy-deep
    bg: string             // background
    surface: string        // surface card
    surface2: string       // surface border
    ink: string            // texto principal
    inkDim: string         // texto secundário
    success: string        // whatsapp green
    green: string          // verde temático (Brasil, etc.)
    yellow: string         // amarelo temático
    red: string            // vermelho / sale
  }

  hero: {
    badge: string
    titulo: string
    tituloAccent: string
    descricao: string
    ctaPrimario: { label: string; href: string }
    ctaSecundario: { label: string; href: string }
    videoSrc?: string   // video em loop no background (tema street)
  }

  whatsappFloat?: boolean  // exibe botão flutuante do WhatsApp

  stats: Array<{ valor: number; label: string; sufixo: string }>

  categorias: Array<{
    id: string
    slug: string
    nome: string
    icone: string
    total: number
    corRgb: string // "R,G,B" para glow effect
  }>

  categoriasBadge: string   // "Encontre seu estilo"
  categoriasTitle: string   // "CATEGORIAS"

  colecaoDestaque: {
    badge: string
    titulo: string
    tituloAccent: string
    descricao: string
    ctaLabel: string
    ctaHref: string
  }

  atacado: {
    badge: string
    titulo: string
    tituloAccent: string
    descricao: string
    contadores: Array<{ valor: number; label: string; sufixo: string; prefixo: string }>
    ctaPrimario: { label: string; href: string }
    whatsappMsg: string // URL-encoded message for wa.me link
  }

  lojaFisica: {
    badge: string
    titulo: string
    tituloAccent: string
    enderecoRua: string
    enderecoCidadeEstado: string
    enderecoFooter: string     // single line for footer
    horarios: Array<{ dias: string; horas: string }>
    horarioSumario: string     // "Seg–Sex 9h–18h · Sáb 9h–14h"
    mapsUrl: string
    mapTitle: string
    mapSubtitle: string
  }

  contato: {
    whatsapp: string           // only digits: 5561985818667
    whatsappFormatado: string  // "(61) 9 8581-8667"
    instagram: string          // "@paizaomodas2"
    instagramUrl: string       // "https://instagram.com/paizaomodas2"
    instagramSeguidores: string // "8.324"
  }

  nav: {
    links: Array<{ href: string; label: string }>
  }

  sobre: {
    historia: string[]                                   // parágrafos da história
    valores: Array<{ titulo: string; desc: string }>     // 3 valores (ícones por posição)
    ctaTitulo: string                                    // chamada final ("PRONTO PARA...")
  }

  footer: {
    descricao: string
    copyright: string // use {year} as placeholder — component replaces it
    tagline: string
    navLoja: Array<{ label: string; href: string }>
    navEmpresa: Array<{ label: string; href: string }>
  }

  seo: {
    title: string
    titleTemplate: string
    description: string
    keywords: string[]
    ogTitle: string
    ogDescription: string
    ogImage: string
    twitterTitle: string
    twitterDescription: string
    baseUrl: string
  }
}
