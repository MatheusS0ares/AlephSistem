import { useState } from 'react'
import AlephControleLogin from './AlephControleLogin'
import AlephControleDashboard from './AlephControleDashboard'

export default function AlephControlePage() {
  const [auth, setAuth] = useState(() => sessionStorage.getItem('aleph_controle') === '1')

  function logout() {
    sessionStorage.removeItem('aleph_controle')
    setAuth(false)
  }

  if (!auth) return <AlephControleLogin onLogin={() => setAuth(true)} />
  return <AlephControleDashboard onLogout={logout} />
}
