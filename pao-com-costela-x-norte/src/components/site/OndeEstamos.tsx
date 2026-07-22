import { siteConfig } from "@/lib/site-config";

export default function OndeEstamos() {
  const temCoordenadas = siteConfig.latitude !== undefined && siteConfig.longitude !== undefined;

  return (
    <section className="tema-site px-6 py-16 border-b-4 border-lona">
      <h2 className="titulo-display text-3xl sm:text-4xl mb-8">Onde estamos</h2>
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="space-y-3">
          <p className="text-lg">{siteConfig.enderecoRua}</p>
          <p className="text-papel/80">{siteConfig.referencia}</p>
          <p className="preco text-lona">{siteConfig.horario}</p>
        </div>
        <div className="border-4 border-papel/30 flex items-center justify-center min-h-[180px]">
          {temCoordenadas ? (
            <iframe
              title="Mapa"
              className="w-full h-full min-h-[180px] grayscale contrast-125"
              src={`https://www.openstreetmap.org/export/embed.html?marker=${siteConfig.latitude},${siteConfig.longitude}`}
            />
          ) : (
            <p className="text-sm text-papel/50 px-4 text-center">mapa em breve</p>
          )}
        </div>
      </div>
    </section>
  );
}
