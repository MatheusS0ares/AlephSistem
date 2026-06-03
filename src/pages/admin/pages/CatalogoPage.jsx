import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { supabase, CATEGORIES } from '../../../lib/supabase'
import styles from './CatalogoPage.module.css'

const CAT_LABELS = { festas:'Festas', bebes:'Bebês', presentes:'Presentes', aniversario:'Aniversário', maternidade:'Maternidade', corporativo:'Corporativo' }
const EMPTY_FORM = { name: '', category: 'festas', description: '', price: '', price_num: '', icon: '🎁', image_url: '', brand: '', active: true, store_id: '' }

export default function CatalogoPage() {
  const [products, setProducts] = useState([])
  const [stores, setStores] = useState([])
  const [filterCat, setFilterCat] = useState('todos')
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const photoInputRef = useRef(null)

  const loadData = useCallback(async () => {
    const [prodRes, storeRes] = await Promise.all([
      supabase.from('products').select('*').order('order_index'),
      supabase.from('stores').select('id, name').eq('active', true),
    ])
    setProducts(prodRes.data || [])
    setStores(storeRes.data || [])
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const filtered = filterCat === 'todos' ? products : products.filter(p => p.category === filterCat)

  const catCounts = Object.keys(CATEGORIES || CAT_LABELS).reduce((acc, k) => {
    acc[k] = products.filter(p => p.category === k).length
    return acc
  }, {})

  function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
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
        const compressed = new File([blob], 'produto.jpg', { type: 'image/jpeg' })
        setSelectedFile(compressed)
        setPreviewUrl(URL.createObjectURL(compressed))
      }, 'image/jpeg', 0.85)
    }
    img.src = objectUrl
  }

  function removePhoto() {
    setSelectedFile(null)
    setPreviewUrl(null)
    setForm(f => ({ ...f, image_url: '' }))
    if (photoInputRef.current) photoInputRef.current.value = ''
  }

  function openNew() {
    setEditProduct(null)
    setForm({ ...EMPTY_FORM, store_id: '' })
    setSaveError(null)
    setSelectedFile(null)
    setPreviewUrl(null)
    setShowForm(true)
  }

  function openEdit(p) {
    setEditProduct(p)
    setSaveError(null)
    setSelectedFile(null)
    setPreviewUrl(p.image_url || null)
    setForm({
      name: p.name, category: p.category, description: p.description || '',
      price: p.price || '', price_num: p.price_num || '', icon: p.icon || '🎁',
      image_url: p.image_url || '', brand: p.brand || '',
      active: p.active !== false, store_id: p.store_id || '',
    })
    setShowForm(true)
  }

  async function saveProduct() {
    if (!form.name.trim()) { setSaveError('Informe o nome do produto.'); return }
    setSaving(true)
    setSaveError(null)

    let imageUrl = form.image_url || null

    if (selectedFile) {
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('product-images')
        .upload(filename, selectedFile, { upsert: true, contentType: 'image/jpeg' })
      if (uploadErr) {
        setSaveError('Erro ao enviar foto: ' + (uploadErr.message || 'bucket não encontrado. Crie o bucket "product-images" no Supabase Dashboard → Storage.'))
        setSaving(false)
        return
      }
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(uploadData.path)
      imageUrl = publicUrl
    } else if (!previewUrl) {
      imageUrl = null
    }

    const payload = { ...form, image_url: imageUrl, price_num: parseFloat(form.price_num) || 0, store_id: form.store_id || null }
    let error
    if (editProduct) {
      ({ error } = await supabase.from('products').update(payload).eq('id', editProduct.id))
    } else {
      ({ error } = await supabase.from('products').insert(payload))
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
    await supabase.from('products').update({ active: !p.active }).eq('id', p.id)
    loadData()
  }

  async function deleteProduct(id) {
    if (!window.confirm('Excluir produto?')) return
    await supabase.from('products').delete().eq('id', id)
    loadData()
  }

  const CATS = [{ key:'todos', label:'Todos', count: products.length }, ...Object.entries(CAT_LABELS).map(([k,v]) => ({ key:k, label:v, count: catCounts[k] || 0 }))]

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <div className={styles.counters}>
          <span>{products.length} produtos</span>
          <span>{Object.keys(CAT_LABELS).filter(k => catCounts[k] > 0).length} categorias</span>
        </div>
        <button className={styles.btnGold} onClick={openNew}>+ Produto</button>
      </div>

      <div className={styles.filterRow}>
        {CATS.map(c => (
          <button
            key={c.key}
            className={`${styles.filterTab} ${filterCat === c.key ? styles.filterActive : ''}`}
            onClick={() => setFilterCat(c.key)}
          >
            {c.label} {c.count > 0 && <span>{c.count}</span>}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filtered.map(p => (
          <motion.div
            key={p.id}
            className={`${styles.card} ${!p.active ? styles.cardInactive : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className={styles.cardImg}>
              {p.image_url ? (
                <img src={p.image_url} alt={p.name} className={styles.img} />
              ) : (
                <span className={styles.cardIcon}>{p.icon || '🎁'}</span>
              )}
              {!p.active && <span className={styles.inactiveBadge}>Inativo</span>}
            </div>

            <div className={styles.cardBody}>
              <span className={styles.catBadge}>{CAT_LABELS[p.category] || p.category}</span>
              <h4 className={styles.cardName}>{p.name}</h4>
              {p.brand && <span className={styles.brand}>{p.brand}</span>}
              {p.price && <span className={styles.price}>{p.price}</span>}
              {p.description && <p className={styles.desc}>{p.description}</p>}
              <span className={styles.sold}>{p.sold_count || 0} vendidos</span>
            </div>

            <div className={styles.cardActions}>
              <button className={styles.btnToggle} onClick={() => toggleActive(p)}>
                {p.active ? '👁 Ativo' : '🚫 Inativo'}
              </button>
              <button className={styles.btnIcon} onClick={() => openEdit(p)}>✏️</button>
              <button className={`${styles.btnIcon} ${styles.btnDanger}`} onClick={() => deleteProduct(p.id)}>🗑</button>
            </div>
          </motion.div>
        ))}
      </div>

      {createPortal(<AnimatePresence>
        {showForm && (
          <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className={styles.modal} initial={{ scale: 0.93 }} animate={{ scale: 1 }} exit={{ scale: 0.93 }}>
              <div className={styles.modalHeader}>
                <h3>{editProduct ? 'Editar produto' : 'Novo produto'}</h3>
                <button onClick={() => setShowForm(false)}>✕</button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Nome *</label>
                    <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Nome do produto" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Categoria</label>
                    <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}>
                      {Object.entries(CAT_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Marca</label>
                    <input value={form.brand} onChange={e => setForm(f => ({...f, brand: e.target.value}))} placeholder="Ex: Reino Imperial" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Preço (texto)</label>
                    <input value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} placeholder="A partir de R$ 49,90" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Preço (número)</label>
                    <input type="number" step="0.01" value={form.price_num} onChange={e => setForm(f => ({...f, price_num: e.target.value}))} placeholder="49.90" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Ícone (emoji)</label>
                    <input value={form.icon} onChange={e => setForm(f => ({...f, icon: e.target.value}))} placeholder="🎁" />
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Foto do produto</label>
                    <input ref={photoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
                    {previewUrl ? (
                      <div className={styles.photoPreviewWrap}>
                        <img src={previewUrl} alt="preview" className={styles.photoPreviewImg} />
                        <div className={styles.photoPreviewActions}>
                          <button type="button" className={styles.btnPhotoChange} onClick={() => photoInputRef.current?.click()}>🔄 Trocar</button>
                          <button type="button" className={styles.btnPhotoRemove} onClick={removePhoto}>🗑 Remover</button>
                        </div>
                      </div>
                    ) : (
                      <button type="button" className={styles.photoUploadBtn} onClick={() => photoInputRef.current?.click()}>
                        <span>📷</span><span>Adicionar foto</span>
                      </button>
                    )}
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Descrição</label>
                    <textarea rows="2" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} />
                  </div>
                  {stores.length > 1 && (
                    <div className={styles.formGroup}>
                      <label>Loja (vazio = compartilhado)</label>
                      <select value={form.store_id} onChange={e => setForm(f => ({...f, store_id: e.target.value}))}>
                        <option value="">Compartilhado</option>
                        {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                  )}
                  <label className={styles.checkLabel}>
                    <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({...f, active: e.target.checked}))} />
                    Produto ativo
                  </label>
                </div>
              </div>
              {saveError && <p className={styles.saveError}>{saveError}</p>}
              <div className={styles.modalFooter}>
                <button className={styles.btnOutline} onClick={() => setShowForm(false)}>Cancelar</button>
                <button className={styles.btnGold} onClick={saveProduct} disabled={saving}>
                  {saving ? 'Salvando…' : editProduct ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>, document.body)}
    </div>
  )
}
