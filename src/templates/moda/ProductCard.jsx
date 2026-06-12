import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'

/**
 * Card de produto para template de moda.
 * Adaptado de Paizão Moda Jovem (ref/paizao-moda-jovem):
 * - substituído next/image por <img>
 * - substituído next/link por react-router Link
 * - removida dependência de Tailwind (inline styles)
 * - integração WhatsApp via link direto
 */

const BADGE_COLORS = {
  Novo:  { bg: '#1a1a2e', color: '#d4af37', border: '1px solid rgba(212,175,55,0.3)' },
  Sale:  { bg: '#c0392b', color: '#fff', border: 'none' },
  Hot:   { bg: '#d4af37', color: '#1a1a2e', border: 'none' },
}

export default function ProductCard({ produto, storeSlug }) {
  const [hovered, setHovered] = useState(false)
  const [selectedSize, setSelectedSize] = useState(null)

  const { nome, imagem, preco, precoOriginal, badge, tamanhos = [], slug, whatsapp } = produto

  const linkHref = storeSlug ? `/loja/${storeSlug}/produto/${slug}` : '#'
  const whatsappMsg = encodeURIComponent(`Olá! Tenho interesse no produto: ${nome}${selectedSize ? ` - Tamanho: ${selectedSize}` : ''}`)
  const whatsappLink = `https://wa.me/${whatsapp}?text=${whatsappMsg}`

  return (
    <motion.article
      style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', background: 'var(--black-soft, #111)', border: '1px solid rgba(255,255,255,0.07)' }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <Link to={linkHref} style={{ display: 'block', textDecoration: 'none' }}>
        {/* Imagem */}
        <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#1a1a1a' }}>
          <img
            src={imagem}
            alt={nome}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
          />

          {badge && BADGE_COLORS[badge] && (
            <span style={{
              position: 'absolute', top: 8, left: 8,
              fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em',
              padding: '3px 8px', borderRadius: 4,
              ...BADGE_COLORS[badge]
            }}>{badge}</span>
          )}

          {/* Seletor de tamanho no hover */}
          <AnimatePresence>
            {hovered && tamanhos.length > 0 && (
              <motion.div
                key="sizes"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: 12,
                  background: 'linear-gradient(to top, rgba(10,10,20,0.95) 0%, transparent 100%)',
                }}
                onClick={e => e.preventDefault()}
              >
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {tamanhos.map(sz => (
                    <button
                      key={sz}
                      onClick={e => { e.preventDefault(); setSelectedSize(sz) }}
                      style={{
                        padding: '3px 10px', fontSize: 11, fontWeight: 700, borderRadius: 6,
                        border: selectedSize === sz ? '1px solid #d4af37' : '1px solid rgba(255,255,255,0.2)',
                        background: selectedSize === sz ? '#d4af37' : 'rgba(255,255,255,0.1)',
                        color: selectedSize === sz ? '#1a1a2e' : '#fff',
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >{sz}</button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info */}
        <div style={{ padding: '12px 14px 4px' }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text, #e0e0e0)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nome}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--gold, #d4af37)' }}>R$ {preco?.toFixed(2)}</span>
            {precoOriginal && (
              <span style={{ fontSize: 12, color: '#777', textDecoration: 'line-through' }}>R$ {precoOriginal?.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>

      {/* Botão WhatsApp */}
      <div style={{ padding: '8px 14px 14px' }}>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            width: '100%', padding: '8px 0', borderRadius: 10,
            background: '#25d366', color: '#fff',
            fontSize: 12, fontWeight: 700, textDecoration: 'none',
            transition: 'opacity 0.15s',
          }}
          onClick={e => e.stopPropagation()}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Comprar via WhatsApp
        </a>
      </div>
    </motion.article>
  )
}
