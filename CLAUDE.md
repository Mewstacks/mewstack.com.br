# MewStack — guia para o Claude

One-pager de credibilidade do estúdio MewStack (software, automações & dados).
A régua aqui é alta: o site tem que parecer feito por um **estúdio de produto**, não
por um gerador. Leia também:

- **`PRODUCT.md`** — marca, público, voz, princípios, anti-referências, acessibilidade.
- **`DESIGN.md`** — design system (cores OKLCH, tipografia, motion, layout).

Não duplique o conteúdo desses dois; siga-os.

## Stack & comandos

- **React 18 + TypeScript + Vite 6 + Tailwind v4** (CSS-first, `@theme` em `src/index.css`).
- **GSAP + ScrollTrigger + SplitText** (animação/scroll cinematográfico), **lenis** (scroll
  suave, em ponte com o ScrollTrigger), **lucide-react** (ícones). **Sem framer-motion.**
- Rodar: `npm run dev` · Buildar: `npm run build` (faz `tsc -b` + `vite build`).
- `vite.config.ts` lê `PORT` do ambiente (fallback 5173) — não remova.

### Arquitetura de motion (o sistema de "capítulos")

- `src/lib/gsap.ts` — registro único de GSAP + ScrollTrigger + SplitText. **Importe daqui**,
  nunca de `"gsap"` direto (evita dupla-registração).
- `src/lib/motion.ts` — `MOTION`, o **dial único** de timing/intensidade. Ajuste aqui;
  nada mais hardcoda valores. Também exporta `reduceMotion()`.
- `src/lib/chapters.ts` — `CHAPTERS`: ordem + `theme` ("light" | "dark") de cada seção.
  **Fonte da verdade** para a nav e para o fundo reativo.
- `src/lib/useChapter.ts` — transforma uma seção em capítulo (enter→hold→exit) só com
  atributos: `data-reveal-title` (reveal por LINHA via SplitText), `data-reveal` (stagger),
  `data-parallax`. Variantes de saída: `recede` | `scaleHandoff` (`[data-handoff]`) | `wipe`.
- `src/lib/useSceneBackground.ts` + `components/SceneBackground.tsx` — fundo global que faz
  crossfade cream↔charcoal conforme o capítulo no centro da viewport (lê `theme`).
- `src/lib/useChapterTheme.ts` — tema do capítulo sob a nav; a `Nav` inverte contraste sobre
  seções charcoal.
- `src/lib/useMagnetic.ts` — hover magnético (escopo + seletor; desktop/pointer-fine).
- `src/lib/useHorizontalGallery.ts` — Showcase: scroll vertical vira track horizontal (pin).

## Fluxo inegociável (toda mudança)

1. **Verifique na tela, sempre.** Mudou algo visual → rode o app e tire screenshot
   (Preview MCP ou Playwright MCP), **desktop e mobile**: 360 / 768 / 1024 / 1440.
   Não confie que "deve estar certo" — olhe.
2. **`npm run build` tem que passar limpo** (TS + bundle) antes de encerrar.
3. **Zero overflow horizontal** em qualquer largura. O usuário nunca deve rolar de lado.
4. **`prefers-reduced-motion`**: toda animação precisa de fallback (sem loop infinito).
5. Não invente "pronto" — só afirme depois de ver funcionando.

## Frontend com excelência — o que evita "cara de IA"

Estes são os princípios que diferenciam premium de genérico. Sigam à risca:

- **Subtrair > decorar.** Site de IA empilha efeitos (auroras, glows, linhas, spotlights,
  pontinhos pulsando). Restrinja. Bordas **hairline** (`--line`) fazem o trabalho no lugar
  de sombras pesadas — é o tell do Linear/Supabase.
- **Produto > metáfora.** Mostre interface real (o console NFS-e do Hero, o IDE Python),
  não diagramas decorativos. Todo visual deve comunicar algo concreto.
- **Copy específica, sem repetir.** Cada seção tem um ângulo próprio. Nunca repita a mesma
  frase ("PDF/CSV → vira decisão") verbatim em várias seções — é o maior tell que sobra.
- **Tipografia faz a hierarquia.** Gradiente só pontual e sutil, sempre na paleta.
- **Referências de linguagem:** Linear, Supabase, Cursor — capture o ritmo/respiro/restrição,
  **nunca clone**. Adapte à identidade MewStack.
- **Espaçamento moderado.** Respiro intencional, mas compacto e coeso — não esticado.

## Design system (resumo — detalhe em `DESIGN.md`)

