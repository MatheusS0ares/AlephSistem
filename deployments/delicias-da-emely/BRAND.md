# Delicias da Emely — Brand Guide para Geração de Imagens

## Identidade da Marca

**Nome:** Delicias da Emely  
**Nicho:** Confeitaria artesanal — brigadeiros gourmet, kits presente, doces especiais  
**Localização:** Brasília - DF  
**Personalidade:** Artesanal, romântica, premium, acolhedora, feminina  
**Posicionamento:** Doces feitos com ingredientes selecionados, embalagem presenteável, encomenda personalizada  
**Público-alvo:** Mulheres 25–45 anos que presenteiam com cuidado, casais, empresas em Brasília

---

## Paleta de Cores

| Nome          | HEX       | Uso                              |
|---------------|-----------|----------------------------------|
| Rosa principal| `#d4006e` | Destaque, botões, acentos        |
| Rosa claro    | `#f06292` | Itálicos, hover, textos em rosa  |
| Rosa escuro   | `#9c0050` | Sombras, profundidade            |
| Fundo dark    | `#0e0508` | Background principal             |
| Card escuro   | `#1e0e16` | Cards de produto                 |
| Texto         | `#f0d8e4` | Textos sobre fundo escuro        |
| Dourado       | `#d4af37` | Badges "Hot", detalhes premium   |
| WhatsApp      | `#25d366` | Botões de ação                   |

**Sensação visual:** escuro, elegante, romântico — como chocolateria europeia premium.

---

## Estilo Visual (Photography Art Direction)

### Regras fundamentais — SEMPRE aplicar
- **Fundo:** escuro. Mármore preto, madeira escura envelhecida, veludo preto, ardósia
- **Iluminação:** lateral suave (chiaroscuro) — uma fonte de luz principal, sombras visíveis
- **Profundidade de campo:** rasa. Produto em foco, fundo desfocado (f/1.4–f/2.8)
- **Atmosfera:** romântica, íntima, artesanal. Nunca clínica ou branca demais
- **Temperatura de cor:** warm (3200–4500K) — tons âmbar e rosê, nunca fria/azulada
- **Ângulo:** 45° ou top-down. Nunca foto frontal plana sem interesse
- **Props permitidos:** pétalas de rosa, fita de cetim, folhas secas, glitter dourado, velas, papel kraft, cartões escritos à mão
- **Props proibidos:** fundos brancos ou claros, luz de flash direta, embalagens genéricas

### Palavras-chave de estilo para usar em todos os prompts
```
dark moody food photography, chiaroscuro lighting, shallow depth of field,
warm candlelight tones, luxury artisan confectionery, romantic Brazilian
sweet shop aesthetic, dark marble or dark wood surface, bokeh background,
editorial quality, 85mm lens equivalent, f/1.8, ultra sharp subject
```

---

## Por Produto — Referência de Cena

### Hero Background
- **Cena:** Brigadeiros em grupo, pétalas espalhadas, bokeh rosa ao fundo
- **Formato:** 16:9 horizontal
- **Mood:** "Quero isso agora"

### Brigadeiros (produto solo ou caixa)
- **Superfície:** mármore escuro ou madeira escura
- **Luz:** lateral esquerda suave, reflexo no glacê do brigadeiro
- **Detalhe:** textura do brigadeiro em foco (granulado, pistache, raspas de chocolate)
- **Props:** papel rendado preto embaixo, fita de cetim rosa

### Kits Presente / Caixas
- **Cena:** caixa semi-aberta revelando o interior organizado
- **Luz:** luz de fundo suave + spotlight no produto
- **Props:** laço de cetim, cartão manuscrito, pétalas secas ao redor
- **Ângulo:** 45° inclinado para mostrar profundidade da caixa

### Kit Namorados / Jogo do Prazer
- **Superfície:** veludo vinho ou madeira escura
- **Props:** dados ao lado, pétalas de rosa vermelha, vela acesa desfocada ao fundo
- **Paleta extra:** vermelho e dourado entram como acentos
- **Mood:** sensual, romantico, adulto mas elegante

