import ScrollReveal from "./ScrollReveal";
import { Flame, CheckCircle2, Smartphone, MapPin } from "lucide-react";

const ITENS = [
  {
    titulo: "Na brasa, na hora",
    texto: "O pedido só vai pro pão depois que você manda — nada fica esperando debaixo de luz. Sabor de churrasco de verdade, selado no fogo.",
    icone: Flame,
    span: "sm:col-span-2 sm:row-span-2",
  },
  {
    titulo: "3 toques, pronto",
    texto: "Pão, carne, molho. Monte do seu jeito e veja o preço mudar na hora.",
    icone: CheckCircle2,
    span: "sm:col-span-1",
  },
  {
    titulo: "Direto no WhatsApp",
    texto: "Sem cadastro, sem app pra baixar. Confirma e já era.",
    icone: Smartphone,
    span: "sm:col-span-1",
  },
  {
    titulo: "Pertinho de você",
    texto: "Quadra X, Setor Norte — em frente à Padaria X Norte.",
    icone: MapPin,
    span: "sm:col-span-2",
  },
];

export default function UspBento() {
  return (
    <section className="tema-site px-6 py-24 sm:py-32 relative overflow-hidden">
      {/* Background sutil */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,var(--color-brasa-2)_0%,transparent_60%)] -translate-y-1/2"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <ScrollReveal>
          <h2 className="titulo-display text-4xl sm:text-6xl mb-12 text-center">Por que a gente?</h2>
        </ScrollReveal>
        
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-3 sm:grid-rows-3 sm:auto-rows-[160px]">
          {ITENS.map((item, i) => {
            const Icone = item.icone;
            return (
              <ScrollReveal key={item.titulo} atraso={i * 100} className={item.span}>
                <div className="vidro group rounded-3xl p-8 h-full flex flex-col justify-between overflow-hidden hover:border-papel/20 hover:shadow-[0_0_30px_-5px_rgba(255,60,0,0.15)] transition-all duration-500 relative">
                  {/* Subtle hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-papel/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10 mb-8 sm:mb-0">
                    <div className="h-12 w-12 rounded-2xl bg-noite-2 flex items-center justify-center borda-fina text-brasa-2 mb-6 group-hover:scale-110 group-hover:text-brasa transition-all duration-500 ease-[0.16,1,0.3,1]">
                      <Icone size={24} strokeWidth={1.5} />
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="titulo-display text-2xl text-papel mb-2 tracking-wide group-hover:text-brasa-2 transition-colors duration-300">
                      {item.titulo}
                    </h3>
                    <p className="text-papel/60 leading-relaxed font-light">
                      {item.texto}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
