import { useParams, useNavigate } from 'react-router-dom'
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

function StoreContent() {
  const { store, settings, loading } = useStore()

  if (loading) return (
    <div className={styles.loading}>
      <motion.span
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className={styles.loadingCrown}
      >♛</motion.span>
    </div>
  )

  if (!store) return <StoreNotFound />

  const theme = settings?.store_type || 'default'

  return (
    <div data-theme={theme}>
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
      <StoreContent />
    </StoreProvider>
  )
}
