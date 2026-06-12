import type { Metadata } from 'next'
import { AuthGuard } from '@/components/admin/AuthGuard'
import { Logo } from '@/components/brand/Logo'
import Link from 'next/link'
import { Package, Film } from 'lucide-react'
import { AdminSignOut } from '@/components/admin/AdminSignOut'
import { getTenant } from '@/tenants'

export function generateMetadata(): Metadata {
  return {
    title: { absolute: `Admin | ${getTenant().nome}` },
    robots: { index: false, follow: false },
  }
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-paizao-bg flex">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 bg-paizao-surface border-r border-paizao-surface-2 flex flex-col hidden md:flex">
          <div className="p-5 border-b border-paizao-surface-2">
            <Logo size="sm" />
            <p className="text-[10px] text-paizao-ink-dim mt-1 uppercase tracking-widest">
              Admin
            </p>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            <Link
              href="/admin/produtos"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-paizao-ink-dim hover:text-paizao-ink hover:bg-paizao-surface-2 transition-colors"
            >
              <Package size={16} />
              Produtos
            </Link>
            <Link
              href="/admin/reels"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-paizao-ink-dim hover:text-paizao-ink hover:bg-paizao-surface-2 transition-colors"
            >
              <Film size={16} />
              Reels
            </Link>
          </nav>

          <div className="p-3 border-t border-paizao-surface-2">
            <AdminSignOut />
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-auto">
          {/* Mobile header */}
          <div className="md:hidden flex items-center justify-between px-4 py-3 bg-paizao-surface border-b border-paizao-surface-2">
            <Logo size="sm" />
            <div className="flex items-center gap-3">
              <Link href="/admin/produtos" className="text-paizao-ink-dim hover:text-paizao-gold">
                <Package size={20} />
              </Link>
              <Link href="/admin/reels" className="text-paizao-ink-dim hover:text-paizao-gold">
                <Film size={20} />
              </Link>
            </div>
          </div>
          <div className="p-4 sm:p-8">{children}</div>
        </main>
      </div>
    </AuthGuard>
  )
}
