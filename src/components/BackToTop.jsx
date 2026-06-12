import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import styles from './BackToTop.module.css'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          className={styles.btn}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ backgroundColor: 'var(--gold)', color: 'var(--black)', y: -3 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Voltar ao topo"
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  )
}
