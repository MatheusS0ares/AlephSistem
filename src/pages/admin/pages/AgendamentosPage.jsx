import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { supabase } from '../../../lib/supabase'
import styles from './AgendamentosPage.module.css'

const STATUS_CONFIG = {
  agendado:       { label: 'Agendado',      color: '#7c9ef5' },
  confirmado:     { label: 'Confirmado',    color: '#56d18f' },
  em_atendimento: { label: 'Em Atendimento', color: '#C8960C' },
  concluido:      { label: 'Concluído',     color: '#888' },
  cancelado:      { label: 'Cancelado',     color: '#e05c5c' },
}

const SERVICOS_DEFAULT = [
  'Corte Clássico', 'Degradê / Fade', 'Barba Completa', 'Corte + Barba',
  'Hidratação Capilar', 'Sobrancelha Masculina',
]

const EMPTY_FORM = {
  customer_name: '',
  customer_whatsapp: '',
  service_name: '',
  professional_name: '',
  appointment_date: '',
  appointment_time: '',
  duration_minutes: 60,
  price: '',
  notes: '',
  status: 'agendado',
}

function fmtDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function fmtMoney(v) {
  return `R$ ${Number(v || 0).toFixed(2).replace('.', ',')}`
}

export default function AgendamentosPage({ search, storeId }) {
  const [appointments, setAppointments] = useState([])
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [filtroData, setFiltroData] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    const q = supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true })

    if (storeId && !storeId.startsWith('fallback-')) {
      q.eq('store_id', storeId)
    }

    const { data } = await q
    setAppointments(data || [])
    setLoading(false)
  }, [storeId])

  useEffect(() => { loadData() }, [loadData])

  useEffect(() => {
    window.__adminOpenNewAppointment = () => openNew()
    return () => { delete window.__adminOpenNewAppointment }
  }, [])

  const filtered = appointments.filter(a => {
    const q = (search || '').toLowerCase()
    const matchSearch = !q ||
      a.customer_name?.toLowerCase().includes(q) ||
      a.service_name?.toLowerCase().includes(q) ||
      a.professional_name?.toLowerCase().includes(q)
    const matchStatus = filtroStatus === 'todos' || a.status === filtroStatus
    const matchData = !filtroData || a.appointment_date === filtroData
    return matchSearch && matchStatus && matchData
  })

  function openNew() {
    setEditItem(null)
    setSaveError(null)
    const today = new Date().toISOString().split('T')[0]
    setForm({ ...EMPTY_FORM, appointment_date: today })
    setShowForm(true)
  }

  function openEdit(a) {
    setEditItem(a)
    setSaveError(null)
    setForm({
      customer_name: a.customer_name || '',
      customer_whatsapp: a.customer_whatsapp || '',
      service_name: a.service_name || '',
      professional_name: a.professional_name || '',
      appointment_date: a.appointment_date || '',
      appointment_time: a.appointment_time || '',
      duration_minutes: a.duration_minutes || 60,
      price: a.price || '',
      notes: a.notes || '',
      status: a.status || 'agendado',
    })
    setShowForm(true)
  }

  async function save() {
    if (!form.customer_name.trim()) { setSaveError('Informe o nome do cliente.'); return }
    if (!form.appointment_date) { setSaveError('Informe a data.'); return }
    if (!form.appointment_time) { setSaveError('Informe o horário.'); return }

    setSaving(true)
    setSaveError(null)
    const effectiveStoreId = storeId?.startsWith('fallback-') ? null : storeId
    const payload = {
      customer_name: form.customer_name.trim(),
      customer_whatsapp: form.customer_whatsapp,
      service_name: form.service_name,
      professional_name: form.professional_name,
      appointment_date: form.appointment_date,
      appointment_time: form.appointment_time,
      duration_minutes: Number(form.duration_minutes) || 60,
      price: form.price ? Number(form.price) : null,
      notes: form.notes,
      status: form.status,
      store_id: effectiveStoreId,
    }
    let error
    if (editItem) {
      ({ error } = await supabase.from('appointments').update(payload).eq('id', editItem.id))
    } else {
      ({ error } = await supabase.from('appointments').insert(payload))
    }
    setSaving(false)
    if (error) {
      setSaveError(error.message || 'Erro ao salvar.')
    } else {
      setShowForm(false)
      loadData()
    }
  }

  async function updateStatus(id, status) {
    await supabase.from('appointments').update({ status }).eq('id', id)
    loadData()
  }

  async function deleteItem(id) {
    if (!window.confirm('Excluir este agendamento?')) return
    await supabase.from('appointments').delete().eq('id', id)
    loadData()
  }

  const statusKeys = ['todos', ...Object.keys(STATUS_CONFIG)]
  const countByStatus = Object.keys(STATUS_CONFIG).reduce((acc, s) => {
    acc[s] = appointments.filter(a => a.status === s).length
    return acc
  }, {})
  const todayStr = new Date().toISOString().split('T')[0]
  const todayCount = appointments.filter(a => a.appointment_date === todayStr).length

  return (
    <div className={styles.page}>
      {/* Stat bar */}
      <div className={styles.statBar}>
        <div className={styles.statItem}>
          <span className={styles.statVal} style={{ color: '#C8960C' }}>{todayCount}</span>
          <span className={styles.statLbl}>Hoje</span>
        </div>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <div key={key} className={styles.statItem}>
            <span className={styles.statVal} style={{ color: cfg.color }}>{countByStatus[key]}</span>
            <span className={styles.statLbl}>{cfg.label}</span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <div className={styles.statusFilters}>
            {statusKeys.map(s => (
              <button
                key={s}
                className={`${styles.filterBtn} ${filtroStatus === s ? styles.filterActive : ''}`}
                style={filtroStatus === s && s !== 'todos' ? { background: STATUS_CONFIG[s]?.color + '22', borderColor: STATUS_CONFIG[s]?.color, color: STATUS_CONFIG[s]?.color } : {}}
                onClick={() => setFiltroStatus(s)}
              >
                {s === 'todos' ? 'Todos' : STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
          <input
            type="date"
            className={styles.dateFilter}
            value={filtroData}
            onChange={e => setFiltroData(e.target.value)}
            title="Filtrar por data"
          />
          {filtroData && (
            <button className={styles.clearDate} onClick={() => setFiltroData('')}>✕</button>
          )}
        </div>

        <button className={styles.btnGold} onClick={openNew}>+ Novo agendamento</button>
      </div>

      {/* List */}
      {loading ? (
        <div className={styles.empty}>Carregando…</div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>Nenhum agendamento encontrado.</div>
      ) : (
        <div className={styles.list}>
          {filtered.map((a, i) => {
            const cfg = STATUS_CONFIG[a.status] || STATUS_CONFIG.agendado
            const isToday = a.appointment_date === todayStr
            return (
              <motion.div
                key={a.id}
                className={`${styles.card} ${isToday ? styles.cardToday : ''}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <div className={styles.cardLeft}>
                  <div className={styles.dateBlock}>
                    <span className={styles.dateDay}>
                      {a.appointment_date ? new Date(a.appointment_date + 'T00:00').getDate() : '—'}
                    </span>
                    <span className={styles.dateMon}>
                      {a.appointment_date
                        ? new Date(a.appointment_date + 'T00:00').toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')
                        : '—'}
                    </span>
                    {isToday && <span className={styles.todayTag}>Hoje</span>}
                  </div>

                  <div className={styles.timeBlock}>
                    <span className={styles.time}>{a.appointment_time?.slice(0, 5) || '—'}</span>
                    <span className={styles.duration}>{a.duration_minutes || 60} min</span>
                  </div>
                </div>

                <div className={styles.cardCenter}>
                  <div className={styles.clientRow}>
                    <div className={styles.avatar}>
                      {(a.customer_name || '?')[0].toUpperCase()}
                    </div>
                    <div>
                      <span className={styles.clientName}>{a.customer_name || '—'}</span>
                      {a.customer_whatsapp && (
                        <a
                          href={`https://wa.me/55${a.customer_whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.wppLink}
                        >
                          📱 {a.customer_whatsapp}
                        </a>
                      )}
                    </div>
                  </div>

                  <div className={styles.serviceRow}>
                    {a.service_name && <span className={styles.service}>✂ {a.service_name}</span>}
                    {a.professional_name && <span className={styles.prof}>👤 {a.professional_name}</span>}
                    {a.notes && <span className={styles.notes}>{a.notes}</span>}
                  </div>
                </div>

                <div className={styles.cardRight}>
                  {a.price > 0 && (
                    <span className={styles.price}>{fmtMoney(a.price)}</span>
                  )}
                  <span className={styles.statusBadge} style={{ background: cfg.color + '22', color: cfg.color }}>
                    {cfg.label}
                  </span>
                  <div className={styles.actions}>
                    <select
                      className={styles.statusSelect}
                      value={a.status}
                      onChange={e => updateStatus(a.id, e.target.value)}
                    >
                      {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                    </select>
                    {a.customer_whatsapp && (
                      <a
                        href={`https://wa.me/55${a.customer_whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${a.customer_name || ''}! Confirmando seu agendamento na Barbearia HUD'S para ${a.service_name || ''} no dia ${fmtDate(a.appointment_date)} às ${a.appointment_time?.slice(0, 5) || ''}. Te esperamos! ✂️`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.btnIcon} ${styles.btnConfirm}`}
                        title="Confirmar via WhatsApp"
                      >
                        ✓ Confirmar
                      </a>
                    )}
                    {a.customer_whatsapp && (
                      <a
                        href={`https://wa.me/55${a.customer_whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${a.customer_name || ''}! Lembrando que seu horário na Barbearia HUD'S é hoje às ${a.appointment_time?.slice(0, 5) || ''} para ${a.service_name || ''}. Não se esqueça! 😊✂️`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.btnIcon} ${styles.btnReminder}`}
                        title="Enviar lembrete via WhatsApp"
                      >
                        ⏰ Lembrete
                      </a>
                    )}
                    <button className={styles.btnIcon} onClick={() => openEdit(a)} title="Editar">✏️</button>
                    <button className={`${styles.btnIcon} ${styles.btnDanger}`} onClick={() => deleteItem(a.id)} title="Excluir">🗑</button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Form modal */}
      {createPortal(
        <AnimatePresence>
          {showForm && (
            <motion.div
              className={styles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={e => e.target === e.currentTarget && setShowForm(false)}
            >
              <motion.div
                className={styles.modal}
                initial={{ scale: 0.93, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.93, y: 20 }}
              >
                <div className={styles.modalHeader}>
                  <h3>{editItem ? 'Editar Agendamento' : 'Novo Agendamento'}</h3>
                  <button onClick={() => setShowForm(false)}>✕</button>
                </div>

                <div className={styles.modalBody}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Cliente *</label>
                      <input
                        value={form.customer_name}
                        onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
                        placeholder="Nome do cliente"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>WhatsApp</label>
                      <input
                        value={form.customer_whatsapp}
                        onChange={e => setForm(f => ({ ...f, customer_whatsapp: e.target.value }))}
                        placeholder="61 9 9999-9999"
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Data *</label>
                      <input
                        type="date"
                        value={form.appointment_date}
                        onChange={e => setForm(f => ({ ...f, appointment_date: e.target.value }))}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Horário *</label>
                      <input
                        type="time"
                        value={form.appointment_time}
                        onChange={e => setForm(f => ({ ...f, appointment_time: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Serviço</label>
                      <select
                        value={form.service_name}
                        onChange={e => setForm(f => ({ ...f, service_name: e.target.value }))}
                      >
                        <option value="">Selecionar…</option>
                        {SERVICOS_DEFAULT.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Profissional</label>
                      <input
                        value={form.professional_name}
                        onChange={e => setForm(f => ({ ...f, professional_name: e.target.value }))}
                        placeholder="Nome do profissional"
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Duração (min)</label>
                      <input
                        type="number"
                        value={form.duration_minutes}
                        onChange={e => setForm(f => ({ ...f, duration_minutes: e.target.value }))}
                        min="15"
                        step="15"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Valor (R$)</label>
                      <input
                        type="number"
                        value={form.price}
                        onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                        placeholder="0,00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Status</label>
                    <select
                      value={form.status}
                      onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    >
                      {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Observações</label>
                    <textarea
                      rows="2"
                      value={form.notes}
                      onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                      placeholder="Preferências, pedidos especiais…"
                    />
                  </div>

                  {saveError && <p className={styles.saveError}>{saveError}</p>}
                </div>

                <div className={styles.modalFooter}>
                  <button className={styles.btnOutline} onClick={() => setShowForm(false)}>Cancelar</button>
                  <button className={styles.btnGold} onClick={save} disabled={saving}>
                    {saving ? 'Salvando…' : editItem ? 'Salvar' : 'Criar'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}
