# REDESIGN-PLAN — MewStack · direção "Sinal & Papel"

> **Precedência:** este documento é a fonte da verdade visual do redesign. Onde ele
> conflitar com `CLAUDE.md`, `DESIGN.md` ou `PRODUCT.md`, **este documento vence**.
> A lista explícita de regras antigas revogadas está no §14. As regras de engenharia
> de `CLAUDE.md` (stack, comandos, fluxo de verificação, armadilhas conhecidas)
> continuam valendo integralmente.

---

## 0. Como usar este documento

- Implemente na ordem dos parágrafos §4 → §5 → §6 (tokens primeiro, tipografia depois,
  seções por último). Cada seção pode ser um commit.
- Nenhum asset de mídia final existe ainda. **Não gere imagens, vídeos, dashboards
  falsos nem pessoas por IA.** Todo espaço de mídia tem um fallback puramente gráfico
  especificado (§7 e §8) que deve parecer terminado mesmo vazio.
- Todo valor de cor está em OKLCH e vira token no `@theme` de `src/index.css`.
  Nada de cor hardcoded em componente.
- Critérios de aceite objetivos no §13. O redesign só está pronto quando todos passarem.

---

## 1. Direção criativa central

**Nome: "Sinal & Papel".**

A página é a **superfície de trabalho do estúdio**: um papel técnico claro, tonal e
quente — anotado com hairlines, marcas de registro e legendas mono — atravessado por
**um sinal contínuo** (o fio rosa: dado vivo viajando do ruído à clareza). Em pontos
precisos, o papel se abre em **viewports escuros**: janelas para a máquina rodando
(código, dados, mídia). O visitante não olha uma landing page; olha a bancada de um
estúdio que transforma caos operacional em sistemas que rodam.

Três materiais, três papéis:

| Material | O que é | Onde aparece |
|---|---|---|
| **Papel** | superfície clara tonal (off-whites com temperatura) | fundo de quase toda a página |
| **Máquina** | núcleos violeta-noite | viewports de mídia, CodeLab, Contato |
| **Sinal** | o rosa da marca como energia/luz/linha, nunca como bloco | fio-guia, estados de interface, reflexos |

## 2. Sentimento visual e metáfora

- **Sentimento:** estúdio de produto maduro trabalhando de dia — luz natural sobre papel
  técnico, calma, precisão, e um pulso de energia rosa percorrendo tudo. Confiança sem
  frieza; técnica sem escuridão; brasilidade no texto, sobriedade na forma.
- **Metáfora estrutural:** *do ruído ao sinal*. Um único fio atravessa a página inteira:
  nasce **emaranhado** no capítulo do problema, é **domado** nos serviços, se **ordena**
  no processo, **entra na máquina** no CodeLab, **sai como resultado** nos cases e vira
  **horizonte aceso** no contato. O scroll conta essa história sem precisar de texto.
- **Tensão central:** superfície clara editorial × núcleos técnicos escuros. O escuro
  nunca domina — ele é visto *através* do papel, como janelas de inspeção numa máquina.

## 3. Regras duras — o que evitar

Proibições absolutas (valem para qualquer seção, qualquer breakpoint):

1. **Sem branco puro `#FFFFFF`** como fundo de área grande. Só em micro-realces
   (inset highlight de 1px, brilho de borda).
2. **Sem hero centralizado** com headline isolada flutuando sobre nada.
3. **Sem auroras, blobs, glows difusos ou spotlights.** O utilitário `.aurora` morre.
4. **Sem gradiente em texto** (`.text-gradient` morre) e sem gradientes pastel genéricos
   de fundo. Gradientes só como variação tonal quase imperceptível entre dois off-whites
   vizinhos (ΔL ≤ 0.03).
5. **Sem faixas/blocos sólidos de rosa.** Rosa nunca preenche área maior que um chip de
   estado (~24px de altura). Rosa é linha, ponto, reflexo, texto acentuado.
6. **Sem grid de cards arredondados idênticos** (3-up, bento decorativo). Card só quando
   for um objeto real (viewport, painel de instrumento) e nunca dois grids iguais na página.
7. **Sem mockups falsos com cara de IA:** as telas fictícias atuais (NFS-e, editor de
   requisitos, conciliação) **saem** e dão lugar aos frames do §8 aguardando capturas reais.
8. **Sem avatares circulares com ring, badges de startup, chips flutuantes animados,
   contadores de métrica de template.**
9. **Sem mascote no corpo da página.** O gato de headset vive apenas em `Logo.tsx`
   (wordmark/ícone) e no favicon.
10. **Sem tracking exagerado em uppercase** (o eyebrow atual com `0.14–0.16em` é tell).
    Máximo `0.08em` em rótulos mono pequenos.
11. **Sem empilhar efeitos.** Cada seção tem no máximo **um** gesto de motion próprio
    além dos reveals padrão.
