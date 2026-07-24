"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

type Modo = "senha" | "link";

export default function LoginForm() {
  const params = useSearchParams();
  const router = useRouter();
  const redirect = params.get("redirect") ?? "/admin";

  const [modo, setModo] = useState<Modo>("senha");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const configurado = isSupabaseConfigured();

  async function entrarComSenha(e: React.FormEvent) {
    e.preventDefault();
    if (!configurado) return;
    setErro("");
    setCarregando(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

    setCarregando(false);
    if (error) {
      setErro("E-mail ou senha incorretos.");
      return;
    }
    router.replace(redirect);
    router.refresh();
  }

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
        <p className="text-sm text-admin-texto/60 mt-1">
          {modo === "senha" ? "Entre com seu e-mail e senha." : "Login por link mágico, sem senha."}
        </p>
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
        <>
          <div className="flex border-2 border-admin-borda">
            <button
              type="button"
              onClick={() => { setModo("senha"); setErro(""); }}
              className={`alvo-toque flex-1 text-sm font-bold uppercase ${modo === "senha" ? "bg-brasa text-white" : "text-admin-texto/60"}`}
            >
              Senha
            </button>
            <button
              type="button"
              onClick={() => { setModo("link"); setErro(""); }}
              className={`alvo-toque flex-1 text-sm font-bold uppercase ${modo === "link" ? "bg-brasa text-white" : "text-admin-texto/60"}`}
            >
              Link mágico
            </button>
          </div>

          <form onSubmit={modo === "senha" ? entrarComSenha : enviarMagicLink} className="space-y-4">
            <input
              type="email"
              required
              autoFocus
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="alvo-toque w-full border-2 border-admin-borda px-4 text-lg"
            />
            {modo === "senha" && (
              <input
                type="password"
                required
                placeholder="Senha"
                autoComplete="current-password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="alvo-toque w-full border-2 border-admin-borda px-4 text-lg"
              />
            )}
            {erro && <p className="text-sm text-brasa">{erro}</p>}
            <button
              type="submit"
              disabled={carregando}
              className="alvo-toque w-full bg-brasa text-white font-bold uppercase tracking-wide disabled:opacity-50"
            >
              {carregando ? "Entrando..." : modo === "senha" ? "Entrar" : "Enviar link de acesso"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
