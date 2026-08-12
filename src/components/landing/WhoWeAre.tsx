"use client";

import { motion } from "framer-motion";
import {
  AppWindow,
  ArrowRight,
  BrainCircuit,
  Gauge,
  PencilRuler,
  ScanFace,
} from "lucide-react";
import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { EASE, Reveal } from "./primitives";
import { SpotlightCard } from "./reactbits";

/* ================================================================== */
/*  Quem somos — a primeira palavra da empresa depois do palco.         */
/*                                                                     */
/*  A hero divide a tela em duas colunas e joga o texto na esquerda;    */
/*  aqui a composição volta para o eixo central e o painel abre em      */
/*  claro. É a virada de simetria, junto com a troca de fundo, que      */
/*  separa uma seção da outra.                                          */
/*                                                                     */
/*  São dois movimentos e nada além disso: o bloco de abertura e a      */
/*  trilha do que construímos. A frase que diferencia a empresa (única  */
/*  do país em reconhecimento facial) abre o parágrafo em peso e cor    */
/*  de destaque em vez de virar uma faixa própria — uma versão          */
/*  anterior tinha três blocos empilhados e a seção passava de duas     */
/*  telas de altura sem dizer mais nada.                                */
/*                                                                     */
/*  A trilha corre na horizontal e o último cartão fica cortado de      */
/*  propósito, no celular e no desktop: cartão inteiro na borda não     */
/*  conta que existe mais coisa depois dele.                            */
/* ================================================================== */

const BUILDS = [
  {
    icon: ScanFace,
    title: "Reconhecimento facial",
    body: "Acesso, presença e antifraude com as câmeras que já existem no lugar.",
  },
  {
    icon: PencilRuler,
    title: "Software sob medida",
    body: "Sistema desenhado para a operação que a empresa tem, não para a média do mercado.",
  },
  {
    icon: AppWindow,
    title: "Produtos digitais",
    body: "Plataformas e SaaS para quem está criando um negócio ou digitalizando um antigo.",
  },
  {
    icon: BrainCircuit,
    title: "Automação e IA",
    body: "O que hoje é feito na mão vira fluxo automático, com IA onde ela resolve.",
  },
  {
    icon: Gauge,
    title: "Evolução de sistemas",
    body: "Modernização, performance e segurança no que já está no ar.",
  },
];

function BuildCard({
  item,
  index,
}: {
  item: (typeof BUILDS)[number];
  index: number;
}) {
  const Icon = item.icon;

  return (
    <motion.div
      className="shrink-0 snap-start"
      initial={{ opacity: 0, y: 26, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay: 0.05 + index * 0.07 }}
    >
      <SpotlightCard
        spotlightColor="rgba(37,99,235,0.10)"
        className="flex h-full w-[74vw] max-w-[23rem] flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-fl-sm transition-[border-color,box-shadow] duration-300 hover:border-slate-300 hover:shadow-fl-lg sm:w-[21rem] sm:max-w-none lg:w-[25rem] lg:p-8"
      >
        {/* o ícone vive solto no cartão: a caixa em volta dele só repetia
            o contorno que o próprio cartão já tem */}
        <Icon className="h-7 w-7 text-brand-600" strokeWidth={1.5} />
        <h3 className="mt-6 text-[19px] font-semibold tracking-tight text-brand-950 sm:text-[20px]">
          {item.title}
        </h3>
        <p className="mt-2.5 text-[15px] leading-relaxed text-slate-600">
          {item.body}
        </p>
      </SpotlightCard>
    </motion.div>
  );
}

/* "Arraste para ver" prometia clique-e-arraste, mas overflow-x-auto só
   responde a scroll/trackpad — mouse não arrasta um <div> por padrão.
   O hook abaixo cobre só ponteiro tipo mouse; toque e caneta continuam
   no scroll nativo do container (pra não brigar com a inércia do iOS). */
function useDragToScroll() {
  const railRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0 });
  const [dragging, setDragging] = useState(false);

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = railRef.current;
    if (!el) return;
    e.preventDefault();
    drag.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft };
    setDragging(true);
    try {
      el.setPointerCapture(e.pointerId);
    } catch {}
  }, []);

  const onPointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const el = railRef.current;
    if (!el || !drag.current.active) return;
    el.scrollLeft = drag.current.startScroll - (e.clientX - drag.current.startX);
  }, []);

  /* solta no meio do caminho: sem inércia nativa (o scroll foi setado à
     mão), então quem decide onde o cartão assenta é este passo, não o
     scroll-snap do CSS — ele só reage a gestos, não a scrollLeft direto */
  const snapToNearest = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const cards = Array.from(el.querySelectorAll<HTMLElement>(":scope > .snap-start"));
    if (!cards.length) return;
    let nearest = cards[0];
    let best = Infinity;
    for (const card of cards) {
      const diff = Math.abs(card.offsetLeft - el.scrollLeft);
      if (diff < best) {
        best = diff;
        nearest = card;
      }
    }
    el.scrollTo({ left: nearest.offsetLeft, behavior: "smooth" });
  }, []);

  const endDrag = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!drag.current.active) return;
      drag.current.active = false;
      setDragging(false);
      const el = railRef.current;
      try {
        if (el?.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      } catch {}
      snapToNearest();
    },
    [snapToNearest],
  );

  return { railRef, dragging, onPointerDown, onPointerMove, onPointerUp: endDrag, onPointerCancel: endDrag };
}

