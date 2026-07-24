import "server-only";
import { createPublicCachedClient } from "./supabase/public";
import { createClient as createAuthedClient } from "./supabase/server";
import { isSupabaseConfigured as isConfiguredEnv } from "./supabase/client";
import type { Cardapio } from "./types";

const VAZIO: Cardapio = { paes: [], carnes: [], molhos: [], excecoes: [], promocoes: [], combos: [] };

export function isSupabaseConfigured() {
  return isConfiguredEnv();
}

/**
 * Cardápio como o site público enxerga: só itens ativos, cacheado com a tag 'cardapio'.
 * DEBUG TEMPORÁRIO: `_erro` carrega a primeira mensagem de erro do Supabase (RLS,
 * schema não exposto etc.) pra diagnosticar o cardápio vazio — remover depois.
 */
export async function getCardapioPublico(): Promise<Cardapio & { _erro?: string }> {
  if (!isSupabaseConfigured()) return { ...VAZIO, _erro: "NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não configurados na Vercel" };
  const supabase = createPublicCachedClient();
  const [paes, carnes, molhos, excecoes, promocoes, combos] = await Promise.all([
    supabase.from("paes").select("*").eq("ativo", true).order("ordem"),
    supabase.from("carnes").select("*").eq("ativo", true).order("ordem"),
    supabase.from("molhos").select("*").eq("ativo", true).order("ordem"),
    supabase.from("precos_excecao").select("*"),
    supabase.from("promocoes").select("*").eq("ativo", true),
    supabase.from("combos").select("*").eq("ativo", true).order("ordem"),
  ]);
  const erro = paes.error ?? carnes.error ?? molhos.error ?? excecoes.error ?? promocoes.error ?? combos.error;
  return {
    paes: paes.data ?? [],
    carnes: carnes.data ?? [],
    molhos: molhos.data ?? [],
    excecoes: excecoes.data ?? [],
    promocoes: promocoes.data ?? [],
    combos: combos.data ?? [],
    ...(erro ? { _erro: `${erro.message} (code: ${erro.code})` } : {}),
  };
}

/** Cardápio como o painel admin enxerga: tudo, sem cache, para edição. */
export async function getCardapioAdmin(): Promise<Cardapio> {
  const supabase = await createAuthedClient();
  const [paes, carnes, molhos, excecoes, promocoes, combos] = await Promise.all([
    supabase.from("paes").select("*").order("ordem"),
    supabase.from("carnes").select("*").order("ordem"),
    supabase.from("molhos").select("*").order("ordem"),
    supabase.from("precos_excecao").select("*"),
    supabase.from("promocoes").select("*"),
    supabase.from("combos").select("*").order("ordem"),
  ]);
  return {
    paes: paes.data ?? [],
    carnes: carnes.data ?? [],
    molhos: molhos.data ?? [],
    excecoes: excecoes.data ?? [],
    promocoes: promocoes.data ?? [],
    combos: combos.data ?? [],
  };
}
