import { useLayoutEffect, useState } from 'react'
import { motion } from 'motion/react'

/**
 * Indicador deslizante animado para navegação do admin.
 * Extraído e adaptado de rejjane-app (ref/rejjane-app).
 *
 * @param {string} activeKey - data-key do item ativo
 * @param {React.RefObject} containerRef - ref do elemento nav/aside pai
 * @param {string} color - cor de fundo do indicador
 */
export default function SlidingIndicator({ activeKey, containerRef, color = 'rgba(212,175,55,0.13)' }) {
  const [pos, setPos] = useState({ left: 0, width: 0, top: 0, height: 0 })

  useLayoutEffect(() => {
    const el = containerRef?.current
    if (!el) return
    const active = el.querySelector(`[data-key="${activeKey}"]`)
    if (!active) return
    const cr = el.getBoundingClientRect()
    const ar = active.getBoundingClientRect()
    setPos({ left: ar.left - cr.left, width: ar.width, top: ar.top - cr.top, height: ar.height })
  }, [activeKey, containerRef])

  return (
    <motion.div
      animate={{ x: pos.left, y: pos.top, width: pos.width, height: pos.height }}
      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
      style={{
        position: 'absolute', top: 0, left: 0,
        background: color, borderRadius: 10,
        zIndex: 0, pointerEvents: 'none',
      }}
    />
  )
}
