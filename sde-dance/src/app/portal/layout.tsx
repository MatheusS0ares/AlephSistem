import { createClient } from "@/lib/supabase/server";
import PortalNav from "@/components/portal/PortalNav";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <>{children}</>;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("tipo, nome")
    .eq("id", user.id)
    .single();

  // Admin has its own sidebar — skip portal nav entirely
  if (profile?.tipo === "admin") {
    return (
      <div data-portal="admin" className="min-h-screen flex flex-col"
        style={{ backgroundColor: "var(--color-blackout)" }}>
        {children}
      </div>
    );
  }

  return (
    <div data-portal="true" className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--color-blackout)" }}>
      <PortalNav tipo={profile?.tipo ?? "aluno"} nome={profile?.nome ?? ""} />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
