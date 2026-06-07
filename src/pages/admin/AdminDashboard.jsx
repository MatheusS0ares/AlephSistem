import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { supabase } from '../../lib/supabase'
import { CLIENT_SLUG, CLIENT_NAME } from '../../config/client'
import StoreLogo from '../../components/StoreLogo'
import DashboardHome from './pages/DashboardHome'
import HudsDashboard from './pages/HudsDashboard'
import PedidosPage from './pages/PedidosPage'
import ClientesPage from './pages/ClientesPage'
import CatalogoPage from './pages/CatalogoPage'
import CaixaPage from './pages/CaixaPage'
import AjustesPage from './pages/AjustesPage'
import AgendamentosPage from './pages/AgendamentosPage'
import ProfissionaisPage from './pages/ProfissionaisPage'
import GaleriaPage from './pages/GaleriaPage'
import ServicosPage from './pages/ServicosPage'
import styles from './AdminDashboard.module.css'

const SLUG_NAMES = {
  huds: "HUD'S Barbearia",
}

// Quando CLIENT_SLUG está definido, é um deploy dedicado — pula o seletor
const DEDICATED_STORE = CLIENT_SLUG
  ? {
      id: CLIENT_SLUG,
      name: CLIENT_NAME !== 'AlephSistem' ? CLIENT_NAME : (SLUG_NAMES[CLIENT_SLUG] || CLIENT_SLUG),
      slug: CLIENT_SLUG,
    }
  : null

const FALLBACK_STORES = [
  { id: 'fallback-1', name: 'Confeitaria da Mari',  slug: 'confeitaria-demo' },
  { id: 'fallback-2', name: 'Boutique Style',        slug: 'moda-demo' },
  { id: 'fallback-3', name: 'Burguer Express',       slug: 'delivery-demo' },
  { id: 'fallback-4', name: 'Studio Beauty',         slug: 'beleza-demo' },
  { id: 'fallback-5', name: 'Arte & Mimo',           slug: 'personalizados-demo' },
]

const NAV = [
  { key: 'inicio',        label: 'Início',        icon: '⊞' },
  { key: 'agendamentos',  label: 'Agendamentos',  icon: '📅' },
  { key: 'servicos',      label: 'Serviços',      icon: '✂️' },
  { key: 'pedidos',       label: 'Pedidos',       icon: '📋' },
  { key: 'clientes',      label: 'Clientes',      icon: '👥' },
  { key: 'profissionais', label: 'Profissionais', icon: '💈' },
  { key: 'galeria',       label: 'Galeria',        icon: '📸' },
  { key: 'catalogo',      label: 'Catálogo',       icon: '📦' },
  { key: 'caixa',         label: 'Caixa',         icon: '💰' },
  { key: 'ajustes',       label: 'Ajustes',       icon: '⚙️' },
]

const BOTTOM_NAV = [
  { key: 'inicio',       label: 'Início',       icon: '⊞' },
  { key: 'agendamentos', label: 'Agenda',        icon: '📅' },
  { key: 'pedidos',      label: 'Pedidos',      icon: '📋' },
  { key: 'clientes',     label: 'Clientes',     icon: '👥' },
  { key: 'mais',         label: 'Mais',         icon: '⋯' },
]

