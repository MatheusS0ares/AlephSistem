import { motion } from 'motion/react'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'
import AnimateOnView from './AnimateOnView'
import { useStore } from '../context/StoreContext'
import styles from './Pedido.module.css'

export default function Pedido() {
  const { store } = useStore() || {}
  const wppNumber = store?.whatsapp || '5500000000000'
  const igUrl     = store?.instagram_url || 'https://instagram.com/reinoimperial'

  const handleMouseMove = (e) => {
    const { currentTarget, clientX, clientY } = e
    const rect = currentTarget.getBoundingClientRect()
    currentTarget.style.setProperty('--mouse-x', `${clientX - rect.left}px`)
    currentTarget.style.setProperty('--mouse-y', `${clientY - rect.top}px`)
  }

  return (
    <section className={styles.section} id="pedido">
      <div className="container">
        <AnimateOnView>
          <div className={styles.inner} onMouseMove={handleMouseMove}>
            <div className={styles.content}>
              <span className="section-eyebrow">Vamos criar juntos?</span>
              <h2 className={styles.title}>Pronta para o seu<br /><em>momento especial</em></h2>
              <p className={styles.desc}>
                Cada pedido é único. Conte-nos sua ideia e vamos transformar em realidade com todo o cuidado e carinho que você merece.
              </p>
              <div className={styles.actions}>
                <motion.a
                  href={`https://wa.me/${wppNumber}?text=Olá%20Reino%20Imperial!%20Quero%20fazer%20um%20pedido%20😊`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn--gold btn--lg"
                  whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.97 }}>
                  <FaWhatsapp className="btn__icon" />
                  Chamar no WhatsApp
                </motion.a>
                <motion.a href={igUrl} target="_blank" rel="noopener noreferrer"
                  className="btn btn--outline btn--lg"
                  whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.97 }}>
                  <FaInstagram className="btn__icon" />
                  Ver no Instagram
                </motion.a>
              </div>
            </div>
            <div className={styles.ornament}>
              <motion.div className={styles.crown}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>♛</motion.div>
              {[120, 160, 200].map((size, i) => (
                <motion.div key={size} className={styles.ring}
                  style={{ width: size, height: size }}
                  animate={{ scale: [1, 1.05, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }} />
              ))}
            </div>
          </div>
        </AnimateOnView>
      </div>
    </section>
  )
}
