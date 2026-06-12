import { motion } from 'motion/react'
import { FaWhatsapp } from 'react-icons/fa'
import { useStore } from '../context/StoreContext'
import styles from './WppFloat.module.css'

export default function WppFloat() {
  const { store } = useStore() || {}
  const wppNumber = store?.whatsapp || '5500000000000'

  return (
    <motion.a
      href={`https://wa.me/${wppNumber}?text=Olá!%20Quero%20fazer%20um%20pedido%20😊`}
      target="_blank" rel="noopener noreferrer"
      className={styles.float} aria-label="WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
      <motion.div className={styles.pulse}
        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} />
      <FaWhatsapp className={styles.icon} />
      <span className={styles.tooltip}>Faça seu pedido!</span>
    </motion.a>
  )
}
