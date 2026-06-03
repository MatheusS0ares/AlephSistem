import { useState } from 'react'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'

export default function AdminPage() {
  const [auth, setAuth] = useState(() => sessionStorage.getItem('aleph_admin') === '1')

  function logout() {
    sessionStorage.removeItem('aleph_admin')
    setAuth(false)
  }

  if (!auth) return <AdminLogin onLogin={() => setAuth(true)} />
  return <AdminDashboard onLogout={logout} />
}
