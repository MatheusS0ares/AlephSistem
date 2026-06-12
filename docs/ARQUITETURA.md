# Arquitetura Multi-Loja (Multi-Tenant)

> Como uma única base de código atende várias lojas — e como isso escala de
> 2 para 50+ clientes sem virar um pesadelo de manutenção.

---

## 1. Conceito central

**1 código → N lojas.** O mesmo repositório serve todas as lojas. O que muda
entre elas é apenas a **configuração** (cores, logo, textos, produtos). Uma
"chave" (`NEXT_PUBLIC_TENANT`) diz ao sistema qual loja montar.

```
            ┌─────────────────────┐
            │   GIT (1 código)    │
            └──────────┬──────────┘
        ┌──────────────┴──────────────┐
        ▼                              ▼
  VERCEL Paizão                  VERCEL Magnnata
  TENANT=paizao                  TENANT=magnnata
        ▼                              ▼
  FIREBASE Paizão                FIREBASE Magnnata
  (produtos A)                   (produtos B)
```

---

## 2. Estágio atual (modelo "lojas separadas")

Ideal para **2 a ~10 lojas**. Cada loja tem isolamento total.

| Camada      | Como funciona hoje                                    |
| ----------- | ----------------------------------------------------- |
| Git         | 1 repositório compartilhado                           |
| Config      | 1 arquivo por loja em `tenants/<loja>.ts`             |
| Deploy      | 1 projeto Vercel por loja (`NEXT_PUBLIC_TENANT=...`)  |
| Banco       | 1 projeto Firebase por loja                           |
| Tema visual | `tema: 'copa' \| 'luxo'` define hero e seções da home |

### Estrutura de pastas relevante

```
tenants/
  types.ts        # contrato (interface TenantConfig)
  index.ts        # registro de todas as lojas + getTenant()
  paizao.ts       # config da loja Paizão
  magnnata.ts     # config da loja Magnnata
  _template.ts    # modelo para criar uma loja nova

components/
  hero/HeroCopa.tsx     # hero tema futebol  (Paizão)
  hero/HeroLuxo.tsx     # hero tema luxo     (Magnnata)
  sections/...          # seções compartilhadas, lêem getTenant()
  layout/TenantStyles.tsx  # injeta as cores da loja via CSS variables
```

### Como nasce uma loja nova (modelo atual)

1. Duplicar `tenants/_template.ts` → `tenants/<nome>.ts` e preencher.
2. Registrar em `tenants/index.ts`.
3. Criar projeto Firebase + projeto Vercel (`NEXT_PUBLIC_TENANT=<nome>`).
4. Apontar o domínio.

---

## 3. Isolamento de mudanças (pergunta-chave)

**Dá para mexer em uma loja sem afetar a outra?** Sim. Três cenários:

1. **Conteúdo/visual de uma loja** → mexe só em `tenants/<loja>.ts`. Isolado.
2. **Funcionalidade só de uma loja** → marcação no código:
   `tema === 'luxo' ? <Novo /> : <Antigo />` (foi assim que o hero foi feito).
3. **Conserto geral** → corrige 1x, vale para todas. Vantagem, não limitação.

**Regra de ouro:** código compartilhado mexido "no bruto" afeta todas; com a
marcação por tenant, sempre dá para isolar.

---

## 4. Estágio de escala (modelo "plataforma")

Quando passar de ~10 lojas, migrar para o modelo de plataforma (o que
Shopify/Nuvemshop usam). **1 deploy atende todas as lojas.**

| Camada     | Modelo atual              | Modelo plataforma                    |
| ---------- | ------------------------- | ------------------------------------ |
| Deploy     | 1 Vercel por loja         | **1 Vercel para todas**              |
| Banco      | 1 Firebase por loja       | **1 banco, registros com `lojaId`**  |
| Config     | 1 arquivo `.ts` por loja  | **1 registro no banco por loja**     |
| Loja nova  | trabalho de desenvolvedor | **um cadastro (self-service)**       |
| Roteamento | env var por deploy        | **pelo domínio (middleware)**        |

### Como a loja é identificada (por domínio)

```
acessa lojaX.com.br
        │
        ▼
  Middleware lê o domínio  →  "é a lojaX"
        │
        ▼
  Carrega config da lojaX (do banco / cache Edge Config)
        │
        ▼
  Renderiza com a cara da lojaX, produtos com lojaId = lojaX
```

### Decisão de dados: juntos vs. separados

- **Juntos (recomendado p/ moda):** todos os produtos no mesmo banco, cada um
  com um campo `lojaId`. A loja só enxerga os dados com o `lojaId` dela.
  Barato, fácil de gerenciar, escala liso.
- **Separados (Firebase por loja):** isolamento máximo, mas caro e trabalhoso.
  Só vale para setores com compliance pesado (saúde, financeiro).

### O que muda no código para virar plataforma

1. `getTenant()` passa a resolver pelo **domínio** (via middleware), não por env var.
2. A config sai dos arquivos `.ts` e vai para uma coleção `lojas` no banco
   (com cache em Edge Config para velocidade).
3. Todas as queries de produto ganham filtro `where('lojaId', '==', loja)`.
4. Um **painel de onboarding** cadastra a loja (nome, cores, logo, domínio).
5. Domínios adicionados via API da Vercel (programaticamente).

---

## 5. Roadmap recomendado

| Fase           | Nº de lojas | Ação                                                  |
| -------------- | ----------- | ----------------------------------------------------- |
| **Agora**      | 2           | Manter modelo atual. Não complicar antes da hora.     |
| **Validação**  | 3–8         | Modelo atual; preparar resolução por domínio.         |
| **Escala**     | 10–50+      | Migrar config e produtos para o banco (plataforma).   |
| **Self-serve** | 50+         | Painel de onboarding + cobrança automática por loja.  |

A Magnnata é a **loja-cobaia**: valida que "trocar a cara da loja" funciona de
ponta a ponta. Validado o modelo de negócio, fazemos a migração para plataforma.

---

## 6. Custos (ordem de grandeza)

- **Modelo atual:** cada loja = 1 conta Vercel + 1 Firebase. Linear, fica caro
  e fragmentado ao multiplicar.
- **Modelo plataforma:** 1 Vercel Pro + 1 Firebase aguentam dezenas de lojas e
  domínios. Custo por loja despenca; a margem aumenta com a escala.

---

_Última atualização: mantida junto ao código. Ao evoluir a arquitetura,
atualize este documento._
