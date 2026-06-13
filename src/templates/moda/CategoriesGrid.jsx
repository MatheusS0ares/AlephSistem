import { Link } from 'react-router-dom'
import { motion } from 'motion/react'

/**
 * Grid de categorias animado para template de moda.
 * Adaptado de Paizão Moda Jovem (ref/paizao-moda-jovem):
 * - substituído next/link por react-router Link
 * - removida dependência de Tailwind (inline styles)
 * - multi-tenant via prop `categorias`
 */

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

const cardVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

/**
 * @param {Array} categorias - [{ id, nome, slug, icone, total, corRgb }]
 * @param {string} storeSlug - slug da loja para montar a URL
 * @param {string} badge - texto acima do título (ex: "Explore")
 * @param {string} titulo - título da seção
 */
export default function CategoriesGrid({ categorias = [], storeSlug = '', badge = 'Nossas Categorias', titulo = 'O que você procura?' }) {
  return (
    <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginBottom: 48 }}
      >
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold, #d4af37)', marginBottom: 12 }}>
          {badge}
        </p>
        <h2 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', color: 'var(--white, #fff)', lineHeight: 1.1, fontWeight: 700 }}>
          {titulo}
        </h2>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-8% 0px' }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}
      >
        {categorias.map(cat => {
          const rgb = cat.corRgb || '212,175,55'
          return (
            <motion.div key={cat.id} variants={cardVariant}>
              <Link to={`/loja/${storeSlug}?categoria=${cat.slug}`} style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  style={{
                    position: 'relative', overflow: 'hidden', borderRadius: 16,
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'var(--black-soft, #111)',
                    padding: '20px 18px', height: 160,
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}
                  className="cat-card"
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = `rgba(${rgb},0.35)`
                    e.currentTarget.style.background = `radial-gradient(ellipse at top left, rgba(${rgb},0.1) 0%, var(--black-soft, #111) 65%)`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.background = 'var(--black-soft, #111)'
                  }}
                >
                  <div>
                    <motion.span
                      style={{ fontSize: 36, display: 'block' }}
                      whileHover={{ scale: 1.15, rotate: -5 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      {cat.icone}
                    </motion.span>
                  </div>
                  <div>
                    <p style={{ color: 'var(--white, #fff)', fontWeight: 700, fontSize: 14, marginBottom: 4, lineHeight: 1.3 }}>
                      {cat.nome}
                    </p>
                    {cat.total != null && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: `rgb(${rgb})`, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: '#888' }}>{cat.total} produtos</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
