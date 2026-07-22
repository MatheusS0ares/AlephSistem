# Pão com Costela — X Norte

App autocontido dentro do monorepo AlephSistem. Segue o mesmo padrão de
`family-portal/` e `sde-dance/`: pasta própria, `package.json` próprio,
schema Supabase próprio, deploy Vercel próprio. Nada aqui é compartilhado
com outro cliente — mexer neste projeto não tem como afetar os demais.

## Isolamento (repositório e banco)

- **Repositório**: código vive só em `pao-com-costela-x-norte/`. Build e
  `npm install` rodam com este diretório como raiz (`vercel.json` local +
  Root Directory apontado para esta pasta nas configurações do projeto
  Vercel — criar um projeto Vercel **novo**, nunca reaproveitar o de outro
  cliente).
- **Banco**: usar um projeto Supabase **dedicado** (não o de nenhum outro
  app do monorepo). Rodar `supabase/schema.sql` nesse projeto novo. RLS
  garante que só usuários da tabela `admins` desse projeto escrevem, e o
  pedido do site público só é gravado via `service_role` no servidor —
  nunca com a chave anon no browser (seção 4.4 do brief).
- **Env vars**: cada variável em `.env.example` é específica deste
  projeto (URL/chaves do Supabase dedicado, secret do webhook). Configurar
  no Vercel apenas neste projeto, não no root do monorepo.

## Setup

1. Criar um projeto novo no Supabase.
2. Rodar `supabase/schema.sql` no SQL Editor.
3. Copiar `.env.example` para `.env.local` e preencher.
4. Fazer login uma vez pelo `/admin/login` (magic link) e depois, no SQL
   Editor, promover o usuário a admin:
   ```sql
   insert into admins (id, nome)
   values ('<uuid em auth.users>', 'Nome do dono');
   ```
5. `npm install && npm run dev`.
6. Configurar o Database Webhook no Supabase (Database → Webhooks) nas
   tabelas `paes`, `carnes`, `molhos`, `precos_excecao`, `promocoes`:
   POST para `https://<domínio>/api/revalidate`, header
   `x-revalidate-secret: <mesmo valor de REVALIDATE_SECRET>`.

## Pendente com o cliente (brief seção 11)

O seed só tem a linha do pão bola confirmada. Enquanto não fechar, o
sistema mostra "preço não definido" em vez de chutar valor:

1. Preço do Mini Baguete 17cm e do Pão Francês — vale para qual carne, ou é o mesmo pra qualquer uma?
2. Desconto da costela (−R$ 3,00) vale em todos os pães ou só no pão bola?
3. Linguiça tem ajuste próprio? (entrou como 0 por padrão — revisar em `/admin/cardapio`)
4. Trio é 3 unidades iguais ou pode variar a carne? Por que pão bola não tem trio? *(combos ficaram fora desta entrega — tabela `combos` existe no schema, mas não há UI ainda)*
5. Faz entrega? Raio e taxa? (`siteConfig.fazEntrega = false` por enquanto)
6. Horário e dias de funcionamento (`src/lib/site-config.ts`, placeholder "18h às 23h")
7. Formas de pagamento aceitas (assumido dinheiro/pix/cartão)
8. Número de WhatsApp oficial (`src/lib/site-config.ts`, placeholder — **trocar antes de publicar**)

Depois de fechar esses pontos, atualizar `src/lib/site-config.ts` e a
tabela `carnes`/`paes` no painel (`/admin/cardapio`).

## Fora do escopo (conforme o brief — não implementado de propósito)

Pagamento online, rastreamento de entrega, app nativo, integração
iFood, controle de estoque de insumo, multi-loja.

## O que ficou parcial

- `combos` e `promocoes` têm schema, RLS e resolução de preço prontos,
  mas sem tela de edição no painel — hoje só dá pra gravar via SQL. Baixo
  risco: nenhuma das duas perguntas do cliente (seção 11, item 4) foi
  respondida ainda, então não há dado real para editar.
- Reordenar itens do cardápio por arrastar: hoje a ordem vem da coluna
  `ordem` do seed; trocar exige SQL direto.
