import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { supabase } from '../../lib/supabase'
import StoreLogo from '../../components/StoreLogo'
import DashboardHome from './pages/DashboardHome'
import PedidosPage from './pages/PedidosPage'
import ClientesPage from './pages/ClientesPage'
import CatalogoPage from './pages/CatalogoPage'
import CaixaPage from './pages/CaixaPage'
import AjustesPage from './pages/AjustesPage'
import AgendamentosPage from './pages/AgendamentosPage'
import styles from './AdminDashboard.module.css'

const FALLBACK_STORES = [
  { id: 'fallback-1', name: 'Confeitaria da Mari',  slug: 'confeitaria-demo' },
  { id: 'fallback-2', name: 'Boutique Style',        slug: 'moda-demo' },
  { id: 'fallback-3', name: 'Burguer Express',       slug: 'delivery-demo' },
  { id: 'fallback-4', name: 'Studio Beauty',         slug: 'beleza-demo' },
  { id: 'fallback-5', name: 'Arte & Mimo',           slug: 'personalizados-demo' },
]

const NAV = [
  { key: 'inicio',        label: 'Início',       icon: '⊞' },
  { key: 'agendamentos',  label: 'Agendamentos', icon: '📅' },
  { key: 'pedidos',       label: 'Pedidos',      icon: '📋' },
  { key: 'clientes',      label: 'Clientes',     icon: '👥' },
  { key: 'catalogo',      label: 'Catálogo',     icon: '📦' },
  { key: 'caixa',         label: 'Caixa',        icon: '💰' },
  { key: 'ajustes',       label: 'Ajustes',      icon: '⚙️' },
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
    try { return JSON.parse(sessionStorage.getItem('adminActiveStore')) } catch { return null }
  })
  const [switchModal, setSwitchModal] = useState(false)
  const [switchPwd, setSwitchPwd] = useState('')
  const [switchError, setSwitchError] = useState(false)

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
    setMobileOpen(false)
    setMoreOpen(false)
    setSearch('')
  }

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
    inicio:        <DashboardHome onNavigate={goTo} store={activeStore} />,
    agendamentos:  <AgendamentosPage search={search} storeId={activeStore.id} />,
    pedidos:       <PedidosPage search={search} storeId={activeStore.id} storeName={activeStore.name} />,
    clientes:      <ClientesPage search={search} storeId={activeStore.id} />,
    catalogo:      <CatalogoPage />,
    caixa:         <CaixaPage storeId={activeStore.id} />,
    ajustes:       <AjustesPage storeId={activeStore.id} />,
  }

  const pageLabel = NAV.find(n => n.key === page)?.label || ''
  const isMorePage = ['caixa', 'ajustes', 'catalogo'].includes(page)

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

        <button className={styles.switchStoreBtn} onClick={promptSwitch}>⇄ Trocar loja</button>
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

            {(page === 'pedidos' || page === 'clientes' || page === 'agendamentos') && (
              <div className={styles.searchWrap}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  className={styles.searchInput}
                  placeholder={page === 'pedidos' ? 'Buscar…' : page === 'agendamentos' ? 'Buscar agendamento…' : 'Buscar cliente…'}
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
      {page === 'agendamentos' && (
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
              <span className={styles.bnIcon}>{item.icon}</span>
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
              <button className={styles.moreItem} onClick={() => goTo('catalogo')}>
                <span>📦</span> Catálogo
              </button>
              <button className={styles.moreItem} onClick={() => goTo('caixa')}>
                <span>💰</span> Caixa & Finanças
              </button>
              <button className={styles.moreItem} onClick={() => goTo('ajustes')}>
                <span>⚙️</span> Ajustes
              </button>
              <button className={styles.moreItem} onClick={() => { setMoreOpen(false); promptSwitch() }}>
                <span>⇄</span> Trocar loja
              </button>
              <button className={styles.moreItemDanger} onClick={handleLogout}>
                <span>↩</span> Sair
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
