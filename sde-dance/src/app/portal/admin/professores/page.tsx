import Link from "next/link";
import ProfessoresLista from "./_ProfessoresLista";

export default function AdminProfessoresPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)" }}>Professores</h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-ash)" }}>Gerencie o elenco exibido no site</p>
        </div>
        <Link href="/portal/admin/professores/novo"
          className="px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:brightness-110"
          style={{ backgroundColor: "var(--color-spot)", color: "var(--color-blackout)" }}>
          + Novo professor
        </Link>
      </div>
      <ProfessoresLista />
    </div>
  );
}
