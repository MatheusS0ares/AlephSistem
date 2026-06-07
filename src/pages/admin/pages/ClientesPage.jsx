import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { supabase } from '../../../lib/supabase'
import styles from './ClientesPage.module.css'

const BUCKET = import.meta.env.VITE_STORAGE_BUCKET || 'Photos'
const EMPTY_FORM = { name: '', whatsapp: '', instagram: '', notes: '', vip: false, walks_in: false }

export default function ClientesPage({ search, storeId }) {
  const [customers, setCustomers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editCustomer, setEditCustomer] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [customerStats, setCustomerStats] = useState({})
  const [customerPhotos, setCustomerPhotos] = useState({}) // latest photo per customer
  // Portfolio sheet
  const [portfolioClient, setPortfolioClient] = useState(null)
  const [portfolioPhotos, setPortfolioPhotos] = useState([])
  const [portfolioLoading, setPortfolioLoading] = useState(false)
  // Upload
  const [showUpload, setShowUpload] = useState(false)
  const [uploadCaption, setUploadCaption] = useState('')
  const [uploadFile, setUploadFile] = useState(null)
  const [uploadPreview, setUploadPreview] = useState(null)
  const [uploadSaving, setUploadSaving] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const fileRef = useRef(null)

  const loadData = useCallback(async () => {
    const [custRes, apptRes, photoRes] = await Promise.all([
      supabase.from('customers').select('*').eq('store_id', storeId).order('name'),
      supabase.from('appointments').select('customer_whatsapp, price, status').eq('store_id', storeId),
      supabase.from('gallery').select('customer_id, image_url, created_at')
        .eq('store_id', storeId).not('customer_id', 'is', null).order('created_at', { ascending: false }),
    ])
    const custs = custRes.data || []
    setCustomers(custs)

    // Stats por WhatsApp
    const apptMap = {}
    ;(apptRes.data || []).forEach(a => {
      const key = (a.customer_whatsapp || '').replace(/\D/g, '')
      if (!key) return
      if (!apptMap[key]) apptMap[key] = { total: 0, count: 0, pendentes: 0 }
      apptMap[key].count++
      apptMap[key].total += Number(a.price || 0)
      if (['agendado', 'confirmado'].includes(a.status)) apptMap[key].pendentes++
    })
    const statsMap = {}
    custs.forEach(c => {
      statsMap[c.id] = apptMap[(c.whatsapp || '').replace(/\D/g, '')] || { total: 0, count: 0, pendentes: 0 }
    })
    setCustomerStats(statsMap)

    // Foto mais recente por cliente
    const photoMap = {}
    ;(photoRes.data || []).forEach(p => {
      if (p.customer_id && !photoMap[p.customer_id]) photoMap[p.customer_id] = p.image_url
    })
    setCustomerPhotos(photoMap)
  }, [storeId])

  useEffect(() => { loadData() }, [loadData])

  // Abre portfólio do cliente
  async function openPortfolio(c) {
    setPortfolioClient(c)
    setPortfolioLoading(true)
    const { data } = await supabase.from('gallery')
      .select('*').eq('customer_id', c.id).order('created_at', { ascending: false })
    setPortfolioPhotos(data || [])
    setPortfolioLoading(false)
  }

  function closePortfolio() {
    setPortfolioClient(null)
    setPortfolioPhotos([])
    setShowUpload(false)
    setUploadFile(null)
    setUploadPreview(null)
    setUploadCaption('')
    setUploadError(null)
  }

  // Upload de foto para o portfólio
  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const img = new Image()
    const obj = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(obj)
      const MAX = 1600
      let { width, height } = img
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round(height * MAX / width); width = MAX }
        else { width = Math.round(width * MAX / height); height = MAX }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width; canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      canvas.toBlob(blob => {
        const compressed = new File([blob], 'corte.jpg', { type: 'image/jpeg' })
        setUploadFile(compressed)
        setUploadPreview(URL.createObjectURL(compressed))
      }, 'image/jpeg', 0.85)
    }
    img.src = obj
  }

  async function handleUpload() {
    if (!uploadFile) { setUploadError('Selecione uma foto.'); return }
    setUploadSaving(true)
    setUploadError(null)
    try {
      const path = `gallery/${storeId}/clientes/${portfolioClient.id}/${Date.now()}.jpg`
      const { data: up, error: upErr } = await supabase.storage.from(BUCKET)
        .upload(path, uploadFile, { contentType: 'image/jpeg', upsert: false })
      if (upErr) throw upErr
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(up.path)
      await supabase.from('gallery').insert({
        store_id: storeId,
        customer_id: portfolioClient.id,
        image_url: urlData.publicUrl,
        caption: uploadCaption || null,
        service_tag: 'Corte',
        active: true,
        order_index: portfolioPhotos.length,
      })
      // Recarrega portfólio
      const { data } = await supabase.from('gallery')
        .select('*').eq('customer_id', portfolioClient.id).order('created_at', { ascending: false })
      setPortfolioPhotos(data || [])
      setShowUpload(false)
      setUploadFile(null)
      setUploadPreview(null)
      setUploadCaption('')
      // Atualiza foto do card
      setCustomerPhotos(prev => ({ ...prev, [portfolioClient.id]: urlData.publicUrl }))
    } catch (err) {
      setUploadError(err.message)
    } finally {
      setUploadSaving(false)
    }
  }

  async function deletePhoto(photoId) {
    if (!window.confirm('Remover esta foto?')) return
    await supabase.from('gallery').delete().eq('id', photoId)
    setPortfolioPhotos(prev => prev.filter(p => p.id !== photoId))
  }

  // Formulário de cliente
  function openNew() {
    setEditCustomer(null); setSaveError(null)
    setForm({ ...EMPTY_FORM }); setShowForm(true)
  }
  function openEdit(c, e) {
    e.stopPropagation()
    setEditCustomer(c); setSaveError(null)
    setForm({ name: c.name, whatsapp: c.whatsapp || '', instagram: c.instagram || '', notes: c.notes || '', vip: c.vip || false, walks_in: c.walks_in || false })
    setShowForm(true)
  }
  async function saveCustomer() {
    if (!form.name.trim()) { setSaveError('Informe o nome do cliente.'); return }
    setSaving(true); setSaveError(null)
    const sid = storeId?.startsWith('fallback-') ? null : storeId
    const payload = { name: form.name.trim(), whatsapp: form.whatsapp, instagram: form.instagram, notes: form.notes, vip: form.vip, walks_in: form.walks_in, store_id: sid }
    const { error } = editCustomer
      ? await supabase.from('customers').update(payload).eq('id', editCustomer.id)
      : await supabase.from('customers').insert(payload)
    setSaving(false)
    if (error) { setSaveError(error.message) } else { setShowForm(false); loadData() }
  }
  async function toggleVip(c, e) {
    e.stopPropagation()
    await supabase.from('customers').update({ vip: !c.vip }).eq('id', c.id)
    loadData()
  }
  async function deleteCustomer(id, e) {
    e.stopPropagation()
    if (!window.confirm('Excluir este cliente?')) return
    await supabase.from('customers').delete().eq('id', id)
    loadData()
  }

  const fmt = v => `R$ ${Number(v).toFixed(2).replace('.', ',')}`
  const filtered = customers.filter(c => {
    const q = (search || '').toLowerCase()
    return !q || c.name.toLowerCase().includes(q) || c.whatsapp?.includes(q) || c.instagram?.includes(q)
  })

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
            const stats = customerStats[c.id] || { total: 0, count: 0, pendentes: 0 }
            const initials = c.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
            const latestPhoto = customerPhotos[c.id]
            return (
              <motion.div
                key={c.id}
                className={`${styles.card} ${c.vip ? styles.cardVip : ''}`}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => openPortfolio(c)}
                style={{ cursor: 'pointer' }}
              >
                {/* Cover foto do último corte */}
                {latestPhoto && (
                  <div className={styles.cardCover}>
                    <img src={latestPhoto} alt="Último corte" />
                    <div className={styles.cardCoverOverlay} />
                  </div>
                )}

                <div className={styles.cardHeader}>
                  <div className={`${styles.avatar} ${latestPhoto ? styles.avatarSmall : ''}`}>
                    {initials}
                  </div>
                  <div className={styles.cardInfo}>
                    <div className={styles.nameRow}>
                      <span className={styles.name}>{c.name}</span>
                      {c.vip && <span className={styles.vipBadge}>⭐</span>}
                    </div>
                    {c.instagram
                      ? <a href={`https://instagram.com/${c.instagram.replace('@','')}`} target="_blank" rel="noopener noreferrer" className={styles.igLink} onClick={e => e.stopPropagation()}>@{c.instagram.replace('@','')}</a>
                      : <span className={styles.phone}>{c.whatsapp || '—'}</span>
                    }
                  </div>
                </div>

                {c.notes && <p className={styles.notes}>{c.notes}</p>}

                <div className={styles.stats}>
                  <div className={styles.statItem}>
                    <strong>{stats.count}</strong><span>Cortes</span>
                  </div>
                  <div className={styles.statItem}>
                    <strong className={styles.statGold}>{fmt(stats.total)}</strong><span>Gasto</span>
                  </div>
                  <div className={styles.statItem}>
                    <strong>{stats.pendentes}</strong><span>Pendentes</span>
                  </div>
                </div>

                <div className={styles.cardBottom}>
                  <span className={c.walks_in ? styles.badgeWalk : styles.badgeBook}>
                    {c.walks_in ? '🚶 Sem hora' : '📅 Agenda'}
                  </span>
                  <div className={styles.cardActions} onClick={e => e.stopPropagation()}>
                    {c.whatsapp && (
                      <a href={`https://wa.me/55${c.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className={styles.btnWpp}>💬</a>
                    )}
                    <button className={styles.btnIcon} onClick={e => toggleVip(c, e)}>{c.vip ? '★' : '☆'}</button>
                    <button className={styles.btnIcon} onClick={e => openEdit(c, e)}>✏️</button>
                    <button className={`${styles.btnIcon} ${styles.btnIconDanger}`} onClick={e => deleteCustomer(c.id, e)}>🗑</button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* ── Portfolio sheet ── */}
      {createPortal(
        <AnimatePresence>
          {portfolioClient && (
            <motion.div className={styles.portfolioOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={e => e.target === e.currentTarget && closePortfolio()}>
              <motion.div className={styles.portfolioSheet} initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 32 }}>
                {/* Header */}
                <div className={styles.sheetHeader}>
                  <div className={styles.sheetClientInfo}>
                    <span className={styles.sheetName}>{portfolioClient.name}</span>
                    {portfolioClient.instagram && (
                      <a href={`https://instagram.com/${portfolioClient.instagram.replace('@','')}`} target="_blank" rel="noopener noreferrer" className={styles.sheetIg}>
                        📷 @{portfolioClient.instagram.replace('@','')}
                      </a>
                    )}
                  </div>
                  <div className={styles.sheetHeaderActions}>
                    <motion.button className={styles.btnAddPhoto} onClick={() => { setShowUpload(true); setUploadFile(null); setUploadPreview(null); setUploadCaption(''); setUploadError(null) }} whileTap={{ scale: 0.95 }}>
                      + Foto
                    </motion.button>
                    <button className={styles.btnClose} onClick={closePortfolio}>✕</button>
                  </div>
                </div>

                {/* Galeria de cortes */}
                <div className={styles.sheetBody}>
                  {portfolioLoading ? (
                    <div className={styles.sheetGrid}>
                      {[0,1,2,3].map(i => <div key={i} className={styles.photoSkeleton} />)}
                    </div>
                  ) : portfolioPhotos.length === 0 ? (
                    <div className={styles.sheetEmpty}>
                      <span>✂️</span>
                      <p>Nenhum corte registrado ainda.</p>
                      <p>Toque em "+ Foto" para registrar o estado atual do corte.</p>
                    </div>
                  ) : (
                    <div className={styles.sheetGrid}>
                      {portfolioPhotos.map((p, i) => (
                        <motion.div key={p.id} className={styles.photoCard} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}>
                          <img src={p.image_url} alt={p.caption || 'Corte'} />
                          {(p.caption || p.created_at) && (
                            <div className={styles.photoInfo}>
                              {p.caption && <span className={styles.photoCaption}>{p.caption}</span>}
                              {p.created_at && <span className={styles.photoDate}>{new Date(p.created_at).toLocaleDateString('pt-BR')}</span>}
                            </div>
                          )}
                          <button className={styles.photoDelete} onClick={() => deletePhoto(p.id)}>🗑</button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Upload modal dentro do sheet */}
                <AnimatePresence>
                  {showUpload && (
                    <motion.div className={styles.uploadPanel} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 340, damping: 28 }}>
                      <div className={styles.uploadHeader}>
                        <span>Novo corte — {portfolioClient.name}</span>
                        <button onClick={() => setShowUpload(false)}>✕</button>
                      </div>
                      <div className={styles.uploadBody}>
                        <div className={styles.photoPicker} onClick={() => fileRef.current?.click()} style={uploadPreview ? { padding: 0, border: 'none' } : {}}>
                          {uploadPreview
                            ? <img src={uploadPreview} alt="preview" className={styles.photoPreview} />
                            : <><span style={{ fontSize: '2rem' }}>📷</span><span className={styles.pickText}>Selecionar foto do corte</span></>
                          }
                        </div>
                        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                        {uploadPreview && <button className={styles.btnTrocar} onClick={() => fileRef.current?.click()}>Trocar foto</button>}
                        <div className={styles.formGroup}>
                          <label>Legenda (opcional)</label>
                          <input type="text" placeholder="Ex: Degradê + barba" value={uploadCaption} onChange={e => setUploadCaption(e.target.value)} />
                        </div>
                        {uploadError && <p className={styles.saveError}>{uploadError}</p>}
                      </div>
                      <div className={styles.uploadFooter}>
                        <button className={styles.btnOutline} onClick={() => setShowUpload(false)}>Cancelar</button>
                        <motion.button className={styles.btnGold} onClick={handleUpload} disabled={uploadSaving} whileTap={{ scale: 0.97 }}>
                          {uploadSaving ? 'Enviando…' : 'Publicar corte'}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ── Form cliente ── */}
      {createPortal(
        <AnimatePresence>
          {showForm && (
            <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
              <motion.div className={styles.modal} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ type: 'spring', stiffness: 340, damping: 28 }}>
                <div className={styles.modalHeader}>
                  <h3>{editCustomer ? 'Editar cliente' : 'Novo cliente'}</h3>
                  <button onClick={() => setShowForm(false)}>✕</button>
                </div>
                <div className={styles.modalBody}>
                  <div className={styles.formGroup}>
                    <label>Nome *</label>
                    <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Nome completo" />
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>WhatsApp</label>
                      <input value={form.whatsapp} onChange={e => setForm(f => ({...f, whatsapp: e.target.value}))} placeholder="61 9 9999-9999" />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Instagram</label>
                      <input value={form.instagram} onChange={e => setForm(f => ({...f, instagram: e.target.value}))} placeholder="@usuario" />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Observações</label>
                    <textarea rows="2" value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} placeholder="Preferências, histórico de corte…" />
                  </div>
                  <div className={styles.toggleRow}>
                    <div className={styles.toggleGroup}>
                      <span>Cliente VIP ⭐</span>
                      <button type="button" className={`${styles.toggle} ${form.vip ? styles.toggleOn : ''}`} onClick={() => setForm(f => ({...f, vip: !f.vip}))}><span className={styles.toggleThumb} /></button>
                    </div>
                    <div className={styles.toggleGroup}>
                      <span>Vem sem agendar 🚶</span>
                      <button type="button" className={`${styles.toggle} ${form.walks_in ? styles.toggleOn : ''}`} onClick={() => setForm(f => ({...f, walks_in: !f.walks_in}))}><span className={styles.toggleThumb} /></button>
                    </div>
                  </div>
                  {saveError && <p className={styles.saveError}>{saveError}</p>}
                </div>
                <div className={styles.modalFooter}>
                  <button className={styles.btnOutline} onClick={() => setShowForm(false)}>Cancelar</button>
                  <button className={styles.btnGold} onClick={saveCustomer} disabled={saving}>{saving ? 'Salvando…' : editCustomer ? 'Salvar' : 'Criar'}</button>
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
