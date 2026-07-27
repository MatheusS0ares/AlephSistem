import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/portal/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login?redirect=/portal/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("tipo,nome")
    .eq("id", user.id)
    .single();

  if (profile?.tipo !== "admin") redirect("/portal");

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const hojeStr = hoje.toISOString().slice(0, 10);

  let pendentes = 0;
  let eventos   = 0;

  try {
    const [matriculasRes, eventosRes] = await Promise.all([
      supabase.from("matriculas").select("id", { count: "exact", head: true }).eq("status", "pendente"),
      supabase.from("eventos").select("id", { count: "exact", head: true })
        .gte("data_evento", hojeStr).eq("ativo", true),
    ]);
    pendentes = matriculasRes.count ?? 0;
    eventos   = eventosRes.count ?? 0;
  } catch {
    // tabelas ainda não criadas — sidebar renderiza com contadores zerados
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-blackout)" }}>
      <AdminSidebar nome={profile?.nome ?? ""} pendentes={pendentes} eventos={eventos} />

      {/* Desktop: left-pad for sidebar. Mobile: top-pad for topbar + bottom-pad for nav */}
      <main
        className="lg:pl-[220px] pt-[52px] pb-[72px] lg:pt-0 lg:pb-0"
        style={{ minHeight: "100vh" }}
      >
        <div className="max-w-5xl mx-auto px-4 lg:px-6 py-6 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
