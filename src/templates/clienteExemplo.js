/**
 * clienteExemplo.js
 * Example config for TemplateClientePage — Studio Cílios (eyelash/aesthetics business)
 *
 * Usage:
 *   import TemplateClientePage from './TemplateClientePage'
 *   import { cilosConfig } from './clienteExemplo'
 *   <TemplateClientePage config={cilosConfig} />
 */

export const cilosConfig = {
  nome: 'Studio Cílios',
  tagline: 'Realce seu olhar',
  whatsapp: '556100000000',
  instagram: 'https://instagram.com/studiocilios',
  cores: {
    primaria: '#D4A0B0',
    fundo: '#0d0d0d',
    texto: '#ffffff',
  },
  tipo: 'estetica',
  servicos: [
    {
      nome: 'Extensão de Cílios Clássica',
      desc: 'Fio a fio para um olhar natural e delicado.',
      preco: 'A partir de R$ 180',
      icon: '👁️',
    },
    {
      nome: 'Extensão Volume Russo',
      desc: 'Máximo volume e dramaticidade para um olhar impactante.',
      preco: 'A partir de R$ 220',
      icon: '✨',
    },
    {
      nome: 'Mega Volume',
      desc: 'Técnica avançada para cílios extremamente volumosos.',
      preco: 'A partir de R$ 260',
      icon: '💎',
    },
    {
      nome: 'Manutenção',
      desc: 'Reposição dos fios para manter o visual sempre bonito.',
      preco: 'A partir de R$ 100',
      icon: '🔧',
    },
    {
      nome: 'Lash Lifting',
      desc: 'Curvatura permanente nos cílios naturais, sem extensão.',
      preco: 'R$ 130',
      icon: '🌸',
    },
    {
      nome: 'Design de Sobrancelhas',
      desc: 'Modelagem e definição para um olhar perfeito.',
      preco: 'R$ 50',
      icon: '🖌️',
    },
  ],
  sobre: {
    texto:
      'No Studio Cílios, acreditamos que cada olhar conta uma história única. Utilizamos técnicas avançadas e materiais de alta qualidade para realçar sua beleza natural com segurança e cuidado. Nossa equipe é especializada e apaixonada pelo que faz.',
    stats: [
      { value: '500+', label: 'Clientes atendidas' },
      { value: '3+', label: 'Anos de experiência' },
      { value: '98%', label: 'Satisfação' },
      { value: '100%', label: 'Materiais premium' },
    ],
  },
  contato: {
    endereco: 'Rua das Flores, 123 — Sala 201',
    horarios: [
      'Segunda a Sexta: 09h – 19h',
      'Sábado: 09h – 17h',
      'Domingo: Fechado',
    ],
    cidade: 'Brasília – DF',
  },
}

/**
 * Template de config genérico para reutilização.
 * Copie e customize para cada novo cliente.
 */
export const templateBaseConfig = {
  nome: 'Nome do Negócio',
  tagline: 'Seu slogan aqui',
  whatsapp: '5561000000000',
  instagram: 'https://instagram.com/seunegocio',
  cores: {
    primaria: '#C8960C',
    fundo: '#0a0a0a',
    texto: '#ffffff',
  },
  tipo: 'generico', // 'barbearia' | 'estetica' | 'salao' | 'generico'
  servicos: [
    { nome: 'Serviço 1', desc: 'Descrição do serviço.', preco: 'R$ 00', icon: '⭐' },
    { nome: 'Serviço 2', desc: 'Descrição do serviço.', preco: 'R$ 00', icon: '⭐' },
    { nome: 'Serviço 3', desc: 'Descrição do serviço.', preco: 'R$ 00', icon: '⭐' },
  ],
  sobre: {
    texto: 'Conte aqui a história do negócio, missão e diferenciais.',
    stats: [
      { value: '0+', label: 'Clientes atendidos' },
      { value: '0+', label: 'Anos de experiência' },
    ],
  },
  contato: {
    endereco: 'Endereço completo',
    horarios: [
      'Segunda a Sexta: 09h – 18h',
      'Sábado: 09h – 14h',
    ],
    cidade: 'Cidade – Estado',
  },
}
