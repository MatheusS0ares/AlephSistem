import { motion } from 'motion/react'
import { FaWhatsapp, FaInstagram, FaScissors } from 'react-icons/fa6'
import styles from './HeroHuds.module.css'

export default function HeroHuds({ whatsapp = '5500000000000', instagram = 'https://instagram.com/hudsbarbearia' }) {
  const wppLink = `https://wa.me/${whatsapp}?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20hor%C3%A1rio%20na%20Barbearia%20HUD%27S.`

  return (
    <section className={styles.hero} id="inicio">
      <div className={styles.noise} />
      <div className={styles.gradient} />

      <div className={styles.content}>
        <motion.div
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <span className={styles.eyebrowLine} />
          <span>Barbearia HUD'S</span>
          <span className={styles.eyebrowLine} />
        </motion.div>

        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          SEU ESTILO,<br />
          <span className={styles.titleGold}>NOSSA ARTE.</span>
        </motion.h1>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Cortes precisos, barba impecável e um atendimento que você merece.
          <br />Transforme seu visual com quem entende de estilo.
        </motion.p>

        <motion.div
          className={styles.actions}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <motion.a
            href={wppLink}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnPrimary}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <FaWhatsapp /> Agendar agora
          </motion.a>
          <motion.a
            href="#servicos"
            className={styles.btnSecondary}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            Ver serviços
          </motion.a>
        </motion.div>

        <motion.div
          className={styles.social}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <FaWhatsapp />
          </a>
        </motion.div>
      </div>

      <motion.div
        className={styles.decorIcon}
        initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
        animate={{ opacity: 0.06, scale: 1, rotate: 0 }}
        transition={{ delay: 0.5, duration: 1.2 }}
      >
        <FaScissors />
      </motion.div>

      <motion.div
        className={styles.scrollHint}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.8 }}
      >
        <motion.div
          className={styles.scrollLine}
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span>rolar</span>
      </motion.div>
    </section>
  )
}
