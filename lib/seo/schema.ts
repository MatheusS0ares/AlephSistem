export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: 'Paizão Modas',
    description:
      'Moda masculina jovem em Gama-DF. Camisetas, camisas de times, bermudas, conjuntos e muito mais. Looks estilosos com preço que cabe no bolso.',
    url: 'https://paizaomodas.com.br',
    telephone: '+5561999999999',
    priceRange: '$$',
    image: 'https://paizaomodas.com.br/og-image.jpg',
    logo: 'https://paizaomodas.com.br/logo.png',
    sameAs: ['https://www.instagram.com/paizaomodas2'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Quadra 09 Lote 70',
      addressLocality: 'Gama Leste',
      addressRegion: 'DF',
      addressCountry: 'BR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -16.0133,
      longitude: -48.065,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '14:00',
      },
    ],
  }
}
