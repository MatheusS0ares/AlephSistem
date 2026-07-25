import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

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

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-blackout)" }}>
      {/* Admin header */}
      <header className="border-b" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-header)" }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
              SDE Admin
            </span>
            <nav className="hidden sm:flex items-center gap-1">
              {[
                { href: "/portal/admin", label: "Dashboard" },
                { href: "/portal/admin/professores", label: "Professores" },
              ].map(({ href, label }) => (
                <Link key={href} href={href}
                  className="px-3 py-1.5 text-xs tracking-[0.12em] uppercase transition-colors duration-150"
                  style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs" style={{ color: "var(--color-ash)" }}>{profile.nome}</span>
            <Link href="/" className="text-xs" style={{ color: "var(--color-ash)" }}>← Site</Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
