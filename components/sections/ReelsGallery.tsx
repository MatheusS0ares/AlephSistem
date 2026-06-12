import { getReelsDestaque } from '@/lib/firebase/reels-db'
import { ReelsGalleryClient } from './ReelsGalleryClient'

export async function ReelsGallery() {
  const reels = await getReelsDestaque()
  if (reels.length === 0) return null
  return <ReelsGalleryClient reels={reels} />
}
