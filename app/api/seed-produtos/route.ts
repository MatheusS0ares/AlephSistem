import { NextRequest, NextResponse } from 'next/server'

const TOKEN = 'paizao2026'

const IMGS = [
  'https://i.ibb.co/PZnV3pHF/Whats-App-Image-2026-05-28-at-15-51-22.jpg',
  'https://i.ibb.co/5gc7Mkyt/Whats-App-Image-2026-05-28-at-15-51-22-3.jpg',
  'https://i.ibb.co/B8XvgkW/Whats-App-Image-2026-05-28-at-15-51-22-2.jpg',
  'https://i.ibb.co/qYzKSspx/Whats-App-Image-2026-05-28-at-15-51-22-1.jpg',
  'https://i.ibb.co/VYyR2hwr/Whats-App-Image-2026-05-28-at-15-51-21.jpg',
  'https://i.ibb.co/G4pDtdZn/Whats-App-Image-2026-05-28-at-15-51-21-3.jpg',
  'https://i.ibb.co/LLDxgXD/Whats-App-Image-2026-05-28-at-15-51-21-2.jpg',
  'https://i.ibb.co/S7tMZXPC/Whats-App-Image-2026-05-28-at-15-51-21-1.jpg',
  'https://i.ibb.co/23VphCgd/Whats-App-Image-2026-05-28-at-15-51-20.jpg',
  'https://i.ibb.co/JW4JyrfY/Whats-App-Image-2026-05-28-at-15-51-20-1.jpg',
  'https://i.ibb.co/BHsnRqJ1/Whats-App-Image-2026-05-28-at-15-51-19.jpg',
  'https://i.ibb.co/gMXmjzHP/Whats-App-Image-2026-05-28-at-15-51-31.jpg',
  'https://i.ibb.co/cSvWM09d/Whats-App-Image-2026-05-28-at-15-51-30.jpg',
  'https://i.ibb.co/S7cD7X2w/Whats-App-Image-2026-05-28-at-15-51-30-1.jpg',
  'https://i.ibb.co/m5L1s2qz/Whats-App-Image-2026-05-28-at-15-51-29.jpg',
  'https://i.ibb.co/Cs1FHbYq/Whats-App-Image-2026-05-28-at-15-51-29-1.jpg',
  'https://i.ibb.co/4RHKX6JS/Whats-App-Image-2026-05-28-at-15-51-28.jpg',
  'https://i.ibb.co/k6GDX7pW/Whats-App-Image-2026-05-28-at-15-51-28-1.jpg',
  'https://i.ibb.co/ycT2dPNQ/Whats-App-Image-2026-05-28-at-15-51-27.jpg',
  'https://i.ibb.co/Jwdjs50h/Whats-App-Image-2026-05-28-at-15-51-27-1.jpg',
  'https://i.ibb.co/zh2nhfKm/Whats-App-Image-2026-05-28-at-15-51-26.jpg',
  'https://i.ibb.co/G38ny5yn/Whats-App-Image-2026-05-28-at-15-51-26-2.jpg',
  'https://i.ibb.co/fzbd1H2C/Whats-App-Image-2026-05-28-at-15-51-26-1.jpg',
  'https://i.ibb.co/S7NwBVh0/Whats-App-Image-2026-05-28-at-15-51-25.jpg',
  'https://i.ibb.co/dwbS8fND/Whats-App-Image-2026-05-28-at-15-51-24.jpg',
  'https://i.ibb.co/nNr57v4J/Whats-App-Image-2026-05-28-at-15-51-25-1.jpg',
  'https://i.ibb.co/Jj0mNPz7/Whats-App-Image-2026-05-28-at-15-51-24-1.jpg',
  'https://i.ibb.co/KpNXc9Kp/Whats-App-Image-2026-05-28-at-15-51-24-2.jpg',
  'https://i.ibb.co/yn801wz4/Whats-App-Image-2026-05-28-at-15-51-23.jpg',
  'https://i.ibb.co/DPND1BPV/Whats-App-Image-2026-05-28-at-15-51-23-3.jpg',
  'https://i.ibb.co/yFxt6czD/Whats-App-Image-2026-05-28-at-15-51-23-1.jpg',
  'https://i.ibb.co/C34gpKvH/Whats-App-Image-2026-05-28-at-15-51-23-2.jpg',
]

