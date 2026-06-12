'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getClientAuth } from '@/lib/firebase/client'

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? '').split(',').map((e) => e.trim()).filter(Boolean)

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    async function setup() {
      const auth = await getClientAuth()
      const { onAuthStateChanged } = await import('firebase/auth')

      unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user || (ADMIN_EMAILS.length > 0 && !ADMIN_EMAILS.includes(user.email ?? ''))) {
          router.replace('/admin/login')
          return
        }
        document.cookie = 'paizao-admin-session=1; path=/; max-age=86400; SameSite=Strict'
        setReady(true)
      })
    }

    setup()
    return () => unsubscribe?.()
  }, [router])

  if (!ready) {
    return (
      <div className="min-h-screen bg-paizao-bg flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-paizao-gold/30 border-t-paizao-gold rounded-full animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}
