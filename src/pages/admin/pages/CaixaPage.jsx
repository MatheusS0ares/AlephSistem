import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { supabase } from '../../../lib/supabase'
import styles from './CaixaPage.module.css'

const EMPTY_FORM = { type: 'entrada', amount: '', description: '', category: '' }

export default function CaixaPage({ storeId }) {
  const [transactions, setTransactions] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formType, setFormType] = useState('entrada')
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [month, setMonth] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })

  const loadData = useCallback(async () => {
    const [y, m] = month.split('-')
    const start = `${y}-${m}-01`
    const end = new Date(y, m, 0).toISOString().slice(0, 10)

    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('store_id', storeId)
      .gte('created_at', start)
      .lte('created_at', end + 'T23:59:59')
      .order('created_at', { ascending: false })
    setTransactions(data || [])
  }, [month, storeId])

  useEffect(() => { loadData() }, [loadData])

  const entradas = transactions.filter(t => t.type === 'entrada').reduce((s, t) => s + Number(t.amount), 0)
  const saidas   = transactions.filter(t => t.type === 'saida').reduce((s, t) => s + Number(t.amount), 0)
  const saldo    = entradas - saidas

  const fmt = (v) => `R$ ${Number(v).toFixed(2).replace('.', ',')}`

  function openForm(type) {
    setFormType(type)
    setForm({ ...EMPTY_FORM, type })
    setShowForm(true)
  }

  async function saveTrans() {
    setSaving(true)
    await supabase.from('transactions').insert({
      type: form.type,
      amount: parseFloat(form.amount) || 0,
      description: form.description,
      category: form.category,
      store_id: storeId,
    })
    setSaving(false)
    setShowForm(false)
    loadData()
  }

  async function deleteTrans(id) {
    if (!window.confirm('Excluir lançamento?')) return
    await supabase.from('transactions').delete().eq('id', id)
    loadData()
  }

  const categorySums = transactions.reduce((acc, t) => {
    if (t.type !== 'entrada') return acc
    const cat = t.category || 'Outros'
    acc[cat] = (acc[cat] || 0) + Number(t.amount)
    return acc
  }, {})

  return (
    <div className={styles.page}>
      {/* Month picker + actions */}
      <div className={styles.toolbar}>
        <input
          type="month"
          value={month}
          onChange={e => setMonth(e.target.value)}
          className={styles.monthPicker}
        />
        <div className={styles.toolbarRight}>
          <button className={styles.btnEntrada} onClick={() => openForm('entrada')}>+ Entrada</button>
          <button className={styles.btnSaida} onClick={() => openForm('saida')}>+ Saída</button>
        </div>
      </div>

      {/* Saldo hero */}
      <div className={styles.saldoCard}>
        <div>
          <span className={styles.saldoLabel}>Saldo do mês</span>
          <span className={`${styles.saldoValue} ${saldo >= 0 ? styles.saldoPos : styles.saldoNeg}`}>
            {fmt(saldo)}
          </span>
          <span className={styles.saldoSub}>Entradas {fmt(entradas)} · Saídas {fmt(saidas)}</span>
        </div>
      </div>

      {/* Bottom grid */}
      <div className={styles.bottomGrid}>
        {/* Entradas por categoria */}
        <div className={styles.section}>
          <span className={styles.sectionLabel}>Por categoria</span>
          <h3>Entradas do mês</h3>
          {Object.keys(categorySums).length === 0 ? (
            <p className={styles.empty}>Nenhuma entrada.</p>
          ) : (
            <ul className={styles.catList}>
              {Object.entries(categorySums).map(([cat, val]) => (
                <li key={cat} className={styles.catItem}>
                  <span>{cat}</span>
                  <span className={styles.catVal}>{fmt(val)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Histórico */}
        <div className={styles.section}>
          <span className={styles.sectionLabel}>Histórico</span>
          <h3>Lançamentos</h3>
          {transactions.length === 0 ? (
            <p className={styles.empty}>Nenhum lançamento.</p>
          ) : (
            <div className={styles.transList}>
              {transactions.map(t => (
                <div key={t.id} className={styles.transRow}>
                  <div className={`${styles.transType} ${t.type === 'entrada' ? styles.typeEntrada : styles.typeSaida}`}>
                    {t.type === 'entrada' ? '↑' : '↓'}
                  </div>
                  <div className={styles.transInfo}>
                    <span className={styles.transDesc}>{t.description || '—'}</span>
                    {t.category && <span className={styles.transCat}>{t.category}</span>}
                    <span className={styles.transDate}>{new Date(t.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <span className={`${styles.transAmt} ${t.type === 'entrada' ? styles.amtGreen : styles.amtRed}`}>
                    {t.type === 'saida' ? '-' : '+'}{fmt(t.amount)}
                  </span>
                  <button className={styles.btnDel} onClick={() => deleteTrans(t.id)}>🗑</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {createPortal(<AnimatePresence>
        {showForm && (
          <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className={styles.modal} initial={{ scale: 0.93 }} animate={{ scale: 1 }} exit={{ scale: 0.93 }}>
              <div className={styles.modalHeader}>
                <h3>{formType === 'entrada' ? '+ Entrada' : '+ Saída'}</h3>
                <button onClick={() => setShowForm(false)}>✕</button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label>Valor (R$) *</label>
                  <input type="number" step="0.01" value={form.amount} onChange={e => setForm(f => ({...f, amount: e.target.value}))} placeholder="0,00" />
                </div>
                <div className={styles.formGroup}>
                  <label>Descrição</label>
                  <input value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} placeholder="Ex: Pedido #1234" />
                </div>
                <div className={styles.formGroup}>
                  <label>Categoria</label>
                  <input value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} placeholder="Ex: Festas, Presentes…" />
                </div>
                {stores.length > 1 && (
                  <div className={styles.formGroup}>
                    <label>Loja</label>
                    <select value={form.store_id} onChange={e => setForm(f => ({...f, store_id: e.target.value}))}>
                      <option value="">Selecione</option>
                      {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                )}
              </div>
              <div className={styles.modalFooter}>
                <button className={styles.btnOutline} onClick={() => setShowForm(false)}>Cancelar</button>
                <button className={formType === 'entrada' ? styles.btnEntrada : styles.btnSaida} onClick={saveTrans} disabled={saving}>
                  {saving ? 'Salvando…' : `Registrar ${formType}`}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>, document.body)}
    </div>
  )
}