12. **Sem emojis como ícone; ícones só lucide-react**, tamanho consistente, e apenas
    quando carregam significado (nunca decorativos ao lado de cada item).

## 4. Paleta tonal — tokens

Reescrever o bloco de cores do `@theme` em `src/index.css` com os tokens abaixo.
Manter nomes semânticos novos; ver mapeamento antigo→novo na tabela do fim do parágrafo.

### 4.1 Superfícies claras ("papel")

| Token | Valor OKLCH | Papel |
|---|---|---|
| `--color-paper` | `oklch(0.962 0.007 340)` | fundo-base do site — off-white com temperatura rosada |
| `--color-paper-lilac` | `oklch(0.946 0.010 300)` | modulação fria de seção (lilás quase imperceptível) |
| `--color-paper-rose` | `oklch(0.948 0.011 20)` | modulação quente de seção (rosa envelhecido) |
| `--color-paper-high` | `oklch(0.984 0.004 340)` | superfície elevada (nav sólida, painéis) — **não** é #FFF |
| `--color-line` | `oklch(0.42 0.025 320 / 0.14)` | hairline padrão (o esqueleto do papel) |
| `--color-line-strong` | `oklch(0.42 0.025 320 / 0.24)` | hairline de moldura/bezel |

As três variações de papel modulam capítulos vizinhos (§10.4). A diferença entre elas
deve ser sentida como **atmosfera**, não percebida como troca de cor.

### 4.2 Tintas (texto sobre claro)

| Token | Valor OKLCH | Papel |
|---|---|---|
| `--color-ink` | `oklch(0.245 0.018 300)` | texto primário — carvão-violeta pigmentado |
| `--color-ink-soft` | `oklch(0.435 0.020 305)` | texto secundário (≥4.5:1 sobre qualquer papel) |
| `--color-ink-faint` | `oklch(0.55 0.020 310)` | rótulos mono grandes / metadados (AA large apenas) |

### 4.3 Núcleos escuros ("máquina")

| Token | Valor OKLCH | Papel |
|---|---|---|
| `--color-night` | `oklch(0.215 0.022 290)` | violeta-noite — fundo de viewports, CodeLab e Contato |
| `--color-night-2` | `oklch(0.262 0.024 290)` | superfície elevada dentro do escuro |
| `--color-night-line` | `oklch(0.96 0.012 320 / 0.13)` | hairline sobre escuro |
| `--color-paper-on-night` | `oklch(0.955 0.008 340)` | texto primário sobre escuro |
| `--color-paper-on-night-soft` | `oklch(0.775 0.012 330)` | texto secundário sobre escuro |

O escuro **nunca** é o `#262626` neutro antigo: sempre este violeta-noite, que conversa
com a temperatura do papel.

### 4.4 Sinal (rosa da marca)

| Token | Valor OKLCH | Papel |
|---|---|---|
| `--color-signal` | `oklch(0.745 0.155 356)` | o fio, pontos de estado, reflexos — herança direta do #FF7BAC |
| `--color-signal-deep` | `oklch(0.550 0.190 356)` | texto/ícone rosa sobre claro (somente large/semibold, AA) |
| `--color-signal-bright` | `oklch(0.800 0.140 354)` | texto rosa sobre night (AA large) |
| `--color-signal-ghost` | `oklch(0.745 0.155 356 / 0.10)` | véu de hover, reflexo, wash de foco |
| `--color-dusk` | `oklch(0.62 0.055 290)` | acento frio de apoio, raro (detalhes de dataviz, sublinha secundária) |

**Regras de contraste (AA obrigatório):** texto corrido = `ink` sobre papel ou
`paper-on-night` sobre night. `--color-signal` **nunca** é texto sobre claro (usar
`signal-deep`). `signal-bright` só sobre night. `--color-dusk` nunca em texto pequeno.

### 4.5 Sombras e luz

| Token | Definição | Uso |
|---|---|---|
| `--shadow-soft` | `0 1px 2px oklch(0.3 0.035 310 / 0.05), 0 10px 28px oklch(0.3 0.045 310 / 0.06)` | painéis claros elevados |
| `--shadow-viewport` | `0 2px 6px oklch(0.22 0.04 300 / 0.18), 0 24px 56px oklch(0.25 0.05 305 / 0.16)` | viewports escuros sobre papel |
| `--shadow-signal` | `0 0 0 1px var(--color-signal-ghost), 0 4px 18px oklch(0.745 0.155 356 / 0.12)` | somente hover/focus de elementos interativos |

Sombras são sempre **tingidas** (violeta/rosa), nunca preto puro. Intensidade: o site
deve parecer iluminado por luz difusa, não "flutuando com drop-shadows".

### 4.6 Mapeamento token antigo → novo

