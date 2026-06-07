import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { FaInstagram } from 'react-icons/fa'
import { supabase } from '../../lib/supabase'
import styles from './GaleriaHuds.module.css'

const STORE_ID = import.meta.env.VITE_CLIENT_SLUG || 'huds'

export default function GaleriaHuds({ instagram = 'https://instagram.com/hudsbarbearia' }) {
  const [fotos, setFotos] = useState([])
  const [loading, setLoading] = useState(true)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  useEffect(() => {
    supabase
      .from('gallery')
      .select('*')
      .eq('store_id', STORE_ID)
      .eq('active', true)
      .order('order_index')
      .limit(12)
      .then(({ data }) => {
        setFotos(data || [])
        setLoading(false)
      })
  }, [])

  if (!loading && fotos.length === 0) return null

  return (
    <section className={styles.section} id="galeria" ref={ref}>
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.label}>Nosso trabalho</span>
          <h2 className={styles.title}>
            CADA CORTE, <span className={styles.gold}>UMA OBRA.</span>
          </h2>
          <p className={styles.subtitle}>
            Resultados reais, clientes satisfeitos. Veja o que fazemos.
          </p>
        </motion.div>

        {loading ? (
          <div className={styles.grid}>
            {[0,1,2,3,4,5].map(i => (
              <div key={i} className={styles.skeleton} style={{ '--delay': `${i * 0.1}s` }} />
            ))}
          </div>
        ) : (
          <div className={styles.grid}>
            {fotos.map((foto, i) => (
              <motion.div
                key={foto.id}
                className={styles.card}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.5 }}
              >
                <img
                  src={foto.image_url}
                  alt={foto.caption || foto.service_tag || 'Trabalho HUD\'S Barbearia'}
                  className={styles.cardImg}
                  loading="lazy"
                />
                <div className={styles.cardOverlay}>
                  {foto.service_tag && (
                    <span className={styles.cardTag}>{foto.service_tag}</span>
                  )}
                  {foto.caption && (
                    <p className={styles.cardCaption}>{foto.caption}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          className={styles.cta}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaBtn}
          >
            <FaInstagram />
            Ver mais no Instagram
          </a>
        </motion.div>
      </div>
    </section>
  )
}
