import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { supabase } from '../../../lib/supabase'
import styles from './PedidosPage.module.css'

const STATUS_FLOW = ['orcamento','confirmado','encomendado','chegou','entregue']
const STATUS_LABELS = {
  orcamento: 'Orçamento', confirmado: 'Confirmado', encomendado: 'Encomendado',
  chegou: 'Chegou ✨', entregue: 'Entregue', cancelado: 'Cancelado',
}
const PAYMENT_OPTS = ['pix','dinheiro','cartão crédito','cartão débito','transferência','outro']

const EMPTY_FORM = {
  customer_id: '',
  customer_name: '',
  whatsapp: '',
  payment_method: 'pix',
  status: 'orcamento',
  sinal: '',
  order_date: new Date().toISOString().slice(0, 10),
  delivery_date: '',
  message: '',
  items: [{ product_id: '', product_name: '', qty: 1, price: '' }],
}

const fmt = (v) => v != null ? `R$ ${Number(v).toFixed(2).replace('.', ',')}` : 'R$ 0,00'

function generateNF(order, storeName) {
  // lazy-load PDF libs only when needed
  import('../../../utils/generatePDF').then(({ generateReciboPDF }) => {
    generateReciboPDF(order, storeName)
  })
}

function buildWhatsAppMsg(order, template) {
  if (!order.whatsapp) return
  const msg = template
    .replace('{nome}', order.customer_name || '')
    .replace('{produto}', order.product_name || order.product_interest || '')
    .replace('{total}', fmt(order.total))
    .replace('{sinal}', fmt(order.sinal))
    .replace('{restante}', fmt((order.total || 0) - (order.sinal || 0)))
    .replace('{qtd}', order.quantity || 1)
    .replace('{prazo}', order.delivery_date ? new Date(order.delivery_date + 'T12:00:00').toLocaleDateString('pt-BR') : '—')
  const number = order.whatsapp.replace(/\D/g, '')
  window.open(`https://wa.me/55${number}?text=${encodeURIComponent(msg)}`, '_blank')
}

