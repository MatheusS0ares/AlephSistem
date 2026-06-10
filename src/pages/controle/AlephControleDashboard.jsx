import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { supabase } from '../../lib/supabase'
import styles from './AlephControle.module.css'

const SEGMENTS = ['Barbearia', 'Restaurante', 'Boutique', 'Beleza', 'Delivery', 'Pet Shop', 'Academia', 'Clínica', 'Outro']

const STATUS_CFG = {
  em_dia:   { label: 'Em dia',   color: '#22c55e', bg: 'rgba(34,197,94,0.12)'  },
  pendente: { label: 'Pendente', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  atrasado: { label: 'Atrasado', color: '#ef4444', bg: 'rgba(239,68,68,0.12)'  },
  inativo:  { label: 'Inativo',  color: '#71717a', bg: 'rgba(113,113,122,0.12)'},
}

const PAY_STATUS_CFG = {
  pago:      { label: 'Pago',      color: '#22c55e', bg: 'rgba(34,197,94,0.12)'  },
  pendente:  { label: 'Pendente',  color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  atrasado:  { label: 'Atrasado',  color: '#ef4444', bg: 'rgba(239,68,68,0.12)'  },
  cancelado: { label: 'Cancelado', color: '#71717a', bg: 'rgba(113,113,122,0.12)'},
}

const EMPTY_CLIENT = {
  name: '', contact_name: '', contact_whatsapp: '', contact_email: '',
  segment: 'Outro', site_url: '', admin_url: '', store_slug: '',
  monthly_fee: '', setup_fee: '', contract_start: '', contract_renewal: '',
  payment_day: '10', payment_status: 'em_dia', notes: '', active: true,
}

const EMPTY_PAYMENT = {
  amount: '', reference_month: '', due_date: '', paid_date: '',
  status: 'pendente', notes: '',
}

function fmt(val) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0)
}

function fmtDate(d) {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}

function fmtMonth(m) {
  if (!m) return '—'
  const [y, mo] = m.split('-')
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  return `${months[parseInt(mo, 10) - 1]} ${y}`
}

function StatusBadge({ status, cfg }) {
  const s = cfg[status] || cfg['inativo']
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem',
      fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
      color: s.color, background: s.bg,
    }}>
      {s.label}
    </span>
  )
}

function KpiCard({ label, value, sub, icon, color }) {
  return (
    <motion.div
      className={styles.kpiCard}
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={styles.kpiIcon} style={{ color }}>{icon}</div>
      <div>
        <div className={styles.kpiValue} style={{ color }}>{value}</div>
        <div className={styles.kpiLabel}>{label}</div>
        <div className={styles.kpiSub}>{sub}</div>
      </div>
    </motion.div>
  )
}

function LinkBtn({ href, label, icon }) {
  if (!href) return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.linkBtn}
      title={label}
      onClick={e => e.stopPropagation()}
    >
      {icon} {label}
    </a>
  )
}

