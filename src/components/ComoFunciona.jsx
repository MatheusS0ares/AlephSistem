import { motion } from 'motion/react'
import AnimateOnView from './AnimateOnView'
import styles from './ComoFunciona.module.css'

const steps = [
  { num: '01', icon: '💬', title: 'Entre em contato', desc: 'Nos chame no WhatsApp ou Instagram e conte o que você precisa.' },
  { num: '02', icon: '🎨', title: 'Personalizamos', desc: 'Nossa equipe cria o layout exclusivo com seu nome, tema e estilo.' },
  { num: '03', icon: '✅', title: 'Você aprova', desc: 'Enviamos a arte para aprovação. Ajustamos até você amar.' },
  { num: '04', icon: '🚀', title: 'Receba em casa', desc: 'Enviamos pelo correio ou você retira. Rápido e com segurança.' },
]

export default function ComoFunciona() {
  const handleMouseMove = (e) => {
    const { currentTarget, clientX, clientY } = e
    const rect = currentTarget.getBoundingClientRect()
    currentTarget.style.setProperty('--mouse-x', `${clientX - rect.left}px`)
    currentTarget.style.setProperty('--mouse-y', `${clientY - rect.top}px`)
  }

  return (
    <section className={styles.section}>
      <div className={styles.bgCrown}>♛</div>
      <div className="container">
        <AnimateOnView>
          <div className="section-header">
            <span className="section-eyebrow">Simples e rápido</span>
            <h2 className="section-title">Como <em>funciona</em></h2>
          </div>
        </AnimateOnView>

        <div className={styles.steps}>
          {steps.map((s, i) => (
            <div key={s.num} className={styles.stepWrapper}>
              <motion.div
                className={styles.step}
                onMouseMove={handleMouseMove}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                whileHover={{ y: -4 }}
              >
                <div className={styles.num}>{s.num}</div>
                <motion.div
                  className={styles.icon}
                  whileInView={{ rotate: [0, -10, 10, 0] }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.4, duration: 0.5 }}
                >
                  {s.icon}
                </motion.div>
                <h3 className={styles.title}>{s.title}</h3>
                <p className={styles.desc}>{s.desc}</p>
              </motion.div>
              {i < steps.length - 1 && (
                <motion.div
                  className={styles.arrow}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.3 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.3 }}
                >→</motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
