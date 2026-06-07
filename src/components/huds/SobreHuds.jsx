import { motion } from 'motion/react'
import { useRef } from 'react'
import { useInView } from 'motion/react'
import styles from './SobreHuds.module.css'

const STATS = [
  { value: '5+', label: 'Anos de experiência' },
  { value: '2k+', label: 'Clientes atendidos' },
  { value: '98%', label: 'Satisfação' },
  { value: '3', label: 'Profissionais' },
]

export default function SobreHuds() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className={styles.sobre} id="sobre" ref={ref}>
      <div className={styles.inner}>
        <motion.div
          className={styles.left}
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className={styles.label}>Quem somos</span>
          <h2 className={styles.title}>
            Mais que um corte,<br />
            <span className={styles.gold}>uma experiência.</span>
          </h2>
          <p className={styles.text}>
            A Barbearia HUD'S nasceu da paixão por transformar a autoestima
            masculina através de cortes precisos e atendimento de qualidade.
            Aqui, cada cliente recebe atenção individual e sai com mais
            confiança do que entrou.
          </p>
          <p className={styles.text}>
            Nossos profissionais são especializados em técnicas modernas e
            clássicas — do degradê perfeito ao acabamento na navalha —
            garantindo que seu estilo seja único e impecável.
          </p>
          <div className={styles.divider} />
          <p className={styles.quote}>
            "Cuidar da aparência é cuidar da autoestima."
          </p>
        </motion.div>

        <motion.div
          className={styles.right}
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <div className={styles.statsGrid}>
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                className={styles.statCard}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              >
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </motion.div>
            ))}
          </div>

          <div className={styles.imgBlock}>
            <div className={styles.imgPlaceholder}>
              <div className={styles.imgInner}>
                <span className={styles.imgIcon}>✂</span>
                <span className={styles.imgText}>Barbearia HUD'S</span>
              </div>
            </div>
            <div className={styles.imgAccent} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
