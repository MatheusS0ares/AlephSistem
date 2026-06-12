'use client'
import { motion } from 'motion/react'
import Image from 'next/image'
import { Play } from 'lucide-react'
import { InstagramIcon } from '@/components/brand/InstagramIcon'
import type { ReelDestaque } from '@/lib/firebase/reels-db'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

export function ReelsGalleryClient({ reels }: { reels: ReelDestaque[] }) {
  return (
    <section className="relative py-20 px-4 md:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-paizao-navy/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12 border-b border-paizao-surface-2 pb-6"
        >
          <div>
            <div className="flex items-center gap-2 text-paizao-gold text-xs tracking-[0.3em] uppercase mb-3">
              <InstagramIcon size={16} />
              <span>@paizaomodas2</span>
            </div>
            <h2
              className="text-[clamp(2.5rem,6vw,4.5rem)] text-paizao-ink leading-none"
              style={{ fontFamily: 'var(--font-bebas-neue), sans-serif' }}
            >
              NO CLIMA DA<br />
              <span className="text-paizao-gold">PAIZÃO.</span>
            </h2>
          </div>
          <a
            href="https://instagram.com/paizaomodas2"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 text-paizao-gold text-sm uppercase tracking-widest font-bold hover:text-paizao-gold-bright transition"
          >
            Ver mais no InstagramIcon →
          </a>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5"
        >
          {reels.map((reel, idx) => (
            <ReelCard key={reel.id} reel={reel} priority={idx < 3} />
          ))}
        </motion.div>

        <div className="md:hidden mt-8 text-center">
          <a
            href="https://instagram.com/paizaomodas2"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-paizao-gold text-sm uppercase tracking-widest font-bold"
          >
            <InstagramIcon size={18} />
            Ver mais no InstagramIcon →
          </a>
        </div>
      </div>
    </section>
  )
}

function ReelCard({ reel, priority }: { reel: ReelDestaque; priority: boolean }) {
  return (
    <motion.a
      variants={item}
      href={reel.instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative aspect-[4/5] overflow-hidden rounded-lg bg-paizao-surface border border-paizao-surface-2 hover:border-paizao-gold transition-all duration-500"
      whileHover={{ y: -4 }}
    >
      <Image
        src={reel.thumbnail}
        alt={reel.thumbnailAlt}
        fill
        unoptimized
        priority={priority}
        sizes="(max-width: 768px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-paizao-navy-deep/90 via-paizao-navy-deep/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="w-14 h-14 rounded-full bg-paizao-gold/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-paizao-gold/30">
          <Play size={24} className="text-paizao-navy fill-paizao-navy ml-1" />
        </div>
      </div>

      {reel.destaque && (
        <div className="absolute top-3 left-3 px-2 py-1 bg-paizao-gold text-paizao-navy text-[10px] font-bold uppercase tracking-widest rounded">
          ★ Destaque
        </div>
      )}

      {reel.titulo && (
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex items-center gap-1 text-paizao-gold text-[10px] uppercase tracking-widest mb-1">
            <InstagramIcon size={11} />
            <span>Reel</span>
          </div>
          <h3 className="text-white font-bold text-sm md:text-base leading-tight">
            {reel.titulo}
          </h3>
        </div>
      )}
    </motion.a>
  )
}
