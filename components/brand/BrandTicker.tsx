import { MarqueeText } from '@/components/motion/MarqueeText'
import { getTenant } from '@/tenants'

export function BrandTicker() {
  const { ticker } = getTenant()
  return (
    <div className="bg-paizao-gold py-2.5 overflow-hidden">
      <MarqueeText
        items={ticker}
        speed={40}
        separator="◆"
        itemClassName="text-paizao-navy font-extrabold uppercase tracking-wider text-xs"
      />
    </div>
  )
}
