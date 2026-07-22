import ScrollReveal from "./ScrollReveal";

const ITENS = [
  { titulo: "Na brasa, na hora", texto: "Pedido só vai pro pão depois que você manda — nada fica esperando debaixo de luz." },
  { titulo: "3 toques, pronto", texto: "Pão, carne, molho. Monte do seu jeito e veja o preço mudar na hora." },
  { titulo: "Direto no seu WhatsApp", texto: "Sem cadastro, sem app pra baixar. Confirma e já era." },
  { titulo: "Pertinho de você", texto: "Quadra X, Setor Norte — em frente à Padaria X Norte." },
];

export default function UspBento() {
  return (
    <section className="tema-site px-6 py-20 border-b border-papel/10">
      <div className="grid gap-3 sm:grid-cols-2 max-w-4xl mx-auto">
        {ITENS.map((item, i) => (
          <ScrollReveal key={item.titulo} atraso={i * 80}>
            <div className="borda-fina rounded-2xl p-6 h-full hover:border-brasa/50 transition-colors">
              <p className="titulo-display text-xl text-lona mb-2">{item.titulo}</p>
              <p className="text-sm text-papel/60 leading-relaxed">{item.texto}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
