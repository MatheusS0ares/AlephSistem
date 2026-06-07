import { useState, useEffect } from 'react'
import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { supabase } from '../../lib/supabase'
import styles from './ProfissionalHuds.module.css'

const FALLBACK = {
  name: 'Fabrício Huds',
  role: 'Barbeiro',
  bio: 'Especialista em cortes modernos e tradicionais, degradê e barba. Mais de 8 anos transformando estilos em Gama-DF.',
  instagram: 'hudsbarbearia',
  photo_url: null,
}

const STATS = [
  { num: '8+', label: 'Anos' },
  { num: '500+', label: 'Clientes' },
  { num: 'Gama', label: 'DF' },
]

export default function ProfissionalHuds() {
  const [prof, setProf] = useState(FALLBACK)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  useEffect(() => {
    supabase
      .from('professionals')
      .select('*')
      .eq('store_id', 'huds')
      .eq('active', true)
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setProf({ ...FALLBACK, ...data })
      })
  }, [])

  const firstLetter = prof.name ? prof.name.charAt(0).toUpperCase() : 'F'

  return (
    <section className={styles.section} id="barbeiro" ref={ref}>
      <motion.div
        className={styles.inner}
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Left — content */}
        <div className={styles.content}>
          <span className={styles.label}>O BARBEIRO</span>

          <h2 className={styles.name}>
            {prof.name.split(' ').map((part, i) => (
              i === 0
                ? <span key={i}>{part} </span>
                : <span key={i} className={styles.gold}>{part}</span>
            ))}
          </h2>

          <span className={styles.rolePill}>{prof.role || 'Barbeiro'}</span>

          <p className={styles.bio}>{prof.bio || FALLBACK.bio}</p>

          <div className={styles.stats}>
            {STATS.map(s => (
              <div key={s.label} className={styles.statItem}>
                <span className={styles.statNum}>{s.num}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>

          {prof.instagram && (
            <a
              href={`https://instagram.com/${prof.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.igBtn}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
              </svg>
              @{prof.instagram}
            </a>
          )}
        </div>

        {/* Right — avatar */}
        <div className={styles.avatar}>
          {prof.photo_url ? (
            <img src={prof.photo_url} alt={prof.name} />
          ) : (
            firstLetter
          )}
        </div>
      </motion.div>
    </section>
  )
}
