import type { Metadata } from 'next'
import { Bebas_Neue, Archivo, Archivo_Black } from 'next/font/google'
import { getTenant } from '@/tenants'
import { TenantStyles } from '@/components/layout/TenantStyles'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas-neue',
  display: 'swap',
})

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
})

const archivoBold = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-archivo-black',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const t = getTenant()
  const { seo } = t
  return {
    metadataBase: new URL(seo.baseUrl),
    icons: {
      icon: [{ url: t.logoSrc, type: 'image/png' }],
      apple: [{ url: t.logoSrc, type: 'image/png' }],
    },
    title: {
      default: seo.title,
      template: seo.titleTemplate,
    },
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: t.nome }],
    creator: t.nome,
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      siteName: t.nome,
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: [{ url: seo.ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.twitterTitle,
      description: seo.twitterDescription,
      images: [seo.ogImage],
    },
    robots: { index: true, follow: true },
    alternates: { canonical: seo.baseUrl },
  }
}

function buildSchema(t: ReturnType<typeof getTenant>) {
  const { lojaFisica, contato, seo } = t
  return {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: t.nome,
    description: seo.description,
    url: seo.baseUrl,
    telephone: `+${contato.whatsapp}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: lojaFisica.enderecoRua,
      addressLocality: lojaFisica.enderecoCidadeEstado,
      addressRegion: 'DF',
      addressCountry: 'BR',
    },
    openingHoursSpecification: lojaFisica.horarios.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.dias,
      opens: h.horas.split(' ')[0],
      closes: h.horas.split(' ')[2] ?? h.horas.split(' ')[0],
    })),
    sameAs: [contato.instagramUrl],
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const t = getTenant()
  const schema = buildSchema(t)
  return (
    <html
      lang="pt-BR"
      className={`${bebasNeue.variable} ${archivo.variable} ${archivoBold.variable}`}
    >
      <head>
        <meta name="geo.region" content="BR-DF" />
        <meta name="geo.placename" content={t.lojaFisica.enderecoCidadeEstado} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body>
        <TenantStyles />
        {children}
      </body>
    </html>
  )
}
