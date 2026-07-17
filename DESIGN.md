# Design

## Direção

O sistema atual é **Sinal & Papel**. A especificação completa e os critérios de
aceite vivem em `REDESIGN-PLAN.md`, que tem precedência visual sobre documentos
anteriores. Este arquivo registra apenas a leitura operacional:

- **Papel:** superfícies claras tonais (`paper`, `paper-rose`, `paper-lilac`).
- **Máquina:** viewports e os capítulos CodeLab/Contato em violeta-noite.
- **Sinal:** linha rosa contínua, usada como energia e estado, nunca como grande
  bloco de preenchimento.

Não existe dark mode global. O fundo reativo acompanha o campo `tone` de
`src/lib/chapters.ts`.

## Tipografia

- **Fraunces variável:** títulos; `opsz` alto e `WONK` apenas na palavra-assinatura.
- **Switzer:** corpo, UI e controles.
- **Geist Mono:** código, índices e leituras técnicas.

As três famílias são self-hosted em `public/fonts/`. Tamanhos e cores são tokens
do `@theme` em `src/index.css`; não hardcode valores nos componentes.

## Componentes e materiais

- `MediaFrame.tsx` é o bezel único para hero, instrumentos, CodeLab e cases.
- `SignalLine.tsx` desenha o fio e entrega fallback estático em reduced-motion.
- `Logo.tsx` é o único lugar onde o mascote aparece, além do favicon.
- Índices editoriais substituem eyebrows; hairlines substituem cards genéricos.
- Slots sem mídia mostram fallbacks gráficos honestos. Não criar mock de produto
  ou pessoa por IA.

## Layout e motion

Grid mestre de 12 colunas, `max-width: 1200px`, gutters `px-5 sm:px-8`.
Ordem narrativa:

`Hero → Problema → Serviços → Processo → CodeLab → Cases → Equipe → Contato`

GSAP, ScrollTrigger, SplitText e Lenis permanecem. `MOTION` é o dial único.
Títulos revelam por linha; o fio é o gesto principal; Processo e Cases pinam no
desktop. Em `prefers-reduced-motion`, não há pin, split, loop ou autoplay.
