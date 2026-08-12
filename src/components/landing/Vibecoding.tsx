"use client";

import { useRef, type CSSProperties } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE, Reveal } from "./primitives";
import { whatsappHref } from "@/lib/whatsapp";

/* ================================================================== */
/*  Vibecoding — a seção que responde à objeção mais cara da página:   */
/*  "por que pagar se eu mesmo gero isso com IA?". A resposta não é    */
/*  um texto, é a pilha: o que a IA entrega é a laje CINZA DO TOPO —   */
/*  a parte que aparece — e embaixo dela vão assentando as seis        */
/*  camadas que sustentam um produto. Quem olha entende a proporção    */
/*  antes de ler.                                                      */
/*                                                                     */
/*  A pilha é isométrica de verdade: cada camada é uma laje em SVG com */
/*  três faces — losango em cima, duas laterais extrudadas embaixo.    */
/*  A geometria é desenhada, não transformada (rotateX + rotateZ no    */
/*  contêiner inteiro colapsava tudo num bloco só, com os termos       */
/*  tortos).                                                           */
/*                                                                     */
/*  Duas decisões de desenho carregam esta versão:                     */
/*                                                                     */
/*  1. PITCH === DEPTH. As lajes ficam COLADAS: cada uma encosta       */
/*     exatamente na base da anterior, então o que se vê é uma pilha   */
/*     maciça em que só a laje do topo mostra o losango e todas as     */
/*     outras mostram a própria espessura. A dupla linha de contorno   */
/*     na junta é o que mantém cada laje legível como peça individual  */
/*     dentro do bloco. A versão anterior usava PITCH < SLAB_H, e as   */
/*     lajes se sobrepunham no ar, sem se tocar.                       */
/*                                                                     */
/*  2. A entrada é uma construção, não um stagger decorativo: um único */
/*     gatilho no bloco todo, e cada laje emerge de dentro da anterior */
/*     (começa um PITCH acima, atrás dela, e desce até assentar) na    */
/*     sequência de cima para baixo. Vê-se a fundação sendo posta sob  */
/*     o pedaço que a IA entregou.                                     */
/*                                                                     */
/*  O termo sai na lateral, ligado por um fiozinho ao meio da face     */
/*  direita — a faixa que sobra visível de cada laje. O hover é quase  */
/*  imóvel de propósito: nada de laje saltando para fora nem z-index   */
/*  trocado no ar. Só cor, um realce de brilho e 2px no termo.         */
/*                                                                     */
/*  No mobile a mesma informação vira lista empilhada, sem perspectiva */
/*  (a projeção não cabe em 375px sem virar borrão), na mesma ordem e  */
/*  com as linhas igualmente coladas.                                  */
/* ================================================================== */

const BASE_LAYER = "Código gerado por IA";

const LAYERS = [
  { title: "Arquitetura", body: "Decidida antes, não durante o incêndio." },
  { title: "Testes automatizados", body: "Toda alteração verificada antes de chegar em quem usa." },
  { title: "Segurança", body: "Permissão e dado sensível revisados linha a linha." },
  { title: "Observabilidade", body: "A falha aparece para nós antes de virar reclamação." },
  { title: "Manutenção", body: "Conduzida por quem acompanha o código desde o primeiro dia." },
  { title: "Escala", body: "Infraestrutura que cresce sem salto inesperado na fatura." },
];

/* ------------------------------------------------------------------ */
/*  Pilha isométrica (desktop)                                         */
/* ------------------------------------------------------------------ */

/* Geometria em unidades da viewBox da laje (largura sempre 100), para
   tudo escalar junto com a coluna sem nenhuma conta em pixel.
   DIAMOND_H sai achatado de propósito: com sete camadas, o losango de
   ~0,5 da largura que um ícone de três camadas usa deixaria a pilha com
   mais de 1000px.
   DEPTH é a espessura da laje, e PITCH é igual a ele: assim o losango de
   uma cai exatamente sobre a base da outra e a pilha fica maciça. Como
   efeito colateral bom, PITCH também é o espaço vertical entre os termos
   — laje mais grossa, termo mais folgado. */
const DIAMOND_H = 26;
const DEPTH = 16;
const SLAB_H = DIAMOND_H + DEPTH;
const PITCH = DEPTH;

