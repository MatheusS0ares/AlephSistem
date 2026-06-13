# Deploy — Delicias da Emely

## Passo a passo

### 1. Supabase — Rodar o SQL de setup
1. Acesse **supabase.com** > seu projeto compartilhado
2. Vá em **SQL Editor**
3. Cole o conteúdo de `supabase-setup.sql` e clique em **Run**
4. Verifique rodando as queries de verificação no fim do arquivo

### 2. Vercel — Criar o projeto
1. Acesse **vercel.com** > **Add New Project**
2. Importe o repositório `MatheusS0ares/AlephSistem`
3. Em **Configure Project**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3. Vercel — Configurar variáveis de ambiente
1. Vá em **Settings > Environment Variables**
2. Adicione uma a uma as variáveis do arquivo `.env`:

| Variável | Valor |
|---|---|
| `VITE_SUPABASE_URL` | URL do seu Supabase |
| `VITE_SUPABASE_ANON_KEY` | Anon key do seu Supabase |
| `VITE_CLIENT_SLUG` | `delicias-da-emely` |
| `VITE_CLIENT_NAME` | `Delicias da Emely` |
| `VITE_SUPABASE_MODE` | `shared` |
| `VITE_ADMIN_PASSWORD` | `emely2026!` (ou crie uma senha forte) |

3. Clique em **Deploy**

### 4. Domínio (opcional)
- Vercel gera um link automático: `delicias-da-emely.vercel.app`
- Para domínio próprio: **Settings > Domains** > adicionar `deliciasdaemely.com.br`

### 5. Painel Admin
- URL: `seudominio.vercel.app/admin`
- Senha: a definida em `VITE_ADMIN_PASSWORD`
- Acesso: Emely pode gerenciar produtos, pedidos e ajustes

## URLs após o deploy
- Loja: `https://seudominio.vercel.app/`
- Admin: `https://seudominio.vercel.app/admin`
