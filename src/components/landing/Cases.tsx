"use client";

import type { ReactNode } from "react";
import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { EASE, Eyebrow, Reveal } from "./primitives";
import { DaliaLogo, VisageLogo } from "@/components/cases/logos";

/* ================================================================== */
/*  Cases — a prova do ato claro. A versão anterior explicava cada     */
/*  projeto em um parágrafo inteiro; aqui cada card carrega a imagem   */
/*  real do produto, o cliente e um único resultado, porque quem lê    */
/*  essa altura da página quer reconhecer o porte do trabalho, não     */
/*  estudar o escopo. A grade alterna 3+2 e 2+3 para não repetir o     */
/*  mesmo ritmo duas vezes, e o estudo completo fica a um clique.      */
/*                                                                     */
/*  ---- abaixo de lg o desenho é outro ----                           */
/*                                                                     */
/*  A grade empilhada custava 1.400px de rolagem para quatro itens, e  */
/*  o pior: o card é uma imagem de fundo com o texto por cima, então   */
/*  uma captura de painel de 1917px de largura entrava recortada num   */
/*  quadro de 320 por 416 e virava um borrão azul atrás da frase.      */
/*  Nada do produto aparecia.                                          */
/*                                                                     */
/*  No celular o card é remontado: a imagem sobe para uma faixa 16:10  */
/*  no topo, onde cabe inteira e a interface se reconhece, e o texto   */
/*  desce para o navy sólido, onde tem contraste garantido sem                */
/*  precisar de scrim. Os quatro viram uma trilha que arrasta na       */
/*  horizontal, com o vizinho espiando na borda para dizer que há      */
/*  mais — quatro telas de rolagem viram uma.                          */
/* ================================================================== */

type CaseItem = {
  href: string;
  client: string;
  sector: string;
  result: string;
  image?: { src: string; alt: string };
  logo: ReactNode;
};

const CANARIO_LOGO = (
  <Image
    src="/cases/canario/logo.png"
    alt="Canário Capital"
    width={720}
    height={88}
    className="h-5 w-auto"
  />
);

/* a marca da Máquina Code é azul escuro e sumia no card;
   ganha uma placa branca para ter onde se apoiar */
const MAQUINA_LOGO = (
  <span className="inline-flex rounded-lg bg-white px-3 py-2">
    <Image
      src="/cases/maquina-code/logo.webp"
      alt="Máquina Code"
      width={640}
      height={106}
      className="h-5 w-auto"
    />
  </span>
);

const CASES: CaseItem[] = [
  {
    href: "/cases/visage",
    client: "Visage",
    sector: "Educação",
    result:
      "A primeira chamada de aula por reconhecimento facial do Brasil, sem hardware proprietário.",
    image: { src: "/cases/visage/hero.png", alt: "Painel do Visage em operação" },
    logo: <VisageLogo className="text-xl text-white" mark={26} />,
  },
  {
    href: "/cases/canario",
    client: "Canário Capital",
    sector: "Mercado financeiro",
    result: "Rotinas críticas até 51 vezes mais rápidas.",
    image: { src: "/cases/canario/hero.png", alt: "Plataforma da Canário Capital" },
    logo: CANARIO_LOGO,
  },
  {
    href: "/cases/maquina-code",
    client: "Máquina Code",
    sector: "Tecnologia",
    result: "Parceria técnica que renovou um contrato estratégico.",
    logo: MAQUINA_LOGO,
  },
  {
    href: "/cases/dalia",
    client: "Dália Semijoias",
    sector: "Varejo",
    result: "Vitrine e estoque passaram a viver na mesma operação.",
    image: { src: "/cases/dalia/hero.png", alt: "E-commerce da Dália Semijoias" },
    logo: <DaliaLogo className="text-2xl" color="#ffffff" tracking="tracking-[0.04em]" />,
  },
];

/* fundo dos cards sem captura própria — o mesmo dos dois desenhos */
const FALLBACK_BG =
  "radial-gradient(85% 110% at 12% 0%, rgba(19,98,240,0.42), transparent 68%), linear-gradient(160deg, #101a2d, #0b1220)";

/* ------------------------------------------------------------------ */
/*  Card do desktop — imagem de fundo com o texto por cima             */
/* ------------------------------------------------------------------ */

type CaseCardProps = {
  href: string;
  client: string;
  sector: string;
  result: string;
  image?: { src: string; alt: string };
  logo: ReactNode;
  className?: string;
  tall?: boolean;
};