### Kit Corporativo
- **Superfície:** ardósia cinza escuro ou mármore grafite
- **Composição:** caixinhas organizadas em fileira/grade
- **Luz:** mais limpa, menos dramática — ainda dark, mas profissional
- **Props:** cartão de visita ou tag de marca ao lado

### Trufas
- **Foco:** corte transversal de uma trufa mostrando o recheio
- **Props:** cacau em pó polvilhado ao redor, raspas de chocolate
- **Luz:** máxima atenção à textura — luz rasante lateral

### Foto Sobre (Confeiteira)
- **Estilo:** lifestyle editorial — mãos trabalhando, não pose de estúdio
- **Cena:** mãos femininas decorando brigadeiros, cozinha escura ao fundo desfocada
- **Luz:** janela natural lateral (luz suave, não direta)
- **Formatos:** 4:5 vertical

---

## Template de Prompt (copie e preencha)

```
[DESCRIÇÃO DA CENA ESPECÍFICA DO PRODUTO],
dark moody food photography, chiaroscuro lighting, single warm light source
from the left, shallow depth of field, bokeh dark background, luxury artisan
confectionery aesthetic, dark marble surface, warm candlelight tones, romantic
Brazilian sweet shop, 85mm lens equivalent, f/1.8, ultra sharp product,
rose pink #d4006e accent lighting, editorial quality, high-end food magazine,
[PROPS ESPECÍFICOS DO PRODUTO]
```

> **No Adapta:** selecione o formato na aba **Proporção** antes de gerar.  
> **No Midjourney:** adicione `--ar [W]:[H] --style raw --v 6.1 --q 2` no final.

---

## Prompts prontos por imagem

### 1. Hero Background → **16:9**
```
Editorial food photography of gourmet brigadeiros arranged artistically
on dark black velvet surface, scattered rose petals, soft pink bokeh lights
in background, moody romantic atmosphere, low-key lighting with one dramatic
side light catching chocolate glaze, depth of field, 85mm portrait lens,
f/1.8, ultra sharp foreground brigadeiros with dreamy blurred background,
dark luxury aesthetic
```

### 2. Jogo do Prazer — Ferrero Rocher → **4:3**
```
Top-down flat lay product photography, elegant gift box open revealing
12 Ferrero Rocher chocolates in golden wrappers arranged in perfect grid,
two red dice with love symbols placed beside the box, dark charcoal marble
surface, scattered golden glitter, soft pink accent light from left, white
highlight reflections on chocolate wrappers, luxury packaging, macro details
```

### 3. Jogo do Prazer — Brigadeiros Gourmet → **4:3**
```
Close-up product photography of open pink gift box with 12 gourmet brigadeiros
arranged in rows, each with different topping: white sprinkles, chocolate
shavings, crushed pistachio, gold leaf, two red heart dice beside the box,
dark wood background, romantic pink candlelight glow, shallow depth of field,
macro details on chocolate texture
```

### 4. Caixa 9 Brigadeiros Gourmet → **4:3**
```
45-degree angle product photography of premium kraft paper box containing
exactly 9 gourmet brigadeiros in paper cups, each with different decorative
topping (pistachio, gold pearl, white chocolate, cocoa powder), black ribbon
bow on corner of box, dark moody background with soft directional lighting,
luxury artisan confectionery aesthetic, shallow DOF
```

### 5. Caixa 16 Brigadeiros Gourmet → **4:3**
```
Product photography of elegant black gift box lid partially open revealing
16 perfectly arranged gourmet brigadeiros in 4x4 grid, each in individual
gold paper cup with unique toppings, pink satin ribbon tied in bow, dark
velvet background, dramatic chiaroscuro lighting, luxury confectionery,
bokeh background, close-up angle
```

### 6. Kit Presente Romântico → **4:3**
```
Romantic gift kit product photography, premium matte black box closed with
blush pink satin ribbon and bow, small handwritten gift card leaning against
it, 12 brigadeiros visible in soft focus beside the box, dried rose petals
scattered on dark marble surface, warm candlelight from behind, luxury
Valentine's Day aesthetic, moody romantic lighting
```