export default function WhoWeAre() {
  const drag = useDragToScroll();

  return (
    <section
      id="quem-somos"
      data-nav-theme="light"
      /* a altura é o alvo do desenho: a seção vale cerca de uma tela e um
         quinto, o suficiente para o par título + parágrafo respirar e a
         trilha aparecer inteira sem que a leitura precise de dois fôlegos */
      className="relative scroll-mt-24 overflow-hidden bg-canvas py-24 sm:py-32 lg:py-44"
    >
      {/* o foco de luz nasce no eixo, na emenda com a hero, e desce até
          antes da trilha para os cartões terem fundo limpo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(48% 38% at 50% 0%, rgba(37,99,235,0.15), transparent 70%)," +
            "radial-gradient(30% 24% at 50% 0%, rgba(96,165,250,0.13), transparent 72%)",
        }}
      />
      {/* prumo: cai da emenda com a hero e declara onde fica o centro */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-24 w-px -translate-x-1/2 bg-gradient-to-b from-brand-500/60 to-transparent sm:h-32"
      />

      <div className="relative mx-auto max-w-9xl px-5 lg:px-8">
        {/* ------------------------------ abertura ------------------------------ */}
        <div className="text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-brand-700 shadow-fl-xs">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-600" />
              </span>
              Quem somos
            </span>
          </Reveal>

          <Reveal delay={0.06}>
            {/* o piso do clamp fica em 2rem, o mesmo dos outros h2 da
                página e um degrau abaixo do h1 da hero: no celular quem
                decide é o piso, e um título de seção maior que o da capa
                inverteria a hierarquia */}
            <h2 className="mx-auto mt-7 max-w-[52rem] text-balance text-[clamp(2rem,4.6vw,3.4rem)] font-semibold leading-[1.06] tracking-tightest text-brand-950 sm:mt-8">
              Tecnologia que faz sentido para o negócio.
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-[50rem] text-balance text-[17px] leading-[1.65] text-slate-600 sm:mt-7 sm:text-[20px]">
              {/* a informação que diferencia a empresa abre o parágrafo e
                  carrega o peso; o resto explica o alcance */}
              <strong className="font-semibold text-brand-950">
                Somos a única empresa de software sob demanda do Brasil especializada 
                em reconhecimento facial.
              </strong>{" "}
              Construímos sistemas sob medida, produtos digitais e soluções de IA
              que precisam funcionar na operação, não só na demonstração.
            </p>
          </Reveal>
        </div>

        {/* ---------------------------- a trilha ---------------------------- */}
        <div className="mt-16 flex items-end justify-between gap-6 sm:mt-28">
          <Reveal>
            <h3 className="text-[11px] font-semibold uppercase tracking-eyebrow text-slate-600">
              O que construímos
            </h3>
          </Reveal>
          <Reveal delay={0.06}>
            <span className="flex shrink-0 items-center gap-2 text-[12px] font-medium text-slate-600">
              Arraste para ver
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Reveal>
        </div>

        {/* a margem negativa devolve à trilha a calha do container: o último
            cartão fica cortado na borda em vez de terminar antes dela.
            snap-none durante o arrasto solta a trilha do CSS scroll-snap
            enquanto a mão comanda o scrollLeft; snapToNearest devolve o
            assentamento na soltura. */}
        <div
          ref={drag.railRef}
          onPointerDown={drag.onPointerDown}
          onPointerMove={drag.onPointerMove}
          onPointerUp={drag.onPointerUp}
          onPointerCancel={drag.onPointerCancel}
          className={`rail -mr-5 mt-8 flex gap-4 overflow-x-auto pb-3 sm:gap-5 lg:-mr-8 ${
            drag.dragging ? "cursor-grabbing snap-none select-none" : "cursor-grab snap-x snap-mandatory"
          }`}
        >
          {BUILDS.map((item, i) => (
            <BuildCard key={item.title} item={item} index={i} />
          ))}
          {/* respiro depois do último cartão quando a trilha chega ao fim */}
          <span aria-hidden className="w-1 shrink-0 sm:w-3" />
        </div>
      </div>
    </section>
  );
}
