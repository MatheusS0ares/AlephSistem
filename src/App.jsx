import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import StoreSelector from './pages/StoreSelector'
import StorePage from './pages/StorePage'
import AdminPage from './pages/admin'

export default function App() {
  useEffect(() => {
    const saved = localStorage.getItem('ri-theme') || 'dark'
    document.documentElement.setAttribute('data-theme', saved)
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StoreSelector />} />
        <Route path="/loja/:slug" element={<StorePage />} />
        <Route path="/loja/:slug/*" element={<StorePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  )
}
