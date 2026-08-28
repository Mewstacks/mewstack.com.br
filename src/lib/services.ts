/* One entry per service page. Each page has to answer a different question, so
   the copy is written per service rather than templated — a page that reads as
   a filled-in form ranks like one. Nothing here claims work that was not done:
   the proof images are the same real captures the Showcase uses. */

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type Service = {
  slug: string;
  /** Nav/link label. Short. */
  label: string;
  /** <title>. Aim for 55-60 characters. */
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  lede: string;
  /** What the visitor recognises as their own situation. */
  friction: { title: string; items: string[] };
  /** What actually gets delivered. */
  scope: { title: string; items: { name: string; detail: string }[] };
  proof?: { src: string; width: number; height: number; alt: string; caption: string };
  faq: ServiceFaq[];
};

export const SERVICES: Service[] = [
  {
    slug: "automacao-de-processos",
    label: "Automação de processos",
    metaTitle: "Automação de processos sob medida | MewStack",
    metaDescription:
      "Rotinas manuais que passam a rodar sozinhas: coleta, conferência, digitação e envio. Automação sob medida para a operação que você já tem.",
    eyebrow: "automação",
    h1: "A tarefa que se repete toda semana não precisa de você.",
    lede: "Coletar, conferir, digitar, renomear, enviar. Toda operação tem um punhado de rotinas que consomem horas e não admitem erro. Elas viram software.",
    friction: {
      title: "Onde o tempo vai embora toda semana",
      items: [
        "Alguém abre o mesmo sistema todo dia para copiar os mesmos campos.",
        "Planilha que só uma pessoa sabe atualizar, e ninguém mexe quando ela falta.",
        "Conferência manual que descobre o erro depois que ele já saiu.",
        "Relatório que existe, mas alguém precisa montar à mão para ele existir.",
      ],
    },
    scope: {
      title: "O que entra numa automação sob medida",
      items: [
        {
          name: "Rotinas agendadas",
          detail:
            "O processo roda no horário combinado, sozinho, e avisa quando termina ou quando algo sai do esperado.",
        },
        {
          name: "Leitura de documento",
          detail:
            "PDF, planilha, e-mail e exportação de sistema legado viram dado estruturado, sem redigitação.",
        },
        {
          name: "Regras de conferência",
          detail:
            "A validação que hoje está na cabeça de alguém vira condição explícita, aplicada sempre igual.",
        },
        {
          name: "Registro do que rodou",
          detail:
            "Histórico do que foi processado, quando e com que resultado. Auditável, não uma caixa-preta.",
        },
      ],
    },
    faq: [
      {
        question: "Preciso trocar os sistemas que já uso?",
        answer:
          "Não. A automação se encaixa no que já existe. Trocar tudo é caro, demorado e quase nunca é o que resolve o problema que te trouxe aqui.",
      },
      {
        question: "E quando o processo mudar?",
        answer:
          "O que muda com frequência fica em configuração, não em código, e a gente combina antes o que precisa ser ajustável. Mudança estrutural entra como manutenção.",
      },
      {
        question: "Quanto tempo leva?",
        answer:
          "Uma rotina isolada costuma ir ao ar em semanas, não meses. O prazo real sai depois do diagnóstico, quando dá para ver quantas exceções o processo tem.",
      },
    ],
  },
  {
    slug: "sistemas-sob-medida",
    label: "Sistemas sob medida",
    metaTitle: "Sistemas e software sob medida para empresas | MewStack",
    metaDescription:
      "Sistema desenhado para o jeito que a sua operação funciona, no lugar da planilha esticada e do software genérico adaptado na marra.",
    eyebrow: "sistemas",
    h1: "Quando a planilha vira o sistema, o sistema vira o problema.",
    lede: "Toda operação começa com uma planilha. Ela funciona até virar dez abas, cinco versões e uma pessoa que sabe onde está o quê. A partir daí, o custo de mantê-la é maior que o de substituí-la.",
    friction: {
      title: "Sinais de que a planilha passou do ponto",
      items: [
        "Duas pessoas editam a mesma planilha e ninguém sabe qual versão vale.",
        "O sistema pronto que vocês compraram atende metade do processo, e a outra metade virou gambiarra.",
        "Informação sobre o mesmo cliente mora em quatro lugares diferentes.",
        "Ninguém consegue responder onde um pedido está sem perguntar para alguém.",
      ],
    },
    scope: {
      title: "O que entra num sistema sob medida",
      items: [
        {
          name: "Aplicação web",
          detail:
            "Acesso por navegador, sem instalação, com permissão por pessoa e por papel.",
        },
        {
          name: "Fluxo do seu jeito",
          detail:
            "As etapas, os campos e as regras são as da sua operação, não as do template de alguém.",
        },
        {
          name: "Histórico e responsabilidade",
          detail:
            "Quem fez o quê e quando. O registro para de depender de memória e de conversa.",
        },
        {
          name: "Entra em produção de verdade",
          detail:
            "Deploy, backup, monitoramento e suporte depois do lançamento. Django, React e Docker.",
        },
      ],
    },
    proof: {
      src: "/media/cases/plataforma-tributaria.webp",
      width: 1918,
      height: 991,
      alt: "Aplicação web tributária com acesso a uma plataforma fiscal e ferramentas para validação e adaptação",
      caption: "PLATAFORMA TRIBUTÁRIA",
    },
    faq: [
      {
        question: "O sistema fica sendo de vocês?",
        answer:
          "O código é seu. A gente entrega o repositório e a infraestrutura documentada, e nada fica preso a nós por design.",
      },
      {
        question: "Dá para começar pequeno?",
        answer:
          "É o recomendado. Sobe a parte que dói mais, ela entra em uso, e o resto cresce em cima de algo que já provou que funciona.",
      },
      {
        question: "E o que já existe na planilha?",
        answer:
          "Migra. O histórico entra no sistema na primeira carga, e a planilha para de ser a fonte da verdade no dia da virada, não seis meses depois.",
      },
    ],
  },
  {
    slug: "integracao-de-sistemas",
    label: "Integração de sistemas",
    metaTitle: "Integração de sistemas e APIs | MewStack",
    metaDescription:
      "Ferramentas que não se falam passam a trocar informação sozinhas. Integração via API entre ERP, planilhas, e-mail e sistemas internos.",
    eyebrow: "integração",
    h1: "Entre um sistema e outro, hoje, tem uma pessoa.",
    lede: "O ERP não fala com a planilha, que não fala com o sistema do cliente. Alguém no meio copia de um lado e cola no outro. Essa pessoa é a integração, e ela erra, adoece e tira férias.",
    friction: {
      title: "O que a integração feita à mão custa",
      items: [
        "O mesmo dado é digitado duas ou três vezes, em sistemas diferentes.",
        "Divergência entre dois sistemas só aparece no fechamento do mês.",
        "Exportar de um e importar no outro virou tarefa fixa de alguém.",
        "Ninguém confia no número sem antes conferir na fonte.",
      ],
    },
    scope: {
      title: "O que entra numa integração de sistemas",
      items: [
        {
          name: "Conexão via API",
          detail:
            "Onde existe API, ela é usada. Onde não existe, a integração passa por arquivo, e-mail ou banco, do jeito que der para automatizar com segurança.",
        },
        {
          name: "Sincronização com regra",
          detail:
            "Quem manda em qual campo fica decidido e escrito. Conflito para de ser resolvido no chute.",
        },
        {
          name: "Tratamento de falha",
          detail:
            "Sistema fora do ar não vira dado perdido. A rotina tenta de novo e avisa quando desiste.",
        },
        {
          name: "Alerta de divergência",
          detail:
            "A diferença entre dois sistemas aparece quando acontece, não no fechamento.",
        },
      ],
    },
    proof: {
      src: "/media/cases/distribuicao-multicanal.webp",
      width: 1916,
      height: 989,
      alt: "Sistema interno de promoções com coleta de ofertas, filtros e distribuição para WhatsApp e Telegram",
      caption: "DISTRIBUIÇÃO MULTICANAL",
    },
    faq: [
      {
        question: "E se o sistema não tiver API?",
        answer:
          "Boa parte dos sistemas legados não tem. Aí a integração passa por exportação agendada, leitura de arquivo ou acesso direto ao banco, com o cuidado que cada caminho exige.",
      },
      {
        question: "Com que frequência sincroniza?",
        answer:
          "Depende do que o processo aguenta esperar. Pode ser em tempo real, de hora em hora ou uma vez por dia. Sincronizar mais do que o necessário custa caro e não melhora nada.",
      },
      {
        question: "Como sei que está funcionando?",
        answer:
          "Cada execução fica registrada e as falhas geram alerta. Você não descobre que parou porque um cliente reclamou.",
      },
    ],
  },
  {
    slug: "automacao-fiscal-nfse",
    label: "Automação fiscal e NFS-e",
    metaTitle: "Automação fiscal e de NFS-e para contabilidade | MewStack",
    metaDescription:
      "Consulta de NFS-e, conferência de obrigações, leitura de recibos e checklist mensal. Rotina fiscal que roda sozinha e avisa quando algo diverge.",
    eyebrow: "fiscal",
    h1: "O fechamento não devia depender de alguém lembrar.",
    lede: "Consultar portal, baixar nota, conferir contra o que foi lançado, marcar no checklist. Todo mês, para cada cliente, na mão. É trabalho que a máquina faz melhor porque não cansa e não pula linha.",
    friction: {
      title: "Como o fechamento costuma ser hoje",
      items: [
        "Consulta manual de NFS-e, um portal e um cliente de cada vez.",
        "Recibo que chega por e-mail e por WhatsApp e precisa ser lançado à mão.",
        "Checklist de obrigações que mora numa planilha e depende de alguém marcar.",
        "Divergência entre o que foi emitido e o que foi lançado, descoberta tarde.",
      ],
    },
    scope: {
      title: "O que entra na automação fiscal",
      items: [
        {
          name: "Consulta automática",
          detail:
            "As notas são buscadas e organizadas por competência, sem ninguém abrir portal.",
        },
        {
          name: "Leitura de recibo",
          detail:
            "O documento que chega em PDF ou imagem vira lançamento estruturado.",
        },
        {
          name: "Checklist por competência",
          detail:
            "As obrigações do mês em um painel: o que está pendente, o que foi entregue, o que divergiu.",
        },
        {
          name: "Alerta de divergência",
          detail:
            "O que não bate aparece durante o mês, com tempo de corrigir antes do prazo.",
        },
      ],
    },
    proof: {
      src: "/media/cases/operacao-fiscal.webp",
      width: 1918,
      height: 991,
      alt: "Dashboard de operação fiscal com obrigações, upload de recibos, consulta de NFS-e e checklist mensal",
      caption: "OPERAÇÃO FISCAL CENTRALIZADA",
    },
    faq: [
      {
        question: "Funciona com qualquer prefeitura?",
        answer:
          "NFS-e é municipal e cada prefeitura tem o seu padrão. A gente verifica no diagnóstico quais municípios da sua carteira dão para automatizar e quais não, antes de você decidir.",
      },
      {
        question: "Substitui o sistema contábil?",
        answer:
          "Não. Ele continua sendo o sistema de escrituração. A automação tira o trabalho manual que acontece antes e ao redor dele.",
      },
      {
        question: "Serve para escritório pequeno?",
        answer:
          "Serve, e costuma render mais. Quanto menor o time, maior o peso relativo das horas gastas em conferência manual.",
      },
    ],
  },
];

export const SERVICE_BY_SLUG = new Map(SERVICES.map((s) => [s.slug, s]));
