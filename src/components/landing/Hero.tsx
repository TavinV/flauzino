"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import {
  ActivitySquare,
  ArrowRight,
  Network,
  Plug,
  ScanFace,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { EASE, Reveal } from "./primitives";
import { ShinyText, StarBorder, StarField } from "./reactbits";
import { markHeroReady } from "./heroReady";
import { whatsappHref } from "@/lib/whatsapp";

/* ================================================================== */
/*  Hero — painel escuro em tela cheia com céu estrelado, linhas       */
/*  orbitais e brilho radial contido. O canvas 3D cobre o painel       */
/*  inteiro; tablet e laptop trocam de posição a cada 5s e as badges   */
/*  em glass morphism acompanham o dispositivo em foco. Enquanto os    */
/*  modelos carregam, o PageLoader cobre o site inteiro — a Hero só    */
/*  avisa quando o palco está pronto (markHeroReady).                  */
/* ================================================================== */

const Hero3D = dynamic(() => import("./hero3d/Hero3D"), { ssr: false });

const ROTATE_EVERY_MS = 5000;

type Badge = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  className: string;
};

const BADGES: Record<"tablet" | "monitor", Badge[]> = {
  tablet: [
    { icon: ScanFace, label: "Reconhecimento facial", className: "left-[2%] top-[12%]" },
    { icon: ShieldCheck, label: "Antifraude em tempo real", className: "right-0 top-[38%]" },
    { icon: Plug, label: "Integração com seu sistema", className: "bottom-[14%] left-[6%]" },
  ],
  monitor: [
    { icon: ActivitySquare, label: "Dados em tempo real", className: "left-[2%] top-[14%]" },
    { icon: Workflow, label: "Automação de processos", className: "right-0 top-[20%]" },
    { icon: Network, label: "Integração com dispositivos", className: "bottom-[12%] right-[6%]" },
  ],
};