/* Quanto da largura da coluna é laje. O resto é a calha dos termos: a
   borda direita da laje cai em SLAB_W e o texto começa logo depois.
   A calha vem do termo mais longo — "Testes automatizados" — contra a
   coluna mais estreita em que a pilha ainda aparece (a direita do grid
   em 1024px, ~400px), e é por isso que o termo desce para 13px antes de
   xl. Abaixo de lg o desenho dá lugar à lista do mobile. */
const SLAB_W = 54;
const LABEL_X = 58;

/* Onde o fio encosta na laje, em % da caixa dela. Não é mais a quina do
   losango: com as lajes coladas, o losango de todas (menos a do topo)
   fica escondido pela de cima. O que sobra visível na borda direita é
   exatamente a face lateral — de DIAMOND_H/2 a DIAMOND_H/2 + DEPTH — e o
   fio sai do meio dela. */
const VERTEX_Y = `${((DIAMOND_H / 2 + DEPTH / 2) / SLAB_H) * 100}%`;

const TOP_FACE = `0,${DIAMOND_H / 2} 50,0 100,${DIAMOND_H / 2} 50,${DIAMOND_H}`;
const LEFT_FACE = `0,${DIAMOND_H / 2} 50,${DIAMOND_H} 50,${SLAB_H} 0,${DIAMOND_H / 2 + DEPTH}`;
const RIGHT_FACE = `50,${DIAMOND_H} 100,${DIAMOND_H / 2} 100,${DIAMOND_H / 2 + DEPTH} 50,${SLAB_H}`;

/* As arestas, desenhadas à parte das faces, são o que dá o corpo 3D: a
   luz não bate na face inteira, bate na quina. A de baixo importa mais
   que parece — ela cai exatamente sobre o começo das faces laterais da
   laje seguinte, então é ela que vira a linha luminosa da junta. */
const TOP_EDGE = `M0,${DIAMOND_H / 2} L50,0 L100,${DIAMOND_H / 2} L50,${DIAMOND_H} Z`;
const SPINE = `M50,${DIAMOND_H} L50,${SLAB_H}`;
const BOTTOM_EDGE = `M0,${DIAMOND_H / 2 + DEPTH} L50,${SLAB_H} L100,${DIAMOND_H / 2 + DEPTH}`;

/* Inclinação das arestas do losango. Serve para inclinar os gradientes
   de sombreamento junto com as faces: um gradiente vertical comum tem as
   linhas de nível na horizontal e cortaria o paralelogramo na diagonal,
   deixando a oclusão da junta torta. Com gradientTransform="matrix(1,
   ±SLOPE, 0, 1, 0, 0)" as linhas de nível ficam paralelas às arestas.
   Os K são onde cada aresta cruza x=0 no espaço já inclinado. */
const SLOPE = DIAMOND_H / 100;
const LEFT_K = DIAMOND_H / 2;
const RIGHT_K = (DIAMOND_H * 3) / 2;

/* Tempo. A pilha inteira leva ~2,5s para se montar: a entrada de cada
   laje é longa e o passo entre elas é largo, para dar tempo de ver cada
   encaixe. SETTLE_AT é a fração da duração em que a laje já encostou
   (a EASE da casa é uma expo-out, chega quase toda no primeiro terço) —
   é nesse instante que a onda do encaixe dispara. */
const ENTER_DUR = 0.9;
const ENTER_STEP = 0.26;
const SETTLE_AT = 0.42;

/* Poeira luminosa do palco, em % da caixa. Posições fixas de propósito:
   sortear no render dá marcação diferente no servidor e no cliente. */
const SPECKS = [
  { x: 9, y: 12, s: 3, o: 0.5 },
  { x: 22, y: 6, s: 2, o: 0.32 },
  { x: 84, y: 9, s: 2, o: 0.38 },
  { x: 92, y: 27, s: 3, o: 0.28 },
  { x: 6, y: 46, s: 2, o: 0.3 },
  { x: 88, y: 62, s: 2, o: 0.34 },
  { x: 15, y: 82, s: 3, o: 0.26 },
  { x: 74, y: 91, s: 2, o: 0.3 },
];

/* De cima para baixo na tela: a laje escurece conforme desce, como se a
   luz viesse de cima. Cada laje traz também a cor da sua aresta (a quina
   que pega luz) e a do seu halo — as duas coisas que tiram o desenho do
   registro "clip-art chapado" e o levam para o registro luminoso. */
type Faces = { top: string; left: string; right: string; edge: string; glow: string };

