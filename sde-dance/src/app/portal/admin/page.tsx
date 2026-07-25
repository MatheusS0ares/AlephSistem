import Link from "next/link";

const sections = [
  { href: "/portal/admin/professores", label: "Professores", desc: "Fotos, bio, estilos e ordem de exibição" },
  { href: "/portal/admin/turmas",      label: "Turmas",      desc: "Horários, vagas e grade de aulas" },
  { href: "/portal/admin/alunos",      label: "Alunos",      desc: "Matrículas e perfis" },
  { href: "/portal/admin/financeiro",  label: "Financeiro",  desc: "Mensalidades e cobranças" },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)" }}>
        Painel Admin
      </h1>
      <p className="text-sm mb-10" style={{ color: "var(--color-ash)" }}>SDE Dance — Escola de Dança Sala de Ensaio</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map(({ href, label, desc }) => (
          <Link key={href} href={href}
            className="block p-6 border transition-colors duration-200 hover:border-[var(--color-spot)]"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
            <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
              {label}
            </p>
            <p className="text-sm" style={{ color: "var(--color-ash)" }}>{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
