// Elemento assinatura: sem foto de produto ainda, então o sanduíche vira
// uma marca gráfica própria — blocos de cor chapada em glow, flutuando.
export default function SanduicheHero() {
  return (
    <div className="mt-16 flex justify-center pointer-events-none" aria-hidden="true">
      <div className="flutuar flex flex-col items-center">
        <div className="w-56 sm:w-64 h-9 rounded-full bg-lona shadow-[0_0_50px_-4px_var(--color-lona)]" />
        <div className="w-64 sm:w-72 h-4 -mt-1 rounded-full bg-letrista/90 shadow-[0_0_40px_-6px_var(--color-letrista)]" style={{ transform: "rotate(1.5deg)" }} />
        <div className="w-60 sm:w-72 h-14 -mt-1 rounded-xl bg-brasa shadow-[0_0_60px_-4px_var(--color-brasa)]" style={{ transform: "rotate(-1deg)" }} />
        <div className="w-56 sm:w-64 h-8 -mt-1 rounded-full bg-papel/90" />
      </div>
    </div>
  );
}
