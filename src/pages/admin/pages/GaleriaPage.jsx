import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { supabase } from '../../../lib/supabase'
import styles from './GaleriaPage.module.css'

const EMPTY_FORM = { caption: '', service_tag: '', active: true }
const SERVICE_TAGS = ['Corte Clássico', 'Degradê / Fade', 'Barba Completa', 'Corte + Barba', 'Hidratação Capilar', 'Sobrancelha Masculina', 'Outro']

export default function GaleriaPage({ storeId }) {
  const [fotos, setFotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editFoto, setEditFoto] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const fileInputRef = useRef(null)

  const loadFotos = useCallback(async () => {
    setLoading(true)
    const q = supabase.from('gallery').select('*').eq('active', true).order('order_index')
    if (storeId && !storeId.startsWith('fallback-')) q.eq('store_id', storeId)
    const { data } = await q
    setFotos(data || [])
    setLoading(false)
  }, [storeId])

  useEffect(() => { loadFotos() }, [loadFotos])

  function openNew() {
    setEditFoto(null)
    setForm(EMPTY_FORM)
    setPreviewUrl(null)
    setSelectedFile(null)
    setSaveError(null)
    setShowModal(true)
  }

  function openEdit(foto) {
    setEditFoto(foto)
    setForm({ caption: foto.caption || '', service_tag: foto.service_tag || '', active: foto.active })
    setPreviewUrl(foto.image_url)
    setSelectedFile(null)
    setSaveError(null)
    setShowModal(true)
  }

  function handleFileChange(e) {
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
        const compressed = new File([blob], 'foto.jpg', { type: 'image/jpeg' })
        setSelectedFile(compressed)
        setPreviewUrl(URL.createObjectURL(compressed))
      }, 'image/jpeg', 0.85)
    }
    img.src = objectUrl
  }

  async function uploadImage(file) {
    const BUCKET = import.meta.env.VITE_STORAGE_BUCKET || 'Photos'
    const fileName = `gallery/${storeId}/${Date.now()}.jpg`
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, file, { contentType: 'image/jpeg', upsert: false })
    if (error) {
      if (error.message?.toLowerCase().includes('bucket')) {
        const { data: buckets } = await supabase.storage.listBuckets()
        const names = buckets?.map(b => b.name).join(', ') || 'nenhum'
        throw new Error(`Bucket "${BUCKET}" não encontrado. Buckets disponíveis: ${names}`)
      }
      throw error
    }
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path)
    return urlData.publicUrl
  }

  async function handleSave() {
    if (!editFoto && !selectedFile) {
      setSaveError('Selecione uma foto para enviar.')
      return
    }
    setSaving(true)
    setSaveError(null)
    try {
      let image_url = editFoto?.image_url || ''
      if (selectedFile) {
        image_url = await uploadImage(selectedFile)
      }
      const payload = {
        store_id:    storeId,
        image_url,
        caption:     form.caption || null,
        service_tag: form.service_tag || null,
        active:      form.active,
        order_index: fotos.length,
      }
      if (editFoto) {
        await supabase.from('gallery').update(payload).eq('id', editFoto.id)
      } else {
        await supabase.from('gallery').insert(payload)
      }
      setShowModal(false)
      loadFotos()
    } catch (err) {
      setSaveError(err.message || 'Erro ao salvar. Verifique o storage do Supabase.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Remover esta foto da galeria?')) return
    setDeleting(id)
    await supabase.from('gallery').delete().eq('id', id)
    setFotos(prev => prev.filter(f => f.id !== id))
    setDeleting(null)
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.topRow}>
        <div>
          <h2 className={styles.pageTitle}>Galeria de Trabalhos</h2>
          <p className={styles.pageSub}>{fotos.length} foto{fotos.length !== 1 ? 's' : ''} publicada{fotos.length !== 1 ? 's' : ''}</p>
        </div>
        <motion.button
          className={styles.btnAdd}
          onClick={openNew}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          + Adicionar foto
        </motion.button>
      </div>

      {/* Tips */}
      <div className={styles.tip}>
        📸 As fotos aparecem automaticamente na seção "Nossos Trabalhos" da landing page. Tire foto do corte, envie aqui e o cliente já vê!
      </div>

      {/* Grid */}
      {loading ? (
        <div className={styles.grid}>
          {[0,1,2,3,4,5].map(i => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
      ) : fotos.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📷</span>
          <p>Nenhuma foto ainda.</p>
          <p className={styles.emptySub}>Adicione fotos dos cortes para exibir na landing page.</p>
          <button className={styles.btnAdd} onClick={openNew}>+ Adicionar primeira foto</button>
        </div>
      ) : (
        <div className={styles.grid}>
          {fotos.map((foto, i) => (
            <motion.div
              key={foto.id}
              className={styles.card}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
            >
              <img src={foto.image_url} alt={foto.caption || 'Trabalho'} className={styles.cardImg} loading="lazy" />
              <div className={styles.cardOverlay}>
                {foto.service_tag && <span className={styles.cardTag}>{foto.service_tag}</span>}
                {foto.caption && <p className={styles.cardCaption}>{foto.caption}</p>}
                <div className={styles.cardActions}>
                  <button className={styles.btnEdit} onClick={() => openEdit(foto)}>✏ Editar</button>
                  <button
                    className={styles.btnDelete}
                    onClick={() => handleDelete(foto.id)}
                    disabled={deleting === foto.id}
                  >
                    {deleting === foto.id ? '…' : '🗑'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal — rendered via portal to escape motion.div stacking context */}
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
                <h3>{editFoto ? 'Editar foto' : 'Adicionar foto'}</h3>
                <button onClick={() => setShowModal(false)}>✕</button>
              </div>

              <div className={styles.modalBody}>
                {/* Photo picker */}
                <div
                  className={styles.photoPicker}
                  onClick={() => fileInputRef.current?.click()}
                  style={previewUrl ? { padding: 0, border: 'none' } : {}}
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="preview" className={styles.photoPreview} />
                  ) : (
                    <>
                      <span className={styles.photoPickerIcon}>📷</span>
                      <span className={styles.photoPickerText}>Toque para selecionar ou tirar foto</span>
                      <span className={styles.photoPickerSub}>JPG, PNG · máx 5 MB</span>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                {previewUrl && (
                  <button className={styles.btnTrocar} onClick={() => fileInputRef.current?.click()}>
                    Trocar foto
                  </button>
                )}

                {/* Caption */}
                <div className={styles.formGroup}>
                  <label>Legenda (opcional)</label>
                  <input
                    type="text"
                    placeholder="Ex: Degradê + barba ✂"
                    value={form.caption}
                    onChange={e => setForm(f => ({ ...f, caption: e.target.value }))}
                  />
                </div>

                {/* Service tag */}
                <div className={styles.formGroup}>
                  <label>Serviço relacionado</label>
                  <div className={styles.tagPills}>
                    {SERVICE_TAGS.map(t => (
                      <button
                        key={t}
                        type="button"
                        className={`${styles.tagPill} ${form.service_tag === t ? styles.tagPillActive : ''}`}
                        onClick={() => setForm(f => ({ ...f, service_tag: f.service_tag === t ? '' : t }))}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
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
                  {saving ? 'Enviando…' : editFoto ? 'Salvar' : 'Publicar'}
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