### 7. Kit Festa 50 Unidades → **4:3**
```
Product flat lay of individually wrapped gourmet brigadeiros in small boxes
with pink ribbon tags, arranged in beautiful scattered pattern on dark surface,
some boxes open revealing chocolate inside, confetti and gold stars around,
celebration aesthetic, overhead shot, soft studio lighting, shallow depth of
field on front brigadeiros, event catering luxury style
```

### 8. Kit Corporativo 30 Caixinhas → **4:3**
```
Corporate gift product photography, 30 small premium white gift boxes neatly
arranged in rows on dark grey surface, each with custom label and ribbon,
professional studio lighting, one box open in foreground showing 4 brigadeiros
inside, minimalist corporate aesthetic, soft shadows, sharp product photography,
neutral elegant palette with gold accent details
```

### 9. Trufas Artesanais Caixa 12 → **4:3**
```
Macro product photography of artisan chocolate truffles in open luxury box,
12 truffles with different coatings: dark cocoa powder, milk chocolate glaze,
white chocolate drizzle, crushed hazelnut, one truffle cut in half showing
creamy ganache filling, dark charcoal background, single dramatic spotlight,
chocolate texture details sharp, bokeh background, premium Belgian chocolate
aesthetic
```

### 10. Foto Sobre — Confeiteira → **4:5**
```
Warm editorial portrait lifestyle photo, female artisan confectioner hands
carefully placing gourmet brigadeiros in gift box, natural window light from
left, shallow depth of field on hands and chocolate, warm golden hour tones,
rustic dark wood table, authentic artisan atmosphere, bokeh kitchen background
with copper pots, Canon 5D style, 85mm f/1.4
```

---

## O que NUNCA gerar

- ❌ Fundo branco ou pastel
- ❌ Iluminação de estúdio crua (flash direto)
- ❌ Embalagens genéricas de supermercado
- ❌ Brigadeiros com aparência artificial/digital demais (estilo cartoon)
- ❌ Composições muito simétricas e "perfeitas" — prefira orgânico/artesanal
- ❌ Texto ou logotipos nas imagens geradas por IA
- ❌ Mãos masculinas nas fotos de produto/making of

---

## Proporções por uso no site

> Formatos disponíveis no Adapta: **1:1 · 16:9 · 3:2 · 4:3 · 5:4 · 9:16 · 2:3 · 3:4 · 4:5**

| Imagem                        | Formato no Adapta | Motivo                                   |
|-------------------------------|-------------------|------------------------------------------|
| Hero background               | **16:9**          | Ocupa largura total do site (desktop)    |
| Todos os cards de produto (×8)| **4:3**           | Proporção do `.prodImgWrap` no código    |
| Foto Sobre (Emely/produção)   | **4:5**           | Moldura vertical — coluna esquerda       |
| Post Instagram quadrado       | **1:1**           | Feed padrão                              |
| Story / Reels vertical        | **9:16**          | Stories e Reels                          |
| Banner sazonal (promo)        | **3:2**           | Mais próximo de 3:1 disponível           |

---

## Exemplo de prompt completo validado

> Para a **Caixa 9 Brigadeiros Gourmet**:

```
Open kraft paper gift box containing 9 gourmet brigadeiros in individual
paper cups, each with different artisan topping: pistachio crumble, gold
pearl sugar, white chocolate shavings, dark cocoa powder, placed on dark
weathered wood surface, black satin ribbon bow on corner of box, single
warm candle light from left creating dramatic shadows, shallow depth of
field, foreground sharp brigadeiros in focus, dreamy bokeh dark background,
rose pink light accent, luxury Brazilian artisan confectionery, editorial
food photography, 85mm f/1.8, ultra sharp textures,
--ar 4:3 --style raw --v 6.1 --q 2
```

---

*Gerado para: Delicias da Emely — AlephSistem*  
*Versão: 1.0 — Junho 2025*