| Antigo | Novo |
|---|---|
| `--color-cream` | `--color-paper` |
| `--color-cream-deep` | `--color-paper-high` |
| `--color-cream-line` / `--line` | `--color-line` |
| `--color-ink` / `--color-night` (texto) | `--color-ink` |
| `--color-ink-soft` | `--color-ink-soft` (novo valor) |
| `--color-night` (fundo) | `--color-night` (novo valor violeta) |
| `--color-night-2` / `--color-night-line` | idem, novos valores |
| `--color-paper` / `--color-paper-soft` | `--color-paper-on-night` / `--color-paper-on-night-soft` |
| `--color-pink` | `--color-signal` |
| `--color-pink-deep` | `--color-signal-deep` |
| `--color-pink-bright` | `--color-signal-bright` |
| `--shadow-glow` | **removido** (usar `--shadow-signal` só em interação) |

## 5. Tipografia

Troca completa da dupla Clash Display + Satoshi. Três famílias, todas gratuitas e
**self-hosted** (baixar woff2 para `public/fonts/`, declarar `@font-face` no
`src/index.css`, `font-display: swap`, preload da display no `index.html`; remover o
link do CDN Fontshare).

| Papel | Família | Licença/Fonte | Pesos/eixos | Fallback |
|---|---|---|---|---|
| Display (`--font-display`) | **Fraunces** (variável) | OFL — Google Fonts / github.com/undercasetype/Fraunces | eixos `opsz 9–144`, `wght`, `SOFT`, `WONK`; usar wght 460–560 | `Georgia, 'Times New Roman', serif` |
| Corpo/UI (`--font-body`) | **Switzer** (variável) | Fontshare (ITF FFL, permite self-host web) | wght 400/500/600 | `'General Sans', system-ui, sans-serif` |
| Dados/código (`--font-mono`) | **Geist Mono** | OFL — vercel/geist-font | wght 400/500 | `'IBM Plex Mono', ui-monospace, monospace` |

**Por que essa combinação tem assinatura:** Fraunces é uma serif "old-style com ironia" —
em `opsz` alto e `WONK 1` ela fica levemente torta e viva, o que traduz o
*playful-mechanical* da marca sem apelar para gradiente ou cor; é a mesma família de
linguagem (serif expressiva de display) que Railway, Resend e Zed usam para escapar do
visual SaaS. Switzer é grotesk suíça com desenho próprio (não é Inter). Geist Mono dá
voz técnica real ao que hoje é um `.mono` falso (Satoshi com `tabular-nums`).

### 5.1 Regras de uso

- **h1/h2/h3** em Fraunces. Headlines grandes: `opsz` máximo, `wght ~500`,
  `letter-spacing -0.01em`, `line-height 1.02–1.08`. **`WONK 1` em no máximo uma
  palavra-chave por headline** (a palavra "viva" da frase); itálico Fraunces permitido
  para ênfase curta. Nunca WONK em texto corrido.
- **Corpo** Switzer 400, `line-height 1.6`, medida máx. 68ch. UI/labels Switzer 500.
- **Mono** para: numeração de seção/índice da nav, metadados de mídia, legendas de
  viewport, código, leituras de "instrumento". Uppercase mono com tracking ≤ `0.08em`.
- O `.eyebrow` atual (uppercase + traço rosa) morre. Substituto: **índice editorial** —
  número mono (`01`, `02`…) + rótulo mono minúsculo na cor `ink-faint`, alinhado à
  margem esquerda da seção.

### 5.2 Escala fluida (tokens)

| Token | Valor | Uso |
|---|---|---|
| `--text-hero` | `clamp(2.7rem, 7.4vw, 5.8rem)` | h1 do hero |
| `--text-h2` | `clamp(2rem, 4.6vw, 3.5rem)` | títulos de capítulo |
| `--text-h3` | `clamp(1.3rem, 2.2vw, 1.7rem)` | subtítulos/painéis |
| `--text-lede` | `clamp(1.08rem, 1.6vw, 1.3rem)` | parágrafo de abertura |
| corpo | `1rem` (16px mobile mínimo) | texto corrido |
| `--text-label` | `0.78rem` mono | metadados, índices |

Razão da escala ≥ 1.25; hierarquia deve funcionar **sem cor** (teste: página em
grayscale ainda tem hierarquia óbvia).

## 6. Arquitetura da página e composição por seção

**Nova ordem** (altera `src/App.tsx` e `src/lib/chapters.ts`):

`Nav → Hero → Problema → Serviços → Processo → CodeLab → Cases → Equipe → Contato`

Racional: o fio narrativo *ruído → domado → ordenado → dentro da máquina → resultado →
quem faz → conversa*. CodeLab volta para antes dos cases (a máquina roda **antes** de
mostrar o que ela produz). Tons por capítulo (novo campo `tone` em `chapters.ts`, §10.4):