export default function Hero() {
  const panelRef = useRef<HTMLDivElement>(null);
  const inView = useInView(panelRef, { amount: 0.2 });
  const reduced = !!useReducedMotion();
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);
  const focused: "tablet" | "monitor" = step % 2 === 0 ? "tablet" : "monitor";
  const handleReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    if (!inView || reduced || !ready) return;
    const id = setInterval(() => setStep((s) => s + 1), ROTATE_EVERY_MS);
    return () => clearInterval(id);
  }, [inView, reduced, ready]);

  /* rede lenta ou WebGL indisponível: não segura o loading para sempre */
  useEffect(() => {
    const id = setTimeout(() => setReady(true), 9000);
    return () => clearTimeout(id);
  }, []);

  /* libera o PageLoader assim que o palco 3D está pronto */
  useEffect(() => {
    if (ready) markHeroReady();
  }, [ready]);

  return (
    /* a moldura ao redor do painel acompanha o ato escuro que segue abaixo:
       antes era branca e cortava a página em duas na emenda com a próxima seção */
    <section
      id="top"
      data-nav-theme="dark"
      className="relative bg-[#04070f] px-2 pt-2 sm:px-3 sm:pt-3"
    >
      {/* svh no celular: dvh encolhe e cresce junto com a barra de
          endereço do Safari, e o painel inteiro pulava a cada rolagem.
          svh é a altura estável (barra visível), então a hero para de
          se mexer. De 640px para cima nada muda: sm: devolve o dvh. */}
      <div
        ref={panelRef}
        className="relative flex min-h-[calc(100svh-0.5rem)] flex-col overflow-hidden rounded-[1.75rem] border border-white/5 bg-[#070c19] sm:min-h-[calc(100dvh-0.75rem)]"
      >
        {/* ---- palco 3D cobrindo o painel inteiro ---- */}
        <div className="absolute inset-0" aria-hidden>
          <Hero3D step={step} reduced={reduced} active={inView} onReady={handleReady} />
        </div>

        {/* ---- atmosfera acima do canvas: brilho contido (blend screen),
             estrelas e linhas orbitais ---- */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{
            /* mesma família de cor do GradientText: céu (#7CC5FF) e violeta
               (#A78BFA). O azul-royal saturado de antes deixava o canto do
               painel esverdeado onde encostava no navy do fundo */
            background:
              "radial-gradient(30% 34% at 70% 62%, rgba(124,197,255,0.16), transparent 72%)," +
              "radial-gradient(22% 26% at 60% 86%, rgba(167,139,250,0.13), transparent 72%)," +
              "radial-gradient(40% 44% at 92% 100%, rgba(96,165,250,0.13), transparent 76%)",
          }}
        />
        <StarField className="opacity-70" />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-[26rem] -top-[30rem] h-[62rem] w-[62rem] rounded-full border border-white/[0.07]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-[38rem] -left-[22rem] h-[72rem] w-[72rem] rounded-full border border-white/[0.05]"
        />

        {/* ------------------------------ conteúdo ------------------------------ */}
        <div className="relative z-10 mx-auto flex w-full max-w-[88rem] flex-1 flex-col justify-center px-6 pb-7 pt-[5.25rem] sm:px-8 sm:pb-10 sm:pt-24 lg:px-10 lg:pb-6 lg:pt-28">
          {/* gap subiu de 24 para 32px: no celular o par texto+CTA e o
              palco respirando embaixo ficavam colados um no outro. De
              640px pra cima quem decide continua sendo o sm:gap-10. */}
          <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[minmax(0,46%)_minmax(0,54%)] lg:gap-6">
            {/* texto — centralizado no mobile, alinhado à esquerda no desktop */}
            <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
              <Reveal delay={0.05}>
                {/* o piso do clamp subiu de 1,55rem para 1,95rem: em 375px
                    o título da hero saía a 24,8px, menor que TODOS os h2 da
                    página (32px), e a hierarquia lia ao contrário. O piso só
                    manda abaixo de 780px, então de 1024px para cima quem
                    decide continua sendo o 4vw — desktop intocado. */}
                <h1 className="text-balance text-[clamp(2.1rem,4vw,3.4rem)] font-semibold leading-[1.14] tracking-tightest text-white sm:leading-[1.12]">
                  {/* base em brand-300 para separar do branco da segunda
                      linha; o brilho passa a cada ~4s (2s de varredura +
                      2s de descanso) em vez de um degradê sempre em
                      movimento, que competia com o palco 3D atrás */}
                  <ShinyText
                    text="Reconhecimento facial,"
                    color="#93C5FD"
                    shineColor="#FFFFFF"
                    speed={2}
                    delay={2}
                    spread={120}
                  />{" "}
                  Soluções que aceleram empresas.
                </h1>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="mx-auto mt-5 max-w-xl text-balance text-[15px] leading-relaxed text-white/70 sm:mt-6 sm:text-[17px] lg:mx-0">
                  Desenvolvemos soluções de reconhecimento facial, inteligência
                  artificial, sistemas sob medida, plataformas SaaS e qualquer
                  tecnologia para o seu negócio.
                </p>
              </Reveal>

              <Reveal delay={0.15}>
                {/* os dois CTAs dividem a mesma altura (h-13) e, no mobile,
                    empilham ocupando a largura toda — assim ficam com
                    exatamente a mesma caixa um do outro */}
                <div className="mt-8 flex flex-col items-stretch gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center lg:justify-start">
                  <a
                    href={whatsappHref(
                      "Olá! Vi o site da Flauzino e tenho interesse em reconhecimento facial e soluções de inteligência artificial para minha empresa. Podemos conversar?",
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex h-[3.25rem] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-7 text-[15px] font-semibold text-[#0b1220] shadow-[0_16px_48px_-16px_rgba(147,197,253,0.55)] transition-all duration-200 hover:bg-blue-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30 sm:w-auto"
                  >
                    Falar com especialista
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </a>
                  <StarBorder
                    href="/cases/visage"
                    className="h-[3.25rem] w-full sm:w-auto"
                  >
                    Ver a tecnologia
                  </StarBorder>
                </div>
              </Reveal>

            </div>

            {/* reserva de espaço do palco (o 3D vive no canvas atrás) + badges.
                No celular a reserva encolhe para o par título + CTA caber
                acima da dobra e o dispositivo aparecer espiando embaixo,
                convidando a rolar em vez de ficar cortado pela metade. */}
            <div className="relative h-[30vh] min-h-[190px] sm:h-[42vh] sm:min-h-[300px] lg:h-[62vh] lg:min-h-[480px]">
              {/* celular: um selo por vez, centralizado acima do dispositivo.
                  Os três selos soltos usam percentuais pensados para uma
                  caixa larga; em 318px eles se empilhavam uns sobre os
                  outros e sobre o próprio aparelho. */}
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center px-1 sm:hidden">
                <AnimatePresence mode="wait">
                  {ready &&
                    (() => {
                      const badge = BADGES[focused][Math.floor(step / 2) % 3];
                      return (
                        <motion.div
                          key={`${focused}-${badge.label}`}
                          className="flex max-w-[20rem] items-center gap-2.5 rounded-2xl border border-white/15 bg-[#0d1830]/70 px-3.5 py-2.5 shadow-[0_8px_32px_rgba(2,6,17,0.5)] backdrop-blur-md"
                          initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
                          transition={{ duration: 0.45, ease: EASE }}
                        >
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10 text-brand-300">
                            <badge.icon className="h-[18px] w-[18px]" />
                          </span>
                          <span className="text-[13px] font-medium leading-snug text-white/90">
                            {badge.label}
                          </span>
                        </motion.div>
                      );
                    })()}
                </AnimatePresence>
              </div>

              <div className="pointer-events-none absolute inset-0 z-10 hidden sm:block">
                <AnimatePresence>
                  {ready &&
                    BADGES[focused].map((badge, i) => (
                      <motion.div
                        key={`${focused}-${badge.label}`}
                        className={`absolute ${badge.className}`}
                        initial={{ opacity: 0, y: 16, scale: 0.9, filter: "blur(6px)" }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          filter: "blur(0px)",
                          transition: { duration: 0.6, delay: 0.55 + i * 0.14, ease: EASE },
                        }}
                        exit={{
                          opacity: 0,
                          y: -12,
                          scale: 0.94,
                          filter: "blur(6px)",
                          transition: { duration: 0.32, ease: "easeIn" },
                        }}
                      >
                        <div
                          className="animate-floaty"
                          style={{ animationDuration: `${5.4 + i * 1.4}s`, animationDelay: `${i * 0.8}s` }}
                        >
                          <div className="flex items-center gap-2.5 rounded-2xl border border-white/15 bg-[#0d1830]/60 px-3.5 py-2.5 shadow-[0_8px_32px_rgba(2,6,17,0.5)] backdrop-blur-md">
                            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/10 text-brand-300">
                              <badge.icon className="h-4 w-4" />
                            </span>
                            <span className="max-w-[190px] text-[12px] font-medium leading-snug text-white/90 sm:text-[13px]">
                              {badge.label}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* vinheta inferior para assentar o palco */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#04070f]/70 to-transparent"
        />
      </div>
    </section>
  );
}
