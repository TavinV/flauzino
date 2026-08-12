"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight, Blocks, Bot, ScanEye, ScrollText } from "lucide-react";
import { EASE } from "./primitives";
import { GradientText } from "./reactbits";
import { whatsappHref } from "@/lib/whatsapp";

/* ================================================================== */
/*  Inteligência artificial — o clímax do ato escuro. O Prism cobre a  */
/*  tela em WebGL e é a única imagem da seção; o resto é tipo e        */
/*  espaço, agora em eixo central. A primeira versão jogava tudo à     */
/*  esquerda com display de 80px e as capacidades caíam dentro da      */
/*  faixa de transição para o branco; aqui a coluna é central, a       */
/*  escala do título caiu quase pela metade e a seção termina com      */
/*  folga antes do degradê. O scrim é radial e mais denso no miolo,    */
/*  onde vive o texto, deixando o prisma brilhar pelas bordas.         */
/*                                                                     */
/*  A fita de modelos (Claude, Gemini, Mistral…) saiu daqui: virou     */
/*  parte do LogoLoop que fecha a seção. Sem ela o conteúdo cabe no    */
/*  viewport, então o padding voltou a ser simétrico e o bloco de fato */
/*  centraliza — antes o pb maior que o pt empurrava tudo para cima.   */
/* ================================================================== */

const Prism = dynamic(() => import("./prism/Prism"), { ssr: false });

const CAPABILITIES = [
  {
    icon: Bot,
    title: "Agentes que executam",
    body: "Fluxos conduzidos de ponta a ponta, dentro das regras que a operação já segue.",
  },
  {
    icon: ScrollText,
    title: "Leitura de documentos",
    body: "Contratos, notas e laudos interpretados e conferidos em segundos.",
  },
  {
    icon: ScanEye,
    title: "Visão computacional",
    body: "As câmeras que a empresa já tem passam a gerar dado confiável.",
  },
  {
    icon: Blocks,
    title: "Encaixe no que existe",
    body: "A operação segue de pé durante a implantação. Nada é jogado fora.",
  },
];

/* palavra em máscara: sobe e desembaça no lugar. o padding inferior
   reserva a descida de g, p e q para o overflow não cortar.
   as palavras fortes trocaram o gradiente estático (branco → brand-300)
   pelo GradientText do reactbits: mesma fase em todas, então a frase
   inteira varre de gelo a violeta junto, sem cada palavra por si */
function MaskWord({
  word,
  index,
  tone,
}: {
  word: string;
  index: number;
  tone: "muted" | "strong";
}) {
  return (
    <>
      <span className="inline-block overflow-hidden pb-[0.14em] align-bottom">
        <motion.span
          className="inline-block"
          initial={{ y: "108%", filter: "blur(12px)", opacity: 0 }}
          whileInView={{ y: "0%", filter: "blur(0px)", opacity: 1 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.95, ease: EASE, delay: 0.08 + index * 0.06 }}
        >
          <GradientText animationSpeed={7}>{word}</GradientText>
        </motion.span>
      </span>{" "}
    </>
  );
}

const HEADLINE: { word: string; tone: "muted" | "strong" }[] = [
  { word: "A", tone: "muted" },
  { word: "próxima", tone: "muted" },
  { word: "evolução", tone: "muted" },
  { word: "da", tone: "muted" },
  { word: "sua", tone: "muted" },
  { word: "operação", tone: "strong" },
  { word: "acontece", tone: "strong" },
  { word: "com", tone: "strong" },
  { word: "inteligência", tone: "strong" },
  { word: "artificial.", tone: "strong" },
];

