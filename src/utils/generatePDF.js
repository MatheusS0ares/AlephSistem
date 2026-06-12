import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const fmt = (v) => v != null ? `R$ ${Number(v).toFixed(2).replace('.', ',')}` : 'R$ 0,00'

const STATUS_LABELS = {
  orcamento: 'Orçamento', confirmado: 'Confirmado', encomendado: 'Encomendado',
  chegou: 'Chegou ✨', entregue: 'Entregue', cancelado: 'Cancelado',
}

async function fetchLogoDataUrl(storeName) {
  const slug = storeName?.toLowerCase().includes('personalize') ? 'personalize' : 'reino-imperial'
  try {
    const res = await fetch(`/logos/${slug}.png`)
    const blob = await res.blob()
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

function buildReceiptHTML(order, storeName, logoDataUrl) {
  const total    = Number(order.total  || 0)
  const sinal    = Number(order.sinal  || 0)
  const restante = total - sinal
  const storeUpper = (storeName || 'REINO IMPERIAL').toUpperCase()

  const fmtDate = (iso) => {
    try { return new Date(iso).toLocaleDateString('pt-BR') } catch { return '—' }
  }

  const logoHTML = logoDataUrl
    ? `<img src="${logoDataUrl}" style="width:54px;height:54px;object-fit:contain;background:white;border-radius:8px;padding:5px;flex-shrink:0;" />`
    : `<div style="width:54px;height:54px;border-radius:8px;background:rgba(201,168,76,0.25);display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0;">♛</div>`

  return `
<div style="width:595px;font-family:'Helvetica Neue',Arial,sans-serif;background:#fff;overflow:hidden;">

  <!-- ── HEADER ── -->
  <div style="background:#0a0a0a;padding:28px 36px;display:flex;align-items:center;gap:18px;">
    ${logoHTML}
    <div style="flex:1;">
      <div style="color:#fff;font-size:19px;font-weight:700;letter-spacing:1.5px;">${storeUpper}</div>
      <div style="color:#c9a84c;font-size:8px;letter-spacing:3.5px;margin-top:4px;font-weight:600;">RECIBO DE PEDIDO</div>
    </div>
    <div style="text-align:right;">
      <div style="color:#c9a84c;font-size:15px;font-weight:700;letter-spacing:1px;">#${(order.id || '').slice(-8).toUpperCase()}</div>
      <div style="color:#666;font-size:10px;margin-top:3px;">${fmtDate(order.created_at)}</div>
    </div>
  </div>

  <!-- ── GOLD BAR ── -->
  <div style="height:3px;background:linear-gradient(90deg,#7a5020,#a8722a,#c9a84c,#e8d49a,#c9a84c,#a8722a,#7a5020);"></div>

  <!-- ── BODY ── -->
  <div style="padding:30px 36px 28px;">

    <!-- Cliente -->
    <div style="margin-bottom:22px;">
      <div style="font-size:8px;letter-spacing:3px;color:#c9a84c;font-weight:700;margin-bottom:8px;">CLIENTE</div>
      <div style="font-size:21px;font-weight:700;color:#111;margin-bottom:3px;">${order.customer_name || '—'}</div>
      ${order.whatsapp ? `<div style="font-size:12px;color:#666;display:flex;align-items:center;gap:5px;"><span>📱</span>${order.whatsapp}</div>` : ''}
    </div>

    <div style="height:1px;background:#ebebeb;margin:18px 0;"></div>

    <!-- Produto -->
    <div style="margin-bottom:22px;">
      <div style="font-size:8px;letter-spacing:3px;color:#c9a84c;font-weight:700;margin-bottom:8px;">PRODUTO / SERVIÇO</div>
      <div style="font-size:16px;font-weight:600;color:#111;margin-bottom:4px;">${order.product_name || order.product_interest || '—'}</div>
      <div style="display:flex;gap:16px;">
        <div style="font-size:11px;color:#888;">Qtd: <strong style="color:#444;">${order.quantity || 1}</strong></div>
        ${order.order_date ? `<div style="font-size:11px;color:#888;">Pedido: <strong style="color:#444;">${fmtDate(order.order_date)}</strong></div>` : ''}
        ${order.delivery_date ? `<div style="font-size:11px;color:#888;">Entrega: <strong style="color:#c9a84c;">${fmtDate(order.delivery_date + 'T12:00:00')}</strong></div>` : ''}
      </div>
    </div>

    <div style="height:1px;background:#ebebeb;margin:18px 0;"></div>

    <!-- Financeiro: 3 cards -->
    <div style="margin-bottom:22px;">
      <div style="font-size:8px;letter-spacing:3px;color:#c9a84c;font-weight:700;margin-bottom:12px;">FINANCEIRO</div>
      <div style="display:flex;gap:10px;">
        <div style="flex:1;background:#f4f4f4;border-radius:10px;padding:14px 12px;text-align:center;">
          <div style="font-size:7px;color:#999;letter-spacing:1.5px;margin-bottom:6px;font-weight:600;">TOTAL</div>
          <div style="font-size:17px;font-weight:700;color:#111;">${fmt(total)}</div>
        </div>
        <div style="flex:1;background:#f0faf6;border-radius:10px;padding:14px 12px;text-align:center;border:1px solid rgba(22,163,74,0.15);">
          <div style="font-size:7px;color:#999;letter-spacing:1.5px;margin-bottom:6px;font-weight:600;">SINAL PAGO</div>
          <div style="font-size:17px;font-weight:700;color:#16a34a;">${fmt(sinal)}</div>
        </div>
        <div style="flex:1;background:${restante > 0 ? '#fff7ed' : '#f0faf6'};border-radius:10px;padding:14px 12px;text-align:center;border:1px solid ${restante > 0 ? 'rgba(234,88,12,0.15)' : 'rgba(22,163,74,0.15)'};">
          <div style="font-size:7px;color:#999;letter-spacing:1.5px;margin-bottom:6px;font-weight:600;">RESTANTE</div>
          <div style="font-size:17px;font-weight:700;color:${restante > 0 ? '#ea580c' : '#16a34a'};">${fmt(restante)}</div>
        </div>
      </div>
    </div>

    <!-- Payment + Status -->
    <div style="display:flex;gap:10px;margin-bottom:${order.message ? '18px' : '6px'};">
      <div style="flex:1;background:#f4f4f4;border-radius:8px;padding:12px 16px;">
        <div style="font-size:7px;color:#999;letter-spacing:1.5px;margin-bottom:4px;font-weight:600;">PAGAMENTO</div>
        <div style="font-size:12px;font-weight:700;color:#111;text-transform:uppercase;">${order.payment_method || 'pix'}</div>
      </div>
      <div style="flex:1;background:#fffbeb;border-radius:8px;padding:12px 16px;border:1px solid rgba(201,168,76,0.2);">
        <div style="font-size:7px;color:#999;letter-spacing:1.5px;margin-bottom:4px;font-weight:600;">STATUS</div>
        <div style="font-size:12px;font-weight:700;color:#b38a2a;">${STATUS_LABELS[order.status] || order.status}</div>
      </div>
    </div>

    ${order.message ? `
    <div style="background:#fafafa;border-left:3px solid #c9a84c;border-radius:0 8px 8px 0;padding:12px 16px;margin-bottom:${order.image_url ? '18px' : '0'};">
      <div style="font-size:7px;color:#999;letter-spacing:1.5px;margin-bottom:5px;font-weight:600;">OBSERVAÇÃO</div>
      <div style="font-size:12px;color:#555;line-height:1.6;">${order.message}</div>
    </div>` : ''}

    ${order.image_url ? `
    <div>
      <div style="font-size:7px;color:#999;letter-spacing:1.5px;margin-bottom:10px;font-weight:600;">FOTO DE REFERÊNCIA</div>
      <img src="${order.image_url}" style="width:100%;max-height:260px;object-fit:cover;border-radius:10px;border:1px solid #ebebeb;display:block;" crossorigin="anonymous" />
    </div>` : ''}

  </div>

  <!-- ── FOOTER ── -->
  <div style="background:#0a0a0a;padding:18px 36px;display:flex;justify-content:space-between;align-items:center;">
    <div style="color:#e8e8e8;font-size:13px;font-weight:500;">Obrigado pela confiança! ♛</div>
    <div style="color:#444;font-size:9px;letter-spacing:1px;">reino-imperial.vercel.app</div>
  </div>

</div>`
}

export async function generateReciboPDF(order, storeName) {
  const logoDataUrl = await fetchLogoDataUrl(storeName)

  const wrapper = document.createElement('div')
  wrapper.style.cssText = 'position:fixed;left:-9999px;top:0;'
  wrapper.innerHTML = buildReceiptHTML(order, storeName, logoDataUrl)
  document.body.appendChild(wrapper)

  try {
    const el = wrapper.firstElementChild
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pdfW = pdf.internal.pageSize.getWidth()
    const pdfH = (canvas.height * pdfW) / canvas.width
    pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH)
    pdf.save(`recibo-${(order.id || 'pedido').slice(-8).toUpperCase()}.pdf`)
  } finally {
    document.body.removeChild(wrapper)
  }
}
