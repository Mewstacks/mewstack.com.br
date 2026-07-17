# MewStack — guia de implementação

One-pager de credibilidade do estúdio MewStack. Leia `PRODUCT.md`, `DESIGN.md` e
`REDESIGN-PLAN.md`; o plano é a fonte da verdade visual.

## Stack e comandos

- React 18 + TypeScript + Vite 6 + Tailwind v4 CSS-first.
- GSAP + ScrollTrigger + SplitText, Lenis e lucide-react. Sem framer-motion.
- Rodar: `npm run dev`. Buildar: `npm run build`.
- `vite.config.ts` lê `PORT` do ambiente com fallback 5173.

## Arquitetura

- `src/lib/gsap.ts`: registro único; nunca importe GSAP direto em outro arquivo.
- `src/lib/motion.ts`: dial único de timing e intensidade + `reduceMotion()`.
- `src/lib/chapters.ts`: ordem, `theme` da nav e `tone` do fundo.
- `src/lib/useChapter.ts`: reveals por linha/stagger e handoffs.
- `useSceneBackground.ts` + `SceneBackground.tsx`: crossfade entre quatro tons.
- `useHorizontalGallery.ts`: Cases pinado no desktop e scroll-snap no fallback.
- `MediaFrame.tsx`: bezel compartilhado; `SignalLine.tsx`: fio com fallback estático.

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

## Ordem fixa

`Nav → Hero → Problem → Capabilities → Process → CodeLab → Showcase → About → Contact`

Tons: `paper → paper-rose → paper → paper-lilac → night → paper → paper-rose → night`.
Somente CodeLab e Contato são capítulos escuros.
