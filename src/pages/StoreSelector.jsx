import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { FaWhatsapp, FaInstagram, FaMapMarkerAlt } from 'react-icons/fa'
import { useStores } from '../hooks/useSupabase'
import StoreLogo from '../components/StoreLogo'
import styles from './StoreSelector.module.css'

const FALLBACK_STORES = [
  { id: '1', name: 'Reino Imperial', slug: 'reino-imperial', tagline: 'Brindes e Presentes', whatsapp: '5500000000001', instagram: '@reinoimperial', address: 'Endereço da Loja Reino Imperial' },
  { id: '2', name: 'Personalize+',   slug: 'personalize',    tagline: 'Brindes e Presentes', whatsapp: '5500000000002', instagram: '@personalize',   address: 'Endereço da Loja Personalize' },
]

const LOGO_FILES = {
  'reino-imperial': '/logos/reino-imperial.png',
  'personalize':    '/logos/personalize.png',
}

export default function StoreSelector() {
  const navigate = useNavigate()
  const { stores: dbStores, loading } = useStores()
  const stores = dbStores.length > 0 ? dbStores : FALLBACK_STORES

  const handleMouseMove = (e) => {
    const { currentTarget, clientX, clientY } = e
    const rect = currentTarget.getBoundingClientRect()
    currentTarget.style.setProperty('--mouse-x', `${clientX - rect.left}px`)
    currentTarget.style.setProperty('--mouse-y', `${clientY - rect.top}px`)
  }

  return (
    <div className={styles.page}>
      <div className="grid-overlay" />
      <div className="glow-blobs">
        <div className="glow-blob glow-blob--gold" style={{ width: '600px', height: '600px', top: '-10%', left: '10%', animation: 'float-slow 20s infinite alternate' }} />
        <div className="glow-blob glow-blob--white" style={{ width: '500px', height: '500px', bottom: '10%', right: '10%', animation: 'float-medium 25s infinite alternate' }} />
      </div>

      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className={styles.crown}
            animate={{ filter: ['drop-shadow(0 0 6px rgba(201,168,76,0.3))', 'drop-shadow(0 0 20px rgba(201,168,76,0.8))', 'drop-shadow(0 0 6px rgba(201,168,76,0.3))'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >♛</motion.span>
          <h1 className={styles.title}>Reino Imperial</h1>
          <p className={styles.subtitle}>Personalizados</p>
          <div className={styles.divider} />
          <p className={styles.prompt}>Escolha sua unidade</p>
        </motion.div>

        <div className={styles.cards}>
          {stores.map((store, i) => (
            <motion.button
              key={store.id}
              className={styles.card}
              onClick={() => navigate(`/loja/${store.slug}`)}
              onMouseMove={handleMouseMove}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
            >
              {LOGO_FILES[store.slug] && (
                <div className={styles.logoBg} aria-hidden="true">
                  <img src={LOGO_FILES[store.slug]} alt="" className={styles.logoBgImg} />
                  <div className={styles.logoBgGlow} />
                  <div className={styles.logoBgShimmer} />
                </div>
              )}

              <motion.div
                className={styles.cardLogoWrap}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.15, duration: 0.5 }}
              >
                <StoreLogo slug={store.slug} size="xl" />
              </motion.div>

              <h2 className={styles.cardName}>{store.name}</h2>
              {store.tagline && <p className={styles.cardTagline}>{store.tagline}</p>}

              <div className={styles.cardInfo}>
                {store.address && (
                  <span className={styles.cardInfoItem}>
                    <FaMapMarkerAlt className={styles.cardInfoIcon} />
                    {store.address}
                  </span>
                )}
                {store.instagram && (
                  <span className={styles.cardInfoItem}>
                    <FaInstagram className={styles.cardInfoIcon} />
                    {store.instagram}
                  </span>
                )}
                {store.whatsapp && (
                  <span className={styles.cardInfoItem}>
                    <FaWhatsapp className={styles.cardInfoIcon} />
                    WhatsApp disponível
                  </span>
                )}
              </div>

              <div className={styles.cardCta}>
                Acessar loja
                <motion.span
                  className={styles.cardArrow}
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >→</motion.span>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.p
          className={styles.footer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.8 }}
        >
          Feito com ♥ para momentos inesquecíveis
        </motion.p>
      </div>
    </div>
  )
}
