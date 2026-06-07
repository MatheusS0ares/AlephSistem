import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { supabase } from '../../../lib/supabase'
import styles from './ServicosPage.module.css'

const ICONS = ['✂️', '💈', '🪒', '💆', '🧴', '⭐', '👑', '🔥']
const CATEGORIES = ['Corte', 'Barba', 'Combo', 'Tratamento', 'Outro']

const EMPTY_FORM = {
  icon: '✂️',
  name: '',
  category: 'Corte',
  price: '',
  duration_minutes: '',
  description: '',
  active: true,
}

function fmtPrice(val) {
  if (!val && val !== 0) return ''
  return `R$ ${Number(val).toFixed(2).replace('.', ',')}`
}

export default function ServicosPage({ storeId }) {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const loadServices = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('store_id', storeId)
      .order('order_index')
    setServices(data || [])
    setLoading(false)
  }, [storeId])

  useEffect(() => { if (storeId) loadServices() }, [loadServices, storeId])

  function openNew() {
    setEditItem(null)
    setForm(EMPTY_FORM)
    setSaveError(null)
    setShowModal(true)
  }

  function openEdit(svc) {
    setEditItem(svc)
    setForm({
      icon: svc.icon || '✂️',
      name: svc.name || '',
      category: svc.category || 'Corte',
      price: svc.price != null ? String(svc.price).replace('.', ',') : '',
      duration_minutes: svc.duration_minutes != null ? String(svc.duration_minutes) : '',
      description: svc.description || '',
      active: svc.active !== false,
    })
    setSaveError(null)
    setShowModal(true)
  }

  async function handleSave() {
    if (!form.name.trim()) { setSaveError('Nome é obrigatório.'); return }
    setSaving(true)
    setSaveError(null)
    try {
      const priceVal = form.price ? parseFloat(form.price.replace(',', '.')) : null
      const durVal = form.duration_minutes ? parseInt(form.duration_minutes, 10) : null
      const payload = {
        store_id: storeId,
        icon: form.icon,
        name: form.name.trim(),
        category: form.category,
        price: isNaN(priceVal) ? null : priceVal,
        duration_minutes: isNaN(durVal) ? null : durVal,
        description: form.description.trim() || null,
        active: form.active,
        order_index: editItem ? editItem.order_index : services.length,
      }
      if (editItem) {
        await supabase.from('services').update(payload).eq('id', editItem.id)
      } else {
        await supabase.from('services').insert(payload)
      }
      setShowModal(false)
      loadServices()
    } catch (err) {
      setSaveError(err.message || 'Erro ao salvar.')
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleActive(svc) {
    const next = !svc.active
    setServices(prev => prev.map(s => s.id === svc.id ? { ...s, active: next } : s))
    await supabase.from('services').update({ active: next }).eq('id', svc.id)
  }

  async function handleDelete(id) {
    if (!window.confirm('Remover este serviço?')) return
    setDeleting(id)
    await supabase.from('services').delete().eq('id', id)
    setServices(prev => prev.filter(s => s.id !== id))
    setDeleting(null)
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.topRow}>
        <div>
          <h2 className={styles.pageTitle}>Serviços</h2>
          <p className={styles.pageSub}>{services.length} serviço{services.length !== 1 ? 's' : ''} cadastrado{services.length !== 1 ? 's' : ''}</p>
        </div>
        <motion.button
          className={styles.btnAdd}
          onClick={openNew}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          + Adicionar serviço
        </motion.button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className={styles.grid}>
          {[0,1,2,3,4,5].map(i => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>✂️</span>
          <p>Nenhum serviço cadastrado.</p>
          <p className={styles.emptySub}>Adicione os serviços da barbearia para exibir na landing page.</p>
          <button className={styles.btnAdd} onClick={openNew}>+ Adicionar primeiro serviço</button>
        </div>
      ) : (
        <div className={styles.grid}>
          {services.map((svc, i) => (
            <motion.div
              key={svc.id}
              className={`${styles.card} ${!svc.active ? styles.cardInactive : ''}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: svc.active ? 1 : 0.45, scale: 1 }}
              transition={{ delay: i * 0.04 }}
            >
              <div className={styles.cardTop}>
                <span className={styles.cardIcon}>{svc.icon || '✂️'}</span>
                {svc.category && <span className={styles.cardCat}>{svc.category}</span>}
                <button
                  className={`${styles.toggleBtn} ${svc.active ? styles.toggleOn : styles.toggleOff}`}
                  onClick={() => handleToggleActive(svc)}
                >
                  {svc.active ? 'Ativo' : 'Inativo'}
                </button>
              </div>

              <p className={styles.cardName}>{svc.name}</p>

              {svc.description && (
                <p className={styles.cardDesc}>{svc.description}</p>
              )}

              <div className={styles.cardMeta}>
                {svc.price != null && (
                  <span className={styles.cardPrice}>{fmtPrice(svc.price)}</span>
                )}
                {svc.duration_minutes != null && (
                  <span className={styles.cardDur}>⏱ {svc.duration_minutes} min</span>
                )}
              </div>

              <div className={styles.cardActions}>
                <button className={styles.btnEdit} onClick={() => openEdit(svc)}>✏ Editar</button>
                <button
                  className={styles.btnDelete}
                  onClick={() => handleDelete(svc.id)}
                  disabled={deleting === svc.id}
                >
                  {deleting === svc.id ? '…' : '🗑'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      {createPortal(
        <AnimatePresence>
          {showModal && (
            <motion.div
              className={styles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={e => e.target === e.currentTarget && setShowModal(false)}
            >
              <motion.div
                className={styles.modal}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              >
                <div className={styles.modalHeader}>
                  <h3>{editItem ? 'Editar serviço' : 'Novo serviço'}</h3>
                  <button onClick={() => setShowModal(false)}>✕</button>
                </div>

                <div className={styles.modalBody}>
                  {/* Icon picker */}
                  <div className={styles.formGroup}>
                    <label>Ícone</label>
                    <div className={styles.iconPicker}>
                      {ICONS.map(ic => (
                        <button
                          key={ic}
                          type="button"
                          className={`${styles.iconBtn} ${form.icon === ic ? styles.iconBtnActive : ''}`}
                          onClick={() => setForm(f => ({ ...f, icon: ic }))}
                        >
                          {ic}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name */}
                  <div className={styles.formGroup}>
                    <label>Nome *</label>
                    <input
                      type="text"
                      placeholder="Ex: Corte Clássico"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    />
                  </div>

                  {/* Category */}
                  <div className={styles.formGroup}>
                    <label>Categoria</label>
                    <div className={styles.catPills}>
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          type="button"
                          className={`${styles.catPill} ${form.category === cat ? styles.catPillActive : ''}`}
                          onClick={() => setForm(f => ({ ...f, category: cat }))}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price + Duration */}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Preço (R$)</label>
                      <input
                        type="text"
                        placeholder="0,00"
                        value={form.price}
                        onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Duração (min)</label>
                      <input
                        type="number"
                        placeholder="30"
                        min="1"
                        value={form.duration_minutes}
                        onChange={e => setForm(f => ({ ...f, duration_minutes: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className={styles.formGroup}>
                    <label>Descrição (opcional)</label>
                    <textarea
                      rows={3}
                      placeholder="Descreva o serviço brevemente…"
                      value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    />
                  </div>

                  {/* Active toggle */}
                  <div className={styles.formToggleRow}>
                    <span>Serviço ativo</span>
                    <button
                      type="button"
                      className={`${styles.toggle} ${form.active ? styles.toggleOn : ''}`}
                      onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                      aria-pressed={form.active}
                    >
                      <span className={styles.toggleThumb} />
                    </button>
                  </div>

                  {saveError && <p className={styles.error}>{saveError}</p>}
                </div>

                <div className={styles.modalFooter}>
                  <button className={styles.btnCancel} onClick={() => setShowModal(false)}>Cancelar</button>
                  <motion.button
                    className={styles.btnSave}
                    onClick={handleSave}
                    disabled={saving}
                    whileTap={{ scale: 0.97 }}
                  >
                    {saving ? 'Salvando…' : editItem ? 'Salvar' : 'Criar serviço'}
                  </motion.button>
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
