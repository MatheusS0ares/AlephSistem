import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import StoreSelector from './pages/StoreSelector'
import StorePage from './pages/StorePage'
import AdminPage from './pages/admin'
import { CLIENT_SLUG } from './config/client'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={CLIENT_SLUG ? <Navigate to={`/loja/${CLIENT_SLUG}`} replace /> : <StoreSelector />}
        />
        <Route path="/loja/:slug" element={<StorePage />} />
        <Route path="/loja/:slug/*" element={<StorePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  )
}
