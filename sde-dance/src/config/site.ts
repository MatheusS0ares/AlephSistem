export const site = {
  brand: {
    name: "Escola de Dança Sala de Ensaio",
    short: "SDE Dance",
    since: 2015,
    tagline: "Dança comigo?",
    handle: "@sde.dance",
  },

  contact: {
    phone: "+5561996700607",
    phoneDisplay: "(61) 99670-0607",
    // TODO-CLIENTE: substituir pelo link wa.me/message completo da bio do Instagram
    whatsapp:
      "https://wa.me/5561996700607?text=Ol%C3%A1%21+Vim+pelo+site+e+quero+saber+sobre+as+turmas+da+SDE.",
    instagram: "https://instagram.com/sde.dance",
    // TODO-CLIENTE: endereço exato + ponto de referência para o mapa
    address: "Setor Central do Gama, DF",
    addressNote: "Não funcionamos em horário comercial. Atendimento via WhatsApp.",
  },

  seo: {
    title: "SDE Dance — Escola de Dança Sala de Ensaio | Gama–DF",
    description:
      "10 anos formando corpos, histórias e artistas no coração do Gama. Ballet, Contemporâneo, Jazz e Danças Urbanas — espetáculos em teatros de verdade.",
    // TODO-CLIENTE: imagem OG em alta (1200×630) de espetáculo
    ogImage: "/og-image.jpg",
  },

  hero: {
    eyebrow: "DESDE 2015 · SETOR CENTRAL DO GAMA",
    headline: "Não é só uma aula de dança. É um atravessamento.",
    sub: "10 anos formando corpos, histórias e artistas no coração do Gama.",
    ctaPrimary: { label: "Conheça as turmas", href: "#modalidades" },
    ctaSecondary: { label: "Agende sua aula experimental", href: "#contato" },
    // TODO-CLIENTE: vídeo/foto de espetáculo em alta (hero background)
    mediaSrc: null as string | null,
  },

  modalidades: [
    {
      numero: "I",
      nome: "Ballet",
      faixas: ["Baby (a partir de 3 anos)", "Infantil (a partir de 3 anos)", "Neoclássico Adulto"],
      descricao:
        "Do primeiro passo na barra à técnica neoclássica — o ballet como disciplina, sensibilidade e presença de palco.",
    },
    {
      numero: "II",
      nome: "Dança Contemporânea",
      faixas: [
        "Infantil (6 a 8 anos)",
        "Juvenil (8 a 13 anos)",
        "Adulto Iniciante",
        "Adulto Avançado",
      ],
      descricao:
        "Corpos que investigam, que se entregam à cena e deixam rastros de tudo o que viveram.",
    },
    {
      numero: "III",
      nome: "Danças Urbanas",
      faixas: ["Adulto Iniciante"],
      descricao: "Ritmo, expressão e cultura de rua — movimento que vem das ruas e vai ao palco.",
    },
    {
      numero: "IV",
      nome: "Jazz",
      faixas: ["Turmas em formação"],
      descricao:
        "Técnica, musicalidade e energia — o jazz como ponte entre o clássico e o contemporâneo.",
    },
  ],

  grade: [
    // Segundas e Quartas
    { hora: "09:10", turma: "Ballet Infantil (a partir de 3 anos)", diasSemana: "Seg · Qua" },
    { hora: "17:00", turma: "Ballet Infantil (a partir de 3 anos)", diasSemana: "Seg · Qua" },
    { hora: "18:00", turma: "Dança Contemporânea Infantil (6 a 8 anos)", diasSemana: "Seg · Qua" },
    {
      hora: "18:30",
      turma: "Dança Contemporânea Juvenil (8 a 13 anos)",
      diasSemana: "Seg · Qua",
    },
    { hora: "19:30", turma: "Dança Contemporânea Adulto Iniciante", diasSemana: "Seg · Qua" },
    { hora: "20:00", turma: "Ballet Neoclássico Adulto", diasSemana: "Seg · Qua" },
    { hora: "20:30", turma: "Danças Urbanas Adulto Iniciante", diasSemana: "Seg · Qua" },
    { hora: "21:00", turma: "Dança Contemporânea Adulto Avançado", diasSemana: "Seg · Qua" },
    // Sábados
    { hora: "08:30", turma: "Ballet Baby", diasSemana: "Sáb" },
  ],

  espetaculos: [
    {
      // TODO-CLIENTE: confirmar edição/ano de "A Vida Dança em Movimento"
      titulo: "A Vida Dança em Movimento",
      subtitulo: '"Never Stop"',
      tipo: "Mostra de Dança 2026",
      // TODO-CLIENTE: confirmar data exata — 12 de abril de qual ano
      data: "12 de abril",
      local: "Teatro Sesc Gama",
      sessoes: ["16h — Sessão Infantil", "19h — Sessão Adulto"],
      status: "em-cartaz" as const,
    },
    {
      // TODO-CLIENTE: confirmar data/mês exato de "Heróis e Vilões"
      titulo: "Heróis e Vilões",
      subtitulo: null,
      tipo: "Espetáculo",
      data: "Novembro de 2026",
      local: null,
      sessoes: [],
      status: "inscricoes-abertas" as const,
    },
    {
      // TODO-CLIENTE: confirmar datas de dezembro para "Backstage"
      titulo: "Backstage",
      subtitulo: "Celebração dos 10 anos",
      tipo: "Espetáculo",
      data: "20 e 21 de dezembro",
      local: "Teatro Sesc Gama",
      sessoes: [],
      status: "em-breve" as const,
    },
    {
      titulo: "E se não estreasse?",
      subtitulo: "Mostra de Processos Coreográficos",
      tipo: "Histórico",
      // TODO-CLIENTE: confirmar ano desta mostra
      data: null,
      local: "Teatro da CAESB",
      sessoes: [],
      status: "historico" as const,
    },
  ],

  timeline: [
    { ano: 2015, marco: "Fundação da Escola de Dança Sala de Ensaio no Setor Central do Gama." },
    {
      ano: 2016,
      // TODO-CLIENTE: confirmar marcos anuais para completar a linha do tempo
      marco: "Primeiros espetáculos e construção do repertório artístico.",
    },
    { ano: 2018, marco: "1º Festival SDE — celebração da comunidade e das turmas." },
    { ano: 2019, marco: "SDE Broadway — espetáculo com temática musical." },
    { ano: 2021, marco: "Nós no Circo — nova linguagem, novas possibilidades de cena." },
    {
      ano: 2024,
      marco:
        "BACKSTAGE — espetáculo que homenageia tudo que acontece antes das luzes do palco acenderem.",
    },
    {
      ano: 2025,
      marco:
        "10 anos em cena — uma década de histórias embaladas pela dança que conduz o dia a dia da Sala.",
    },
  ],

  sobre: {
    titulo: "Nossa história",
    paragrafo1:
      "A Escola de Dança Sala de Ensaio nasceu em 2015 no coração do Gama, DF, com uma missão clara: ir além da técnica. Aqui, a dança é atravessamento — formamos não apenas bailarinos, mas artistas que levam o palco dentro de si.",
    paragrafo2:
      "Em 10 anos, produzimos espetáculos em teatros de verdade, formamos nossos próprios professores e construímos uma comunidade onde a arte é o eixo de tudo. Porque a dança supera todos os desafios.",
    filosofia: [
      "Formamos professores dentro da própria escola.",
      "Produzimos espetáculos em teatros: Teatro Sesc Gama, Teatro da CAESB.",
      "Comunicação emocional e poética — não somos uma academia comum.",
    ],
    equipe: [
      { nome: "Camila Graner", papel: "Ballet" },
      // TODO-CLIENTE: nomes completos e papéis do restante do corpo docente
      { nome: "Sérgio", papel: "// TODO-CLIENTE: sobrenome e modalidade" },
    ],
  },

  galeria: [
    // TODO-CLIENTE: fornecer fotos de espetáculos em alta resolução com autorização de imagem
    // Formato: { src: "/galeria/foto-01.jpg", alt: "Descrição da foto" }
  ] as Array<{ src: string; alt: string }>,

  nav: [
    { label: "Modalidades", href: "#modalidades" },
    { label: "Grade", href: "#grade" },
    { label: "Espetáculos", href: "#espetaculos" },
    { label: "Sobre", href: "#sobre" },
    { label: "Contato", href: "#contato" },
  ],
} as const;
