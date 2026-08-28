# MewStack — guia de implementação

One-pager de credibilidade do estúdio MewStack. Leia `PRODUCT.md`, `DESIGN.md` e
`REDESIGN-PLAN.md`; o plano é a fonte da verdade visual.

## Stack e comandos

- React 18 + TypeScript + Vite 6 + Tailwind v4 CSS-first.
- GSAP + ScrollTrigger + SplitText, Lenis e lucide-react. Sem framer-motion.
- Rodar: `npm run dev`. Buildar: `npm run build` (`tsc -b` + `vite build` +
  `scripts/prerender.mjs`).
- `vite.config.ts` lê `PORT` do ambiente com fallback 5173.

## Arquitetura

- `src/lib/gsap.ts`: registro único; nunca importe GSAP direto em outro arquivo.
- `src/lib/motion.ts`: dial único de timing e intensidade + `reduceMotion()`.
- `src/lib/chapters.ts`: ordem, `theme` da nav e `tone` do fundo.
- `src/lib/useChapter.ts`: reveals por linha/stagger e handoffs.
- `useSceneBackground.ts` + `SceneBackground.tsx`: crossfade entre quatro tons.
- `useHorizontalGallery.ts`: Cases pinado no desktop e scroll-snap no fallback.
- `MediaFrame.tsx`: bezel compartilhado; `SignalLine.tsx`: fio com fallback estático.

## Prerender e rotas

O build gera HTML estático de cada rota com Playwright — sem isso o site serve uma
casca vazia e não é indexável.

- `scripts/prerender.mjs` sobe `vite preview`, abre cada rota com
  `reducedMotion: "reduce"` e serializa o DOM. Funciona porque sob reduced-motion
  `useChapter` e `Capabilities` saem cedo: headings inteiros, terminal intacto,
  nada em `opacity: 0`.
- **Rota nova precisa estar linkada de dentro do site.** O prerender descobre
  rotas rastreando `a[href]` a partir das sementes em `scripts/routes.mjs`. Página
  não linkada não é prerenderizada e responde 404 — de propósito.
- `src/components/Seo.tsx` reescreve title/description/canonical/JSON-LD por rota
  num layout effect, que é o que o snapshot captura.
- Conteúdo das páginas de serviço em `src/lib/services.ts`; schema em
  `src/lib/schema.ts`; template em `src/pages/ServicePage.tsx`.
- `index.html` tem uma **guarda de paint** (`html.booting`) que esconde só o que o
  GSAP anima até o React montar. Sem ela o conteúdo prerenderizado pisca. O
  prerender remove a classe do arquivo — nunca deixe ela vazar pro HTML.
- `public/.htaccess` não tem mais catch-all SPA: caminho desconhecido dá 404 real.

## Fluxo inegociável

1. Mudança visual exige inspeção em 360, 768, 1024 e 1440 px.
2. `npm run build` precisa passar limpo.
3. Meça e elimine overflow horizontal em todas as larguras.
4. `prefers-reduced-motion` entrega a página completa sem pin, split, loop ou autoplay.
5. Só afirme conclusão depois de verificar na tela.

## Diretrizes

- Subtrair é melhor que decorar. Hairlines estruturam; sombras são discretas.
- Não use fundos brancos puros, auroras, texto em gradiente, cards genéricos ou
  áreas grandes preenchidas de rosa.
- Mídia de produto só é real. Enquanto não existe, use o fallback gráfico de
  `MediaFrame`; não invente dashboard.
- Copy é específica por capítulo e explica o que o visitante controla ou recebe.
- Componentes usam tokens de `src/index.css`; ícones significativos vêm de Lucide.
- Reveals usam `data-reveal`/`data-reveal-title`; não existe componente `Reveal`.
- O mascote aparece apenas por `Logo.tsx` e favicon.

## Convenções e armadilhas

- TypeScript estrito; Tailwind v4 sem `tailwind.config.js`.
- Seções em `src/sections/`, primitivos em `src/components/`.
- Flex rolável precisa de `min-w-0`.
- Lenis controla scroll programático; use sua instância para âncoras.
- `overflow-x: clip` não substitui a medição real de `scrollWidth`.
- Linhas de tabela independentes precisam de colunas explicitamente dimensionadas.
- `data-reveal-title` (SplitText linha a linha) é disparado por scroll: num
  heading que já nasce dentro da viewport ele trava no meio. Acima da dobra use
  `data-reveal`.
- Heading dentro de `figcaption` herda a fonte display pela regra global de
  `h1..h4`; `index.css` já anula isso para a legenda continuar em mono.

## Ordem fixa

`Nav → Hero → Problem → Capabilities → Process → CodeLab → Showcase → About → Contact`

Tons: `paper → paper-rose → paper → paper-lilac → night → paper → paper-rose → night`.
Somente CodeLab e Contato são capítulos escuros.
