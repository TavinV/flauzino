"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import { Search, Puzzle, Compass, Layers } from "lucide-react";
import { CountUp, EASE } from "./primitives";

/* ================================================================== */
/*  Por que a Flauzino — seção clara encaixada entre dois painéis      */
/*  escuros (a hero acima, a IA abaixo). O branco aqui não é decisão   */
/*  de estilo: sem ele a hero emendava na seção seguinte sem nenhuma   */
/*  quebra e a página parecia uma coisa só. O título fica sticky à     */
/*  esquerda enquanto os quatro compromissos passam à direita, cada    */
/*  um com seu ícone, e a linha vertical se preenche conforme a        */
/*  leitura avança.                                                    */
/* ================================================================== */

const COMMITMENTS = [
  {
    icon: Search,
    title: "Entendimento antes do código",
    body: "Começamos pelo problema. Entendemos a operação, os objetivos e as restrições do projeto antes de definir como a tecnologia será construída.",
  },
  {
    icon: Puzzle,
    title: "Tecnologia na medida do negócio",
    body: "Cada projeto tem necessidades diferentes. Escolhemos arquitetura, ferramentas e soluções de acordo com o que realmente faz sentido para a operação.",
  },
  {
    icon: Compass,
    title: "Clareza durante o projeto",
    body: "Mantemos escopo, prioridades e decisões técnicas claros ao longo do desenvolvimento, para que o cliente acompanhe a evolução do produto.",
  },
  {
    icon: Layers,
    title: "Feito para continuar evoluindo",
    body: "Entregamos sistemas estruturados para receber novas funcionalidades, integrações e melhorias conforme as necessidades do negócio mudam.",
  },
];

function Commitment({
  item,
  index,
}: {
  item: (typeof COMMITMENTS)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px -15% 0px" });
  const Icon = item.icon;

  return (
    <motion.div
      ref={ref}
      /* a calha do ícone valia 64px de uma coluna de 320px no celular —
         um quinto da largura para um selo de 40px. Aqui ela encolhe
         para 56px e devolve o espaço ao texto. */
      className="relative pb-10 pl-14 last:pb-0 sm:pb-12 sm:pl-20"
      initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.85, ease: EASE }}
    >
      {/* o ícone chega girando para dentro do trilho e assenta com mola */}
      <motion.span
        className="absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-brand-600 shadow-fl-sm sm:h-11 sm:w-11"
        initial={{ scale: 0.4, rotate: -35, opacity: 0 }}
        animate={inView ? { scale: 1, rotate: 0, opacity: 1 } : {}}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 18,
          delay: 0.12 + index * 0.05,
        }}
      >
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </motion.span>

      {/* piso do clamp de 1,1rem para 1,2rem: só manda abaixo de 1010px,
          então o 1,9vw continua decidindo de 1024px para cima */}
      <h3 className="text-balance text-[clamp(1.2rem,1.9vw,1.4rem)] font-semibold leading-snug tracking-tight text-brand-950">
        {item.title}
      </h3>
      <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-slate-600 sm:mt-2.5">
        {item.body}
      </p>
    </motion.div>
  );
}

export default function WhyFlauzino() {
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 65%", "end 60%"],
  });
  const fill = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  });
  const headlineY = useTransform(fill, [0, 1], [0, -18]);

  return (
    <section
      id="por-que-a-flauzino"
      data-nav-theme="light"
      className="relative scroll-mt-24 overflow-hidden bg-white py-24 sm:py-28 lg:py-40"
    >
      <div className="relative mx-auto max-w-9xl px-5 lg:px-8">
        <div className="grid gap-12 sm:gap-14 lg:grid-cols-[minmax(0,42%)_minmax(0,1fr)] lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <motion.div style={{ y: headlineY }}>
              <motion.h2
                className="text-balance text-[clamp(2rem,4.2vw,3.25rem)] font-semibold leading-[1.07] tracking-tightest text-brand-950"
                initial={{ opacity: 0, y: 28, filter: "blur(12px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={{ duration: 0.95, ease: EASE }}
              >
                Empresas escolhem a Flauzino para ir além.
              </motion.h2>

              <motion.p
                className="mt-6 max-w-md text-[15px] leading-relaxed text-slate-600 sm:text-[17px]"
                initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={{ duration: 0.85, ease: EASE, delay: 0.12 }}
              >
                Desenvolvemos e evoluímos sistemas sob medida para empresas que precisam transformar
                processos, criar novos produtos ou levar operações existentes para outro nível.
              </motion.p>

              {/* o único número que temos de verdade, tratado como assinatura */}
              <motion.div
                className="mt-9 flex items-center gap-5 border-t border-slate-200 pt-7 sm:mt-10 sm:pt-8"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
              >
                <span className="font-mono text-[clamp(2.5rem,5vw,3.75rem)] font-semibold leading-none tracking-tight text-brand-950">
                  <CountUp to={8} />
                  <span className="text-brand-500">+</span>
                </span>
                <span className="max-w-[13rem] text-sm leading-snug text-slate-500">
                  anos construindo sistemas que não podem parar
                </span>
              </motion.div>
            </motion.div>
          </div>

          <div ref={listRef} className="relative">
            <div
              aria-hidden
              className="absolute bottom-0 left-[19px] top-10 w-px bg-slate-200 sm:left-[21px] sm:top-11"
            />
            <motion.div
              aria-hidden
              className="absolute bottom-0 left-[19px] top-10 w-px origin-top bg-gradient-to-b from-brand-500 via-brand-500/60 to-transparent sm:left-[21px] sm:top-11"
              style={{ scaleY: fill }}
            />

            {COMMITMENTS.map((item, i) => (
              <Commitment key={item.title} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
