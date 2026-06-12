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
[PROPS ESPECÍFICOS DO PRODUTO],
--ar [PROPORÇÃO] --style raw --v 6.1 --q 2
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

| Seção              | Proporção | Pixels sugeridos |
|--------------------|-----------|-----------------|
| Hero background    | 16:9      | 1920 × 1080     |
| Card de produto    | 4:3       | 800 × 600       |
| Sobre (foto)       | 4:5       | 600 × 750       |
| Banner sazonal     | 3:1       | 1200 × 400      |
| Instagram (futuro) | 1:1       | 1080 × 1080     |

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