| # | id | Capítulo | tone | theme (nav) |
|---|---|---|---|---|
| 01 | `top` | Hero | `paper` | light |
| 02 | `problema` | Problema | `paper-rose` | light |
| 03 | `servicos` | Serviços | `paper` | light |
| 04 | `processo` | Processo | `paper-lilac` | light |
| 05 | `rode` | CodeLab | `night` | dark |
| 06 | `exemplos` | Cases | `paper` | light |
| 07 | `estudio` | Equipe | `paper-rose` | light |
| 08 | `contato` | Contato | `night` | dark |

Só **duas** batidas escuras (CodeLab e Contato) — o escuro fica raro e valioso. O grid
mestre é de **12 colunas**, container `max-w-[1200px]`, gutter `px-5 sm:px-8`. Toda
seção ancora seu índice editorial (§5.1) na coluna 1.

### 06.1 Nav
Slim (h-16), fixa, fundo `paper-high/85` + `backdrop-blur` só após scroll; hairline
inferior `--color-line`. Esquerda: `Logo` horizontal (variante branca sobre night via
`useChapterTheme`, mantido). Centro/direita: links com prefixo mono (`01 Problema`…),
sublinha de hover = fio de 1px `--color-signal` que desenha da esquerda. CTA "Fale com
a gente" = botão quieto (§9.1). Mobile: painel `paper-high` com hairlines entre links.

### 06.2 Hero — ver §7 (spec completa)

### 06.3 Problema — "o ruído"
Fundo `paper-rose`. Composição editorial em 2 colunas assimétricas
(`lg:grid-cols-[7fr_5fr]`): à esquerda, h2 + parágrafos; à direita, o **gráfico do fio
emaranhado** — um SVG próprio (path única, stroke 1.5px `--color-signal`) que entra
caótico no topo e sai ordenado por baixo da seção, desenhado por scroll
(stroke-dashoffset). Abaixo, o "antes → depois" recomposto **sem janelas mock**: um
**livro-razão tipográfico** — linhas hairline-separadas, coluna esquerda em mono com os
itens do caos (`controle_FINAL_v7(3).xlsx`, `retrabalho manual`, `dado preso no
WhatsApp`…) em `ink-faint` levemente riscados, coluna direita com o estado resolvido em
`ink` + tick `signal-deep`. As 4 dores atuais viram **linhas de lista numeradas**
(mono `01–04` + frase), não grid de ícones.

### 06.4 Serviços — "domando o sinal"
Fundo `paper`. As 3 frentes viram **linhas editoriais de largura total** empilhadas com
hairline entre elas (sem bento): cada linha = `lg:grid-cols-[1fr_6fr_5fr]` → número mono
grande (`01`) · título Fraunces h3 + descrição + lista de capacidades em mono ·
**painel-instrumento** à direita: um viewport escuro pequeno (aspect 4:3, spec de bezel
do §8.2) exibindo uma leitura abstrata do serviço (SVG/CSS puro: forma de onda para
automações, colunas ordenando-se para dados, cursor de terminal para software — nada de
UI falsa). Hover da linha: hairline inferior acende para `--color-signal` (transição
200ms) e o painel ganha `--shadow-signal`.

### 06.5 Processo — "o sinal se ordena"
Fundo `paper-lilac`. Mantém pin + scrub do GSAP. **O próprio fio é a timeline**: um SVG
horizontal que começa ondulado e termina reto, com 3 nós (Diagnóstico / Construção /
Operação). No scrub, o traço se desenha e cada nó "liga" (ponto `--color-signal` +
rótulo mono passa de `ink-faint` a `ink`). Cards não existem: cada etapa é título
Fraunces + parágrafo, dispostos sob seu nó (`md:grid-cols-3`). Mobile: fio vertical na
margem esquerda, etapas empilhadas, sem pin.

### 06.6 CodeLab — "dentro da máquina"
Fundo `night` (primeira batida escura; transição tonal via SceneBackground). Reaproveitar
o IDE interativo existente re-skinnado: chrome nos tokens `night-2`/`night-line`, código
em Geist Mono, temas internos do IDE recalibrados para a paleta nova (o tema "MewStack"
usa `signal-bright` como acento). O IDE é emoldurado como **viewport-mestre** (bezel §8.2
em escala maior, caption mono `LAB — EXECUTÁVEL`). Manter `scaleHandoff` na saída, com
escala contida (§10.5). Texto da seção em `paper-on-night`.

### 06.7 Cases — "o que sai da máquina" — ver §8 (spec completa dos frames)
Fundo `paper`. Mantém a galeria horizontal pinada no desktop (`useHorizontalGallery`) e
scroll-snap nativo no mobile. Header editorial à esquerda (índice + h2 + lede curto) e a
faixa de frames correndo. **As telas fictícias atuais (NFS-e, editor, conciliação) são
removidas**; cada case vira um `MediaFrame` (§8) aguardando captura real.