function ClientCard({ client, payments, onEdit, onPayments, onNewPayment }) {
  const lastPayments = payments.slice(0, 3)
  const status = STATUS_CFG[client.payment_status] || STATUS_CFG.inativo

  return (
    <motion.div
      className={`${styles.clientCard} ${!client.active ? styles.clientCardInactive : ''}`}
      whileHover={{ y: -3 }}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className={styles.clientCardTop}>
        <div className={styles.clientCardBadges}>
          <StatusBadge status={client.payment_status} cfg={STATUS_CFG} />
          {client.segment && (
            <span className={styles.segmentBadge}>{client.segment}</span>
          )}
        </div>
        <button className={styles.editIconBtn} onClick={onEdit} title="Editar">✎</button>
      </div>

      <h3 className={styles.clientName}>{client.name}</h3>

      {client.contact_name && (
        <div className={styles.clientContact}>
          <span>👤</span>
          <span>{client.contact_name}</span>
          {client.contact_whatsapp && (
            <a
              href={`https://wa.me/${client.contact_whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.wppLink}
              onClick={e => e.stopPropagation()}
            >
              📱
            </a>
          )}
        </div>
      )}

      <div className={styles.clientFinancial}>
        <div className={styles.financialItem}>
          <span className={styles.financialLabel}>Mensalidade</span>
          <span className={styles.financialValue}>{fmt(client.monthly_fee)}</span>
        </div>
        {client.payment_day && (
          <div className={styles.financialItem}>
            <span className={styles.financialLabel}>Vencimento</span>
            <span className={styles.financialValue}>dia {client.payment_day}</span>
          </div>
        )}
        {client.setup_fee > 0 && (
          <div className={styles.financialItem}>
            <span className={styles.financialLabel}>Setup</span>
            <span className={styles.financialValue}>{fmt(client.setup_fee)}</span>
          </div>
        )}
      </div>

      {(client.contract_start || client.contract_renewal) && (
        <div className={styles.contractRow}>
          <span>📋</span>
          {client.contract_start && <span>{fmtDate(client.contract_start)}</span>}
          {client.contract_start && client.contract_renewal && <span className={styles.muted}>→</span>}
          {client.contract_renewal && (
            <span style={{ color: isNearRenewal(client.contract_renewal) ? '#f59e0b' : undefined }}>
              {fmtDate(client.contract_renewal)}
            </span>
          )}
        </div>
      )}

      {lastPayments.length > 0 && (
        <div className={styles.paymentsMini}>
          {lastPayments.map(p => (
            <div key={p.id} className={styles.paymentMiniRow}>
              <span className={styles.paymentMiniMonth}>{fmtMonth(p.reference_month)}</span>
              <StatusBadge status={p.status} cfg={PAY_STATUS_CFG} />
              <span className={styles.paymentMiniAmt}>{fmt(p.amount)}</span>
            </div>
          ))}
        </div>
      )}

      <div className={styles.clientLinks}>
        <LinkBtn href={client.site_url} label="Site" icon="🌐" />
        <LinkBtn href={client.admin_url} label="Admin" icon="⚙️" />
      </div>

      {client.notes && (
        <p className={styles.clientNotes}>{client.notes}</p>
      )}

      <div className={styles.clientCardActions}>
        <button className={styles.actionBtn} onClick={onPayments}>
          💳 Pagamentos
        </button>
        <button className={styles.actionBtnPrimary} onClick={onNewPayment}>
          + Lançar
        </button>
      </div>
    </motion.div>
  )
}

function isNearRenewal(dateStr) {
  if (!dateStr) return false
  const diff = (new Date(dateStr) - new Date()) / 86400000
  return diff >= 0 && diff <= 30
}

function PaymentsTable({ payments, clients, onEdit, onDelete, onNewForClient }) {
  if (payments.length === 0) {
    return <div className={styles.emptyState}>Nenhum pagamento encontrado para este período.</div>
  }

  const sorted = [...payments].sort((a, b) => {
    if (a.due_date && b.due_date) return a.due_date < b.due_date ? 1 : -1
    return 0
  })

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Referência</th>
            <th>Vencimento</th>
            <th>Pagamento</th>
            <th>Valor</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(p => {
            const client = clients.find(c => c.id === p.client_id)
            return (
              <tr key={p.id} className={styles.tableRow}>
                <td className={styles.tdClient}>{client?.name || '—'}</td>
                <td>{fmtMonth(p.reference_month)}</td>
                <td>{fmtDate(p.due_date)}</td>
                <td>{fmtDate(p.paid_date)}</td>
                <td className={styles.tdAmount}>{fmt(p.amount)}</td>
                <td><StatusBadge status={p.status} cfg={PAY_STATUS_CFG} /></td>
                <td>
                  <div className={styles.tableActions}>
                    <button className={styles.tableBtn} onClick={() => onEdit(p)}>✎</button>
                    <button className={`${styles.tableBtn} ${styles.tableBtnDanger}`} onClick={() => onDelete(p.id)}>✕</button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function AlephControleDashboard({ onLogout }) {
  const [clients, setClients] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('clientes')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [clientModal, setClientModal] = useState(null)
  const [clientForm, setClientForm] = useState(EMPTY_CLIENT)
  const [paymentModal, setPaymentModal] = useState(null)
  const [paymentForm, setPaymentForm] = useState(EMPTY_PAYMENT)
  const [paymentClientId, setPaymentClientId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [payMonthFilter, setPayMonthFilter] = useState(() => {
    const n = new Date()
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}`
  })
  const [theme, setTheme] = useState(() => localStorage.getItem('controleTheme') || 'dark')
  const [generatingAll, setGeneratingAll] = useState(false)

  useEffect(() => { localStorage.setItem('controleTheme', theme) }, [theme])
  const isDark = theme === 'dark'

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const [{ data: cl, error: e1 }, { data: py, error: e2 }] = await Promise.all([
      supabase.from('aleph_clients').select('*').order('name'),
      supabase.from('aleph_payments').select('*').order('created_at', { ascending: false }),
    ])
    if (!e1) setClients(cl || [])
    if (!e2) setPayments(py || [])
    setLoading(false)
  }

  // ── KPIs ──
  const activeClients = clients.filter(c => c.active)
  const mrr = activeClients.reduce((s, c) => s + (parseFloat(c.monthly_fee) || 0), 0)
  const pendentes = clients.filter(c => c.payment_status === 'pendente')
  const atrasados = clients.filter(c => c.payment_status === 'atrasado')

  // ── Filtered clients ──
  const filteredClients = clients.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = !q || c.name.toLowerCase().includes(q) ||
      (c.contact_name || '').toLowerCase().includes(q) ||
      (c.segment || '').toLowerCase().includes(q)
    const matchStatus = statusFilter === 'todos' || c.payment_status === statusFilter
    return matchSearch && matchStatus
  })

  // ── Client CRUD ──
  function openNewClient() {
    setClientForm(EMPTY_CLIENT)
    setClientModal('new')
  }

  function openEditClient(client) {
    setClientForm({
      ...EMPTY_CLIENT,
      ...client,
      monthly_fee: client.monthly_fee?.toString() || '',
      setup_fee: client.setup_fee?.toString() || '',
      payment_day: client.payment_day?.toString() || '10',
    })
    setClientModal(client)
  }

  async function saveClient() {
    if (!clientForm.name.trim()) return
    setSaving(true)
    const payload = {
      name: clientForm.name.trim(),
      contact_name: clientForm.contact_name || null,
      contact_whatsapp: clientForm.contact_whatsapp || null,
      contact_email: clientForm.contact_email || null,
      segment: clientForm.segment || 'Outro',
      site_url: clientForm.site_url || null,
      admin_url: clientForm.admin_url || null,
      store_slug: clientForm.store_slug || null,
      monthly_fee: parseFloat(clientForm.monthly_fee) || 0,
      setup_fee: parseFloat(clientForm.setup_fee) || 0,
      contract_start: clientForm.contract_start || null,
      contract_renewal: clientForm.contract_renewal || null,
      payment_day: parseInt(clientForm.payment_day) || 10,
      payment_status: clientForm.payment_status || 'em_dia',
      notes: clientForm.notes || null,
      active: clientForm.active,
    }
    if (clientModal === 'new') {
      await supabase.from('aleph_clients').insert([payload])
    } else {
      await supabase.from('aleph_clients').update(payload).eq('id', clientModal.id)
    }
    setSaving(false)
    setClientModal(null)
    fetchAll()
  }

  async function deleteClient(id) {
    if (!confirm('Remover este cliente? Todos os pagamentos associados serão excluídos.')) return
    await supabase.from('aleph_clients').delete().eq('id', id)
    setClientModal(null)
    fetchAll()
  }

  // ── Payment CRUD ──
  function openNewPayment(clientId) {
    setPaymentClientId(clientId)
    const client = clients.find(c => c.id === clientId)
    const n = new Date()
    const day = client?.payment_day || 10
    const mm = String(n.getMonth() + 1).padStart(2, '0')
    const yyyy = n.getFullYear()
    setPaymentForm({
      ...EMPTY_PAYMENT,
      amount: client?.monthly_fee?.toString() || '',
      reference_month: `${yyyy}-${mm}`,
      due_date: `${yyyy}-${mm}-${String(day).padStart(2, '0')}`,
    })
    setPaymentModal('new')
  }

  function openEditPayment(payment) {
    setPaymentClientId(payment.client_id)
    setPaymentForm({ ...EMPTY_PAYMENT, ...payment, amount: payment.amount?.toString() || '' })
    setPaymentModal(payment)
  }

  async function savePayment() {
    if (!paymentForm.amount || !paymentForm.reference_month) return
    setSaving(true)
    const payload = {
      client_id: paymentClientId,
      amount: parseFloat(paymentForm.amount),
      reference_month: paymentForm.reference_month,
      due_date: paymentForm.due_date || null,
      paid_date: paymentForm.paid_date || null,
      status: paymentForm.status,
      notes: paymentForm.notes || null,
    }
    if (paymentModal === 'new') {
      await supabase.from('aleph_payments').insert([payload])
    } else {
      await supabase.from('aleph_payments').update(payload).eq('id', paymentModal.id)
    }
    setSaving(false)
    setPaymentModal(null)
    fetchAll()
  }

  async function deletePayment(id) {
    if (!confirm('Remover este lançamento?')) return
    await supabase.from('aleph_payments').delete().eq('id', id)
    fetchAll()
  }

  async function generateMonthlyForAll() {
    if (!confirm(`Gerar lançamento de ${fmtMonth(payMonthFilter)} para todos os clientes ativos?`)) return
    setGeneratingAll(true)
    const n = new Date()
    const month = payMonthFilter || `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}`
    const existing = new Set(payments.filter(p => p.reference_month === month).map(p => p.client_id))
    const toInsert = activeClients
      .filter(c => !existing.has(c.id) && c.monthly_fee > 0)
      .map(c => {
        const day = c.payment_day || 10
        const [y, m] = month.split('-')
        return {
          client_id: c.id,
          amount: c.monthly_fee,
          reference_month: month,
          due_date: `${y}-${m}-${String(day).padStart(2, '0')}`,
          status: 'pendente',
        }
      })
    if (toInsert.length > 0) await supabase.from('aleph_payments').insert(toInsert)
    setGeneratingAll(false)
    fetchAll()
  }

  // ── Payment view ──
  const filteredPayments = payments.filter(p => {
    const matchMonth = !payMonthFilter || p.reference_month === payMonthFilter
    const matchClient = !paymentClientId || p.client_id === paymentClientId
    return matchMonth && matchClient
  })

  const paymentSummary = (() => {
    const total = filteredPayments.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0)
    const received = filteredPayments.filter(p => p.status === 'pago').reduce((s, p) => s + (parseFloat(p.amount) || 0), 0)
    return { total, received, pending: total - received }
  })()

  const paymentClientName = clients.find(c => c.id === paymentClientId)?.name || ''

  function setF(field) { return e => setClientForm(f => ({ ...f, [field]: e.target.value })) }
  function setPF(field) { return e => setPaymentForm(f => ({ ...f, [field]: e.target.value })) }

  return (
    <div className={`${styles.page} ${isDark ? '' : styles.light}`}>

      {/* ── Header ── */}
      <header className={styles.topHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.headerAleph}>א</span>
          <div>
            <span className={styles.headerTitle}>Controle Aleph</span>
            <span className={styles.headerSub}>Painel Master</span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.iconBtn} onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
            {isDark ? '☀️' : '🌙'}
          </button>
          <a href="/admin" className={styles.headerLink}>Admin ↗</a>
          <button className={styles.logoutBtn} onClick={onLogout}>↩ Sair</button>
        </div>
      </header>

      <div className={styles.body}>

        {/* ── KPIs ── */}
        <div className={styles.kpiRow}>
          <KpiCard label="MRR" value={fmt(mrr)} sub={`${activeClients.length} clientes ativos`} color="#c9a84c" icon="💰" />
          <KpiCard label="Clientes Ativos" value={activeClients.length} sub={`de ${clients.length} total`} color="#818cf8" icon="🏢" />
          <KpiCard label="Pendentes" value={pendentes.length} sub="aguardando pagamento" color="#f59e0b" icon="⏳" />
          <KpiCard label="Em Atraso" value={atrasados.length} sub={atrasados.length > 0 ? atrasados.map(c => c.name).join(', ') : 'nenhum'} color="#ef4444" icon="⚠️" />
        </div>

        {/* ── Tabs ── */}
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab === 'clientes' ? styles.tabActive : ''}`} onClick={() => setTab('clientes')}>
            🏢 Clientes
          </button>
          <button className={`${styles.tab} ${tab === 'pagamentos' ? styles.tabActive : ''}`} onClick={() => { setTab('pagamentos'); setPaymentClientId(null) }}>
            💳 Pagamentos
          </button>
        </div>

        {/* ══ CLIENTES TAB ══ */}
        <AnimatePresence mode="wait">
          {tab === 'clientes' && (
            <motion.div
              key="clientes"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <div className={styles.sectionBar}>
                <div className={styles.sectionFilters}>
                  <div className={styles.searchBox}>
                    <span>🔍</span>
                    <input
                      placeholder="Buscar cliente..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className={styles.searchInput}
                    />
                  </div>
                  <div className={styles.chipGroup}>
                    {['todos', 'em_dia', 'pendente', 'atrasado', 'inativo'].map(s => (
                      <button
                        key={s}
                        className={`${styles.chip} ${statusFilter === s ? styles.chipActive : ''}`}
                        onClick={() => setStatusFilter(s)}
                        style={s !== 'todos' && statusFilter === s ? { color: STATUS_CFG[s]?.color, borderColor: STATUS_CFG[s]?.color } : undefined}
                      >
                        {s === 'todos' ? 'Todos' : STATUS_CFG[s]?.label}
                      </button>
                    ))}
                  </div>
                </div>
                <motion.button
                  className={styles.btnPrimary}
                  onClick={openNewClient}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  + Novo cliente
                </motion.button>
              </div>

              {loading ? (
                <div className={styles.emptyState}>Carregando clientes...</div>
              ) : filteredClients.length === 0 ? (
                <div className={styles.emptyState}>
                  {clients.length === 0
                    ? 'Nenhum cliente cadastrado ainda. Clique em "+ Novo cliente" para começar.'
                    : 'Nenhum cliente encontrado com este filtro.'}
                </div>
              ) : (
                <div className={styles.clientGrid}>
                  {filteredClients.map((client, i) => (
                    <motion.div
                      key={client.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <ClientCard
                        client={client}
                        payments={payments.filter(p => p.client_id === client.id).slice(0, 3)}
                        onEdit={() => openEditClient(client)}
                        onPayments={() => { setPaymentClientId(client.id); setTab('pagamentos') }}
                        onNewPayment={() => openNewPayment(client.id)}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ══ PAGAMENTOS TAB ══ */}
          {tab === 'pagamentos' && (
            <motion.div
              key="pagamentos"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <div className={styles.sectionBar}>
                <div className={styles.sectionFilters}>
                  {/* Month filter */}
                  <div className={styles.monthWrap}>
                    <label className={styles.muted}>Mês:</label>
                    <input
                      type="month"
                      className={styles.monthInput}
                      value={payMonthFilter}
                      onChange={e => setPayMonthFilter(e.target.value)}
                    />
                    <button className={styles.chip} onClick={() => setPayMonthFilter('')}>Todos</button>
                  </div>

                  {/* Client filter */}
                  <div className={styles.searchBox}>
                    <span>🏢</span>
                    <select
                      className={styles.searchInput}
                      value={paymentClientId || ''}
                      onChange={e => setPaymentClientId(e.target.value || null)}
                    >
                      <option value="">Todos os clientes</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  {paymentClientId && (
                    <button className={`${styles.chip} ${styles.chipActive}`} onClick={() => setPaymentClientId(null)}>
                      {paymentClientName} ✕
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <motion.button
                    className={styles.btnOutline}
                    onClick={generateMonthlyForAll}
                    disabled={generatingAll}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    title="Gera lançamento pendente para todos clientes ativos que ainda não têm no mês selecionado"
                  >
                    {generatingAll ? '...' : '⚡ Gerar mês'}
                  </motion.button>
                  <motion.button
                    className={styles.btnPrimary}
                    onClick={() => {
                      const firstActive = activeClients[0]
                      if (firstActive) openNewPayment(firstActive.id)
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    + Lançar pagamento
                  </motion.button>
                </div>
              </div>

              {/* Summary cards */}
              <div className={styles.summaryRow}>
                <div className={styles.summaryCard}>
                  <span className={styles.muted}>Total lançado</span>
                  <strong className={styles.summaryVal}>{fmt(paymentSummary.total)}</strong>
                </div>
                <div className={styles.summaryCard} style={{ borderColor: 'rgba(34,197,94,0.3)' }}>
                  <span className={styles.muted}>Recebido</span>
                  <strong className={styles.summaryVal} style={{ color: '#22c55e' }}>{fmt(paymentSummary.received)}</strong>
                </div>
                <div className={styles.summaryCard} style={{ borderColor: 'rgba(245,158,11,0.3)' }}>
                  <span className={styles.muted}>A receber</span>
                  <strong className={styles.summaryVal} style={{ color: '#f59e0b' }}>{fmt(paymentSummary.pending)}</strong>
                </div>
              </div>

              <PaymentsTable
                payments={filteredPayments}
                clients={clients}
                onEdit={openEditPayment}
                onDelete={deletePayment}
                onNewForClient={openNewPayment}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ══ CLIENT MODAL ══ */}
      <AnimatePresence>
        {clientModal && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && setClientModal(null)}
          >
            <motion.div
              className={styles.modal}
              initial={{ scale: 0.93, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.93, y: 24 }}
            >
              <div className={styles.modalHeader}>
                <h2>{clientModal === 'new' ? 'Novo Cliente' : `Editar — ${clientModal.name}`}</h2>
                <button className={styles.closeBtn} onClick={() => setClientModal(null)}>✕</button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.formGrid}>

                  <div className={`${styles.fg} ${styles.span2}`}>
                    <label>Nome do cliente *</label>
                    <input value={clientForm.name} onChange={setF('name')} placeholder="Ex: HUD'S Barbearia" />
                  </div>

                  <div className={styles.fg}>
                    <label>Segmento</label>
                    <select value={clientForm.segment} onChange={setF('segment')}>
                      {SEGMENTS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className={styles.fg}>
                    <label>Status de pagamento</label>
                    <select value={clientForm.payment_status} onChange={setF('payment_status')}>
                      <option value="em_dia">Em dia</option>
                      <option value="pendente">Pendente</option>
                      <option value="atrasado">Atrasado</option>
                      <option value="inativo">Inativo</option>
                    </select>
                  </div>

                  <div className={styles.fg}>
                    <label>Nome do contato</label>
                    <input value={clientForm.contact_name} onChange={setF('contact_name')} placeholder="Responsável" />
                  </div>

                  <div className={styles.fg}>
                    <label>WhatsApp</label>
                    <input value={clientForm.contact_whatsapp} onChange={setF('contact_whatsapp')} placeholder="(11) 99999-9999" />
                  </div>

                  <div className={`${styles.fg} ${styles.span2}`}>
                    <label>E-mail</label>
                    <input type="email" value={clientForm.contact_email} onChange={setF('contact_email')} placeholder="email@cliente.com" />
                  </div>

                  <div className={`${styles.fg} ${styles.span2}`}>
                    <label>URL do site público</label>
                    <input value={clientForm.site_url} onChange={setF('site_url')} placeholder="https://cliente.vercel.app" />
                  </div>

                  <div className={`${styles.fg} ${styles.span2}`}>
                    <label>URL do painel admin</label>
                    <input value={clientForm.admin_url} onChange={setF('admin_url')} placeholder="https://cliente.vercel.app/admin" />
                  </div>

                  <div className={`${styles.fg} ${styles.span2}`}>
                    <label>Slug no sistema (opcional)</label>
                    <input value={clientForm.store_slug} onChange={setF('store_slug')} placeholder="huds, padaria-mari, etc." />
                  </div>

                  <div className={styles.fg}>
                    <label>Mensalidade (R$)</label>
                    <input type="number" step="0.01" value={clientForm.monthly_fee} onChange={setF('monthly_fee')} placeholder="297.00" />
                  </div>

                  <div className={styles.fg}>
                    <label>Setup / Implantação (R$)</label>
                    <input type="number" step="0.01" value={clientForm.setup_fee} onChange={setF('setup_fee')} placeholder="0.00" />
                  </div>

                  <div className={styles.fg}>
                    <label>Dia de vencimento</label>
                    <input type="number" min="1" max="28" value={clientForm.payment_day} onChange={setF('payment_day')} placeholder="10" />
                  </div>

                  <div className={styles.fg}>
                    <label>Início do contrato</label>
                    <input type="date" value={clientForm.contract_start} onChange={setF('contract_start')} />
                  </div>

                  <div className={styles.fg}>
                    <label>Renovação do contrato</label>
                    <input type="date" value={clientForm.contract_renewal} onChange={setF('contract_renewal')} />
                  </div>

                  <div className={`${styles.fg} ${styles.span2}`}>
                    <label className={styles.checkLabel}>
                      <input
                        type="checkbox"
                        checked={clientForm.active}
                        onChange={e => setClientForm(f => ({ ...f, active: e.target.checked }))}
                      />
                      Cliente ativo
                    </label>
                  </div>

                  <div className={`${styles.fg} ${styles.span2}`}>
                    <label>Observações</label>
                    <textarea value={clientForm.notes} onChange={setF('notes')} rows={3} placeholder="Notas internas sobre o cliente..." />
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                {clientModal !== 'new' && (
                  <button className={styles.btnDanger} onClick={() => deleteClient(clientModal.id)}>
                    Remover cliente
                  </button>
                )}
                <div style={{ flex: 1 }} />
                <button className={styles.btnOutline} onClick={() => setClientModal(null)}>Cancelar</button>
                <motion.button
                  className={styles.btnPrimary}
                  onClick={saveClient}
                  disabled={saving || !clientForm.name.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {saving ? 'Salvando...' : 'Salvar'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ PAYMENT MODAL ══ */}
      <AnimatePresence>
        {paymentModal && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && setPaymentModal(null)}
          >
            <motion.div
              className={`${styles.modal} ${styles.modalSm}`}
              initial={{ scale: 0.93, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.93, y: 24 }}
            >
              <div className={styles.modalHeader}>
                <h2>{paymentModal === 'new' ? 'Lançar Pagamento' : 'Editar Pagamento'}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className={styles.muted}>{paymentClientName}</span>
                  <button className={styles.closeBtn} onClick={() => setPaymentModal(null)}>✕</button>
                </div>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.formGrid}>

                  {paymentModal === 'new' && (
                    <div className={`${styles.fg} ${styles.span2}`}>
                      <label>Cliente</label>
                      <select
                        value={paymentClientId || ''}
                        onChange={e => setPaymentClientId(e.target.value)}
                      >
                        <option value="">Selecionar...</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  )}

                  <div className={styles.fg}>
                    <label>Mês de referência</label>
                    <input type="month" value={paymentForm.reference_month} onChange={setPF('reference_month')} />
                  </div>

                  <div className={styles.fg}>
                    <label>Valor (R$)</label>
                    <input type="number" step="0.01" value={paymentForm.amount} onChange={setPF('amount')} placeholder="297.00" />
                  </div>

                  <div className={styles.fg}>
                    <label>Data de vencimento</label>
                    <input type="date" value={paymentForm.due_date} onChange={setPF('due_date')} />
                  </div>

                  <div className={styles.fg}>
                    <label>Data de pagamento</label>
                    <input type="date" value={paymentForm.paid_date} onChange={setPF('paid_date')} />
                  </div>

                  <div className={`${styles.fg} ${styles.span2}`}>
                    <label>Status</label>
                    <select value={paymentForm.status} onChange={setPF('status')}>
                      <option value="pendente">Pendente</option>
                      <option value="pago">Pago</option>
                      <option value="atrasado">Atrasado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>

                  <div className={`${styles.fg} ${styles.span2}`}>
                    <label>Observações</label>
                    <textarea value={paymentForm.notes} onChange={setPF('notes')} rows={2} placeholder="Notas sobre este pagamento..." />
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                {paymentModal !== 'new' && (
                  <button className={styles.btnDanger} onClick={() => { deletePayment(paymentModal.id); setPaymentModal(null) }}>
                    Remover
                  </button>
                )}
                <div style={{ flex: 1 }} />
                <button className={styles.btnOutline} onClick={() => setPaymentModal(null)}>Cancelar</button>
                <motion.button
                  className={styles.btnPrimary}
                  onClick={savePayment}
                  disabled={saving || !paymentForm.amount || !paymentForm.reference_month || !paymentClientId}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {saving ? 'Salvando...' : 'Salvar'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
