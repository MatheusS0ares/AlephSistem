import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import styles from './ComoAgendarHuds.module.css'

const PASSOS = [
  {
    num: '01',
    titulo: 'Escolha o serviço',
    desc: 'Navegue pelos nossos serviços e escolha o que mais combina com o seu estilo.',
    icon: '✂',
  },
  {
    num: '02',
    titulo: 'Agende online ou pelo WhatsApp',
    desc: 'Agende pelo nosso sistema online ou mande mensagem pelo WhatsApp — rápido e sem complicação.',
    icon: '📅',
  },
  {
    num: '03',
    titulo: 'Apareça e arrase',
    desc: 'Chega no horário, relaxa, e sai transformado com seu novo visual.',
    icon: '👑',
  },
]

export default function ComoAgendarHuds({ setmore = 'https://hudsbarbearia.setmore.com/' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className={styles.section} id="como-agendar" ref={ref}>
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.label}>Simples assim</span>
          <h2 className={styles.title}>
            COMO <span className={styles.gold}>AGENDAR</span>
          </h2>
        </motion.div>

        <motion.div
          className={styles.onlineCta}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <a href={setmore} target="_blank" rel="noopener noreferrer" className={styles.onlineBtn}>
            📅 Agendar pelo sistema online
          </a>
        </motion.div>

        <div className={styles.passos}>
          {PASSOS.map((p, i) => (
            <motion.div
              key={p.num}
              className={styles.passo}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.15, duration: 0.6 }}
            >
              <div className={styles.passoNum}>{p.num}</div>
              <div className={styles.passoIcon}>{p.icon}</div>
              <h3 className={styles.passoTitulo}>{p.titulo}</h3>
              <p className={styles.passoDesc}>{p.desc}</p>
              {i < PASSOS.length - 1 && <div className={styles.connector} />}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
