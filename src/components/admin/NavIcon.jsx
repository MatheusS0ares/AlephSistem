/**
 * Ícones SVG para navegação do admin.
 * Extraído e adaptado de rejjane-app (ref/rejjane-app).
 * Ampliado com ícones para todos os itens do AlephSistem.
 */
export default function NavIcon({ id, active, size = 18 }) {
  const color = active ? 'var(--gold, #d4af37)' : 'var(--text-muted, #888)'
  const s = { width: size, height: size, fill: 'none', stroke: color, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', flexShrink: 0 }

  if (id === 'inicio')        return <svg {...s} viewBox="0 0 24 24"><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/></svg>
  if (id === 'pedidos')       return <svg {...s} viewBox="0 0 24 24"><path d="M3 7h18l-2 13H5L3 7z"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/></svg>
  if (id === 'clientes')      return <svg {...s} viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2 21c0-4 3.5-6 7-6s7 2 7 6"/><circle cx="17" cy="9" r="2.5"/><path d="M16 20c0-3 2.5-4.5 5-4.5"/></svg>
  if (id === 'catalogo')      return <svg {...s} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
  if (id === 'caixa')         return <svg {...s} viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M8 15h3"/></svg>
  if (id === 'ajustes')       return <svg {...s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>
  if (id === 'agendamentos')  return <svg {...s} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>
  if (id === 'servicos')      return <svg {...s} viewBox="0 0 24 24"><path d="M6 3c0 5.5 4.5 7 4.5 12M17 3c0 5.5-4.5 7-4.5 12"/><path d="M3 10h18M3 14h18"/></svg>
  if (id === 'profissionais') return <svg {...s} viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"/><path d="M16 3.5c1 .8 2 2 2 4.5"/></svg>
  if (id === 'galeria')       return <svg {...s} viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
  if (id === 'mais')          return <svg {...s} viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>
  return null
}
