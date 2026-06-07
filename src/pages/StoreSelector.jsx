import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { FaWhatsapp, FaInstagram, FaMapMarkerAlt } from 'react-icons/fa'
import { useStores } from '../hooks/useSupabase'
import StoreLogo from '../components/StoreLogo'
import styles from './StoreSelector.module.css'

const FALLBACK_STORES = [
  { id: '1', name: 'Confeitaria da Mari', slug: 'confeitaria-demo',    tagline: 'Bolos e doces para eventos',    whatsapp: '5500000000001', instagram: '@confeitariadamari', address: 'Brasília - DF' },
  { id: '2', name: 'Boutique Style',      slug: 'moda-demo',           tagline: 'Moda feminina com estilo',      whatsapp: '5500000000002', instagram: '@boutiquestyle',    address: 'Brasília - DF' },
  { id: '3', name: 'Burguer Express',     slug: 'delivery-demo',       tagline: 'Os melhores burguers',          whatsapp: '5500000000003', instagram: '@burguerexpress',   address: 'Brasília - DF' },
  { id: '4', name: 'Studio Beauty',       slug: 'beleza-demo',         tagline: 'Beleza e bem-estar',            whatsapp: '5500000000004', instagram: '@studiobeauty',     address: 'Brasília - DF' },
  { id: '5', name: 'Arte e Mimo',         slug: 'personalizados-demo', tagline: 'Personalizados exclusivos',     whatsapp: '5500000000005', instagram: '@artemimo',         address: 'Brasília - DF' },
  { id: '6', name: "Barbearia HUD'S",     slug: 'huds',                tagline: 'Seu estilo, nossa arte.',       whatsapp: '5500000000006', instagram: '@hudsbarbearia',    address: 'Brasília - DF', customRoute: '/huds' },
]

export default function StoreSelector() {
  const navigate = useNavigate()
  const { stores: dbStores, loading } = useStores()
  const stores = dbStores.length > 0 ? dbStores : FALLBACK_STORES

  return (
    <div className={styles.page}>
      <div className={styles.bg} />
      <div className={styles.pattern} />

      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className={styles.crown}
            animate={{ filter: ['drop-shadow(0 0 6px rgba(201,168,76,0.4))', 'drop-shadow(0 0 16px rgba(201,168,76,0.9))', 'drop-shadow(0 0 6px rgba(201,168,76,0.4))'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >א</motion.span>
          <h1 className={styles.title}>AlephSistem</h1>
          <p className={styles.subtitle}>Gestão para o seu negócio</p>
          <div className={styles.divider} />
          <p className={styles.prompt}>Escolha sua unidade</p>
        </motion.div>

        <div className={styles.cards}>
          {stores.map((store, i) => (
            <motion.button
              key={store.id}
              className={styles.card}
              onClick={() => navigate(store.customRoute || `/loja/${store.slug}`)}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, borderColor: 'var(--gold)', boxShadow: '0 12px 40px rgba(201,168,76,0.3)' }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className={styles.cardLogoWrap}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.15, duration: 0.5 }}
              >
                <StoreLogo slug={store.slug} size="lg" />
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
          Feito com ♥ para negócios de verdade
        </motion.p>
      </div>
    </div>
  )
}
