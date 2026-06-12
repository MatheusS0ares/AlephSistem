'use client'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { getTenant } from '@/tenants'

const tenant = getTenant()
const { categorias, categoriasBadge, categoriasTitle } = tenant

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

const cardVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function CategoriesGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-12"
      >
        <p className="text-paizao-gold text-xs font-bold tracking-[0.25em] uppercase mb-3">
          {categoriasBadge}
        </p>
        <h2
          className="text-[clamp(2.5rem,6vw,4rem)] text-paizao-ink leading-none"
          style={{ fontFamily: 'var(--font-bebas-neue), sans-serif' }}
        >
          {categoriasTitle}
        </h2>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-8% 0px' }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
      >
        {categorias.map((cat) => {
          const rgb = cat.corRgb
          return (
            <motion.div key={cat.id} variants={cardVariant}>
              <Link href={`/loja/${cat.slug}`} className="group block">
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="relative overflow-hidden rounded-2xl border border-paizao-surface-2 bg-paizao-surface p-5 sm:p-6 h-44 flex flex-col justify-between cursor-pointer"
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                    style={{
                      background: `radial-gradient(ellipse at top left, rgba(${rgb},0.13) 0%, transparent 65%)`,
                    }}
                  />
                  <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-paizao-gold/20 transition-colors duration-300 pointer-events-none" />

                  <div className="relative z-10 flex items-start justify-between">
                    <motion.span
                      className="text-4xl block"
                      whileHover={{ scale: 1.15, rotate: -5 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      {cat.icone}
                    </motion.span>
                    <div className="w-7 h-7 rounded-full bg-paizao-gold/10 border border-paizao-gold/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0">
                      <ArrowUpRight size={13} className="text-paizao-gold" />
                    </div>
                  </div>

                  <div className="relative z-10">
                    <p className="text-paizao-ink font-bold text-[15px] leading-snug mb-1.5 group-hover:text-white transition-colors duration-200">
                      {cat.nome}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: `rgb(${rgb})` }}
                      />
                      <span className="text-paizao-ink-dim text-xs">
                        {cat.total} peças
                      </span>
                    </div>
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
