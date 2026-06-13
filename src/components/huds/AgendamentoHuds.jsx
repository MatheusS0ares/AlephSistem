import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'
import styles from './AgendamentoHuds.module.css'

export default function AgendamentoHuds({ whatsapp = '5500000000000', instagram = 'https://instagram.com/hudsbarbearia' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const wppLink = `https://wa.me/${whatsapp}?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20hor%C3%A1rio%20na%20Barbearia%20HUD%27S.`

  return (
    <section className={styles.section} id="agendamento" ref={ref}>
      <div className={styles.noise} />

      <div className={styles.inner}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowLine} /> Agende agora <span className={styles.eyebrowLine} />
          </span>
          <h2 className={styles.title}>
            PRONTO PARA<br />
            <span className={styles.gold}>SE TRANSFORMAR?</span>
          </h2>
          <p className={styles.desc}>
            Não perca mais tempo. Agende seu horário agora mesmo pelo WhatsApp
            e garanta o atendimento que você merece.
          </p>

          <div className={styles.actions}>
            <motion.a
              href={wppLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnPrimary}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <FaWhatsapp />
              Agendar pelo WhatsApp
            </motion.a>
            <motion.a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnSecondary}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <FaInstagram />
              Ver no Instagram
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          className={styles.badge}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <span className={styles.badgeIcon}>✂</span>
          <span className={styles.badgeText}>HUD'S</span>
          <span className={styles.badgeSub}>Barbearia</span>
        </motion.div>
      </div>
    </section>
  )
}
