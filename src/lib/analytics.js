let _activeId = null

export function initGA4(id) {
  if (!id || _activeId === id) return
  _activeId = id

  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
  script.async = true
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function () { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  window.gtag('config', id)
}

export function trackEvent(name, params = {}) {
  window.gtag?.('event', name, params)
}
