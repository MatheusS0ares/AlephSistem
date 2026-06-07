import { useState, useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { FaWhatsapp } from 'react-icons/fa'
import styles from './ServicosHuds.module.css'

const SERVICOS = [
  {
    categoria: 'Corte',
    nome: 'Corte Clássico',
    desc: 'Corte tradicional com tesoura e pente, acabamento perfeito.',
    preco: 'R$ 45',
    duracao: '40 min',
    icon: '✂',
    destaque: false,
  },
  {
    categoria: 'Corte',
    nome: 'Degradê / Fade',
    desc: 'Degradê moderno com máquina, perfeito para qualquer estilo.',
    preco: 'R$ 50',
    duracao: '45 min',
    icon: '⚡',
    destaque: true,
  },
  {
    categoria: 'Barba',
    nome: 'Barba Completa',
    desc: 'Modelagem e acabamento de barba com navalha e produtos premium.',
    preco: 'R$ 35',
    duracao: '30 min',
    icon: '🪒',
    destaque: false,
  },
  {
    categoria: 'Combo',
    nome: 'Corte + Barba',
    desc: 'O combo perfeito: corte e barba com todo o cuidado que você merece.',
    preco: 'R$ 75',
    duracao: '70 min',
    icon: '👑',
    destaque: true,
  },
  {
    categoria: 'Tratamento',
    nome: 'Hidratação Capilar',
    desc: 'Tratamento profundo para nutrir, hidratar e revitalizar os fios.',
    preco: 'R$ 40',
    duracao: '30 min',
    icon: '💧',
    destaque: false,
  },
  {
    categoria: 'Acabamento',
    nome: 'Sobrancelha Masculina',
    desc: 'Modelagem e acabamento de sobrancelha com linha e pinça.',
    preco: 'R$ 20',
    duracao: '15 min',
    icon: '✦',
    destaque: false,
  },
]

const CATEGORIAS = ['Todos', 'Corte', 'Barba', 'Combo', 'Tratamento', 'Acabamento']

export default function ServicosHuds({ whatsapp = '5500000000000' }) {
  const [catAtiva, setCatAtiva] = useState('Todos')
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const filtrados = catAtiva === 'Todos'
    ? SERVICOS
    : SERVICOS.filter(s => s.categoria === catAtiva)

  const wppLink = (nome) =>
    `https://wa.me/${whatsapp}?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20${encodeURIComponent(nome)}%20na%20Barbearia%20HUD%27S.`

  return (
    <section className={styles.servicos} id="servicos" ref={ref}>
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.label}>O que fazemos</span>
          <h2 className={styles.title}>
            NOSSOS <span className={styles.gold}>SERVIÇOS</span>
          </h2>
          <p className={styles.subtitle}>
            Cada serviço realizado com dedicação e produtos de alta qualidade.
          </p>
        </motion.div>

        <motion.div
          className={styles.filtros}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          {CATEGORIAS.map(cat => (
            <button
              key={cat}
              className={`${styles.filtroBtn} ${catAtiva === cat ? styles.filtroBtnAtivo : ''}`}
              onClick={() => setCatAtiva(cat)}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <div className={styles.grid}>
          {filtrados.map((s, i) => (
            <motion.div
              key={s.nome}
              className={`${styles.card} ${s.destaque ? styles.cardDestaque : ''}`}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
              whileHover={{ y: -4 }}
            >
              {s.destaque && <span className={styles.badge}>Popular</span>}
              <div className={styles.cardTop}>
                <span className={styles.cardIcon}>{s.icon}</span>
                <span className={styles.cardCat}>{s.categoria}</span>
              </div>
              <h3 className={styles.cardNome}>{s.nome}</h3>
              <p className={styles.cardDesc}>{s.desc}</p>
              <div className={styles.cardBottom}>
                <div className={styles.cardMeta}>
                  <span className={styles.preco}>{s.preco}</span>
                  <span className={styles.duracao}>⏱ {s.duracao}</span>
                </div>
                <a
                  href={wppLink(s.nome)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.cardCta}
                >
                  <FaWhatsapp /> Agendar
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
