import { motion } from 'motion/react'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'
import { useStore } from '../context/StoreContext'
import styles from './Hero.module.css'

const LOGO_FILES = {
  'reino-imperial': '/logos/reino-imperial.png',
  'personalize':    '/logos/personalize.png',
}

export default function Hero() {
  const { store, settings } = useStore() || {}
  const wppNumber = store?.whatsapp || '5500000000000'
  const igUrl     = store?.instagram_url || 'https://instagram.com/reinoimperial'
  const title     = settings?.hero_title || 'Cada detalhe conta uma história única'
  const desc      = settings?.hero_desc  || 'Personalizados exclusivos para festas, presentes e bebês.'
  const logoSrc   = LOGO_FILES[store?.slug]

  return (
    <section className={styles.hero} id="inicio">
      {logoSrc && (
        <div className={styles.logoBg} aria-hidden="true">
          <img src={logoSrc} alt="" className={styles.logoBgBloom} />
          <img src={logoSrc} alt="" className={styles.logoBgGhost} />
          <div className={styles.logoBgGlow} />
          <div className={styles.logoBgRing} />
          <div className={styles.logoBgRing2} />
        </div>
      )}
      <div className="grid-overlay" />
      <div className="glow-blobs">
        <div className="glow-blob glow-blob--gold" style={{ width: '800px', height: '800px', top: '-20%', left: '-10%', animation: 'float-slow 20s infinite alternate' }} />
        <div className="glow-blob glow-blob--white" style={{ width: '600px', height: '600px', bottom: '10%', right: '-10%', animation: 'float-medium 25s infinite alternate' }} />
      </div>

      <div className={styles.content}>
        <motion.p className={styles.eyebrow}
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}>
          ✦ Feito com amor, entregue com arte ✦
        </motion.p>

        <motion.h1 className={styles.title}
          initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}>
          {title.split(' uma ')[0]}
          <em>{title.includes(' uma ') ? ` uma ${title.split(' uma ')[1]}` : ''}</em>
        </motion.h1>

        <motion.p className={styles.desc}
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}>
          {desc}
        </motion.p>

        <motion.div className={styles.actions}
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}>
          <motion.a href="#catalogo" className="btn btn--gold"
            whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}>
            Ver Catálogo
          </motion.a>
          <motion.a
            href={`https://wa.me/${wppNumber}?text=Olá!%20Quero%20fazer%20um%20pedido%20no%20Reino%20Imperial%20😊`}
            target="_blank" rel="noopener noreferrer" className="btn btn--outline"
            whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}>
            <FaWhatsapp className={styles.wppIcon} />
            Pedir pelo WhatsApp
          </motion.a>
        </motion.div>

        <motion.div className={styles.social}
          initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
          transition={{ delay: 1.1 }}>
          <a href={igUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
          <a href={`https://wa.me/${wppNumber}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><FaWhatsapp /></a>
        </motion.div>
      </div>

      <motion.div className={styles.scroll}
        initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
        transition={{ delay: 1.3 }}>
        <span className={styles.scrollText}>Descobrir</span>
        <div className={styles.scrollMouse}>
          <motion.div className={styles.scrollWheel}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }} />
        </div>
      </motion.div>
    </section>
  )
}
