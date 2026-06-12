import { NextResponse } from 'next/server'

export const revalidate = 3600

interface InstagramPost {
  id: string
  mediaUrl: string
  permalink: string
  caption: string
  timestamp: string
}

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  const userId = process.env.INSTAGRAM_USER_ID

  if (!token || !userId) {
    return NextResponse.json<{ posts: InstagramPost[] }>({ posts: [] })
  }

  try {
    const fields = 'id,media_url,permalink,caption,timestamp'
    const url = `https://graph.instagram.com/${userId}/media?fields=${fields}&limit=6&access_token=${token}`

    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error(`Instagram API error: ${res.status}`)

    const data = (await res.json()) as { data: Array<{ id: string; media_url: string; permalink: string; caption?: string; timestamp: string }> }
    const posts: InstagramPost[] = data.data.map((p) => ({
      id: p.id,
      mediaUrl: p.media_url,
      permalink: p.permalink,
      caption: p.caption ?? '',
      timestamp: p.timestamp,
    }))

    return NextResponse.json<{ posts: InstagramPost[] }>({ posts })
  } catch {
    return NextResponse.json<{ posts: InstagramPost[] }>({ posts: [] })
  }
}
