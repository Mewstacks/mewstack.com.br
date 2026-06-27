# MewStack — guia para o Claude

One-pager de credibilidade do estúdio MewStack (software, automações & dados).
A régua aqui é alta: o site tem que parecer feito por um **estúdio de produto**, não
por um gerador. Leia também:

- **`PRODUCT.md`** — marca, público, voz, princípios, anti-referências, acessibilidade.
- **`DESIGN.md`** — design system (cores OKLCH, tipografia, motion, layout).

Não duplique o conteúdo desses dois; siga-os.

## Stack & comandos

- **React 18 + TypeScript + Vite 6 + Tailwind v4** (CSS-first, `@theme` em `src/index.css`).
- **framer-motion** (animação), **lenis** (scroll suave), **lucide-react** (ícones).
- Rodar: `npm run dev` · Buildar: `npm run build` (faz `tsc -b` + `vite build`).
- `vite.config.ts` lê `PORT` do ambiente (fallback 5173) — não remova.

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

- **Paleta fixa, light mode:** `#FF7BAC` rosa · `#262626` carvão · `#F2F2F2` claro.
  Tokens em OKLCH no `@theme`. **Não** mude as cores nem vá pra dark mode.
- **Contraste (AA):** rosa `#FF7BAC` **nunca** é texto pequeno em fundo claro — use
  `--color-pink-deep`. Pink claro só em carvão.
- **Fontes:** Clash Display (títulos) + Satoshi (corpo).
- **Reutilize os utilitários** já definidos em `index.css`: `.btn`/`.btn-primary`/`.btn-pink`/
  `.btn-ghost`, `.card`, `.eyebrow`, `.console`, `.mono`. Não recrie variações soltas.
- Ícones: **lucide-react**. Animações de entrada: componente `Reveal` (já trata reduced-motion).

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

## Mapa das seções (`src/App.tsx`)

`Nav → Hero` (mockup NFS-e) `→ Pillars` (FIG 01/02/03) `→ CodeLab` (IDE Python executável)
`→ Capabilities → Process → Projects → About → Contact`.
