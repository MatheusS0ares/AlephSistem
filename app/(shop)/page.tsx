import { HeroCopa } from '@/components/hero/HeroCopa'
import { HeroLuxo } from '@/components/hero/HeroLuxo'
import { HeroStreet } from '@/components/hero/HeroStreet'
import { CategoriesGrid } from '@/components/sections/CategoriesGrid'
import { BestSellers } from '@/components/sections/BestSellers'
import { CopaSection } from '@/components/sections/CopaSection'
import { LuxoShowcase } from '@/components/sections/LuxoShowcase'
import { AtacadoBanner } from '@/components/sections/AtacadoBanner'
import { LojaFisica } from '@/components/sections/LojaFisica'
import { ReelsGallery } from '@/components/sections/ReelsGallery'
import { getTenant } from '@/tenants'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  const { tema } = getTenant()
  const luxo = tema === 'luxo'
  const street = tema === 'street'

  const HeroComponent = street ? HeroStreet : luxo ? HeroLuxo : HeroCopa
  const ShowcaseComponent = street || luxo ? LuxoShowcase : CopaSection

  return (
    <>
      <HeroComponent />
      <CategoriesGrid />
      <BestSellers />
      <ShowcaseComponent />
      <AtacadoBanner />
      <ReelsGallery />
      <LojaFisica />
    </>
  )
}