### 06.8 Equipe — "quem opera"
Fundo `paper-rose`. Sem grid de avatar: **fichas editoriais** em `md:grid-cols-2`
`lg:grid-cols-4`, cada uma: foto retangular **4:5** num frame hairline (`--color-line-strong`,
raio 8px, leve véu tonal `paper-rose` multiply para unificar as fotos), nome em Fraunces,
função em mono `signal-deep`, bio curta em corpo. Sem ring rosa, sem pills de skill —
skills viram uma linha mono única separada por `·`. Placeholder de membro sem foto:
campo tonal `paper-lilac` com iniciais em Fraunces `ink-faint` (nunca círculo tracejado).

### 06.9 Contato — "anoitecer"
Fundo `night` via crossfade lento (o "anoitecer" da página). Grid
`lg:grid-cols-[1.2fr_0.8fr]`: à esquerda, h2 grande Fraunces (`paper-on-night`), lede,
CTAs (WhatsApp = botão de tinta invertida §9.1; e-mail e Instagram = links com sublinha
de fio). **O horizonte de sinal**: uma única linha de 1px `--color-signal` atravessando
a largura total atrás do conteúdo, com halo mínimo (`--shadow-signal`) — é o fio da
página chegando ao destino, substitui o glow-horizonte atual. Direita: wordmark branco
estático (sem float). Footer: hairline `night-line`, wordmark, © ano, domínio, índice
mono das seções.

## 7. Hero em detalhe

**Composição (desktop ≥1024):** grid de 12 colunas, sem centralização.

- **Headline** (h1 Fraunces, `--text-hero`): colunas 1–9, alinhada à esquerda, 2 linhas.
  Uma palavra com `WONK 1` + itálico como assinatura. Sem gradiente; `ink` puro.
- **Lede** (Switzer, `--text-lede`, `ink-soft`, máx. 52ch): colunas 1–5, abaixo da headline.
- **CTAs**: linha abaixo do lede — primário "Fale com a gente" + secundário "Ver o
  processo" (§9.1).
- **Metadados de margem** (mono `--text-label`, `ink-faint`): coluna 12 no topo, vertical
  ou empilhado — `EST. 2024 · POA/BR`, `SOFTWARE · AUTOMAÇÕES · DADOS`. Preenchem a
  margem direita como anotação de prancheta, não como badge.
- **O fio nasce aqui**: path SVG de 1.5px `--color-signal` que desce da nav, contorna a
  headline pela margem esquerda e **entra no palco de vídeo**, desenhado na entrada
  (uma vez, não loop).

**Palco de vídeo (o protagonista):**

| Atributo | Spec |
|---|---|
| Posição | colunas 3–12, começando ~1 linha antes do fim do bloco de texto (o palco desliza por trás da coluna de texto — sobreposição real de camadas, `z` abaixo do texto) |
| Proporção | **16:9 fixa** em todos os breakpoints (mobile: largura total do container) |
| Moldura | bezel de instrumento (§8.2): fundo `--color-night`, hairline `--color-line-strong`, raio 8px, 4 marcas de registro nos cantos (traços em L, 8px, `night-line`), `--shadow-viewport` |
| Régua de legenda | faixa mono de 28px acima do frame, entre hairlines: `MEWSTACK — OPERAÇÃO` à esquerda, `SINAL 01 / AO VIVO` + ponto de estado `--color-signal` à direita |
| Asset esperado | vídeo real do estúdio: mp4/webm h264 1920×1080, 10–20s, loop, sem áudio, ≤6 MB, `preload="none"`, poster obrigatório, play/pause por IntersectionObserver |
| Fallback temporário (até o vídeo existir) | **tratamento 100% gráfico**, sem IA: campo `night` com grão (§10.1), o fio do sinal atravessando o frame como forma de onda SVG animada lentamente (dashoffset, 12s, pausa em reduced-motion), e leituras mono `paper-on-night-soft` nos cantos (`AGUARDANDO SINAL`, coordenadas, timestamp). Deve parecer uma tela de instrumento em standby — bonita e intencional, não uma caixa vazia |
| Reduced-motion | fio estático, sem animação; vídeo futuro não dá autoplay (mostra poster + botão play) |

**Mobile (<768):** headline colunas cheias (4 palavras/linha no máx.), lede, CTAs
empilhados full-width, metadados viram uma linha mono horizontal discreta, palco 16:9
full-width abaixo. Nada de chips, nada de scroll-cue animado (um traço vertical hairline
de 24px basta como convite de scroll).

## 8. Frames de mídia dos cases (`MediaFrame`)

### 8.1 Conteúdo e comportamento

Cada case da galeria horizontal é um `MediaFrame` com legenda técnica. **Nenhuma tela
fictícia**: até existirem capturas reais, o slot mostra o fallback gráfico (§8.3).

