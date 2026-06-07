import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { supabase } from '../../../lib/supabase'
import styles from './ProfissionaisPage.module.css'

const ROLES = ['Barbeiro', 'Colorista', 'Cabeleireiro', 'Maquiador', 'Manicure', 'Outro']

const EMPTY_FORM = {
  name: '',
  role: 'Barbeiro',
  whatsapp: '',
  bio: '',
  active: true,
}

export default function ProfissionaisPage({ search, storeId }) {
  const [professionals, setProfessionals] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    const q = supabase.from('professionals').select('*').order('name')
    if (storeId && !storeId.startsWith('fallback-')) {
      q.eq('store_id', storeId)
    }
    const { data } = await q
    setProfessionals(data || [])
    setLoading(false)
  }, [storeId])

  useEffect(() => { loadData() }, [loadData])

  const filtered = professionals.filter(p => {
    const q = (search || '').toLowerCase()
    return !q || p.name?.toLowerCase().includes(q) || p.role?.toLowerCase().includes(q)
  })

  function openNew() {
    setEditItem(null)
    setSaveError(null)
    setForm({ ...EMPTY_FORM })
    setShowForm(true)
  }

  function openEdit(p) {
    setEditItem(p)
    setSaveError(null)
    setForm({
      name: p.name || '',
      role: p.role || 'Barbeiro',
      whatsapp: p.whatsapp || '',
      bio: p.bio || '',
      active: p.active !== false,
    })
    setShowForm(true)
  }

  async function save() {
    if (!form.name.trim()) { setSaveError('Informe o nome do profissional.'); return }
    setSaving(true)
    setSaveError(null)
    const effectiveStoreId = storeId?.startsWith('fallback-') ? null : storeId
    const payload = {
      name: form.name.trim(),
      role: form.role,
      whatsapp: form.whatsapp,
      bio: form.bio,
      active: form.active,
      store_id: effectiveStoreId,
    }
    let error
    if (editItem) {
      ;({ error } = await supabase.from('professionals').update(payload).eq('id', editItem.id))
    } else {
      ;({ error } = await supabase.from('professionals').insert(payload))
    }
    setSaving(false)
    if (error) {
      setSaveError(error.message || 'Erro ao salvar.')
    } else {
      setShowForm(false)
      loadData()
    }
  }

  async function toggleActive(p) {
    await supabase.from('professionals').update({ active: !p.active }).eq('id', p.id)
    loadData()
  }

  async function deleteItem(id) {
    if (!window.confirm('Excluir este profissional?')) return
    await supabase.from('professionals').delete().eq('id', id)
    loadData()
  }

  const initials = (name) =>
    (name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <span className={styles.total}>
          {filtered.length} profissional{filtered.length !== 1 ? 'is' : ''}
        </span>
        <button className={styles.btnGold} onClick={openNew}>+ Novo profissional</button>
      </div>

      {loading ? (
        <div className={styles.empty}>Carregando…</div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>Nenhum profissional encontrado.</div>
      ) : (
        <div className={styles.grid}>
          {filtered.map(p => (
            <motion.div
              key={p.id}
              className={`${styles.card} ${!p.active ? styles.cardInactive : ''}`}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className={styles.cardHeader}>
                <div className={styles.avatar}>{initials(p.name)}</div>
                <div className={styles.cardInfo}>
                  <div className={styles.nameRow}>
                    <span className={styles.name}>{p.name}</span>
                    {!p.active && <span className={styles.inactiveBadge}>Inativo</span>}
                  </div>
                  <span className={styles.role}>{p.role || '—'}</span>
                </div>
              </div>

              {p.bio && <p className={styles.bio}>{p.bio}</p>}

              {p.whatsapp && (
                <div className={styles.phone}>
                  <span>📱</span>
                  <span>{p.whatsapp}</span>
                </div>
              )}

              <div className={styles.cardActions}>
                {p.whatsapp && (
                  <a
                    href={`https://wa.me/55${p.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.btnWpp}
                  >
                    💬
                  </a>
                )}
                <button
                  className={styles.btnIcon}
                  onClick={() => toggleActive(p)}
                  title={p.active ? 'Desativar' : 'Ativar'}
                >
                  {p.active ? '✓' : '○'}
                </button>
                <button className={styles.btnIcon} onClick={() => openEdit(p)} title="Editar">
                  ✏️
                </button>
                <button
                  className={`${styles.btnIcon} ${styles.btnIconDanger}`}
                  onClick={() => deleteItem(p.id)}
                  title="Excluir"
                >
                  🗑
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

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
                  <h3>{editItem ? 'Editar profissional' : 'Novo profissional'}</h3>
                  <button onClick={() => setShowForm(false)}>✕</button>
                </div>

                <div className={styles.modalBody}>
                  <div className={styles.formGroup}>
                    <label>Nome *</label>
                    <input
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Nome completo"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Função</label>
                    <select
                      value={form.role}
                      onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                    >
                      {ROLES.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>WhatsApp</label>
                    <input
                      value={form.whatsapp}
                      onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                      placeholder="61 9 9999-9999"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Bio / Especialidade</label>
                    <textarea
                      rows="3"
                      value={form.bio}
                      onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                      placeholder="Especialidades, experiência, estilo…"
                    />
                  </div>

                  <label className={styles.checkLabel}>
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                    />
                    Profissional ativo
                  </label>

                  {saveError && <p className={styles.saveError}>{saveError}</p>}
                </div>

                <div className={styles.modalFooter}>
                  <button className={styles.btnOutline} onClick={() => setShowForm(false)}>
                    Cancelar
                  </button>
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
