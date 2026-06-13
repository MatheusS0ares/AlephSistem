import { motion } from 'motion/react'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'
import { useStore } from '../context/StoreContext'
import styles from './Hero.module.css'

export default function Hero() {
  const { store, settings } = useStore() || {}
  const wppNumber = store?.whatsapp || '5500000000000'
  const igUrl     = store?.instagram_url || 'https://instagram.com/reinoimperial'
  const title     = settings?.hero_title   || 'Cada detalhe conta uma história única'
  const desc      = settings?.hero_desc    || 'Personalizados exclusivos para festas, presentes e bebês.'
  const eyebrow   = settings?.hero_eyebrow || '✦ Feito com amor, entregue com arte ✦'
  const wppText   = settings?.hero_wpp_text || 'Olá! Quero fazer um pedido no Reino Imperial 😊'

  return (
    <section className={styles.hero} id="inicio">
      <div className={styles.bg} />
      <div className={styles.pattern} />

      <div className={styles.content}>
        <motion.p className={styles.eyebrow}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}>
          {eyebrow}
        </motion.p>

        <motion.h1 className={styles.title}
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}>
          {title.split(' uma ')[0]}
          <em>{title.includes(' uma ') ? ` uma ${title.split(' uma ')[1]}` : ''}</em>
        </motion.h1>

        <motion.p className={styles.desc}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}>
          {desc}
        </motion.p>

        <motion.div className={styles.actions}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}>
          <motion.a href="#catalogo" className="btn btn--gold"
            whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
            Ver Catálogo
          </motion.a>
          <motion.a
            href={`https://wa.me/${wppNumber}?text=${encodeURIComponent(wppText)}`}
            target="_blank" rel="noopener noreferrer" className="btn btn--outline"
            whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
            <FaWhatsapp />
            Pedir pelo WhatsApp
          </motion.a>
        </motion.div>

        <motion.div className={styles.social}
          initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
          transition={{ delay: 1.3 }}>
          <a href={igUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
          <a href={`https://wa.me/${wppNumber}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><FaWhatsapp /></a>
        </motion.div>
      </div>

      <motion.div className={styles.scroll}
        initial={{ opacity: 0 }} animate={{ opacity: 0.4 }}
        transition={{ delay: 1.5 }}>
        <span>Rolar</span>
        <motion.div className={styles.scrollLine}
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
      </motion.div>
    </section>
  )
}