| Atributo | Spec |
|---|---|
| Proporção | **16:10** no desktop (largura ~72vw, máx. 960px); **4:3** no mobile (largura ~88vw no scroll-snap) |
| Localização | trilho horizontal da seção Cases; 3–5 frames |
| Asset esperado | screenshot real (png/webp ≥2x) ou screen-recording curto (mp4 ≤4 MB, loop, sem áudio); `object-fit: cover` |
| Legenda | barra mono de 32px **abaixo** do frame, entre hairlines: nome do case (`ink`) · stack (`ink-faint`) · ano · tipo (`AUTOMAÇÃO` / `SISTEMA` / `DADOS` em `signal-deep`) |
| Hover (desktop) | frame ganha `--shadow-signal` e a legenda acende o tipo; sem zoom/scale |

### 8.2 Anatomia do bezel (compartilhada por palco do hero, painéis de serviço e frames de case)

1. Superfície `--color-night` (o conteúdo vive "dentro da máquina").
2. Borda hairline `--color-line-strong` (sobre papel) ou `--color-night-line` (sobre night).
3. Raio fixo **8px** (todos os viewports — consistência de sistema).
4. **Marcas de registro**: 4 traços em L de 8px nos cantos externos, `ink-faint`/`night-line`.
5. Highlight interno de 1px no topo (`oklch(1 0 0 / 0.06)`) — o "vidro".
6. `--shadow-viewport` quando sobre papel.

Componente novo: `src/components/MediaFrame.tsx` (props: `ratio`, `caption`,
`src?`/`videoSrc?`, `standbyLabel`). O bezel é um só código para o site inteiro.

### 8.3 Fallback temporário (sem asset, sem IA)

Campo `night` + grão + **espécime tipográfico**: o nome do case em Fraunces grande
`paper-on-night` cortado pela borda (composição editorial), o fio do sinal cruzando em
diagonal (SVG 1px), e no canto inferior mono `paper-on-night-soft`:
`CAPTURA EM PRODUÇÃO — EM BREVE`. Cada fallback muda apenas o ângulo do fio e o recorte
do título — parecem uma família de capas, não caixas vazias.

## 9. Sistema de componentes

### 9.1 Botões
Raio **6px** (mais retos que os pills atuais), padding `0.7rem 1.15rem`, Switzer 500,
transições 200ms. Sem sheen diagonal, sem lift de sombra grande.

- **Primário** (`.btn-primary`): fundo `ink`, texto `paper`; hover: fundo sobe para
  `oklch(0.30 0.02 300)` + um **ponto de sinal** de 6px acende à esquerda do rótulo.
  Sobre night: inverte (fundo `paper-on-night`, texto `night`).
- **Quieto** (`.btn-ghost`): hairline `--color-line-strong`, fundo transparente; hover:
  fundo `--color-signal-ghost` + hairline vira `signal`.
- **Focus-visible (global)**: outline 2px `--color-signal` offset 2px — o rosa como
  estado de interface, sempre.
- Área de toque mínima 44×44px; `cursor-pointer` em tudo que é clicável.

### 9.2 Superfícies
Sem `.card` genérico. Três superfícies apenas: **papel** (fundo de seção), **painel**
(`paper-high` + hairline + `--shadow-soft`, raio 8px — usar raramente) e **viewport**
(§8.2). Divisões internas por hairline, não por caixas.

### 9.3 Links e microdetalhes
Links de texto: sublinha 1px `--color-line-strong` que anima para `--color-signal`
(background-size, 200ms). Pontos de estado (`.signal-dot`): 6px `--color-signal`, com
`ping` **apenas** no palco do hero e no contato — não em toda seção (o `.live-dot`
espalhado morre). Marcas de medição (traços hairline + número mono na margem) podem
pontuar 2–3 seções, nunca todas.

### 9.4 Nav e cursor
Nav conforme §6.1. `Cursor.tsx` (anel rosa) é **removido** — com o fio e os estados de
sinal, o cursor custom vira redundância; o sistema deve ser sentido no conteúdo, não
no ponteiro.

## 10. Textura, luz, sombra, fundos e motion

### 10.1 Grão de papel
Um único utilitário `.grain` novo: noise SVG (feTurbulence embutido em data-URI) em
overlay ≤3% de opacidade sobre papel, ≤5% sobre night. Aplicado no `SceneBackground`
(global, uma vez) — não por seção. O `.grid-lines` atual morre; réguas de medição
pontuais (§9.3) assumem o papel técnico.

### 10.2 Luz
A página é iluminada "de cima": vinhetas radiais tonais quase imperceptíveis
(ΔL ≤ 0.02) no topo dos capítulos claros. Reflexos de sinal: quando o fio passa perto
de um painel, o painel pode ter um `box-shadow` interno rosa de alpha ≤0.06 — luz
emprestada, não glow.