type ProdutoSeed = {
  slug: string
  nome: string
  descricao: string
  preco: number
  precoOriginal?: number
  categoria: string
  imagem: string
  imagens: string[]
  tamanhos: string[]
  cores: string[]
  badge?: 'Novo' | 'Copa' | 'Sale' | 'Hot'
  destaque: boolean
  estoque: boolean
}

const produtos: ProdutoSeed[] = [
  { slug: 'camisa-brasil-copa-2026-home', nome: 'Camisa Brasil Copa 2026 \u2014 Home', descricao: 'Camisa oficial da Sele\u00E7\u00E3o Brasileira para a Copa do Mundo 2026. Verde canarinho com detalhes dourados.', preco: 89.90, categoria: 'times', imagem: IMGS[0], imagens: [IMGS[0]], tamanhos: ['P','M','G','GG','XGG'], cores: [], badge: 'Copa', destaque: true, estoque: true },
  { slug: 'camisa-brasil-copa-2026-away', nome: 'Camisa Brasil Copa 2026 \u2014 Away Azul', descricao: 'Camisa reserva da Sele\u00E7\u00E3o Brasileira para a Copa 2026. Azul com escudo bordado.', preco: 89.90, categoria: 'times', imagem: IMGS[1], imagens: [IMGS[1]], tamanhos: ['P','M','G','GG'], cores: [], badge: 'Copa', destaque: true, estoque: true },
  { slug: 'camisa-flamengo-2026', nome: 'Camisa Flamengo 2026 \u2014 Rubro-Negra', descricao: 'Camisa oficial do Flamengo temporada 2026. Listras rubro-negras cl\u00E1ssicas com tecnologia dry-fit.', preco: 79.90, categoria: 'times', imagem: IMGS[2], imagens: [IMGS[2]], tamanhos: ['P','M','G','GG','XGG'], cores: [], badge: 'Novo', destaque: true, estoque: true },
  { slug: 'camisa-corinthians-2026', nome: 'Camisa Corinthians 2026 \u2014 Branca', descricao: 'Camisa oficial do Tim\u00E3o temporada 2026. Branco imaculado com detalhes em preto.', preco: 79.90, categoria: 'times', imagem: IMGS[3], imagens: [IMGS[3]], tamanhos: ['P','M','G','GG'], cores: [], destaque: false, estoque: true },
  { slug: 'camisa-palmeiras-2026', nome: 'Camisa Palmeiras 2026 \u2014 Verde', descricao: 'Camisa oficial do Palmeiras para 2026. Verde alviverde com escudo bordado premium.', preco: 79.90, categoria: 'times', imagem: IMGS[4], imagens: [IMGS[4]], tamanhos: ['P','M','G','GG','XGG'], cores: [], destaque: false, estoque: true },
  { slug: 'camisa-vasco-2026', nome: 'Camisa Vasco 2026 \u2014 Tradicional', descricao: 'Camisa cl\u00E1ssica do Vasco da Gama 2026. Listras tradicionais em preto e branco.', preco: 79.90, categoria: 'times', imagem: IMGS[5], imagens: [IMGS[5]], tamanhos: ['P','M','G','GG'], cores: [], destaque: false, estoque: true },
  { slug: 'camisa-atletico-mg-2026', nome: 'Camisa Atl\u00E9tico-MG 2026 \u2014 Galo', descricao: 'Camisa do Galo para a temporada 2026. Preto e branco com detalhes modernos.', preco: 79.90, categoria: 'times', imagem: IMGS[6], imagens: [IMGS[6]], tamanhos: ['P','M','G','GG'], cores: [], destaque: false, estoque: true },
  { slug: 'camisa-sao-paulo-2026', nome: 'Camisa S\u00E3o Paulo 2026 \u2014 Tricolor', descricao: 'Camisa oficial do S\u00E3o Paulo FC 2026. Tricolor paulista com tecnologia dry-fit.', preco: 79.90, categoria: 'times', imagem: IMGS[7], imagens: [IMGS[7]], tamanhos: ['P','M','G','GG','XGG'], cores: [], destaque: false, estoque: true },
  { slug: 'camiseta-basica-premium-preta', nome: 'Camiseta B\u00E1sica Premium \u2014 Preta', descricao: 'Camiseta b\u00E1sica em algod\u00E3o premium. Corte slim moderno, ideal para qualquer ocasi\u00E3o.', preco: 39.90, categoria: 'camisetas', imagem: IMGS[8], imagens: [IMGS[8]], tamanhos: ['PP','P','M','G','GG','XGG'], cores: [], badge: 'Hot', destaque: true, estoque: true },
  { slug: 'camiseta-basica-premium-branca', nome: 'Camiseta B\u00E1sica Premium \u2014 Branca', descricao: 'Camiseta b\u00E1sica em algod\u00E3o premium na cor branca. Essencial no guarda-roupa masculino.', preco: 39.90, categoria: 'camisetas', imagem: IMGS[9], imagens: [IMGS[9]], tamanhos: ['PP','P','M','G','GG','XGG'], cores: [], destaque: false, estoque: true },
  { slug: 'camiseta-basica-premium-azul', nome: 'Camiseta B\u00E1sica Premium \u2014 Azul Marinho', descricao: 'Camiseta b\u00E1sica em algod\u00E3o premium no tom azul marinho. Vers\u00E1til e estilosa.', preco: 39.90, categoria: 'camisetas', imagem: IMGS[10], imagens: [IMGS[10]], tamanhos: ['PP','P','M','G','GG'], cores: [], destaque: false, estoque: true },
  { slug: 'camiseta-oversized-grafite', nome: 'Camiseta Oversized \u2014 Grafite', descricao: 'Camiseta no estilo oversized em grafite. Tend\u00EAncia streetwear com caimento perfeito.', preco: 49.90, categoria: 'camisetas', imagem: IMGS[11], imagens: [IMGS[11]], tamanhos: ['P','M','G','GG','XGG'], cores: [], badge: 'Novo', destaque: true, estoque: true },
  { slug: 'conjunto-moletom-jogger-navy', nome: 'Conjunto Moletom Jogger \u2014 Navy', descricao: 'Conjunto completo moletom + cal\u00E7a jogger em azul navy. Conforto e estilo para o dia a dia.', preco: 149.90, precoOriginal: 189.90, categoria: 'conjuntos', imagem: IMGS[12], imagens: [IMGS[12]], tamanhos: ['P','M','G','GG'], cores: [], badge: 'Sale', destaque: true, estoque: true },
  { slug: 'conjunto-agasalho-dry-fit-preto', nome: 'Conjunto Agasalho Dry-fit \u2014 Preto', descricao: 'Conjunto agasalho completo em tecido dry-fit premium. Ideal para treinos e uso casual.', preco: 159.90, categoria: 'conjuntos', imagem: IMGS[13], imagens: [IMGS[13]], tamanhos: ['P','M','G','GG','XGG'], cores: [], destaque: false, estoque: true },
  { slug: 'conjunto-shorts-camiseta-copa', nome: 'Conjunto Shorts + Camiseta Copa', descricao: 'Conjunto tem\u00E1tico Copa 2026 com shorts e camiseta combinando. Perfeito para torcer pelo Brasil.', preco: 129.90, categoria: 'conjuntos', imagem: IMGS[14], imagens: [IMGS[14]], tamanhos: ['P','M','G','GG'], cores: [], badge: 'Copa', destaque: true, estoque: true },
  { slug: 'conjunto-treino-premium-verde', nome: 'Conjunto Treino Premium \u2014 Verde', descricao: 'Conjunto de treino premium em verde. Tecnologia dry-fit com modelagem esportiva moderna.', preco: 139.90, categoria: 'conjuntos', imagem: IMGS[15], imagens: [IMGS[15]], tamanhos: ['P','M','G','GG'], cores: [], destaque: false, estoque: true },
  { slug: 'conjunto-casual-streetwear', nome: 'Conjunto Casual Streetwear', descricao: 'Conjunto casual com influ\u00EAncia streetwear. Moletom + jogger com detalhes exclusivos.', preco: 169.90, categoria: 'conjuntos', imagem: IMGS[16], imagens: [IMGS[16]], tamanhos: ['M','G','GG'], cores: [], destaque: false, estoque: true },
  { slug: 'bermuda-tactel-camuflada', nome: 'Bermuda Tactel Camuflada', descricao: 'Bermuda em tactel com estampa camuflada. Leve e dur\u00E1vel para o ver\u00E3o carioca.', preco: 49.90, categoria: 'bermudas', imagem: IMGS[17], imagens: [IMGS[17]], tamanhos: ['38','40','42','44'], cores: [], badge: 'Novo', destaque: true, estoque: true },
  { slug: 'bermuda-moletom-jogger-preta', nome: 'Bermuda Moletom Jogger \u2014 Preta', descricao: 'Bermuda de moletom com c\u00F3s el\u00E1stico e cord\u00E3o. Confort\u00E1vel para casa e passeio.', preco: 59.90, categoria: 'bermudas', imagem: IMGS[18], imagens: [IMGS[18]], tamanhos: ['38','40','42','44'], cores: [], destaque: false, estoque: true },
  { slug: 'bermuda-dry-fit-copa', nome: 'Bermuda Dry-fit Copa 2026', descricao: 'Bermuda esportiva em dry-fit com tema Copa 2026. Perfeita para torcer e se exercitar.', preco: 54.90, categoria: 'bermudas', imagem: IMGS[19], imagens: [IMGS[19]], tamanhos: ['38','40','42','44'], cores: [], badge: 'Copa', destaque: false, estoque: true },
  { slug: 'bermuda-cargo-masculina', nome: 'Bermuda Cargo Masculina \u2014 Verde', descricao: 'Bermuda cargo com bolsos laterais. Estilo utilit\u00E1rio com muito conforto.', preco: 64.90, categoria: 'bermudas', imagem: IMGS[20], imagens: [IMGS[20]], tamanhos: ['38','40','42','44'], cores: [], destaque: false, estoque: true },
  { slug: 'bermuda-social-slim-azul', nome: 'Bermuda Social Slim \u2014 Azul', descricao: 'Bermuda social de corte slim em azul. Elegante para passeios e eventos casuais.', preco: 59.90, categoria: 'bermudas', imagem: IMGS[21], imagens: [IMGS[21]], tamanhos: ['38','40','42','44'], cores: [], destaque: false, estoque: true },
  { slug: 'polo-social-slim-branca', nome: 'Polo Social Slim \u2014 Branca', descricao: 'Camisa polo social de corte slim na cor branca. Tecido piquet premium de alta qualidade.', preco: 69.90, categoria: 'polos', imagem: IMGS[22], imagens: [IMGS[22]], tamanhos: ['P','M','G','GG'], cores: [], destaque: true, estoque: true },
  { slug: 'polo-premium-piquet-preta', nome: 'Polo Premium Piquet \u2014 Preta', descricao: 'Polo em piquet premium na cor preta. Ideal para ocasi\u00F5es que exigem mais eleg\u00E2ncia.', preco: 79.90, categoria: 'polos', imagem: IMGS[23], imagens: [IMGS[23]], tamanhos: ['P','M','G','GG','XGG'], cores: [], badge: 'Hot', destaque: true, estoque: true },
  { slug: 'polo-casual-azul-royal', nome: 'Polo Casual \u2014 Azul Royal', descricao: 'Polo casual em azul royal. Vers\u00E1til e estilosa, combina com bermudas e cal\u00E7as.', preco: 74.90, categoria: 'polos', imagem: IMGS[24], imagens: [IMGS[24]], tamanhos: ['P','M','G','GG'], cores: [], destaque: false, estoque: true },
  { slug: 'polo-copa-brasil-verde', nome: 'Polo Copa Brasil \u2014 Verde', descricao: 'Polo tem\u00E1tica Copa do Mundo 2026 em verde Brasil. Bordado exclusivo da sele\u00E7\u00E3o.', preco: 84.90, categoria: 'polos', imagem: IMGS[25], imagens: [IMGS[25]], tamanhos: ['P','M','G','GG'], cores: [], badge: 'Copa', destaque: false, estoque: true },
  { slug: 'polo-social-listrada', nome: 'Polo Social Listrada', descricao: 'Polo social com listras horizontais cl\u00E1ssicas. Eleg\u00E2ncia atemporal no estilo masculino.', preco: 69.90, categoria: 'polos', imagem: IMGS[26], imagens: [IMGS[26]], tamanhos: ['P','M','G','GG'], cores: [], destaque: false, estoque: true },
  { slug: 'tenis-casual-chunky-branco', nome: 'T\u00EAnis Casual Chunky \u2014 Branco/Dourado', descricao: 'T\u00EAnis chunky estilo streetwear em branco com detalhes dourados. Solado tratorado moderno.', preco: 189.90, precoOriginal: 239.90, categoria: 'tenis', imagem: IMGS[27], imagens: [IMGS[27]], tamanhos: ['38','39','40','41','42','43','44'], cores: [], badge: 'Sale', destaque: true, estoque: true },
  { slug: 'tenis-slip-on-preto', nome: 'T\u00EAnis Slip-On Masculino \u2014 Preto', descricao: 'T\u00EAnis slip-on sem cadar\u00E7o em preto. Praticidade e estilo para o cotidiano.', preco: 149.90, categoria: 'tenis', imagem: IMGS[28], imagens: [IMGS[28]], tamanhos: ['38','39','40','41','42','43'], cores: [], destaque: false, estoque: true },
  { slug: 'tenis-esportivo-colorblock', nome: 'T\u00EAnis Esportivo Colorblock', descricao: 'T\u00EAnis esportivo com design colorblock moderno. Alto desempenho para treino e uso casual.', preco: 169.90, categoria: 'tenis', imagem: IMGS[29], imagens: [IMGS[29]], tamanhos: ['39','40','41','42','43','44'], cores: [], destaque: false, estoque: true },
  { slug: 'tenis-classic-low-branco', nome: 'T\u00EAnis Classic Low \u2014 Branco', descricao: 'T\u00EAnis cl\u00E1ssico cano baixo em branco. Ic\u00F4nico e vers\u00E1til para qualquer look masculino.', preco: 159.90, categoria: 'tenis', imagem: IMGS[30], imagens: [IMGS[30]], tamanhos: ['38','39','40','41','42','43','44'], cores: [], destaque: false, estoque: true },
  { slug: 'tenis-street-high-preto-dourado', nome: 'T\u00EAnis Street High \u2014 Preto/Dourado', descricao: 'T\u00EAnis cano alto streetwear em preto com detalhes dourados. Atitude e estilo para a rua.', preco: 199.90, categoria: 'tenis', imagem: IMGS[31], imagens: [IMGS[31]], tamanhos: ['39','40','41','42','43','44'], cores: [], badge: 'Novo', destaque: true, estoque: true },
]

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (token !== TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { initializeApp, getApps } = await import('firebase/app')
    const { getFirestore, collection, getDocs, addDoc, deleteDoc } = await import('firebase/firestore')

    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }

    const app = getApps().find((a) => a.name === 'seed') ?? initializeApp(config, 'seed')
    const db = getFirestore(app)
    const col = collection(db, 'produtos')

    const existing = await getDocs(col)
    await Promise.all(existing.docs.map((d) => deleteDoc(d.ref)))
    await Promise.all(produtos.map((p) => addDoc(col, p)))

    return NextResponse.json({ ok: true, total: produtos.length })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}