export default function PedidosPage({ search, storeId, storeName }) {
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [filterStatus, setFilterStatus] = useState('todos')
  const [showForm, setShowForm] = useState(false)
  const [editOrder, setEditOrder] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [wppTemplates, setWppTemplates] = useState({})
  const [showNewClient, setShowNewClient] = useState(false)
  const [newClientForm, setNewClientForm] = useState({ name: '', whatsapp: '' })
  const [nfOrder, setNfOrder] = useState(null)
  const [nfCpf, setNfCpf] = useState('')
  const [nfDiscriminacao, setNfDiscriminacao] = useState('')
  const [nfCopied, setNfCopied] = useState(false)
  const [fiscalSettings, setFiscalSettings] = useState({})
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [viewImageUrl, setViewImageUrl] = useState(null)
  const photoInputRef = useRef(null)

  const loadData = useCallback(async () => {
    const effectiveId = storeId?.startsWith('fallback-') ? null : storeId
    const [ordRes, custRes, prodRes, settRes] = await Promise.all([
      storeId
        ? supabase.from('orders').select('*').eq('store_id', storeId).order('created_at', { ascending: false })
        : supabase.from('orders').select('*').is('store_id', null).order('created_at', { ascending: false }),
      effectiveId
        ? supabase.from('customers').select('id, name, whatsapp').eq('store_id', effectiveId).order('name')
        : supabase.from('customers').select('id, name, whatsapp').order('name'),
      supabase.from('products').select('id, name, price_num').eq('active', true).order('name'),
      supabase.from('settings').select('key, value').or('key.like.msg_%,key.like.nf_%'),
    ])
    setOrders(ordRes.data || [])
    setCustomers(custRes.data || [])
    setProducts(prodRes.data || [])
    const tpls = {}
    const fiscal = {}
    ;(settRes.data || []).forEach(r => {
      if (r.key.startsWith('msg_')) tpls[r.key] = r.value
      if (r.key.startsWith('nf_'))  fiscal[r.key] = r.value
    })
    setWppTemplates(tpls)
    setFiscalSettings(fiscal)
  }, [storeId])

  useEffect(() => { loadData() }, [loadData])

  useEffect(() => {
    window.__adminOpenNewOrder = openNew
    return () => { delete window.__adminOpenNewOrder }
  })

  /* ── item helpers ── */
  const addItem    = () => setForm(f => ({ ...f, items: [...f.items, { product_id: '', product_name: '', qty: 1, price: '' }] }))
  const removeItem = (i) => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }))
  const updateItem = (i, changes) => setForm(f => ({
    ...f,
    items: f.items.map((item, idx) => idx === i ? { ...item, ...changes } : item),
  }))
  const computedTotal = form.items.reduce((sum, item) => sum + item.qty * (parseFloat(item.price) || 0), 0)

  /* ── customer helpers ── */
  function selectCustomer(customerId) {
    const c = customers.find(x => x.id === customerId)
    if (c) setForm(f => ({ ...f, customer_id: c.id, customer_name: c.name, whatsapp: c.whatsapp || '' }))
  }

  async function saveNewClient() {
    if (!newClientForm.name.trim()) return
    const effectiveStoreId = storeId?.startsWith('fallback-') ? null : storeId
    const { data, error } = await supabase.from('customers').insert({
      name: newClientForm.name.trim(),
      whatsapp: newClientForm.whatsapp,
      store_id: effectiveStoreId,
    }).select().single()
    if (!error && data) {
      setCustomers(list => [...list, data].sort((a, b) => a.name.localeCompare(b.name)))
      selectCustomer(data.id)
      setShowNewClient(false)
      setNewClientForm({ name: '', whatsapp: '' })
    }
  }

  /* ── order CRUD ── */
  const filtered = orders.filter(o => {
    const matchStatus = filterStatus === 'todos' || o.status === filterStatus
    const q = (search || '').toLowerCase()
    const matchSearch = !q || o.customer_name?.toLowerCase().includes(q) ||
      o.product_name?.toLowerCase().includes(q) || o.whatsapp?.includes(q)
    return matchStatus && matchSearch
  })

  const countByStatus = (s) => orders.filter(o => o.status === s).length

  function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    // Compress before storing: resize to max 1600px, JPEG 82%
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
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      canvas.toBlob(blob => {
        const compressed = new File([blob], 'foto.jpg', { type: 'image/jpeg' })
        setSelectedFile(compressed)
        setPreviewUrl(URL.createObjectURL(compressed))
      }, 'image/jpeg', 0.82)
    }
    img.src = objectUrl
  }

  function removePhoto() {
    setSelectedFile(null)
    setPreviewUrl(null)
    if (photoInputRef.current) photoInputRef.current.value = ''
  }

  function openNew() {
    setEditOrder(null)
    setForm({ ...EMPTY_FORM, order_date: new Date().toISOString().slice(0, 10) })
    setSaveError(null)
    setShowNewClient(false)
    setSelectedFile(null)
    setPreviewUrl(null)
    setShowForm(true)
  }

  function openEdit(o) {
    setEditOrder(o)
    setSaveError(null)
    setShowNewClient(false)
    setSelectedFile(null)
    setPreviewUrl(o.image_url || null)
    const unitPrice = (o.quantity && o.total) ? (o.total / o.quantity) : (o.total || '')
    setForm({
      customer_id: o.customer_id || '',
      customer_name: o.customer_name || '',
      whatsapp: o.whatsapp || '',
      payment_method: o.payment_method || 'pix',
      status: o.status || 'orcamento',
      sinal: o.sinal != null ? String(o.sinal) : '',
      order_date: o.created_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
      delivery_date: o.delivery_date || '',
      message: o.message || '',
      items: [{
        product_id: '',
        product_name: o.product_name || o.product_interest || '',
        qty: o.quantity || 1,
        price: unitPrice ? Number(unitPrice).toFixed(2) : '',
      }],
    })
    setShowForm(true)
  }

  async function saveOrder() {
    if (!form.customer_name.trim()) { setSaveError('Informe o nome do cliente.'); return }
    setSaving(true)
    setSaveError(null)
    const effectiveStoreId = storeId?.startsWith('fallback-') ? null : storeId
    const total = computedTotal
    const product_name = form.items.map(i => i.product_name).filter(Boolean).join(', ') || 'Produto'
    const quantity = form.items.reduce((s, i) => s + i.qty, 0)
    const payload = {
      customer_id: form.customer_id || null,
      customer_name: form.customer_name.trim(),
      whatsapp: form.whatsapp,
      product_name,
      product_interest: product_name,
      quantity,
      total,
      sinal: parseFloat(form.sinal) || 0,
      payment_method: form.payment_method,
      delivery_date: form.delivery_date || null,
      status: form.status,
      message: form.message,
      store_id: effectiveStoreId,
    }
    let error
    let orderId = editOrder?.id

    if (editOrder) {
      ({ error } = await supabase.from('orders').update(payload).eq('id', editOrder.id))
    } else {
      const { data: newOrder, error: insertError } = await supabase
        .from('orders').insert(payload).select('id').single()
      error = insertError
      orderId = newOrder?.id
    }

    if (!error && orderId && selectedFile) {
      const ext = selectedFile.name.split('.').pop().toLowerCase()
      const path = `${effectiveStoreId || 'shared'}/${orderId}.${ext}`
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('order-images')
        .upload(path, selectedFile, { upsert: true, contentType: selectedFile.type })
      if (!uploadErr && uploadData) {
        const { data: { publicUrl } } = supabase.storage.from('order-images').getPublicUrl(uploadData.path)
        await supabase.from('orders').update({ image_url: publicUrl }).eq('id', orderId)
      }
    } else if (!error && orderId && !selectedFile && !previewUrl && editOrder?.image_url) {
      await supabase.from('orders').update({ image_url: null }).eq('id', orderId)
    }

    setSaving(false)
    if (error) {
      setSaveError(error.message || 'Erro ao salvar. Verifique os dados e tente novamente.')
    } else {
      setShowForm(false)
      loadData()
    }
  }

  async function advanceStatus(order) {
    const idx = STATUS_FLOW.indexOf(order.status)
    if (idx < 0 || idx >= STATUS_FLOW.length - 1) return
    await supabase.from('orders').update({ status: STATUS_FLOW[idx + 1] }).eq('id', order.id)
    loadData()
  }

  async function cancelOrder(order) {
    await supabase.from('orders').update({ status: 'cancelado' }).eq('id', order.id)
    loadData()
  }

  async function deleteOrder(id) {
    if (!window.confirm('Excluir este pedido?')) return
    await supabase.from('orders').delete().eq('id', id)
    loadData()
  }

  function sendWhatsApp(order) {
    const tplKey = `msg_${order.status}`
    const tpl = wppTemplates[tplKey] || `Olá {nome}! Sobre seu pedido de {produto}: Total {total}, Sinal {sinal}, Restante {restante}. Prazo: {prazo}. ♛ ${storeName || 'Reino Imperial'}`
    buildWhatsAppMsg(order, tpl)
  }

  function openNF(order) {
    setNfOrder(order)
    setNfCpf('')
    const defaultDisc = fiscalSettings.nf_discriminacao_padrao || 'Prestação de serviço de personalização — {produto} ({qtd}x)'
    const disc = defaultDisc
      .replace('{produto}', order.product_name || order.product_interest || '')
      .replace('{qtd}', String(order.quantity || 1))
      .replace('{nome}', order.customer_name || '')
      .replace('{total}', fmt(order.total))
    setNfDiscriminacao(disc)
    setNfCopied(false)
  }

  async function copyNFData() {
    const lines = [
      '=== DADOS PARA NOTA FISCAL ===',
      '',
      '[ EMITENTE ]',
      `Razão Social: ${fiscalSettings.nf_razao_social || storeName || '—'}`,
      `CNPJ: ${fiscalSettings.nf_cnpj || '—'}`,
      `Insc. Municipal: ${fiscalSettings.nf_inscricao_municipal || '—'}`,
      `CNAE: ${fiscalSettings.nf_cnae || '—'}`,
      '',
      '[ TOMADOR (CLIENTE) ]',
      `Nome: ${nfOrder?.customer_name || '—'}`,
      `CPF/CNPJ: ${nfCpf || '(preencher no portal)'}`,
      '',
      '[ SERVIÇO ]',
      `Discriminação: ${nfDiscriminacao}`,
      `Valor: ${fmt(nfOrder?.total)}`,
      `Alíquota ISS: ${fiscalSettings.nf_aliquota_iss || '—'}%`,
      `Competência: ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`,
    ].join('\n')
    try {
      await navigator.clipboard.writeText(lines)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = lines
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setNfCopied(true)
    setTimeout(() => setNfCopied(false), 2500)
  }

  const nextLabel = (o) => {
    const idx = STATUS_FLOW.indexOf(o.status)
    if (idx < 0 || idx >= STATUS_FLOW.length - 1) return null
    return `→ ${STATUS_LABELS[STATUS_FLOW[idx + 1]]}`
  }

  const FILTER_TABS = [
    { key: 'todos', label: 'Todos', count: orders.length },
    ...STATUS_FLOW.map(s => ({ key: s, label: STATUS_LABELS[s], count: countByStatus(s) })),
    { key: 'cancelado', label: 'Cancelado', count: countByStatus('cancelado') },
  ]

  const restante = computedTotal - (parseFloat(form.sinal) || 0)

  return (
    <div className={styles.page}>
      {/* Filter tabs */}
      <div className={styles.filterRow}>
        {FILTER_TABS.map(t => (
          <button
            key={t.key}
            className={`${styles.filterTab} ${filterStatus === t.key ? styles.filterActive : ''}`}
            onClick={() => setFilterStatus(t.key)}
          >
            {t.label}
            {t.count > 0 && <span className={styles.filterCount}>{t.count}</span>}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>Nenhum pedido encontrado.</div>
      ) : (
        <div className={styles.list}>
          {filtered.map(o => (
            <motion.div
              key={o.id}
              className={styles.orderCard}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={styles.orderTop}>
                <div className={styles.orderAvatar}>{(o.customer_name || '?')[0].toUpperCase()}</div>
                <div className={styles.orderInfo}>
                  <div className={styles.orderIdRow}>
                    <span className={styles.orderId}>#{o.id?.slice(-10).toUpperCase()}</span>
                    <span className={`${styles.statusBadge} ${styles[`st_${o.status}`]}`}>
                      {STATUS_LABELS[o.status]}
                    </span>
                  </div>
                  <span className={styles.orderName}>{o.customer_name || '—'}</span>
                  <span className={styles.orderProduct}>
                    {o.product_name || o.product_interest || '—'}
                    {o.quantity > 1 && ` ×${o.quantity}`}
                  </span>
                </div>
                <div className={styles.orderDateCol}>
                  <span className={styles.orderDate}>
                    {new Date(o.created_at).toLocaleDateString('pt-BR', { day:'2-digit', month:'short' })}
                  </span>
                  {o.delivery_date && (
                    <span className={styles.deliveryDate}>
                      entrega {new Date(o.delivery_date + 'T12:00:00').toLocaleDateString('pt-BR', { day:'2-digit', month:'short' })}
                    </span>
                  )}
                  {o.image_url && (
                    <img
                      src={o.image_url}
                      alt="foto"
                      className={styles.orderThumb}
                      onClick={() => setViewImageUrl(o.image_url)}
                    />
                  )}
                </div>
              </div>

              <div className={styles.orderFinancial}>
                <div className={styles.finItem}>
                  <span>Total</span>
                  <strong>{fmt(o.total)}</strong>
                </div>
                <div className={styles.finItem}>
                  <span>Sinal</span>
                  <strong className={styles.finGreen}>{fmt(o.sinal)}</strong>
                </div>
                <div className={styles.finItem}>
                  <span>Restante</span>
                  <strong className={styles.finRed}>{fmt((o.total || 0) - (o.sinal || 0))}</strong>
                </div>
                <div className={styles.finItem}>
                  <span>Pagamento</span>
                  <span className={styles.payBadge}>{o.payment_method || 'pix'}</span>
                </div>
              </div>

              <div className={styles.orderActions}>
                {nextLabel(o) && (
                  <button className={styles.btnAdvance} onClick={() => advanceStatus(o)}>
                    {nextLabel(o)}
                  </button>
                )}
                <button className={styles.btnSecondary} onClick={() => openEdit(o)}>✏️ Editar</button>
                <button className={styles.btnWpp} onClick={() => sendWhatsApp(o)}>💬</button>
                <button className={styles.btnNF} onClick={() => generateNF(o, storeName)} title="Baixar Recibo .txt">🧾</button>
                <button className={styles.btnEmitirNF} onClick={() => openNF(o)} title="Emitir Nota Fiscal">📋 NF</button>
                {o.status !== 'cancelado' && (
                  <button className={styles.btnCancel} onClick={() => cancelOrder(o)}>Cancelar</button>
                )}
                <button className={styles.btnDelete} onClick={() => deleteOrder(o.id)}>🗑</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {createPortal(<AnimatePresence>
        {showForm && (
          <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className={styles.modal}
              initial={{ scale: 0.93, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.93, y: 20 }}
            >
              <div className={styles.modalHeader}>
                <div>
                  {storeName && <span className={styles.modalStore}>{storeName.toUpperCase()}</span>}
                  <h3>{editOrder ? 'Editar pedido' : 'Novo pedido'}</h3>
                </div>
                <button className={styles.modalClose} onClick={() => setShowForm(false)}>✕</button>
              </div>

              <div className={styles.modalBody}>

                {/* ─── Customer ─── */}
                <div className={styles.formRow}>
                  <div className={`${styles.formGroup} ${styles.grow}`}>
                    <label>Cliente</label>
                    {showNewClient ? (
                      <div className={styles.inlineClientForm}>
                        <input
                          placeholder="Nome *"
                          value={newClientForm.name}
                          onChange={e => setNewClientForm(f => ({...f, name: e.target.value}))}
                          onKeyDown={e => e.key === 'Enter' && saveNewClient()}
                        />
                        <input
                          placeholder="WhatsApp"
                          value={newClientForm.whatsapp}
                          onChange={e => setNewClientForm(f => ({...f, whatsapp: e.target.value}))}
                        />
                        <div className={styles.inlineClientBtns}>
                          <button className={styles.btnGold} onClick={saveNewClient}>Salvar</button>
                          <button className={styles.btnOutline} onClick={() => setShowNewClient(false)}>Cancelar</button>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.customerSelectRow}>
                        <select
                          value={form.customer_id}
                          onChange={e => selectCustomer(e.target.value)}
                        >
                          <option value="">— buscar no cadastro —</option>
                          {customers.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                        <button className={styles.btnNew} onClick={() => setShowNewClient(true)}>+ Nova</button>
                      </div>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Forma de Pagamento</label>
                    <select value={form.payment_method} onChange={e => setForm(f => ({...f, payment_method: e.target.value}))}>
                      {PAYMENT_OPTS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>

                {/* Customer name + whatsapp (always shown) */}
                <div className={styles.formRow}>
                  <div className={`${styles.formGroup} ${styles.grow}`}>
                    <label>Nome *</label>
                    <input
                      value={form.customer_name}
                      onChange={e => setForm(f => ({...f, customer_name: e.target.value, customer_id: ''}))}
                      placeholder="Nome do cliente"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>WhatsApp</label>
                    <input
                      value={form.whatsapp}
                      onChange={e => setForm(f => ({...f, whatsapp: e.target.value}))}
                      placeholder="61 9 9999-9999"
                    />
                  </div>
                </div>
                {form.customer_id && (
                  <div className={styles.customerLinked}>
                    ✓ Vinculado ao cadastro de {form.customer_name}
                    <button onClick={() => setForm(f => ({...f, customer_id: ''}))}>desvincular</button>
                  </div>
                )}

                {/* ─── Products ─── */}
                <div className={styles.itemsSection}>
                  <span className={styles.itemsLabel}>PRODUTOS DO PEDIDO</span>

                  {form.items.map((item, i) => (
                    <div key={i} className={styles.itemRow}>
                      <div className={styles.itemLeft}>
                        <select
                          className={styles.itemSelect}
                          value={item.product_id}
                          onChange={e => {
                            const prod = products.find(p => p.id === e.target.value)
                            updateItem(i, {
                              product_id: e.target.value,
                              product_name: prod?.name || item.product_name,
                              price: item.price || (prod?.price_num ? String(prod.price_num) : ''),
                            })
                          }}
                        >
                          <option value="">Selecionar produto...</option>
                          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        {!item.product_id && (
                          <input
                            className={styles.itemManualName}
                            placeholder="Ou digite o produto"
                            value={item.product_name}
                            onChange={e => updateItem(i, { product_name: e.target.value })}
                          />
                        )}
                      </div>

                      <div className={styles.itemRight}>
                        <div className={styles.qtyControl}>
                          <button type="button" onClick={() => updateItem(i, { qty: Math.max(1, item.qty - 1) })}>−</button>
                          <span>{item.qty}</span>
                          <button type="button" onClick={() => updateItem(i, { qty: item.qty + 1 })}>+</button>
                        </div>

                        <div className={styles.itemPriceWrap}>
                          <span>R$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.price}
                            onChange={e => updateItem(i, { price: e.target.value })}
                            placeholder="0,00"
                          />
                        </div>

                        <span className={styles.itemSubtotal}>
                          R$ {(item.qty * (parseFloat(item.price) || 0)).toFixed(2).replace('.', ',')}
                        </span>

                        {form.items.length > 1 && (
                          <button className={styles.btnRemoveItem} type="button" onClick={() => removeItem(i)}>×</button>
                        )}
                      </div>
                    </div>
                  ))}

                  <button className={styles.btnAddItem} type="button" onClick={addItem}>
                    + Adicionar produto
                  </button>
                </div>

                {/* Total */}
                <div className={styles.totalRow}>
                  <span>TOTAL DO PEDIDO</span>
                  <span className={styles.totalValue}>
                    R$ {computedTotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                {/* Sinal + dates */}
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Sinal Pago (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.sinal}
                      onChange={e => setForm(f => ({...f, sinal: e.target.value}))}
                      placeholder="0"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Data do Pedido</label>
                    <input type="date" value={form.order_date} onChange={e => setForm(f => ({...f, order_date: e.target.value}))} />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Prazo de Entrega</label>
                  <input type="date" value={form.delivery_date} onChange={e => setForm(f => ({...f, delivery_date: e.target.value}))} />
                </div>

                {/* Restante */}
                {restante > 0 && (
                  <div className={styles.restanteRow}>
                    <span>🏷 Pagamento do restante — <strong>R$ {restante.toFixed(2).replace('.', ',')}</strong></span>
                  </div>
                )}

                {/* Status */}
                <div className={styles.formRow}>
                  <div className={`${styles.formGroup} ${styles.grow}`}>
                    <label>Status</label>
                    <select value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))}>
                      {[...STATUS_FLOW, 'cancelado'].map(s => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div className={styles.formGroup}>
                  <label>Observação</label>
                  <textarea
                    rows="2"
                    value={form.message}
                    onChange={e => setForm(f => ({...f, message: e.target.value}))}
                    placeholder="Detalhes adicionais, cor, tamanho…"
                  />
                </div>

                {/* Photo */}
                <div className={styles.formGroup}>
                  <label>Foto de referência</label>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handlePhotoChange}
                  />
                  {previewUrl ? (
                    <div className={styles.photoPreviewWrap}>
                      <img
                        src={previewUrl}
                        alt="preview"
                        className={styles.photoPreviewImg}
                        onClick={() => setViewImageUrl(previewUrl)}
                      />
                      <div className={styles.photoPreviewActions}>
                        <button type="button" className={styles.btnPhotoChange} onClick={() => photoInputRef.current?.click()}>
                          🔄 Trocar foto
                        </button>
                        <button type="button" className={styles.btnPhotoRemove} onClick={removePhoto}>
                          🗑 Remover
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className={styles.photoUploadBtn}
                      onClick={() => photoInputRef.current?.click()}
                    >
                      <span className={styles.photoUploadIcon}>📷</span>
                      <span>Adicionar foto de referência</span>
                    </button>
                  )}
                </div>

                {saveError && <p className={styles.saveError}>{saveError}</p>}
              </div>

              <div className={styles.modalFooter}>
                <button className={styles.btnOutline} onClick={() => setShowForm(false)}>Cancelar</button>
                <button className={styles.btnGold} onClick={saveOrder} disabled={saving}>
                  {saving ? 'Salvando…' : editOrder ? 'Salvar' : 'Criar pedido'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {/* ── NF modal ── */}
        {nfOrder && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => { if (e.target === e.currentTarget) setNfOrder(null) }}
          >
            <motion.div
              className={styles.modal}
              initial={{ scale: 0.93, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.93, y: 20 }}
            >
              <div className={styles.modalHeader}>
                <div>
                  <span className={styles.modalStore}>NOTA FISCAL DE SERVIÇO</span>
                  <h3>Dados para Emissão de NFS-e</h3>
                </div>
                <button className={styles.modalClose} onClick={() => setNfOrder(null)}>✕</button>
              </div>

              <div className={styles.modalBody}>
                {/* Resumo do pedido */}
                <div className={styles.nfSummary}>
                  <div className={styles.nfSummaryRow}>
                    <span>Cliente</span>
                    <strong>{nfOrder.customer_name || '—'}</strong>
                  </div>
                  <div className={styles.nfSummaryRow}>
                    <span>Serviço</span>
                    <strong>{nfOrder.product_name || nfOrder.product_interest || '—'}</strong>
                  </div>
                  <div className={styles.nfSummaryRow}>
                    <span>Valor</span>
                    <strong className={styles.nfTotal}>{fmt(nfOrder.total)}</strong>
                  </div>
                </div>

                {/* Emitente */}
                <div className={styles.nfBlock}>
                  <span className={styles.nfBlockTitle}>Emitente</span>
                  <div className={styles.nfField}>
                    <span>Razão Social</span>
                    <span>{fiscalSettings.nf_razao_social || storeName || '—'}</span>
                  </div>
                  <div className={styles.nfField}>
                    <span>CNPJ</span>
                    <span>{fiscalSettings.nf_cnpj || <em className={styles.nfMissing}>não configurado</em>}</span>
                  </div>
                  {fiscalSettings.nf_inscricao_municipal && (
                    <div className={styles.nfField}>
                      <span>Insc. Municipal</span>
                      <span>{fiscalSettings.nf_inscricao_municipal}</span>
                    </div>
                  )}
                </div>

                {/* Tomador */}
                <div className={styles.nfBlock}>
                  <span className={styles.nfBlockTitle}>Tomador (Cliente)</span>
                  <div className={styles.formGroup}>
                    <label>CPF / CNPJ do Cliente</label>
                    <input
                      placeholder="000.000.000-00 ou 00.000.000/0001-00"
                      value={nfCpf}
                      onChange={e => setNfCpf(e.target.value)}
                    />
                  </div>
                </div>

                {/* Serviço */}
                <div className={styles.nfBlock}>
                  <span className={styles.nfBlockTitle}>Descrição do Serviço</span>
                  <div className={styles.formGroup}>
                    <label>Discriminação</label>
                    <textarea
                      rows="3"
                      value={nfDiscriminacao}
                      onChange={e => setNfDiscriminacao(e.target.value)}
                      placeholder="Descrição do serviço prestado…"
                    />
                  </div>
                  {fiscalSettings.nf_aliquota_iss && (
                    <div className={styles.nfField}>
                      <span>Alíquota ISS</span>
                      <span>{fiscalSettings.nf_aliquota_iss}%</span>
                    </div>
                  )}
                  {fiscalSettings.nf_cnae && (
                    <div className={styles.nfField}>
                      <span>CNAE</span>
                      <span>{fiscalSettings.nf_cnae}</span>
                    </div>
                  )}
                </div>

                {!fiscalSettings.nf_cnpj && (
                  <p className={styles.nfWarn}>
                    ⚠️ Configure os dados fiscais em <strong>Ajustes → Nota Fiscal</strong> para pré-preencher automaticamente.
                  </p>
                )}
              </div>

              <div className={styles.modalFooter}>
                <button className={styles.btnOutline} onClick={() => setNfOrder(null)}>Fechar</button>
                <button className={styles.btnSecondary} onClick={copyNFData}>
                  {nfCopied ? '✓ Copiado!' : '📋 Copiar dados'}
                </button>
                {fiscalSettings.nf_portal_url && (
                  <button
                    className={styles.btnGold}
                    onClick={() => window.open(fiscalSettings.nf_portal_url, '_blank')}
                  >
                    Abrir Portal →
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
        {/* ── Image viewer ── */}
        {viewImageUrl && (
          <motion.div
            className={styles.imgViewerOverlay}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setViewImageUrl(null)}
          >
            <motion.img
              src={viewImageUrl}
              className={styles.imgViewerImg}
              initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}
              onClick={e => e.stopPropagation()}
            />
            <button className={styles.imgViewerClose} onClick={() => setViewImageUrl(null)}>✕</button>
          </motion.div>
        )}
      </AnimatePresence>, document.body)}
    </div>
  )
}