export default function AdminDashboard({ onLogout }) {
  const [page, setPage] = useState('inicio')
  const [search, setSearch] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('adminTheme') || 'dark')
  const [storeList, setStoreList] = useState(FALLBACK_STORES)
  const [activeStore, setActiveStore] = useState(() => {
    if (DEDICATED_STORE) return DEDICATED_STORE
    try { return JSON.parse(sessionStorage.getItem('adminActiveStore')) } catch { return null }
  })
  const [switchModal, setSwitchModal] = useState(false)
  const [switchPwd, setSwitchPwd] = useState('')
  const [switchError, setSwitchError] = useState(false)
  const [notifToast, setNotifToast] = useState(null)
  const [agendaBadge, setAgendaBadge] = useState(0)
  const notifTimeout = useRef(null)

  useEffect(() => { localStorage.setItem('adminTheme', theme) }, [theme])

  useEffect(() => {
    supabase.from('stores').select('id, name, slug').eq('active', true).then(({ data }) => {
      if (data?.length) setStoreList(data)
    })
  }, [])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  function pickStore(store) {
    setActiveStore(store)
    setPage('inicio')
    try { sessionStorage.setItem('adminActiveStore', JSON.stringify(store)) } catch {}
  }

  function clearStore() {
    setActiveStore(null)
    try { sessionStorage.removeItem('adminActiveStore') } catch {}
  }

  function promptSwitch() {
    setSwitchPwd('')
    setSwitchError(false)
    setSwitchModal(true)
  }

  function confirmSwitch() {
    const correct = import.meta.env.VITE_ADMIN_PASSWORD || 'aleph2024'
    if (switchPwd === correct) {
      setSwitchModal(false)
      clearStore()
    } else {
      setSwitchError(true)
    }
  }

  function handleLogout() {
    clearStore()
    onLogout()
  }

  const goTo = (key) => {
    setPage(key)
    if (key === 'agendamentos') setAgendaBadge(0)
    setMobileOpen(false)
    setMoreOpen(false)
    setSearch('')
  }

  useEffect(() => {
    if (!activeStore) return
    const channel = supabase
      .channel('admin-new-appointments')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'appointments' }, payload => {
        const a = payload.new
        setAgendaBadge(n => n + 1)
        setNotifToast({ name: a.customer_name, service: a.service_name, time: a.appointment_time, date: a.appointment_date })
        clearTimeout(notifTimeout.current)
        notifTimeout.current = setTimeout(() => setNotifToast(null), 6000)
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [activeStore])

  const isDark = theme === 'dark'

  /* ── Store picker screen ── */
  if (!activeStore) {
    return (
      <div className={`${styles.layout} ${isDark ? '' : styles.light}`}>
        <motion.div
          className={styles.pickerScreen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className={styles.pickerHeader}>
            <h1>Painel Admin א</h1>
            <p>Selecione a loja para continuar</p>
          </div>

          <div className={styles.pickerCards}>
            {storeList.map((store, i) => (
              <motion.button
                key={store.id}
                className={styles.pickerCard}
                onClick={() => pickStore(store)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
              >
                <StoreLogo slug={store.slug} size="lg" dark={isDark} />
                <span className={styles.pickerCardName}>{store.name}</span>
              </motion.button>
            ))}
          </div>

          <button className={styles.pickerThemeToggle} onClick={toggleTheme} title="Alternar tema">
            {isDark ? '☀️' : '🌙'}
          </button>
        </motion.div>
      </div>
    )
  }

  const PAGE_MAP = {
    inicio:         <HudsDashboard onNavigate={goTo} store={activeStore} />,
    agendamentos:   <AgendamentosPage search={search} storeId={activeStore.id} />,
    pedidos:        <PedidosPage search={search} storeId={activeStore.id} storeName={activeStore.name} />,
    clientes:       <ClientesPage search={search} storeId={activeStore.id} />,
    profissionais:  <ProfissionaisPage search={search} storeId={activeStore.id} />,
    galeria:        <GaleriaPage storeId={activeStore.id} />,
    servicos:       <ServicosPage storeId={activeStore.id} />,
    catalogo:       <CatalogoPage />,
    caixa:          <CaixaPage storeId={activeStore.id} />,
    ajustes:        <AjustesPage storeId={activeStore.id} />,
  }

  const pageLabel = NAV.find(n => n.key === page)?.label || ''
  const isMorePage = ['caixa', 'ajustes', 'catalogo', 'profissionais', 'galeria', 'servicos'].includes(page)

  return (
    <div className={`${styles.layout} ${isDark ? '' : styles.light}`}>

      {/* ── Desktop sidebar ── */}
      <aside className={`${styles.sidebar} ${mobileOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarBrand}>
          <StoreLogo slug={activeStore.slug} size="sm" dark={isDark} />
          <div>
            <span className={styles.brandName}>{activeStore.name}</span>
            <span className={styles.brandSub}>Painel Admin</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {NAV.map(item => (
            <button
              key={item.key}
              className={`${styles.navItem} ${page === item.key ? styles.navActive : ''}`}
              onClick={() => goTo(item.key)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
              {page === item.key && (
                <motion.div className={styles.navIndicator} layoutId="navIndicator" />
              )}
            </button>
          ))}
        </nav>

        {!DEDICATED_STORE && (
          <button className={styles.switchStoreBtn} onClick={promptSwitch}>⇄ Trocar loja</button>
        )}
        <button className={styles.logoutBtn} onClick={handleLogout}>↩ Sair</button>
      </aside>

      {/* Mobile backdrop (sidebar) */}
      {mobileOpen && (
        <div className={styles.backdrop} onClick={() => setMobileOpen(false)} />
      )}

      {/* ── Main area ── */}
      <div className={styles.main}>
        <header className={styles.topbar}>
          <button className={styles.menuBtn} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            ☰
          </button>
          <h1 className={styles.pageTitle}>{pageLabel}</h1>

          <div className={styles.topbarRight}>
            <button className={styles.themeToggle} onClick={toggleTheme} title="Alternar tema">
              {isDark ? '☀️' : '🌙'}
            </button>

            {(page === 'pedidos' || page === 'clientes' || page === 'agendamentos' || page === 'profissionais') && (
              <div className={styles.searchWrap}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  className={styles.searchInput}
                  placeholder={
                    page === 'pedidos' ? 'Buscar…' :
                    page === 'agendamentos' ? 'Buscar agendamento…' :
                    page === 'profissionais' ? 'Buscar profissional…' :
                    'Buscar cliente…'
                  }
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            )}

            {page === 'pedidos' && (
              <motion.button
                className={`${styles.newOrderBtn} ${styles.desktopOnly}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => window.__adminOpenNewOrder?.()}
              >
                + Novo pedido
              </motion.button>
            )}

            {page === 'agendamentos' && (
              <motion.button
                className={`${styles.newOrderBtn} ${styles.desktopOnly}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => window.__adminOpenNewAppointment?.()}
              >
                + Novo agendamento
              </motion.button>
            )}
          </div>
        </header>

        <div className={styles.content}>
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {PAGE_MAP[page]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Mobile FAB ── */}
      {page === 'pedidos' && (
        <motion.button
          className={styles.fab}
          whileTap={{ scale: 0.92 }}
          onClick={() => window.__adminOpenNewOrder?.()}
          aria-label="Novo pedido"
        >
          +
        </motion.button>
      )}
      {(page === 'agendamentos' || page === 'inicio') && (
        <motion.button
          className={styles.fab}
          whileTap={{ scale: 0.92 }}
          onClick={() => window.__adminOpenNewAppointment?.()}
          aria-label="Novo agendamento"
        >
          +
        </motion.button>
      )}

      {/* ── Mobile bottom navigation ── */}
      <nav className={styles.bottomNav}>
        {BOTTOM_NAV.map(item => (
          item.key === 'mais' ? (
            <button
              key="mais"
              className={`${styles.bnItem} ${isMorePage || moreOpen ? styles.bnActive : ''}`}
              onClick={() => setMoreOpen(o => !o)}
            >
              <span className={styles.bnIcon}>{item.icon}</span>
              <span className={styles.bnLabel}>{item.label}</span>
            </button>
          ) : (
            <button
              key={item.key}
              className={`${styles.bnItem} ${page === item.key ? styles.bnActive : ''}`}
              onClick={() => goTo(item.key)}
            >
              <span className={styles.bnIcon} style={{ position: 'relative' }}>
                {item.icon}
                {item.key === 'agendamentos' && agendaBadge > 0 && (
                  <span style={{
                    position: 'absolute', top: -2, right: -4, width: 8, height: 8,
                    borderRadius: '50%', background: '#C8960C', display: 'block',
                  }} />
                )}
              </span>
              <span className={styles.bnLabel}>{item.label}</span>
              {page === item.key && (
                <motion.div className={styles.bnIndicator} layoutId="bnIndicator" />
              )}
            </button>
          )
        ))}
      </nav>

      {/* ── Switch store password modal ── */}
      <AnimatePresence>
        {switchModal && (
          <motion.div
            className={styles.pwdOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && setSwitchModal(false)}
          >
            <motion.div
              className={styles.pwdModal}
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
            >
              <h3 className={styles.pwdTitle}>⇄ Trocar Loja</h3>
              <p className={styles.pwdSub}>Confirme a senha do painel para continuar</p>
              <input
                className={`${styles.pwdInput} ${switchError ? styles.pwdInputErr : ''}`}
                type="password"
                placeholder="Senha"
                value={switchPwd}
                autoFocus
                onChange={e => { setSwitchPwd(e.target.value); setSwitchError(false) }}
                onKeyDown={e => e.key === 'Enter' && confirmSwitch()}
              />
              {switchError && <span className={styles.pwdError}>Senha incorreta</span>}
              <div className={styles.pwdFooter}>
                <button className={styles.btnOutlineSm} onClick={() => setSwitchModal(false)}>Cancelar</button>
                <button className={styles.newOrderBtn} onClick={confirmSwitch}>Confirmar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── "Mais" sheet ── */}
      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.div
              className={styles.moreBackdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMoreOpen(false)}
            />
            <motion.div
              className={styles.moreSheet}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            >
              <button className={styles.moreItem} onClick={() => goTo('servicos')}>
                <span>✂️</span> Serviços
              </button>
              <button className={styles.moreItem} onClick={() => goTo('profissionais')}>
                <span>💈</span> Profissionais
              </button>
              <button className={styles.moreItem} onClick={() => goTo('galeria')}>
                <span>📸</span> Galeria de Trabalhos
              </button>
              <button className={styles.moreItem} onClick={() => goTo('catalogo')}>
                <span>📦</span> Catálogo
              </button>
              <button className={styles.moreItem} onClick={() => goTo('caixa')}>
                <span>💰</span> Caixa & Finanças
              </button>
              <button className={styles.moreItem} onClick={() => goTo('ajustes')}>
                <span>⚙️</span> Ajustes
              </button>
              {!DEDICATED_STORE && (
                <button className={styles.moreItem} onClick={() => { setMoreOpen(false); promptSwitch() }}>
                  <span>⇄</span> Trocar loja
                </button>
              )}
              <button className={styles.moreItemDanger} onClick={handleLogout}>
                <span>↩</span> Sair
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Real-time notification toast ── */}
      {createPortal(
        <AnimatePresence>
          {notifToast && (
            <motion.div
              style={{
                position: 'fixed', bottom: 'calc(90px + env(safe-area-inset-bottom))', right: '16px',
                background: '#18181b', border: '1px solid rgba(200,150,12,0.4)',
                borderRadius: '14px', padding: '14px 18px', zIndex: 9999,
                maxWidth: '300px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                display: 'flex', flexDirection: 'column', gap: '4px',
              }}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            >
              <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C8960C' }}>
                📅 Novo agendamento
              </span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fafafa' }}>{notifToast.name}</span>
              <span style={{ fontSize: '0.78rem', color: '#a1a1aa' }}>
                {notifToast.service} · {notifToast.date ? notifToast.date.split('-').reverse().join('/') : ''} às {notifToast.time}
              </span>
              <button
                onClick={() => { setNotifToast(null); goTo('agendamentos') }}
                style={{ marginTop: '8px', padding: '6px 0', background: 'rgba(200,150,12,0.15)', border: '1px solid rgba(200,150,12,0.3)', borderRadius: '8px', color: '#C8960C', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Ver agendamentos →
              </button>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}
