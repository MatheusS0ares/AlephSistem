import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { supabase } from '../../../lib/supabase'
import styles from './ClientesPage.module.css'

const EMPTY_FORM = { name: '', whatsapp: '', notes: '', vip: false }

export default function ClientesPage({ search, storeId }) {
  const [customers, setCustomers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editCustomer, setEditCustomer] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [customerOrders, setCustomerOrders] = useState({})

  const loadData = useCallback(async () => {
    const [custRes, ordRes] = await Promise.all([
      supabase.from('customers').select('*').eq('store_id', storeId).order('name'),
      supabase.from('orders').select('customer_id, total, status').eq('store_id', storeId),
    ])

    setCustomers(custRes.data || [])

    const ordMap = {}
    ;(ordRes.data || []).forEach(o => {
      if (!o.customer_id) return
      if (!ordMap[o.customer_id]) ordMap[o.customer_id] = { total: 0, count: 0, abertos: 0 }
      ordMap[o.customer_id].count++
      ordMap[o.customer_id].total += Number(o.total || 0)
      if (['orcamento','confirmado','encomendado','chegou'].includes(o.status)) {
        ordMap[o.customer_id].abertos++
      }
    })
    setCustomerOrders(ordMap)
  }, [storeId])

  useEffect(() => { loadData() }, [loadData])

  const filtered = customers.filter(c => {
    const q = (search || '').toLowerCase()
    return !q || c.name.toLowerCase().includes(q) || c.whatsapp?.includes(q)
  })

  function openNew() {
    setEditCustomer(null)
    setSaveError(null)
    setForm({ ...EMPTY_FORM })
    setShowForm(true)
  }

  function openEdit(c) {
    setEditCustomer(c)
    setSaveError(null)
    setForm({ name: c.name, whatsapp: c.whatsapp || '', notes: c.notes || '', vip: c.vip || false })
    setShowForm(true)
  }

  async function saveCustomer() {
    if (!form.name.trim()) { setSaveError('Informe o nome do cliente.'); return }
    setSaving(true)
    setSaveError(null)
    const effectiveStoreId = storeId?.startsWith('fallback-') ? null : storeId
    const payload = {
      name: form.name.trim(),
      whatsapp: form.whatsapp,
      notes: form.notes,
      vip: form.vip,
      store_id: effectiveStoreId,
    }
    let error
    if (editCustomer) {
      ({ error } = await supabase.from('customers').update(payload).eq('id', editCustomer.id))
    } else {
      ({ error } = await supabase.from('customers').insert(payload))
    }
    setSaving(false)
    if (error) {
      setSaveError(error.message || 'Erro ao salvar.')
    } else {
      setShowForm(false)
      loadData()
    }
  }

  async function toggleVip(c) {
    await supabase.from('customers').update({ vip: !c.vip }).eq('id', c.id)
    loadData()
  }

  async function deleteCustomer(id) {
    if (!window.confirm('Excluir este cliente?')) return
    await supabase.from('customers').delete().eq('id', id)
    loadData()
  }

  const fmt = (v) => `R$ ${Number(v).toFixed(2).replace('.', ',')}`

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <span className={styles.total}>{filtered.length} cliente{filtered.length !== 1 ? 's' : ''}</span>
        <button className={styles.btnGold} onClick={openNew}>+ Novo cliente</button>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>Nenhum cliente encontrado.</div>
      ) : (
        <div className={styles.grid}>
          {filtered.map(c => {
            const stats = customerOrders[c.id] || { total: 0, count: 0, abertos: 0 }
            const initials = c.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
            return (
              <motion.div
                key={c.id}
                className={`${styles.card} ${c.vip ? styles.cardVip : ''}`}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.avatar}>{initials}</div>
                  <div className={styles.cardInfo}>
                    <div className={styles.nameRow}>
                      <span className={styles.name}>{c.name}</span>
                      {c.vip && <span className={styles.vipBadge}>⭐ VIP</span>}
                    </div>
                    <span className={styles.phone}>{c.whatsapp || '—'}</span>
                  </div>
                </div>

                {c.notes && <p className={styles.notes}>{c.notes}</p>}

                <div className={styles.stats}>
                  <div className={styles.statItem}>
                    <strong>{stats.count}</strong>
                    <span>Pedidos</span>
                  </div>
                  <div className={styles.statItem}>
                    <strong className={styles.statGold}>{fmt(stats.total)}</strong>
                    <span>Total</span>
                  </div>
                  <div className={styles.statItem}>
                    <strong>{stats.abertos}</strong>
                    <span>Abertos</span>
                  </div>
                </div>

                <div className={styles.cardActions}>
                  {c.whatsapp && (
                    <a
                      href={`https://wa.me/55${c.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.btnWpp}
                    >💬</a>
                  )}
                  <button className={styles.btnIcon} onClick={() => toggleVip(c)} title={c.vip ? 'Remover VIP' : 'Marcar VIP'}>
                    {c.vip ? '★' : '☆'}
                  </button>
                  <button className={styles.btnIcon} onClick={() => openEdit(c)}>✏️</button>
                  <button className={`${styles.btnIcon} ${styles.btnIconDanger}`} onClick={() => deleteCustomer(c.id)}>🗑</button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {createPortal(<AnimatePresence>
        {showForm && (
          <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className={styles.modal} initial={{ scale: 0.93 }} animate={{ scale: 1 }} exit={{ scale: 0.93 }}>
              <div className={styles.modalHeader}>
                <h3>{editCustomer ? 'Editar cliente' : 'Novo cliente'}</h3>
                <button onClick={() => setShowForm(false)}>✕</button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label>Nome *</label>
                  <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Nome completo" />
                </div>
                <div className={styles.formGroup}>
                  <label>WhatsApp</label>
                  <input value={form.whatsapp} onChange={e => setForm(f => ({...f, whatsapp: e.target.value}))} placeholder="61 9 9999-9999" />
                </div>
                <div className={styles.formGroup}>
                  <label>Observações</label>
                  <textarea rows="2" value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} placeholder="Preferências, histórico…" />
                </div>
                <label className={styles.checkLabel}>
                  <input type="checkbox" checked={form.vip} onChange={e => setForm(f => ({...f, vip: e.target.checked}))} />
                  Cliente VIP ⭐
                </label>
                {saveError && <p className={styles.saveError}>{saveError}</p>}
              </div>
              <div className={styles.modalFooter}>
                <button className={styles.btnOutline} onClick={() => setShowForm(false)}>Cancelar</button>
                <button className={styles.btnGold} onClick={saveCustomer} disabled={saving}>
                  {saving ? 'Salvando…' : editCustomer ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>, document.body)}
    </div>
  )
}