export default function ArtificialIntelligence() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  /* o prisma só entra em cena depois que 10% da seção está na tela: antes
     disso ele apareceria já montado atrás do degradê da seção anterior.
     once, porque desmontar e remontar o canvas WebGL a cada passagem
     custa mais do que mantê-lo vivo. */
  const prismInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  /* parallax curto e em pixel, não em %: no mobile a coluna cresce para
     mais de 1200px de altura e ±3% viravam ±37px, altura suficiente para
     a última fileira entrar embaixo do degradê de transição */
  const contentY = useTransform(scrollYProgress, [0, 1], [16, -16]);
  const prismY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const prismScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1, 1.1]);

  return (
    <section
      ref={sectionRef}
      id="inteligencia-artificial"
      data-nav-theme="dark"
      /* painel WebGL de tela cheia: o header abre e fica sem vidro aqui,
         igual ao topo da hero (ver Nav) */
      data-nav-chrome="bare"
      /* 140dvh no celular reservava uma tela e meia de altura mínima para
         um conteúdo que cabe em uma: sobravam faixas mortas de prisma em
         cima e embaixo do texto, e o shader mais caro da página rodava
         sobre 40% a mais de pixels. Aqui o painel vale uma tela (svh, sem
         o pulo da barra do Safari) e cresce com o conteúdo se precisar. */
      className="relative isolate flex min-h-[100svh] scroll-mt-24 items-center overflow-hidden bg-[#04070f] py-20 sm:min-h-[140dvh] sm:py-24"
    >
      {/* o y e o scale continuam presos ao scroll, então o prisma não
          "acende": ele sobe e assenta enquanto a seção entra */}
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={reduced ? undefined : { y: prismY, scale: prismScale }}
        initial={{ opacity: 0 }}
        animate={{ opacity: prismInView ? 1 : 0 }}
        transition={{ duration: 1.1, ease: EASE }}
      >
        {prismInView && (
          <Prism
            animationType="rotate"
            timeScale={0.42}
            height={3.5}
            baseWidth={5.5}
            scale={2.9}
            hueShift={0}
            colorFrequency={1}
            noise={0.35}
            glow={0.9}
          />
        )}
      </motion.div>

      {/* scrim radial: denso no miolo, onde o texto mora, e leve nas bordas,
         onde o prisma tem permissão para aparecer */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[#04070f]/62" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(62% 52% at 50% 46%, rgba(4,7,15,0.62), rgba(4,7,15,0.12) 100%)",
          }}
        />
      </div>
      {/* só o pé tem degradê: em cima a seção começa com corte seco no
          branco de "Por que a Flauzino", que é o que dá ao header o
          instante exato para trocar de tema */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-20 bg-gradient-to-t from-white to-transparent"
      />

      {/* ----------------------- conteúdo, eixo central ----------------------- */}
      <motion.div
        className="relative mx-auto w-full max-w-6xl px-5 text-center lg:px-8"
        style={reduced ? undefined : { y: contentY }}
      >
        <h2 className="mx-auto max-w-4xl text-balance text-[clamp(1.9rem,3.4vw,3.05rem)] font-semibold leading-[1.12] tracking-tightest">
          {HEADLINE.map((w, i) => (
            <MaskWord key={`${w.word}-${i}`} word={w.word} index={i} tone={w.tone} />
          ))}
        </h2>

        <motion.p
          className="mx-auto mt-5 max-w-2xl text-balance text-[15px] leading-relaxed text-white/70 sm:mt-7 sm:text-[17px]"
          initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.7 }}
        >
          Nós transformamos processos manuais em sistemas inteligentes, conectados ao que sua empresa já usa.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.85, ease: EASE, delay: 0.85 }}
          className="mt-9"
        >
          <a
            href={whatsappHref(
              "Olá! Vi a seção de Inteligência Artificial no site da Flauzino e quero entender como aplicar agentes de IA e automação na minha operação.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-[15px] font-semibold text-[#0b1220] shadow-[0_18px_60px_-18px_rgba(147,197,253,0.75)] transition-all duration-200 hover:bg-brand-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
          >
            Falar com especialista
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
        </motion.div>

        {/* capacidades: quatro colunas centradas, com folga acima e abaixo.
            No celular a coluna centrada virava quatro blocos altos e
            iguais, cada um com o ícone sozinho numa linha; aqui cada
            capacidade vira uma linha de leitura — ícone à esquerda,
            título e frase à direita — na metade da altura. A troca é
            só de grid para flex: a ordem dos nós no DOM não muda. */}
        <div className="mt-12 grid gap-x-8 gap-y-7 sm:mt-16 sm:grid-cols-2 sm:gap-y-11 lg:mt-20 lg:grid-cols-4">
          {CAPABILITIES.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.title}
                /* as classes de desktop continuam sendo a base; o layout de
                   celular entra por max-sm para não deixar nenhuma
                   declaração sobrando no computed style de 640px acima */
                className="flex flex-col items-center max-sm:grid max-sm:grid-cols-[auto_minmax(0,1fr)] max-sm:items-start max-sm:gap-x-4 max-sm:text-left"
                initial={{ opacity: 0, y: 26, filter: "blur(9px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.1 + i * 0.09 }}
              >
                <motion.span
                  className="grid h-12 w-12 place-items-center rounded-2xl border border-white/15 bg-white/[0.07] text-brand-200 backdrop-blur-sm max-sm:row-span-2 max-sm:h-11 max-sm:w-11"
                  initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
                  whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{
                    type: "spring",
                    stiffness: 250,
                    damping: 17,
                    delay: 0.18 + i * 0.09,
                  }}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </motion.span>
                <h3 className="mt-4 text-[15px] font-semibold tracking-tight text-white max-sm:mt-0 max-sm:text-[16px]">
                  {c.title}
                </h3>
                <p className="mt-2 max-w-[15rem] text-sm leading-relaxed text-white/65 max-sm:mt-1.5 max-sm:max-w-none max-sm:text-[15px]">
                  {c.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
