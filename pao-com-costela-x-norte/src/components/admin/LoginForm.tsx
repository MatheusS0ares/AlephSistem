"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function LoginForm() {
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/admin";

  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const configurado = isSupabaseConfigured();

  async function enviarMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!configurado) return;
    setErro("");
    setCarregando(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/admin/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    });

    setCarregando(false);
    if (error) {
      setErro("Não foi possível enviar o link. Confira o e-mail e tente de novo.");
      return;
    }
    setEnviado(true);
  }

  return (
    <div className="w-full max-w-sm space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Painel — X Norte</h1>
        <p className="text-sm text-admin-texto/60 mt-1">Login por link mágico, sem senha.</p>
      </div>

      {!configurado ? (
        <p className="text-center text-sm border-2 border-admin-borda p-6">
          Painel em configuração. Fale com quem cuida do sistema.
        </p>
      ) : enviado ? (
        <p className="text-center text-sm border-2 border-brasa p-6">
          Link enviado para <strong>{email}</strong>. Abra o e-mail no celular e toque no link.
        </p>
      ) : (
        <form onSubmit={enviarMagicLink} className="space-y-4">
          <input
            type="email"
            required
            autoFocus
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="alvo-toque w-full border-2 border-admin-borda px-4 text-lg"
          />
          {erro && <p className="text-sm text-brasa">{erro}</p>}
          <button
            type="submit"
            disabled={carregando}
            className="alvo-toque w-full bg-brasa text-white font-bold uppercase tracking-wide disabled:opacity-50"
          >
            {carregando ? "Enviando..." : "Enviar link de acesso"}
          </button>
        </form>
      )}
    </div>
  );
}
