'use server'
import { revalidatePath } from 'next/cache'
import { createReel, updateReel, deleteReel } from '@/lib/firebase/reels-db'

export async function actionCreateReel(formData: FormData) {
  const destaque = formData.get('destaque') === 'on'
  await createReel({
    thumbnail: formData.get('thumbnail') as string,
    thumbnailAlt: formData.get('thumbnailAlt') as string,
    titulo: (formData.get('titulo') as string) || null,
    instagramUrl: formData.get('instagramUrl') as string,
    destaque,
    ativo: true,
    ordem: Number(formData.get('ordem') ?? 99),
    criadoEm: Date.now(),
  })
  revalidatePath('/')
  revalidatePath('/admin/reels')
}

export async function actionUpdateReel(id: string, formData: FormData) {
  const destaque = formData.get('destaque') === 'on'
  await updateReel(id, {
    thumbnail: formData.get('thumbnail') as string,
    thumbnailAlt: formData.get('thumbnailAlt') as string,
    titulo: (formData.get('titulo') as string) || null,
    instagramUrl: formData.get('instagramUrl') as string,
    destaque,
    ordem: Number(formData.get('ordem') ?? 99),
  })
  revalidatePath('/')
  revalidatePath('/admin/reels')
}

export async function actionToggleDestaque(id: string, value: boolean) {
  await updateReel(id, { destaque: value })
  revalidatePath('/')
  revalidatePath('/admin/reels')
}

export async function actionToggleAtivo(id: string, value: boolean) {
  await updateReel(id, { ativo: value })
  revalidatePath('/')
  revalidatePath('/admin/reels')
}

export async function actionDeleteReel(id: string) {
  await deleteReel(id)
  revalidatePath('/')
  revalidatePath('/admin/reels')
}