- **Paleta fixa:** `#FF7BAC` rosa · `#262626` carvão · `#F2F2F2` claro. Tokens em OKLCH no
  `@theme`. **Não** mude as cores nem introduza dark mode global. O site é claro por padrão,
  com **batidas charcoal intencionais** ("sala de máquinas") em capítulos marcados como
  `theme: "dark"` no `chapters.ts` (hoje: Capabilities, CodeLab, Accounting e Contact) —
  esse é o ritmo claro↔carvão da narrativa, não um tema escuro. Sobre carvão use
  `--color-paper`/`--color-pink-bright`.
- **Contraste (AA):** rosa `#FF7BAC` **nunca** é texto pequeno em fundo claro — use
  `--color-pink-deep`. Pink claro só em carvão.
- **Fontes:** Clash Display (títulos) + Satoshi (corpo).
- **Reutilize os utilitários** já definidos em `index.css`: `.btn`/`.btn-primary`/`.btn-pink`/
  `.btn-ghost`, `.card`, `.eyebrow`, `.console`, `.mono`. Não recrie variações soltas.
- Ícones: **lucide-react**. Reveals de entrada: atributos `data-reveal`/`data-reveal-title` +
  `useChapter` (trata reduced-motion). Não existe componente `Reveal`.

## Convenções de código

- TypeScript estrito; siga o estilo dos componentes vizinhos.
- Tailwind v4 (sem `tailwind.config.js` — tokens vivem no `@theme`).
- Antes de instalar lib nova, avise/justifique.
- Seções em `src/sections/`, primitivos em `src/components/`. Marcas oficiais via `Logo.tsx`.

## Armadilhas já conhecidas

- **Flex que rola precisa de `min-w-0`** no filho — senão estoura a largura (clássico bug de overflow).
- **Lenis sequestra o scroll programático.** `window.scrollTo` é resetado; use a instância do Lenis.
- `body` tem `overflow-x: clip` — esconde overflow lateral, mas continue medindo pra não criar.
- Tabelas/grids: para colunas alinharem entre linhas, use **larguras de coluna explícitas**
  (cada linha é um grid independente; `auto` não alinha entre linhas).

## Mapa das seções (`src/App.tsx`) — ordem fixa

`Nav → Hero` (abertura cinematográfica + chips de automação + mascote flutuando) `→ Problem`
(antes→depois, banda branca com grid) `→ Capabilities` (3 frentes como painéis de sistema,
**charcoal** — 1ª batida dark) `→ CodeLab` (IDE Python executável, **charcoal**) `→ Process`
(timeline pinada/scrubbed, 5 etapas, mascote viaja o trilho) `→ Accounting` (vídeo demo de
automação contábil, **charcoal**) `→ Showcase` (galeria horizontal de telas reais) `→ About`
(time) `→ Contact` (CTA, **charcoal** com glow-horizonte próprio).

Ritmo de tom no scroll: claro → **carvão** (Capabilities→CodeLab, ato dark sustentado) →
claro → **carvão** (Accounting) → claro → **carvão** (Contact). A antiga seção "Benefits"
(eyebrow "na prática") foi removida — duplicava o antes→depois do Problem.

### Mascote (`src/components/Mascot.tsx`)

Personagem 3D **original** (criatura-espírito rosa `#FF7BAC` com headset charcoal — design
próprio, sem derivar de IP existente), criado no Higgsfield: design-mestre no Nano Banana 2,
poses por image-reference, cutout pelo background remover do Higgsfield. Servido de
`public/mascot/mascot-<pose>.webp` (480px, 32–39 KB). Poses em uso: `idle` (Hero), `looking`
(Problem, Showcase), `focused` (CodeLab), `pointing` (Process — viaja sobre o trilho no
scrub do pin — e Accounting), `focused`→`celebrating` com swap por ScrollTrigger na
Capabilities, `celebrating` (Contact); `waving`/`three-quarter`/`side`/`back`/`headset-close`
ficam como character sheet. Sempre decorativo (`aria-hidden`, `alt=""`), flutuação idle via
`.animate-float` (congela sob reduced-motion; o swap vira pose final estática). Desktop-only
(`hidden lg:block`/`xl:block`). Não empilhe transform estático no `className` do Mascot (o
float sobrescreve) — flips/offsets vão num wrapper.

### Vídeo contábil (`src/sections/Accounting.tsx`)

`public/media/contabil.mp4` (10s, 1440w, ~370 KB, h264 24fps, sem áudio) + poster webp.
`preload="none"`, play/pause via IntersectionObserver, e sob reduced-motion renderiza a
imagem estática no lugar do vídeo. Pipeline Higgsfield: screenshot da tela NFS-e real da
Showcase → Nano Banana expande para dashboard completo (PT-BR, paleta da marca) →
**Seedance 2.0** image-to-video (start_image, 1080p std) → ffmpeg crf 33, escala 1440w.
O loop emenda bem (progresso ~62% no primeiro frame e ~60% no último).
