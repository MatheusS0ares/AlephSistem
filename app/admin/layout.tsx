import type { Metadata } from 'next'
import { getTenant } from '@/tenants'

export function generateMetadata(): Metadata {
  return {
    title: { absolute: `Admin | ${getTenant().nome}` },
    robots: { index: false, follow: false },
  }
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
