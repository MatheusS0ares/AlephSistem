import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { FaWhatsapp, FaTimes } from 'react-icons/fa'
import { useStore } from '../context/StoreContext'
import styles from './SazonalBanner.module.css'

export default function SazonalBanner() {
  const { store, settings } = useStore() || {}
  const [dismissed, setDismissed] = useState(false)

  if (!settings?.banner_ativo || settings.banner_ativo !== '1' || dismissed) return null

  const texto   = settings.banner_texto || '🎉 Promoção especial! Peça pelo WhatsApp.'
  const cor     = settings.banner_cor   || 'C9A84C'
  const wpp     = store?.whatsapp || '5500000000000'
  const wppText = settings?.hero_wpp_text || 'Olá! Quero aproveitar a promoção 🎁'

  return (
    <AnimatePresence>
      <motion.div
        className={styles.banner}
        style={{ '--banner-cor': `#${cor}` }}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className={styles.inner}>
          <p className={styles.texto}>{texto}</p>
          <a
            href={`https://wa.me/${wpp}?text=${encodeURIComponent(wppText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.cta}
          >
            <FaWhatsapp />
            Pedir agora
          </a>
        </div>
        <button
          className={styles.close}
          onClick={() => setDismissed(true)}
          aria-label="Fechar banner"
        >
          <FaTimes size={12} />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
