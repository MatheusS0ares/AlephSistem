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
    // TODO-CLIENTE: link wa.me/message completo da bio do Instagram
    whatsapp:
      "https://wa.me/5561996700607?text=Ol%C3%A1%21+Vim+pelo+site+e+quero+saber+sobre+as+turmas+da+SDE.",
    instagram: "https://instagram.com/sde.dance",
    // TODO-CLIENTE: endereço exato (rua, número, CEP) para o mapa
    address: "Setor Central do Gama, DF",
    addressNote: "Não funcionamos em horário comercial. Atendimento via WhatsApp.",
    // TODO-CLIENTE: criar conta em formspree.io e substituir pelo ID real
    // Ex: se a URL for https://formspree.io/f/xpzvwkqb → formEndpoint: "xpzvwkqb"
    formEndpoint: "TODO_FORMSPREE_ID",
  },

  seo: {
    title: "SDE Dance — Escola de Dança Sala de Ensaio | Gama–DF",
    description:
      "10 anos formando corpos, histórias e artistas no coração do Gama. Ballet, Contemporâneo, Jazz e Danças Urbanas — espetáculos em teatros de verdade.",
    ogImage: "/og-image.jpg",
  },

  hero: {
    eyebrow: "DESDE 2015 · SETOR CENTRAL DO GAMA",
    headline: "Não é só uma aula de dança. É um atravessamento.",
    sub: "10 anos formando corpos, histórias e artistas no coração do Gama.",
    ctaPrimary: { label: "Conheça as turmas", href: "#modalidades" },
    ctaSecondary: { label: "Agende sua aula experimental", href: "#matricula" },
    // Para adicionar background: coloque /public/hero.jpg e troque null por "/hero.jpg"
    // TODO-CLIENTE: foto ou vídeo de espetáculo em alta
    backgroundImage: null as string | null,
    backgroundVideo: null as string | null,
  },

  professores: [
    {
      nome: "Camila Graner",
      papel: "Diretora Artística · Ballet",
      modalidades: ["Ballet Baby", "Ballet Infantil", "Ballet Neoclássico Adulto"],
      // TODO-CLIENTE: bio completa de Camila
      bio: "Camila Graner é a alma da Sala de Ensaio. Fundadora e diretora artística da SDE Dance, carrega mais de uma década dedicada à arte do ballet — da formação técnica à sensibilidade de palco que transforma bailarinas em artistas.",
      // TODO-CLIENTE: citação real de Camila
      citacao: "A dança não é o que fazemos com o corpo. É o que o corpo revela da alma.",
      // TODO-CLIENTE: /public/professores/camila.jpg
      foto: null as string | null,
      // TODO-CLIENTE: @ Instagram pessoal de Camila
      instagram: null as string | null,
    },
    {
      // TODO-CLIENTE: sobrenome de Sérgio
      nome: "Sérgio",
      // TODO-CLIENTE: papel e modalidades de Sérgio
      papel: "Professor",
      modalidades: [] as string[],
      // TODO-CLIENTE: bio de Sérgio
      bio: "Com técnica apurada e presença cativante, traz para a Sala de Ensaio uma linguagem que conecta tradição e contemporaneidade. Cada aula é uma nova cena.",
      // TODO-CLIENTE: citação real de Sérgio
      citacao: "Dançar é a única forma de falar o que as palavras não alcançam.",
      foto: null as string | null,
      instagram: null as string | null,
    },
    // TODO-CLIENTE: adicionar demais professores
  ],

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
      faixas: ["Infantil (6 a 8 anos)", "Juvenil (8 a 13 anos)", "Adulto Iniciante", "Adulto Avançado"],
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
    { hora: "09:10", turma: "Ballet Infantil (a partir de 3 anos)", diasSemana: "Seg · Qua", vagas: "disponivel" as const },
    { hora: "17:00", turma: "Ballet Infantil (a partir de 3 anos)", diasSemana: "Seg · Qua", vagas: "poucas" as const },
    { hora: "18:00", turma: "Dança Contemporânea Infantil (6 a 8 anos)", diasSemana: "Seg · Qua", vagas: "disponivel" as const },
    { hora: "18:30", turma: "Dança Contemporânea Juvenil (8 a 13 anos)", diasSemana: "Seg · Qua", vagas: "poucas" as const },
    { hora: "19:30", turma: "Dança Contemporânea Adulto Iniciante", diasSemana: "Seg · Qua", vagas: "disponivel" as const },
    { hora: "20:00", turma: "Ballet Neoclássico Adulto", diasSemana: "Seg · Qua", vagas: "disponivel" as const },
    { hora: "20:30", turma: "Danças Urbanas Adulto Iniciante", diasSemana: "Seg · Qua", vagas: "poucas" as const },
    { hora: "21:00", turma: "Dança Contemporânea Adulto Avançado", diasSemana: "Seg · Qua", vagas: "lotada" as const },
    { hora: "08:30", turma: "Ballet Baby", diasSemana: "Sáb", vagas: "disponivel" as const },
    // TODO-CLIENTE: atualizar status de vagas periodicamente (disponivel | poucas | lotada)
  ],

  espetaculos: [
    {
      titulo: "A Vida Dança em Movimento",
      subtitulo: '"Never Stop"',
      tipo: "Mostra de Dança 2026",
      data: "12 de abril",   // TODO-CLIENTE: confirmar ano
      local: "Teatro Sesc Gama",
      sessoes: ["16h — Sessão Infantil", "19h — Sessão Adulto"],
      status: "em-cartaz" as const,
    },
    {
      titulo: "Heróis e Vilões",
      subtitulo: null,
      tipo: "Espetáculo",
      data: "Novembro de 2026", // TODO-CLIENTE: confirmar data
      local: null,
      sessoes: [],
      status: "inscricoes-abertas" as const,
    },
    {
      titulo: "Backstage",
      subtitulo: "Celebração dos 10 anos",
      tipo: "Espetáculo",
      data: "20 e 21 de dezembro", // TODO-CLIENTE: confirmar
      local: "Teatro Sesc Gama",
      sessoes: [],
      status: "em-breve" as const,
    },
    {
      titulo: "E se não estreasse?",
      subtitulo: "Mostra de Processos Coreográficos",
      tipo: "Histórico",
      data: null,
      local: "Teatro da CAESB",
      sessoes: [],
      status: "historico" as const,
    },
  ],

  // TODO-CLIENTE: adicionar IDs de vídeos do YouTube (canal da escola ou espetáculos)
  // Para achar o ID: no link youtube.com/watch?v=ESTE_TRECHO → copie o trecho após v=
  videos: [] as Array<{
    youtubeId: string;
    titulo: string;
    descricao?: string;
  }>,

  depoimentos: [
    // TODO-CLIENTE: substituir pelos depoimentos reais de pais e alunos
    {
      nome: "Ana Paula",
      papel: "Mãe de aluna — Ballet Infantil",
      texto:
        "Minha filha entrou tímida e hoje sobe ao palco com uma confiança que me emociona toda vez. A SDE não ensina só dança — ensina a se colocar no mundo.",
      foto: null as string | null,
    },
    {
      nome: "Rodrigo Mendes",
      papel: "Aluno adulto — Contemporâneo",
      texto:
        "Comecei sem nenhuma experiência e encontrei aqui um espaço sem julgamento. Cada aula é uma descoberta do próprio corpo. Recomendo de olhos fechados.",
      foto: null as string | null,
    },
    {
      nome: "Fernanda Lima",
      papel: "Mãe de aluno — Ballet Baby",
      texto:
        "Desde os 3 anos meu filho dança na SDE. Ver a evolução dele nos espetáculos do Sesc é indescritível. A Camila e toda a equipe são dedicados de verdade.",
      foto: null as string | null,
    },
  ],

  faq: [
    {
      pergunta: "A partir de que idade as crianças podem começar?",
      resposta:
        "Temos turmas a partir dos 3 anos com o Ballet Baby aos sábados. Para Dança Contemporânea, a partir dos 6 anos. Nunca é tarde para começar — temos turmas para adultos de todos os níveis também.",
    },
    {
      pergunta: "Existe aula experimental gratuita?",
      resposta:
        "Sim! Oferecemos uma aula experimental gratuita sem compromisso. É a melhor forma de conhecer a escola, sentir o espaço e ver se a modalidade é a certa para você ou seu filho.",
    },
    {
      pergunta: "Quais são os valores das mensalidades?",
      resposta:
        "Os valores variam conforme a modalidade e frequência semanal. Entre em contato pelo WhatsApp para receber a tabela atualizada — nosso atendimento é totalmente online.",
    },
    {
      pergunta: "Como funciona o atendimento?",
      resposta:
        "Não funcionamos em horário comercial. Todo o atendimento é feito pela recepção online via WhatsApp. Costumamos responder rapidamente durante o período da tarde e noite.",
    },
    {
      pergunta: "Preciso ter experiência prévia para me matricular?",
      resposta:
        "Não. Temos turmas para iniciantes em todas as modalidades. O importante é a vontade de dançar — a técnica vem com o tempo e com dedicação.",
    },
    {
      pergunta: "Quando acontecem os espetáculos?",
      resposta:
        "A escola realiza espetáculos e mostras ao longo do ano em teatros como o Teatro Sesc Gama e o Teatro da CAESB. Os alunos participam das produções conforme o nível e a turma.",
    },
    {
      pergunta: "Quais são os dias e horários das aulas?",
      resposta:
        "As aulas acontecem às segundas e quartas (das 9h às 21h, variando por turma) e aos sábados (Ballet Baby às 8h30). Confira a grade completa na seção de horários.",
    },
  ],

  timeline: [
    { ano: 2015, marco: "Fundação da Escola de Dança Sala de Ensaio no Setor Central do Gama." },
    { ano: 2016, marco: "Primeiros espetáculos e construção do repertório artístico." },
    { ano: 2018, marco: "1º Festival SDE — celebração da comunidade e das turmas." },
    { ano: 2019, marco: "SDE Broadway — espetáculo com temática musical." },
    { ano: 2021, marco: "Nós no Circo — nova linguagem, novas possibilidades de cena." },
    { ano: 2024, marco: "BACKSTAGE — espetáculo que homenageia tudo que acontece antes das luzes do palco acenderem." },
    { ano: 2025, marco: "10 anos em cena — uma década de histórias embaladas pela dança que conduz o dia a dia da SALA." },
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
  },

  galeria: [
    // Exemplo: { src: "/galeria/foto-01.jpg", alt: "Espetáculo Backstage 2024" }
    // TODO-CLIENTE: fotos de espetáculos com autorização de imagem
  ] as Array<{ src: string; alt: string }>,

  nav: [
    { label: "Modalidades", href: "#modalidades" },
    { label: "Professores", href: "#professores" },
    { label: "Grade", href: "#grade" },
    { label: "Espetáculos", href: "#espetaculos" },
    { label: "Sobre", href: "#sobre" },
    { label: "Contato", href: "#contato" },
  ],
} as const;
