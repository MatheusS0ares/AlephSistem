/* ============================================================
   CONFIG DO CLIENTE — não sincronizar com upstream (Aleph)
   Edite aqui: slug, nome, modo de operação
   ============================================================ */

// VITE_CLIENT_SLUG no .env define qual loja este deploy representa.
// Se não definido, exibe o StoreSelector (modo demo/multi-loja).
export const CLIENT_SLUG = import.meta.env.VITE_CLIENT_SLUG || null

// Nome exibido no título da aba e no painel admin
export const CLIENT_NAME = import.meta.env.VITE_CLIENT_NAME || 'AlephSistem'

// 'shared'    → usa Supabase compartilhado (prospects/trial)
// 'dedicated' → usa Supabase próprio do cliente (produção)
export const SUPABASE_MODE = import.meta.env.VITE_SUPABASE_MODE || 'shared'
