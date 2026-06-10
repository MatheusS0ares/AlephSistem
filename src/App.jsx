import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import StoreSelector from './pages/StoreSelector'
import StorePage from './pages/StorePage'
import AdminPage from './pages/admin'
import AlephControlePage from './pages/controle'
import HudsPage from './pages/huds/HudsPage'
import AgendarPage from './pages/huds/AgendarPage'
import { CLIENT_SLUG } from './config/client'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            CLIENT_SLUG === 'huds'
              ? <Navigate to="/huds" replace />
              : CLIENT_SLUG
                ? <Navigate to={`/loja/${CLIENT_SLUG}`} replace />
                : <StoreSelector />
          }
        />
        <Route path="/loja/:slug" element={<StorePage />} />
        <Route path="/loja/:slug/*" element={<StorePage />} />
        <Route path="/huds" element={<HudsPage />} />
        <Route path="/huds/agendar" element={<AgendarPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/controle" element={<AlephControlePage />} />
        <Route path="/controle/*" element={<AlephControlePage />} />
      </Routes>
    </BrowserRouter>
  )
}
