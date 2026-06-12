'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getClientAuth } from '@/lib/firebase/client'
import { LogoMark } from '@/components/brand/LogoMark'
import { getTenant } from '@/tenants'

const { nome } = getTenant()

export default function AdminLoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const loginWithGoogle = async () => {
    setLoading(true)
    setError(null)
    try {
      const auth = await getClientAuth()
      const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth')
      await signInWithPopup(auth, new GoogleAuthProvider())
      document.cookie = 'paizao-admin-session=1; path=/; max-age=86400; SameSite=Strict'
      router.replace('/admin/produtos')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  const loginWithEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const auth = await getClientAuth()
      const { signInWithEmailAndPassword } = await import('firebase/auth')
      await signInWithEmailAndPassword(auth, email, password)
      document.cookie = 'paizao-admin-session=1; path=/; max-age=86400; SameSite=Strict'
      router.replace('/admin/produtos')
    } catch {
      setError('E-mail ou senha inválidos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-paizao-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <LogoMark size={56} />
          <h1 className="mt-3 text-xl font-semibold text-paizao-ink">Painel Admin</h1>
          <p className="text-paizao-ink-dim text-sm mt-1">{nome}</p>
        </div>

        <div className="bg-paizao-surface rounded-2xl border border-paizao-surface-2 p-6 space-y-5">
          {error && (
            <p className="text-paizao-red text-sm text-center p-2 rounded bg-paizao-red/10 border border-paizao-red/20">
              {error}
            </p>
          )}

          <button
            onClick={loginWithGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-paizao-surface-2 text-paizao-ink hover:border-paizao-gold/40 transition-colors text-sm font-medium disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Entrar com Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-paizao-surface-2" />
            </div>
            <div className="relative flex justify-center">
              <span className="text-xs text-paizao-ink-dim bg-paizao-surface px-2">ou e-mail</span>
            </div>
          </div>

          <form onSubmit={loginWithEmail} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-paizao-surface-2 border border-paizao-surface-2 text-paizao-ink placeholder:text-paizao-ink-dim/50 focus:outline-none focus:border-paizao-gold/50 transition-colors text-sm"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-paizao-surface-2 border border-paizao-surface-2 text-paizao-ink placeholder:text-paizao-ink-dim/50 focus:outline-none focus:border-paizao-gold/50 transition-colors text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-paizao-gold text-paizao-navy font-bold text-sm hover:bg-paizao-gold-bright disabled:opacity-50 transition-colors"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
