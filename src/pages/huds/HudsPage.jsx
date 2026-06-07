import { motion } from 'motion/react'
import { FaWhatsapp } from 'react-icons/fa'
import HeaderHuds from '../../components/huds/HeaderHuds'
import HeroHuds from '../../components/huds/HeroHuds'
import SobreHuds from '../../components/huds/SobreHuds'
import ServicosHuds from '../../components/huds/ServicosHuds'
import ComoAgendarHuds from '../../components/huds/ComoAgendarHuds'
import DepoimentosHuds from '../../components/huds/DepoimentosHuds'
import AgendamentoHuds from '../../components/huds/AgendamentoHuds'
import ContatoHuds from '../../components/huds/ContatoHuds'
import FooterHuds from '../../components/huds/FooterHuds'
import styles from './HudsPage.module.css'

const HUDS = {
  whatsapp: '5561999385296',
  instagram: 'https://instagram.com/hudsbarbearia',
  setmore: 'https://hudsbarbearia.setmore.com/',
}

export default function HudsPage() {
  const wppLink = `https://wa.me/${HUDS.whatsapp}?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20hor%C3%A1rio%20na%20Barbearia%20HUD%27S.`

  return (
    <div className={styles.page}>
      <HeaderHuds whatsapp={HUDS.whatsapp} />
      <main>
        <HeroHuds whatsapp={HUDS.whatsapp} instagram={HUDS.instagram} />
        <SobreHuds />
        <ServicosHuds whatsapp={HUDS.whatsapp} />
        <ComoAgendarHuds setmore={HUDS.setmore} />
        <DepoimentosHuds />
        <AgendamentoHuds whatsapp={HUDS.whatsapp} instagram={HUDS.instagram} />
        <ContatoHuds whatsapp={HUDS.whatsapp} instagram={HUDS.instagram} />
      </main>
      <FooterHuds whatsapp={HUDS.whatsapp} instagram={HUDS.instagram} />

      {/* Floating WhatsApp */}
      <motion.a
        href={wppLink}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.wppFloat}
        aria-label="WhatsApp"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaWhatsapp />
      </motion.a>

      {/* Back to top */}
      <BackToTopHuds />
    </div>
  )
}

function BackToTopHuds() {
  return (
    <motion.button
      className={styles.backTop}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Voltar ao topo"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      ↑
    </motion.button>
  )
}
