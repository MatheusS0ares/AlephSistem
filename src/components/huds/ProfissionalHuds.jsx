import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { supabase } from '../../lib/supabase'
import styles from './ProfissionalHuds.module.css'

const FALLBACK = {
  name: 'Fabrício Huds',
  role: 'Barbeiro & Fundador',
  bio: 'Mais de 8 anos transformando estilos e autoestima em Gama-DF. Especialista em degradê cirúrgico, navalha e técnicas modernas — cada atendimento é uma experiência única e personalizada.',
  instagram: 'hudsbarbearia',
  photo_url: null,
}

const STATS = [
  { num: '8+', label: 'Anos de experiência' },
  { num: '2k+', label: 'Clientes atendidos' },
  { num: '★', label: 'Referência em Gama-DF' },
]

export default function ProfissionalHuds() {
  const [prof, setProf] = useState(FALLBACK)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

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

  const photoUrl = prof.photo_url || '/logos/FabricioHuds.png'
  const nameParts = (prof.name || 'Fabrício Huds').split(' ')
  const firstName = nameParts[0]
  const lastName = nameParts.slice(1).join(' ')

  return (
    <section className={styles.section} id="barbeiro" ref={ref}>

      {/* ── Photo background ── */}
      <div className={styles.photoBg}>
        <img src={photoUrl} alt={prof.name} className={styles.photoImg} />
        <div className={styles.photoGrad} />
        <div className={styles.photoVignette} />
      </div>

      {/* ── Subtle grid decoration ── */}
      <div className={styles.gridDeco} aria-hidden="true">
        <span /><span /><span />
      </div>

      {/* ── Content ── */}
      <div className={styles.container}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4 }}
        >

          {/* Label */}
          <motion.div
            className={styles.labelRow}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <span className={styles.accentBar} />
            <span className={styles.label}>O BARBEIRO</span>
          </motion.div>

          {/* Name */}
          <motion.h2
            className={styles.name}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className={styles.nameWhite}>{firstName.toUpperCase()}</span>
            <br />
            <span className={styles.nameGold}>{lastName.toUpperCase()}</span>
          </motion.h2>

          {/* Role */}
          <motion.span
            className={styles.rolePill}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.45 }}
          >
            {prof.role || FALLBACK.role}
          </motion.span>

          {/* Bio */}
          <motion.p
            className={styles.bio}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.45, duration: 0.45 }}
          >
            {prof.bio || FALLBACK.bio}
          </motion.p>

          {/* Divider */}
          <motion.div
            className={styles.divider}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.55, duration: 0.6, ease: 'easeOut' }}
            style={{ transformOrigin: 'left' }}
          />

          {/* Stats */}
          <motion.div
            className={styles.statsRow}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.45 }}
          >
            {STATS.map((s, i) => (
              <div key={i} className={styles.stat}>
                <span className={styles.statNum}>{s.num}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Instagram */}
          {prof.instagram && (
            <motion.a
              href={`https://instagram.com/${prof.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.igBtn}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7, duration: 0.45 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
              </svg>
              @{prof.instagram}
            </motion.a>
          )}

        </motion.div>
      </div>
    </section>
  )
}