### 10.3 Bordas
Hairlines fazem todo o trabalho estrutural (herança boa do site atual — manter a
disciplina). Espessura 1px sempre; nunca 2px decorativo.

### 10.4 Fundo reativo multi-tom
`SceneBackground` evolui de binário (cream↔charcoal) para **4 camadas tonais**
(`paper`, `paper-lilac`, `paper-rose`, `night`) com crossfade de opacidade conduzido
pelo novo campo `tone` de `CHAPTERS` (`useSceneBackground` passa a ler `tone`).
Transições ~0.8s entre papéis, ~1.1s para entrar/sair de night. Reduced-motion: troca
instantânea.

### 10.5 Motion (recalibrar `MOTION` em `src/lib/motion.ts`)
Manter a arquitetura de capítulos GSAP + Lenis. Recalibrar o dial para **menos teatro,
mais precisão**:

- `exitBlur: 5 → 0` (blur de saída morre), `exitScale: 0.96 → 0.985`,
  `exitOpacity: 0.34 → 0.5`, `revealY: 64 → 36`, `revealScale: 0.94 → 0.98`,
  `handoffScale: 1.12 → 1.05`, magnetic `strength: 0.28 → 0.12` (só CTAs do contato)
  — valores de partida; ajustar a olho.
- Reveals de título continuam por linha (SplitText) — é assinatura boa.
- **Gesto novo e único do redesign: o desenho do fio** (stroke-dashoffset por scroll,
  Hero/Problema/Processo/Contato). Um gesto por seção no máximo (§3.11).
- `prefers-reduced-motion`: tudo estático e visível — sem pin, sem split, sem desenho
  de fio (fio renderiza completo), sem autoplay, sem ping.

## 11. Diretrizes responsivas

**Desktop (≥1024):** grid 12 col, sobreposições de camada do hero ativas, galeria
horizontal pinada, painéis-instrumento à direita das linhas de serviço, hover states
completos.

**Tablet (768–1023):** grid cai para 8 col; hero mantém alinhamento à esquerda com
palco full-width abaixo do texto (sem sobreposição); linhas de serviço viram
`[1fr_7fr]` com painel-instrumento abaixo do texto (aspect 16:9); galeria horizontal
ainda pinada; equipe em 2 col.

**Mobile (360–767):** tudo em 1 col, fio vertical na margem esquerda como guia
contínuo; galeria vira scroll-snap nativo (frames 4:3); processo vertical sem pin;
tipografia respeita mínimos (corpo 16px); alvos de toque ≥44px; **zero overflow
horizontal em 360px** (medir de verdade; lembrar `min-w-0` em filhos de flex).

## 12. Mapeamento de arquivos

| Arquivo | Ação |
|---|---|
| `src/index.css` | reescrita: tokens §4, @font-face §5, utilitários novos (`.signal-dot`, `.grain` novo, índice editorial); **remover** `.aurora`, `.text-gradient`, `.live-dot`, `.grid-lines`, `.card`, `.eyebrow`, `.console`, `.win-dot`, `.cursor-dot`, sheen dos botões |
| `index.html` | remover CDN Fontshare; preload de Fraunces/Switzer/Geist Mono woff2 |
| `public/fonts/` | **novo** — woff2 das 3 famílias |
| `src/lib/chapters.ts` | nova ordem §6 + campo `tone` |
| `src/lib/motion.ts` | dial recalibrado §10.5 |
| `src/lib/useSceneBackground.ts` + `src/components/SceneBackground.tsx` | multi-tom §10.4 + grão global |
| `src/components/MediaFrame.tsx` | **novo** — bezel/viewport §8.2 |
| `src/components/SignalLine.tsx` | **novo** — path SVG do fio com desenho por scroll (reduced-motion: estático) |
| `src/components/Cursor.tsx` | **remover** (e uso no App) |
| `src/components/Mascot.tsx` + `public/mascot/` | **remover** (mascote só via `Logo.tsx`/favicon) |
| `src/App.tsx` | nova ordem de seções; remoção do Cursor |
| `src/sections/*.tsx` (todas) | recompor conforme §6–§8; `Showcase.tsx` perde `NfseScreen`/`EditorScreen`/`ReconcileScreen` |
| `src/lib/useChapter.ts`, `useHorizontalGallery.ts`, `useMagnetic.ts`, `useChapterTheme.ts`, `gsap.ts` | **manter** (ajustes de parâmetro apenas) |
| `CLAUDE.md` / `DESIGN.md` | atualizar ao final para refletir este documento (evitar instruções conflitantes no repo) |

## 13. Critérios de aceite visual

A implementação só está pronta quando **todos** passarem, verificados na tela
(screenshots 360 / 768 / 1024 / 1440):

1. Nenhum fundo `#FFFFFF` puro e nenhum fundo do cinza neutro antigo — todo fundo tem
   temperatura (checar computed styles).