const SLAB_COLORS: Faces[] = [
  { top: "#DCEAFF", left: "#79B0FF", right: "#3D7BEE", edge: "#D3E6FF", glow: "rgba(96,165,250,0.60)" },
  { top: "#CFE1FF", left: "#6BA3FA", right: "#356FE2", edge: "#C6DDFF", glow: "rgba(88,155,250,0.54)" },
  { top: "#C2D8FE", left: "#5D96F5", right: "#2D63D6", edge: "#B9D4FF", glow: "rgba(80,145,245,0.48)" },
  { top: "#B5CFFE", left: "#4F89F0", right: "#2557CA", edge: "#ACCBFF", glow: "rgba(72,135,240,0.43)" },
  { top: "#A8C6FD", left: "#417CEB", right: "#1D4BBE", edge: "#9FC2FF", glow: "rgba(64,125,235,0.38)" },
  { top: "#9BBDFC", left: "#336FE6", right: "#153FB2", edge: "#92B9FF", glow: "rgba(56,115,230,0.33)" },
];

/* A laje da IA é a única sem cor: aresta fria e halo quase nulo. Ela
   fica no topo, iluminada por baixo pelas outras, e a diferença de
   temperatura é o argumento da seção dito sem texto. */
const BASE_COLORS: Faces = {
  top: "#E9EEF6", left: "#C4CDDB", right: "#93A0B4", edge: "#F5F8FC", glow: "rgba(148,163,184,0.22)",
};

/* Gradientes e defs compartilhados por todas as lajes. Ficam num SVG
   próprio de tamanho zero porque cada laje é um <svg> separado (precisa
   ser, para animar uma a uma) e ids de <defs> são globais no documento:
   repetir os mesmos defs sete vezes faria as sete referências caírem
   todas no primeiro. */
