import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { supabase } from '../../../lib/supabase'
import styles from './DashboardHome.module.css'

const STATUS_LABELS = {
  orcamento: 'Orçamento', confirmado: 'Confirmado',
  encomendado: 'Encomendado', chegou: 'Chegou ✨',
  entregue: 'Entregue', cancelado: 'Cancelado',
}

export default function DashboardHome({ onNavigate, store }) {
  const [stats, setStats] = useState({ aberto: 0, encomendado: 0, chegou: 0, semana: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [financials, setFinancials] = useState({ entradas: 0, saidas: 0 })
  const [topProducts, setTopProducts] = useState([])

  useEffect(() => {
    if (store?.id) loadData()
  }, [store?.id])

  async function loadData() {
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    const [ordersRes, transRes, prodsRes] = await Promise.all([
      supabase.from('orders').select('*').eq('store_id', store.id).order('created_at', { ascending: false }),
      supabase.from('transactions').select('*').eq('store_id', store.id).gte('created_at', startOfMonth),
      supabase.from('products').select('name, sold_count').order('sold_count', { ascending: false }).limit(5),
    ])

    const orders = ordersRes.data || []
    setRecentOrders(orders.slice(0, 6))

    const weekStart = startOfWeek.toISOString()
    setStats({
      aberto:      orders.filter(o => ['orcamento','confirmado'].includes(o.status)).length,
      encomendado: orders.filter(o => o.status === 'encomendado').length,
      chegou:      orders.filter(o => o.status === 'chegou').length,
      semana:      orders.filter(o => o.created_at >= weekStart).length,
    })

    const trans = transRes.data || []
    setFinancials({
      entradas: trans.filter(t => t.type === 'entrada').reduce((s, t) => s + Number(t.amount), 0),
      saidas:   trans.filter(t => t.type === 'saida').reduce((s, t) => s + Number(t.amount), 0),
    })

    setTopProducts(prodsRes.data || [])
  }

  const fmt = (v) => `R$ ${Number(v).toFixed(2).replace('.', ',')}`
  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })

  const STAT_CARDS = [
    { label: 'Em aberto',   value: stats.aberto,      sub: 'pedidos ativos',       color: '#c9a84c' },
    { label: 'Encomendados',value: stats.encomendado, sub: 'aguardando chegada',    color: '#7c9ef5' },
    { label: 'Chegou! ✨',  value: stats.chegou,      sub: 'prontos para entrega',  color: '#56d18f' },
    { label: 'Esta semana', value: stats.semana,       sub: 'pedidos novos',         color: '#e8a87c' },
  ]

  return (
    <div className={styles.page}>
      {/* Hero greeting */}
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.heroDate}>{today.charAt(0).toUpperCase() + today.slice(1)}</span>
          <h2 className={styles.heroGreeting}>Bem-vindo, {store?.name} ♛</h2>
          <p className={styles.heroSub}>
            Você tem <strong>{stats.aberto}</strong> pedido{stats.aberto !== 1 ? 's' : ''} em andamento
            {stats.chegou > 0 && <> e <strong>{stats.chegou}</strong> prontos para entrega</>}.
          </p>
          <div className={styles.heroActions}>
            <button className={styles.btnGold} onClick={() => onNavigate('pedidos')}>+ Novo pedido</button>
            <button className={styles.btnOutline} onClick={() => onNavigate('clientes')}>Ver clientes</button>
          </div>
        </div>
        <span className={styles.storeChip}>{store?.name}</span>
      </div>

      {/* Stat cards */}
      <div className={styles.statsGrid}>
        {STAT_CARDS.map((c, i) => (
          <motion.div
            key={c.label}
            className={styles.statCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <span className={styles.statValue} style={{ color: c.color }}>{c.value}</span>
            <span className={styles.statLabel}>{c.label}</span>
            <span className={styles.statSub}>{c.sub}</span>
          </motion.div>
        ))}
      </div>

      {/* Bottom grid */}
      <div className={styles.bottomGrid}>
        {/* Pedidos em andamento */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Acompanhamento</span>
            <h3 className={styles.sectionTitle}>Pedidos em andamento</h3>
          </div>
          {recentOrders.length === 0 ? (
            <p className={styles.empty}>Nenhum pedido ainda.</p>
          ) : (
            <div className={styles.orderList}>
              {recentOrders.map(o => (
                <div key={o.id} className={styles.orderRow}>
                  <div className={styles.orderAvatar}>{(o.customer_name || o.product_interest || '?')[0].toUpperCase()}</div>
                  <div className={styles.orderInfo}>
                    <span className={styles.orderName}>{o.customer_name || '—'}</span>
                    <span className={styles.orderProduct}>{o.product_name || o.product_interest || '—'}</span>
                  </div>
                  <div className={styles.orderMeta}>
                    <span className={`${styles.statusBadge} ${styles[`status_${o.status}`]}`}>
                      {STATUS_LABELS[o.status] || o.status}
                    </span>
                    {o.total > 0 && <span className={styles.orderTotal}>{fmt(o.total)}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
          <button className={styles.seeAll} onClick={() => onNavigate('pedidos')}>Ver tudo →</button>
        </div>

        {/* Financeiro + Top */}
        <div className={styles.rightCol}>
          <div className={styles.finCard}>
            <span className={styles.sectionLabel}>Este mês</span>
            <div className={styles.finRow}>
              <div>
                <span className={styles.finLabel}>Entradas</span>
                <span className={styles.finEntradas}>{fmt(financials.entradas)}</span>
              </div>
              <div>
                <span className={styles.finLabel}>Saídas</span>
                <span className={styles.finSaidas}>{fmt(financials.saidas)}</span>
              </div>
            </div>
            <div className={styles.finBalance}>
              <span>Saldo</span>
              <span className={financials.entradas - financials.saidas >= 0 ? styles.finEntradas : styles.finSaidas}>
                {fmt(financials.entradas - financials.saidas)}
              </span>
            </div>
            <button className={styles.seeAll} onClick={() => onNavigate('caixa')}>Abrir caixa →</button>
          </div>

          <div className={styles.topCard}>
            <span className={styles.sectionLabel}>Top vendidos</span>
            {topProducts.length === 0 ? (
              <p className={styles.empty}>Nenhum produto ainda.</p>
            ) : (
              <ol className={styles.topList}>
                {topProducts.map((p, i) => (
                  <li key={p.name} className={styles.topItem}>
                    <span className={styles.topRank}>{i + 1}</span>
                    <span className={styles.topName}>{p.name}</span>
                    <span className={styles.topCount}>{p.sold_count || 0} vendidos</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
