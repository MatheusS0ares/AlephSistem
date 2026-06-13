import { motion } from 'motion/react'
import AnimateOnView from './AnimateOnView'
import { useStore } from '../context/StoreContext'
import styles from './Sobre.module.css'

const stats = [
  { num: '3+', label: 'Anos de experiência' },
  { num: '1k+', label: 'Pedidos entregues' },
  { num: '100%', label: 'Satisfação garantida' },
]

export default function Sobre() {
  const { store, settings } = useStore() || {}
  const storeName = store?.name || 'nossa loja'

  return (
    <section className={styles.sobre} id="sobre">
      <div className="container">
        <div className={styles.grid}>
          <AnimateOnView className={styles.imageWrap}>
            <div className={styles.imgFrame}>
              <div className={styles.imgPlaceholder}>
                <motion.span
                  className={styles.crown}
                  animate={{ opacity: [0.1, 0.2, 0.1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >♛</motion.span>
              </div>
              <motion.div
                className={styles.badge}
                initial={{ scale: 0, rotate: -20 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              >
                <span className={styles.badgeNum}>500+</span>
                <span className={styles.badgeText}>Clientes felizes</span>
              </motion.div>
            </div>
          </AnimateOnView>

          <div className={styles.content}>
            <AnimateOnView delay={0.1}>
              <span className="section-eyebrow">Nossa história</span>
              <h2 className="section-title">
                Transformamos momentos<br /><em>em memórias eternas</em>
              </h2>
              <p className={styles.text}>{settings?.sobre_text1 || `Em ${storeName}, acreditamos que cada produto personalizado carrega uma emoção especial. Criamos peças únicas para festas, chás de bebê, aniversários e presentes que deixam quem recebe sem palavras.`}</p>
              <p className={styles.text}>{settings?.sobre_text2 || 'Do convite ao painel de bolo, tudo é pensado com cuidado para que seu evento seja inesquecível.'}</p>
            </AnimateOnView>

            <AnimateOnView delay={0.2}>
              <div className={styles.stats}>
                {stats.map((s, i) => (
                  <motion.div
                    key={s.num}
                    className={styles.stat}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <span className={styles.statNum}>{s.num}</span>
                    <span className={styles.statLabel}>{s.label}</span>
                  </motion.div>
                ))}
              </div>
            </AnimateOnView>

            <AnimateOnView delay={0.3}>
              <motion.a
                href="#contato"
                className="btn btn--gold"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                Fale Conosco
              </motion.a>
            </AnimateOnView>
          </div>
        </div>
      </div>
    </section>
  )
}
