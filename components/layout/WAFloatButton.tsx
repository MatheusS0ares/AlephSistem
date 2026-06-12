'use client'
import { motion } from 'motion/react'
import { MessageCircle } from 'lucide-react'
import { getTenant } from '@/tenants'

export function WAFloatButton() {
  const { contato } = getTenant()
  const msg = 'Chama%20no%20Zap%20e%20garante%20o%20seu'
  const href = `https://wa.me/${contato.whatsapp}?text=${msg}`

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2.5, type: 'spring', stiffness: 180, damping: 14 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 bg-[#25D366] text-white font-black text-sm rounded-full shadow-[0_4px_24px_rgba(37,211,102,0.45)] hover:shadow-[0_4px_36px_rgba(37,211,102,0.65)] transition-shadow"
      aria-label="Chamar no WhatsApp"
    >
      <MessageCircle className="w-5 h-5 shrink-0" />
      <span className="hidden sm:inline whitespace-nowrap">Chama no Zap e garante o seu</span>
    </motion.a>
  )
}