function StackDefs() {
  return (
    <svg aria-hidden className="pointer-events-none absolute h-0 w-0 overflow-hidden">
      <defs>
        {/* sombreamento das faces laterais, inclinado junto com a aresta.
            Começa forte (a oclusão logo abaixo da laje de cima), abre
            para o meio e fecha escurecendo na base. É esse trio que dá
            volume à face em vez de deixá-la chapada. */}
        {([
          ["vb-shade-l", 1, LEFT_K],
          ["vb-shade-r", -1, RIGHT_K],
        ] as const).map(([id, dir, k]) => (
          <linearGradient
            key={id}
            id={id}
            gradientUnits="userSpaceOnUse"
            x1={0}
            y1={k}
            x2={0}
            y2={k + DEPTH}
            gradientTransform={`matrix(1, ${dir * SLOPE}, 0, 1, 0, 0)`}
          >
            <stop offset="0" stopColor="#020617" stopOpacity="0.42" />
            <stop offset="0.09" stopColor="#020617" stopOpacity="0.06" />
            <stop offset="0.45" stopColor="#020617" stopOpacity="0" />
            <stop offset="1" stopColor="#020617" stopOpacity="0.34" />
          </linearGradient>
        ))}

        {/* mesma coisa para a laje do topo, que não tem ninguém acima —
            sem a oclusão da junta, senão ela ganha uma sombra do nada */}
        {([
          ["vb-shade-lt", 1, LEFT_K],
          ["vb-shade-rt", -1, RIGHT_K],
        ] as const).map(([id, dir, k]) => (
          <linearGradient
            key={id}
            id={id}
            gradientUnits="userSpaceOnUse"
            x1={0}
            y1={k}
            x2={0}
            y2={k + DEPTH}
            gradientTransform={`matrix(1, ${dir * SLOPE}, 0, 1, 0, 0)`}
          >
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.16" />
            <stop offset="0.4" stopColor="#020617" stopOpacity="0" />
            <stop offset="1" stopColor="#020617" stopOpacity="0.34" />
          </linearGradient>
        ))}

        {/* o tampo pega a luz na quina de trás e cai para a da frente */}
        <linearGradient id="vb-shade-top" x1="0.12" y1="0" x2="0.78" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.34" />
          <stop offset="0.55" stopColor="#FFFFFF" stopOpacity="0.04" />
          <stop offset="1" stopColor="#020617" stopOpacity="0.14" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Slab({ faces, isTop }: { faces: Faces; isTop: boolean }) {
  return (
    <svg viewBox={`0 0 100 ${SLAB_H}`} className="block w-full" aria-hidden>
      {/* cada face é pintada em dois passes: a cor, e por cima o
          gradiente de sombreamento. Separar os dois é o que permite um
          único conjunto de gradientes servir as sete lajes */}
      <polygon points={LEFT_FACE} fill={faces.left} />
      <polygon points={LEFT_FACE} fill={`url(#vb-shade-l${isTop ? "t" : ""})`} />
      <polygon points={RIGHT_FACE} fill={faces.right} />
      <polygon points={RIGHT_FACE} fill={`url(#vb-shade-r${isTop ? "t" : ""})`} />
      <polygon points={TOP_FACE} fill={faces.top} />
      <polygon points={TOP_FACE} fill="url(#vb-shade-top)" />

      <path
        d={TOP_EDGE}
        fill="none"
        stroke={faces.edge}
        strokeOpacity={0.85}
        strokeWidth={0.7}
        strokeLinejoin="round"
      />
      {/* o vinco da frente, onde as duas laterais se encontram */}
      <path d={SPINE} fill="none" stroke={faces.edge} strokeOpacity={0.3} strokeWidth={0.55} />
      {/* a linha luminosa da junta com a laje de baixo */}
      <path
        d={BOTTOM_EDGE}
        fill="none"
        stroke={faces.edge}
        strokeOpacity={0.42}
        strokeWidth={0.6}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  A onda do encaixe                                                  */
/*                                                                     */
/*  Quando uma laje assenta na outra, o plano de contato solta duas     */
/*  ondas: uma cheia, curta, que é o estalo, e um contorno fino que     */
/*  continua abrindo depois. Em projeção isométrica o quadrado do       */
/*  contato é o losango do tampo — então a onda é o próprio TOP_FACE    */
/*  crescendo a partir do centro.                                       */
/*                                                                     */
/*  Elas moram numa camada acima de toda a pilha: o plano de contato    */
/*  fica, por definição, escondido pela laje de cima, e sem esse        */
/*  z-index à parte a onda nasceria atrás dela e não apareceria.        */
/* ------------------------------------------------------------------ */

function ContactWave({
  top,
  delay,
  color,
  inView,
}: {
  top: string;
  delay: number;
  color: string;
  inView: boolean;
}) {
  const origin = { transformBox: "fill-box", transformOrigin: "center" } as const;

  return (
    <div className="absolute inset-x-0" style={{ top }}>
      {/* overflow visível: a onda passa muito além da caixa da laje */}
      <svg
        viewBox={`0 0 100 ${SLAB_H}`}
        className="block overflow-visible"
        style={{ width: `${SLAB_W}%` }}
        aria-hidden
      >
        {/* o estalo: cheio, curto, quase no tamanho da laje */}
        <motion.polygon
          points={TOP_FACE}
          fill={color}
          style={origin}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={inView ? { scale: [0.92, 1.02, 1.15], opacity: [0, 0.55, 0] } : {}}
          transition={{ duration: 0.8, ease: "easeOut", delay, times: [0, 0.14, 1] }}
        />
        {/* e dois anéis atrás dele. A amplitude é curta de propósito: o
            palco tem borda, e uma onda que cresce até sumir cortada na
            beirada estraga o efeito. Três ondas pequenas em sequência
            leem como ondulação melhor que uma grande e truncada. */}
        {[
          { to: 1.19, dur: 1.05, from: 0.98, op: 0.6, gap: 0.06 },
          { to: 1.23, dur: 1.35, from: 1.0, op: 0.32, gap: 0.18 },
        ].map((w) => (
          <motion.polygon
            key={w.to}
            points={TOP_FACE}
            fill="none"
            stroke={color}
            strokeWidth={1}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            style={origin}
            initial={{ scale: w.from, opacity: 0 }}
            animate={inView ? { scale: [w.from, w.to], opacity: [w.op, 0] } : {}}
            transition={{ duration: w.dur, ease: "easeOut", delay: delay + w.gap }}
          />
        ))}
      </svg>
    </div>
  );
}

type StackItem = { label: string; faces: Faces; base: boolean };

/* Um pitch expresso em % da ALTURA da própria laje — é o deslocamento de
   onde cada peça começa a animação: um degrau acima, portanto por trás da
   laje anterior, que tem z-index maior. */
const ENTER_OFFSET = `-${(PITCH / SLAB_H) * 100}%`;

function SlabRow({
  item,
  top,
  zIndex,
  inView,
  index,
}: {
  item: StackItem;
  top: string;
  zIndex: number;
  inView: boolean;
  index: number;
}) {
  return (
    <motion.div
      /* sem hover:z-* aqui: a ordem de pintura da pilha é fixa, quem está
         em cima na tela está em cima no empilhamento, e ponto */
      className="group absolute inset-x-0"
      style={{ top, zIndex }}
      initial={{ opacity: 0, y: ENTER_OFFSET }}
      animate={inView ? { opacity: 1, y: "0%" } : {}}
      transition={{ duration: ENTER_DUR, ease: EASE, delay: index * ENTER_STEP }}
    >
      {/* o halo é um drop-shadow sem deslocamento: ele acompanha a
          silhueta da laje, então a luz vaza pelas quinas e pela junta
          com a de baixo, não numa caixa retangular em volta.
          O hover continua imóvel — só abre o halo. Mover a laje para
          fora exigiria roubar o z-index de quem está por cima, que é o
          que fazia o efeito parecer barato. */}
      <div
        className="[filter:drop-shadow(0_0_9px_var(--glow))] transition-[filter] duration-300 ease-out group-hover:[filter:drop-shadow(0_0_22px_var(--glow))_brightness(1.06)]"
        style={{ width: `${SLAB_W}%`, "--glow": item.faces.glow } as CSSProperties}
      >
        <Slab faces={item.faces} isTop={index === 0} />
      </div>

      {/* fio que liga o meio da face direita ao termo */}
      <span
        aria-hidden
        className={`absolute h-px -translate-y-1/2 transition-colors duration-200 ${
          item.base ? "bg-slate-600 group-hover:bg-slate-400" : "bg-brand-400/70 group-hover:bg-brand-300"
        }`}
        style={{ left: `${SLAB_W + 0.5}%`, width: `${LABEL_X - SLAB_W - 1.5}%`, top: VERTEX_Y }}
      />

      <span
        className={`absolute right-0 -translate-y-1/2 text-[13px] font-semibold leading-tight tracking-tight transition-[color,transform] duration-200 group-hover:translate-x-0.5 xl:text-[15px] ${
          item.base
            ? "text-slate-400 group-hover:text-slate-200"
            : "text-slate-100 group-hover:text-white"
        }`}
        style={{ left: `${LABEL_X}%`, top: VERTEX_Y }}
      >
        {item.label}
      </span>
    </motion.div>
  );
}

function LayerStack() {
  /* de cima para baixo na tela: a laje da IA primeiro — é o que ela
     entrega, e é o que aparece — e as seis camadas da casa descendo até
     Arquitetura, que é a fundação de tudo */
  const stacked: StackItem[] = [
    { label: BASE_LAYER, faces: BASE_COLORS, base: true },
    ...[...LAYERS].reverse().map((l, i) => ({ label: l.title, faces: SLAB_COLORS[i], base: false })),
  ];

  /* alturas em unidades da largura da COLUNA, não da laje */
  const pitch = (PITCH * SLAB_W) / 100;
  const total = (stacked.length - 1) * pitch + (SLAB_H * SLAB_W) / 100;

  /* um gatilho só para o bloco inteiro: a sequência das lajes é o delay
     de cada uma, não o scroll passando por cada faixa. Assim a pilha se
     constrói sempre no mesmo ritmo, independente da velocidade da roda */
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px -20% 0px" });

  return (
    /* O palco escuro não é enfeite: halo é luz, e luz só existe contra o
       escuro — o mesmo drop-shadow que aqui vira brilho, no branco da
       seção viraria uma mancha suja em volta da laje. O navy é o mesmo
       do bloco de CTA no fim da seção, então o escuro já é vocabulário
       daqui e a pilha lê como um display aceso dentro da página clara. */
    /* o respiro à esquerda é maior que o da direita porque a laje é
       alinhada à esquerda e é de lá que as ondas saem — sem essa folga
       elas morrem cortadas na beirada do palco */
    <div ref={ref} className="relative hidden overflow-hidden rounded-[28px] bg-[#050B1C] py-10 pl-7 pr-5 lg:block xl:py-14 xl:pl-11 xl:pr-9">
      <StackDefs />

      {/* luz ambiente atrás da pilha */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(58% 52% at 34% 44%, rgba(56,120,255,0.30), transparent 72%)",
        }}
      />
      {/* poeira luminosa, nas posições fixas de sempre: sortear no render
          daria hidratação diferente do servidor */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {SPECKS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-brand-100"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, opacity: s.o }}
          />
        ))}
      </div>

      <div
        className="relative mx-auto w-full max-w-[40rem]"
        style={{ aspectRatio: `100 / ${total}` }}
      >
        {stacked.map((item, j) => (
          <SlabRow
            key={item.label}
            item={item}
            index={j}
            inView={inView}
            top={`${((j * pitch) / total) * 100}%`}
            /* a laje mais alta é pintada por cima: é ela que esconde o
               losango da de baixo e fecha a pilha */
            zIndex={stacked.length - j}
          />
        ))}

        {/* as ondas por cima de tudo — ver ContactWave. A primeira laje
            não tem onda: ela assenta no vazio, não há junta nenhuma */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-20">
          {stacked.slice(1).map((item, k) => (
            <ContactWave
              key={item.label}
              top={`${(((k + 1) * pitch) / total) * 100}%`}
              color={item.faces.edge}
              inView={inView}
              delay={(k + 1) * ENTER_STEP + ENTER_DUR * SETTLE_AT}
            />
          ))}
        </div>
      </div>

      {/* a pilha pousa numa poça de luz, não numa sombra: no escuro é o
          reflexo que dá o chão. Vai dentro de uma caixa igual à da pilha
          para nascer sob a laje, que é alinhada à esquerda — centralizar
          no palco a jogaria para a calha dos termos */}
      <div className="relative mx-auto w-full max-w-[40rem]">
        <motion.div
          aria-hidden
          className="mt-5 h-7 rounded-[50%] bg-brand-500/25 blur-2xl"
          style={{ width: `${SLAB_W}%` }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, ease: EASE, delay: stacked.length * ENTER_STEP }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mesma informação, empilhada (mobile e tablet)                      */
/*                                                                     */
/*  A ordem é a mesma da pilha isométrica do desktop — a camada da IA   */
/*  em cima, cinza, e as seis da casa descendo até Arquitetura, que é a */
/*  fundação — e cada linha usa a MESMA cor da laje correspondente,     */
/*  escurecendo conforme desce.                                        */
/*                                                                     */
/*  As linhas também são coladas aqui: um bloco único com o arredonda- */
/*  mento só nas duas pontas, em vez de seis cartões soltos com respiro */
/*  entre eles. A faixa clara na borda esquerda é o tampo da laje visto */
/*  de lado, e a sombra de contato no fim faz a pilha pousar em vez de  */
/*  flutuar — os dois detalhes vêm do desenho de cima, então as duas    */
/*  versões contam a mesma história com a mesma linguagem.             */
/* ------------------------------------------------------------------ */

function LayerList() {
  const stacked = [...LAYERS].reverse();

  return (
    <div className="lg:hidden">
      {/* a camada que a IA entrega: cinza, no topo, e todo o resto abaixo */}
      <motion.div
        className="relative overflow-hidden rounded-t-2xl border-x border-t border-slate-200 bg-slate-100 py-4 pl-7 pr-5"
        initial={{ opacity: 0, y: -14, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-2"
          style={{ background: BASE_COLORS.left }}
        />
        <span className="text-[15px] font-semibold text-slate-500">{BASE_LAYER}</span>
      </motion.div>

      <ol>
        {stacked.map((layer, i) => (
          <motion.li
            key={layer.title}
            className={`relative overflow-hidden py-4 pl-7 pr-5 ${
              i === stacked.length - 1 ? "rounded-b-2xl" : ""
            }`}
            /* aqui o gradiente vai da face direita desta laje à da
               seguinte, não da esquerda à direita: as cores da face
               esquerda foram calibradas para brilhar contra o palco
               escuro do desktop, e num cartão de fundo claro elas
               deixariam o texto branco quase ilegível */
            style={{
              background: `linear-gradient(135deg, ${SLAB_COLORS[i].right}, ${
                SLAB_COLORS[Math.min(i + 1, SLAB_COLORS.length - 1)].right
              })`,
            }}
            initial={{ opacity: 0, y: -14, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.5, ease: EASE, delay: (i + 1) * 0.09 }}
          >
            {/* linha de junta: a mesma leitura que o contorno duplo dá na
                pilha isométrica, para a laje não sumir dentro do bloco */}
            <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-white/25" />
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 w-2"
              style={{ background: SLAB_COLORS[i].top }}
            />
            <span className="text-[15px] font-semibold text-white">{layer.title}</span>
            <p className="mt-1 text-[15px] leading-snug text-brand-100">{layer.body}</p>
          </motion.li>
        ))}
      </ol>

      <div
        aria-hidden
        className="mx-auto mt-4 h-5 w-2/3 rounded-[50%] bg-brand-950/[0.13] blur-lg"
      />
    </div>
  );
}

export default function Vibecoding() {
  return (
    <section data-nav-theme="light" className="relative bg-white py-20 sm:py-28 lg:py-40">
      <div className="mx-auto max-w-9xl px-5 lg:px-8">
        <div className="grid items-center gap-10 sm:gap-16 lg:grid-cols-[minmax(0,46%)_minmax(0,1fr)] lg:gap-20">
          <div>
            <Reveal>
              <h2 className="text-balance text-[clamp(2rem,4.2vw,3.25rem)] font-semibold leading-[1.08] tracking-tightest">
                {/* a primeira linha é constatação, não ressalva: sai do
                   cinza e assume o preto da casa. O azul fica para a
                   virada, que é onde está o argumento da seção */}
                <span className="text-brand-950">A IA escreve o código.</span>
                <br />
                <span className="text-brand-600">Produto é outra história.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="mt-5 max-w-[58ch] text-[15px] leading-relaxed text-slate-600 sm:mt-7 sm:text-[17px]">
                Hoje, qualquer pessoa consegue colocar um sistema no ar. O desafio começa quando ele precisa escalar, 
                permanecer seguro e continuar funcionando. Nesse cenário, ajudamos seu sistema feito por I.A a crescer 
                junto com seu negócio.
              </p>
            </Reveal>

            {/* No desktop este resumo convive com a pilha isométrica, que
                mostra só os rótulos. Abaixo de lg quem entra é a
                LayerList — que já traz título E descrição das mesmas
                camadas — e os quatro primeiros itens apareciam duas
                vezes, palavra por palavra, a menos de uma tela um do
                outro. Some abaixo de lg. */}
            <Reveal delay={0.2} className="hidden lg:block">
              <dl className="mt-10 grid gap-x-8 gap-y-6 border-t border-slate-200 pt-8 sm:grid-cols-2">
                {LAYERS.slice(0, 4).map((l) => (
                  <div key={l.title}>
                    <dt className="text-[15px] font-semibold tracking-tight text-brand-950">
                      {l.title}
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-slate-600">
                      {l.body}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <div>
            <LayerStack />
            <LayerList />
          </div>
        </div>

        {/* blindagem: o serviço que nasce dessa tese */}
        <Reveal delay={0.1} className="mt-16 sm:mt-24 lg:mt-32">
          <div className="relative overflow-hidden rounded-3xl bg-flauzino-navy-900 p-7 sm:p-12 lg:p-16">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                background:
                  "radial-gradient(52% 70% at 88% 8%, rgba(37,99,235,0.22), transparent 72%)",
              }}
            />
            <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
              <div>
                <h3 className="text-balance text-[clamp(1.65rem,2.8vw,2.25rem)] font-semibold leading-[1.14] tracking-tight text-white">
                  Seu SaaS nasceu de vibecoding e agora precisa aguentar cliente
                  de verdade?
                </h3>
                <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/70 sm:mt-5 sm:text-base">
                  Assumimos a evolução do projeto: revisão de arquitetura,
                  brechas de segurança, testes que nunca foram escritos e
                  gargalos de banco. Essa auditoria evita meses de retrabalho
                  mais adiante.
                </p>
              </div>
              <a
                href={whatsappHref(
                  "Olá! Tenho um SaaS desenvolvido com vibecoding/IA e vi no site da Flauzino que vocês fazem blindagem de arquitetura, segurança e performance. Quero saber mais.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                /* no celular o botão ocupa a largura toda: um "w-fit" de
                   210px encostado à esquerda de uma tela de 360 não lê
                   como a ação principal do bloco */
                className="group inline-flex w-fit shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-[15px] font-semibold text-[#0b1220] transition-all duration-200 hover:bg-brand-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30 max-sm:h-14 max-sm:w-full max-sm:justify-center max-sm:py-0"
              >
                Falar com especialista
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
