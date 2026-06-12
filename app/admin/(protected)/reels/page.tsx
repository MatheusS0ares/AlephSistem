import { getReels } from '@/lib/firebase/reels-db'
import { ReelsAdminClient } from './ReelsAdminClient'

export const dynamic = 'force-dynamic'

export default async function ReelsAdminPage() {
  const reels = await getReels()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-paizao-ink">Galeria de Reels</h1>
        <p className="text-paizao-ink-dim text-sm mt-0.5">
          {reels.length > 0
            ? `${reels.length} ${reels.length === 1 ? 'reel cadastrado' : 'reels cadastrados'} · aparece na home`
            : 'A seção aparece na home quando houver ao menos 1 reel ativo'}
        </p>
      </div>
      <ReelsAdminClient initialReels={reels} />
    </div>
  )
}