function CaseCard({
  href,
  client,
  sector,
  result,
  image,
  logo,
  className = "",
  tall = false,
}: CaseCardProps) {
  return (
    <Link
      href={href}
      aria-label={`${client}, ver estudo de caso`}
      className={`group relative flex overflow-hidden rounded-3xl bg-flauzino-navy-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/40 ${
        tall ? "min-h-[26rem] lg:min-h-[32rem]" : "min-h-[20rem] lg:min-h-[15.25rem]"
      } ${className}`}
    >
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover object-top transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />
      ) : (
        <div aria-hidden className="absolute inset-0" style={{ background: FALLBACK_BG }} />
      )}

      {/* scrim: o texto tem que passar em contraste sobre qualquer screenshot */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-[#050a15] via-[#050a15]/80 to-[#050a15]/25 transition-opacity duration-500 group-hover:opacity-[0.92]"
      />

      <div className="relative z-10 flex w-full flex-col justify-end p-7 sm:p-9">
        <div className="flex items-start justify-between gap-4">
          <div className="opacity-90 transition-opacity duration-300 group-hover:opacity-100">
            {logo}
          </div>
          <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/20 text-white/70 transition-all duration-300 group-hover:border-white/40 group-hover:bg-white group-hover:text-[#0b1220]">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <p
          className={`mt-5 text-balance font-semibold leading-snug tracking-tight text-white ${
            tall ? "max-w-lg text-[clamp(1.35rem,2.4vw,2rem)]" : "max-w-sm text-lg sm:text-xl"
          }`}
        >
          {result}
        </p>
        <span className="mt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-300/80">
          {sector}
        </span>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Card do celular — imagem em cima, texto embaixo em navy sólido     */
/* ------------------------------------------------------------------ */

function CaseSlide({ item }: { item: CaseItem }) {
  return (
    <Link
      href={item.href}
      aria-label={`${item.client}, ver estudo de caso`}
      className="flex w-full flex-col overflow-hidden rounded-3xl bg-flauzino-navy-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/40"
    >
      {/* 16:10 é o recorte em que a interface ainda se reconhece:
          mais alto que isso e a captura vira textura */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {item.image ? (
          <Image
            src={item.image.src}
            alt={item.image.alt}
            fill
            sizes="80vw"
            className="object-cover object-top"
          />
        ) : (
          <div aria-hidden className="absolute inset-0" style={{ background: FALLBACK_BG }} />
        )}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-flauzino-navy-900 to-transparent"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          {item.logo}
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/20 text-white/70">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <p className="mt-4 text-balance text-[17px] font-semibold leading-snug tracking-tight text-white">
          {item.result}
        </p>
        <span className="mt-auto pt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-300/80">
          {item.sector}
        </span>
      </div>
    </Link>
  );
}

function CasesRail() {
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  /* o índice sai da posição real de cada card, não de uma conta com a
     largura: assim continua certo com qualquer largura de tela */
  const onScroll = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    let best = 0;
    let bestDist = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const dist = Math.abs((child as HTMLElement).offsetLeft - el.scrollLeft - 20);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActive(best);
  }, []);

  return (
    <div className="mt-10 lg:hidden">
      <div
        ref={railRef}
        onScroll={onScroll}
        className="rail -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pl-5 px-5 pb-1"
      >
        {CASES.map((item, i) => (
          <motion.div
            key={item.href}
            /* a largura fica no item da trilha (o card só preenche): com
               78% sobra uma fatia do vizinho na borda, que é o que avisa
               que dá para arrastar sem precisar escrever "arraste" */
            className="flex w-[78%] max-w-[19rem] shrink-0 snap-start"
            initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.8, ease: EASE, delay: Math.min(i, 2) * 0.09 }}
          >
            <CaseSlide item={item} />
          </motion.div>
        ))}
      </div>

      {/* posição na trilha — o card vizinho espiando já diz que há mais,
          os traços dizem quanto falta */}
      <div className="mt-5 flex justify-center gap-1.5" aria-hidden>
        {CASES.map((c, i) => (
          <span
            key={c.href}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === active ? "w-6 bg-brand-600" : "w-1.5 bg-slate-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Cases() {
  return (
    <section
      id="cases"
      data-nav-theme="light"
      className="relative scroll-mt-24 border-t border-slate-200/70 bg-canvas py-20 sm:py-28 lg:py-40"
    >
      <div className="mx-auto max-w-9xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>Cases</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-5 text-balance text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-[1.08] tracking-tightest text-brand-950">
              Quatro empresas, quatro problemas difíceis.
            </h2>
          </Reveal>
        </div>

        <CasesRail />

        <div className="mt-16 hidden gap-5 lg:grid lg:grid-cols-5">
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.95, ease: EASE }}
          >
            <CaseCard
              tall
              href={CASES[0].href}
              client={CASES[0].client}
              sector={CASES[0].sector}
              result={CASES[0].result}
              image={CASES[0].image}
              logo={CASES[0].logo}
              className="h-full"
            />
          </motion.div>

          <div className="grid gap-5 lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.95, ease: EASE, delay: 0.12 }}
            >
              <CaseCard
                href={CASES[1].href}
                client={CASES[1].client}
                sector={CASES[1].sector}
                result={CASES[1].result}
                image={CASES[1].image}
                logo={CASES[1].logo}
                className="h-full"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.95, ease: EASE, delay: 0.2 }}
            >
              <CaseCard
                href={CASES[2].href}
                client={CASES[2].client}
                sector={CASES[2].sector}
                result={CASES[2].result}
                logo={CASES[2].logo}
                className="h-full"
              />
            </motion.div>
          </div>

          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.95, ease: EASE, delay: 0.1 }}
          >
            <CaseCard
              href={CASES[3].href}
              client={CASES[3].client}
              sector={CASES[3].sector}
              result={CASES[3].result}
              image={CASES[3].image}
              logo={CASES[3].logo}
              className="min-h-[19rem] lg:min-h-[21rem]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
