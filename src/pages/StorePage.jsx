import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { motion } from 'motion/react'
import { StoreProvider, useStore } from '../context/StoreContext'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Sobre from '../components/Sobre'
import Categorias from '../components/Categorias'
import Catalogo from '../components/Catalogo'
import ComoFunciona from '../components/ComoFunciona'
import Depoimentos from '../components/Depoimentos'
import Pedido from '../components/Pedido'
import Contato from '../components/Contato'
import Footer from '../components/Footer'
import WppFloat from '../components/WppFloat'
import BackToTop from '../components/BackToTop'
import SazonalBanner from '../components/SazonalBanner'
import ConfeitariaStorePage from './confeitaria/ConfeitariaStorePage'
import styles from './StorePage.module.css'

function StoreNotFound() {
  const navigate = useNavigate()
  return (
    <div className={styles.notFound}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.notFoundInner}
      >
        <span className={styles.notFoundCrown}>♛</span>
        <h1>Loja não encontrada</h1>
        <p>Esta unidade não existe ou está inativa.</p>
        <motion.button
          className="btn btn--gold"
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          ← Voltar ao início
        </motion.button>
      </motion.div>
    </div>
  )
}

const CONFEITARIA_KEYWORDS = ['emely', 'confeitaria', 'doceria', 'doce', 'brigadeiro']
function isConfeitariaSlug(slug = '') {
  return CONFEITARIA_KEYWORDS.some(k => slug.toLowerCase().includes(k))
}

function ConfeitariaLoader({ name = 'Delícias da Emely' }) {
  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '28px',
      background: '#050315',
    }}>
      {/* Pulsing brigadeiro */}
      <motion.div
        animate={{ scale: [1, 1.18, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ fontSize: '3.5rem', lineHeight: 1 }}
      >
        🍫
      </motion.div>

      {/* Brand name */}
      <motion.p
        animate={{ opacity: [0.35, 0.9, 0.35] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          fontFamily: "'Clash Display', 'Barlow Condensed', sans-serif",
          fontSize: '1.15rem', fontWeight: 600, letterSpacing: '-0.01em',
          color: '#f0d8e4', margin: 0,
        }}
      >
        {name}
      </motion.p>

      {/* Pink shimmer bar */}
      <div style={{
        width: '72px', height: '2px',
        background: 'rgba(212,0,110,0.2)',
        borderRadius: '1px', overflow: 'hidden',
      }}>
        <motion.div
          style={{ width: '45%', height: '100%', background: '#d4006e', borderRadius: '1px' }}
          animate={{ x: ['-120%', '280%'] }}
          transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  )
}

function StoreContent({ slug }) {
  const { store, settings, loading } = useStore()

  useEffect(() => {
    if (store?.name) {
      const tagline = store.tagline || settings?.hero_desc?.slice(0, 60) || ''
      document.title = tagline
        ? `${store.name} — ${tagline}`
        : store.name
    }
  }, [store, settings])

  if (loading) {
    if (isConfeitariaSlug(slug)) return <ConfeitariaLoader name="Delícias da Emely" />
    return (
      <div className={styles.loading}>
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className={styles.loadingCrown}
        >♛</motion.span>
      </div>
    )
  }

  if (!store) return <StoreNotFound />

  const storeType = settings?.store_type || 'default'

  if (storeType === 'confeitaria') return <ConfeitariaStorePage />

  return (
    <div data-theme={storeType}>
      <SazonalBanner />
      <Header />
      <main>
        <Hero />
        <Sobre />
        <Categorias />
        <Catalogo />
        <ComoFunciona />
        <Depoimentos />
        <Pedido />
        <Contato />
      </main>
      <Footer />
      <WppFloat />
      <BackToTop />
    </div>
  )
}

export default function StorePage() {
  const { slug } = useParams()
  return (
    <StoreProvider slug={slug}>
      <StoreContent slug={slug} />
    </StoreProvider>
  )
}
