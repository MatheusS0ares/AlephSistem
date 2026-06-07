import { useState } from 'react'
import styles from './StoreLogo.module.css'

const LOGO_FILES = {
  'reino-imperial': '/logos/reino-imperial.png',
  'personalize':    '/logos/personalize.png',
  'huds':           '/logos/huds.png',
}

const FALLBACK = {
  'reino-imperial': { symbol: '♛', text: 'REINO IMPERIAL', sub: 'BRINDES E PRESENTES' },
  'personalize':    { symbol: 'P+', text: 'Personalize+',  sub: 'BRINDES E PRESENTES' },
  'huds':           { symbol: '✂', text: "HUD'S",          sub: 'BARBEARIA' },
}

export default function StoreLogo({ slug, size = 'md', dark = true, className = '' }) {
  const [imgError, setImgError] = useState(false)
  const logoSrc = LOGO_FILES[slug]
  const fallback = FALLBACK[slug] || { symbol: '♛', text: 'Reino Imperial', sub: '' }
  const sizeClass = styles[`size_${size}`] || styles.size_md

  if (logoSrc && !imgError) {
    return (
      <div className={`${styles.imgWrap} ${dark ? styles.imgWrapDark : ''} ${sizeClass} ${className}`}>
        <img
          src={logoSrc}
          alt={fallback.text}
          className={styles.img}
          onError={() => setImgError(true)}
        />
      </div>
    )
  }

  return (
    <div className={`${styles.fallback} ${sizeClass} ${className}`}>
      <span className={styles.symbol}>{fallback.symbol}</span>
      <div className={styles.texts}>
        <span className={styles.name}>{fallback.text}</span>
        {fallback.sub && <span className={styles.sub}>{fallback.sub}</span>}
      </div>
    </div>
  )
}
