import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { WAFloatButton } from '@/components/layout/WAFloatButton'
import { getTenant } from '@/tenants'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const { whatsappFloat } = getTenant()
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CartDrawer />
      {whatsappFloat && <WAFloatButton />}
    </>
  )
}
