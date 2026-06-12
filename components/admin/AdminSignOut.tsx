'use client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { getClientAuth } from '@/lib/firebase/client'

export function AdminSignOut() {
  const router = useRouter()

  const handleSignOut = async () => {
    const auth = await getClientAuth()
    const { signOut } = await import('firebase/auth')
    await signOut(auth)
    document.cookie = 'paizao-admin-session=; path=/; max-age=0'
    router.replace('/admin/login')
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-paizao-ink-dim hover:text-paizao-red hover:bg-paizao-red/10 transition-colors"
    >
      <LogOut size={15} />
      Sair
    </button>
  )
}