2. Hero: headline alinhada à esquerda em grid assimétrico; palco de vídeo presente e
   **bonito sem asset** (standby gráfico §7); nenhum chip flutuante.
3. Rosa: nenhuma área sólida > 24px de altura; nenhum texto pequeno rosa sobre claro;
   focus-visible rosa funcionando em todos os interativos (testar por teclado).
4. Só 2 capítulos escuros (CodeLab, Contato) + viewports pontuais; o escuro é
   violeta-noite, não `#262626`.
5. Tipografia: Fraunces/Switzer/Geist Mono self-hosted carregando (Network sem
   Fontshare); hierarquia legível em grayscale; corpo ≥16px no mobile.
6. Zero telas fictícias/mock de UI: todos os slots de mídia usam `MediaFrame` com
   fallback §8.3.
7. Zero overflow horizontal em 360/768/1024/1440 (medir `document.documentElement.scrollWidth`).
8. Contraste AA: `ink-soft` sobre os 3 papéis ≥4.5:1; `paper-on-night-soft` sobre night ≥4.5:1.
9. `prefers-reduced-motion`: página completa e estática, sem pin/split/loop/autoplay.
10. `npm run build` limpo (TS + bundle); sem imports de `Mascot`/`Cursor` órfãos.
11. O fio do sinal existe e conecta Hero → Problema → Processo → Contato (visível como
    elemento contínuo da identidade, desenhado por scroll no desktop).
12. Nenhum utilitário morto (`.aurora`, `.text-gradient`, `.live-dot`, `.console`,
    `.eyebrow`, `.grid-lines`) remanescente no CSS ou em componentes.

## 14. Decisões que substituem o design atual

Regras antigas (CLAUDE.md / DESIGN.md / PRODUCT.md) **revogadas por este documento**:

1. **Paleta fixa `#FF7BAC · #262626 · #F2F2F2`** → substituída pela paleta tonal §4
   (o rosa permanece como `--color-signal`; o carvão neutro e o cinza claro neutro morrem).
2. **Tokens `--color-cream*` / `--color-night*` antigos** → renomeados/reavaliados §4.6.
3. **Clash Display + Satoshi via Fontshare CDN** → Fraunces + Switzer + Geist Mono
   self-hosted §5.
4. **"O mascote é a marca" / mascote como personagem recorrente** → mascote **apenas**
   em `Logo.tsx` e favicon. `Mascot.tsx` e `public/mascot/` saem do projeto.
5. **Mapa de seções fixo com Accounting/vídeo contábil e ritmo claro↔carvão com 3–4
   batidas dark** → nova ordem e novo ritmo tonal §6 (2 batidas night + viewports).
6. **Hero centralizado com chips de automação flutuantes e aurora** → hero editorial
   assimétrico com palco de vídeo §7.
7. **`.aurora`, `.text-gradient`, `.live-dot` espalhado, `.eyebrow` com traço rosa,
   `.grid-lines`, `.console`/`.win-dot` (janelas mac fake), sheen de botão, cursor
   custom** → removidos (substitutos em §9–§10).
8. **Telas fictícias da Showcase (NFS-e/editor/conciliação) e pipeline
   Higgsfield/Seedance para mídia** → mídia só real, produzida pelo usuário; até lá,
   fallbacks gráficos §7/§8.3. Nenhuma mídia gerada por IA.
9. **"Mostre interface real (mock)"** → reinterpretada: mostrar interface **real de
   verdade** (capturas) quando existir; nunca mock inventado.
10. **Sombras neutras + `--shadow-glow` rosa** → sombras tingidas §4.5, glow apenas
    como estado de interação.

Regras antigas que **permanecem** (não conflitam):

- White mode como base; sem dark mode global (§15).
- Acessibilidade WCAG 2.1 AA, `prefers-reduced-motion` integral, navegação por teclado,
  landmarks semânticos, PT-BR.
- Stack e arquitetura de motion: GSAP/ScrollTrigger/SplitText via `src/lib/gsap.ts`,
  Lenis, dial único `MOTION`, sistema de capítulos, sem framer-motion.
- Zero overflow horizontal; `npm run build` limpo; verificação visual em 4 larguras.
- Marcas oficiais via `Logo.tsx`; lucide-react para ícones; TypeScript estrito;
  Tailwind v4 com tokens no `@theme`.
- Copy específica por seção, sem repetição verbatim; subtrair > decorar.

## 15. White mode — reafirmação

O site é e continua sendo **claro**. Não existe dark mode global, toggle de tema ou
`prefers-color-scheme` invertendo a página. O escuro (violeta-noite) existe somente
como **matéria pontual** — viewports de mídia, o capítulo CodeLab e o anoitecer do
Contato — sempre emoldurado pelo papel claro que domina a experiência.
