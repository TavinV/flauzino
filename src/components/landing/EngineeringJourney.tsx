"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Eyebrow, EASE, Reveal } from "./primitives";
import { StarField } from "./reactbits";

/* ================================================================== */
/*  Engenharia de software — a IA acelera a escrita de código, mas o    */
/*  produto confiável nasce da engenharia ao redor dele. Painel escuro  */
/*  com StarField (mesma atmosfera da Hero) e um roadmap horizontal de  */
/*  6 etapas cuja linha de progresso preenche ao entrar na viewport.    */
/* ================================================================== */

const STEPS: { label: string; tag?: string }[] = [
  { label: "Código gerado por IA", tag: "Ponto de partida" },
  { label: "Arquitetura" },
  { label: "Testes" },
  { label: "Monitoramento" },
  { label: "Segurança" },
  { label: "Software confiável em produção", tag: "Resultado" },
];

function Roadmap() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const last = STEPS.length - 1;

  return (
    <div ref={ref} className="mt-16">
      <div className="flex items-center justify-between gap-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
        <span>Do código gerado ao produto em produção</span>
        <span className="whitespace-nowrap">0{STEPS.length} etapas</span>
      </div>

      <div className="mt-10 overflow-x-auto pb-2">
        <div className="relative grid grid-flow-col auto-cols-[minmax(148px,1fr)] gap-2 sm:auto-cols-fr">
          {/* trilho base */}
          <div
            aria-hidden
            className="absolute left-[19px] right-[19px] top-[19px] h-px bg-white/15"
          />
          {/* trilho preenchido — anima da esquerda pro fim ao entrar na tela */}
          <motion.div
            aria-hidden
            className="absolute left-[19px] right-[19px] top-[19px] h-px origin-left bg-gradient-to-r from-brand-400 to-brand-300"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.7, ease: EASE, delay: 0.35 }}
          />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.label}
              className="relative flex flex-col items-start"
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE, delay: 0.15 + i * 0.09 }}
            >
              <span
                className={`grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full border-2 text-xs font-semibold tabular-nums ${
                  i === last
                    ? "border-brand-400 bg-brand-500 text-white"
                    : i === 0
                      ? "border-white/30 bg-transparent text-white/50"
                      : "border-white/15 bg-[#0b1220] text-white/40"
                }`}
              >
                0{i + 1}
              </span>
              <span className="mt-4 text-sm font-medium leading-snug text-white">
                {step.label}
              </span>
              {step.tag && (
                <span
                  className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                    i === last ? "text-brand-300" : "text-white/35"
                  }`}
                >
                  {step.tag}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function EngineeringJourney() {
  return (
    <section className="relative overflow-hidden border-t border-white/5 bg-[#070c19] py-24 lg:py-32">
      <StarField className="opacity-50" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[22rem] -top-[26rem] h-[52rem] w-[52rem] rounded-full border border-white/[0.06]"
      />

      <div className="relative mx-auto max-w-9xl px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,42%)_1fr] lg:gap-16">
          <div>
            <Reveal>
              <Eyebrow className="!text-brand-300">Engenharia de software</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-5 text-balance text-[clamp(1.9rem,3.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight">
                <span className="text-white/40">A IA escreve código.</span>
                <br />
                <span className="text-white">Nós construímos software.</span>
              </h2>
            </Reveal>
          </div>

          <div className="space-y-5">
            <Reveal delay={0.1}>
              <p className="text-[15px] leading-relaxed text-white/70 sm:text-base">
                A inteligência artificial mudou a forma de desenvolver
                software, e nós fazemos uso dela diariamente para acelerar
                entregas e aumentar a produtividade da equipe. Mas código
                gerado rapidamente ainda precisa de arquitetura, testes,
                monitoramento, segurança e decisões técnicas para se tornar
                um produto confiável.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="text-[15px] leading-relaxed text-white/70 sm:text-base">
                É nesse ponto que a engenharia faz diferença. Enquanto você
                concentra seus esforços no crescimento da empresa, nós
                garantimos que a tecnologia acompanhe esse ritmo, preparada
                para evoluir sem comprometer desempenho, estabilidade ou
                segurança.
              </p>
            </Reveal>
          </div>
        </div>

        <Roadmap />
      </div>
    </section>
  );
}
