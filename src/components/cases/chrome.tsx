"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { EASE, Reveal, Wordmark } from "@/components/landing/primitives";
import { StarField } from "@/components/landing/reactbits";
import Footer from "@/components/landing/Footer";
import { DaliaLogo, VisageLogo } from "@/components/cases/logos";
import { whatsappHref } from "@/lib/whatsapp";

/* ================================================================== */
/*  Chrome das páginas /cases/*. A versão anterior tinha um bloco só,  */
/*  o SectionIntro, com título à esquerda e parágrafo solto à direita, */
/*  repetido em toda seção de todo case: as quatro páginas ficavam com */
/*  o mesmo ritmo do começo ao fim. Aqui existem famílias distintas    */
/*  (enunciado, números, comparativo, vitrine de imagem e destaque) e  */
/*  cada case monta a sua sequência. O header segue o mesmo desenho    */
/*  da navegação nova da landing, inclusive sem escutar scroll direto. */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  Header                                                             */
/* ------------------------------------------------------------------ */

export function CaseTopBar({ whatsappMessage }: { whatsappMessage: string }) {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 40));

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4">
      <motion.div
        className="pointer-events-auto relative w-full overflow-hidden rounded-2xl border"
        animate={{
          maxWidth: scrolled ? "64rem" : "88rem",
          backgroundColor: scrolled ? "rgba(255,255,255,0.82)" : "rgba(8,13,24,0)",
          borderColor: scrolled ? "rgba(15,23,42,0.08)" : "rgba(255,255,255,0)",
          backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
          boxShadow: scrolled
            ? "0 18px 50px -28px rgba(16,24,40,0.35)"
            : "0 0 0 0 rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
          <Link
            href="/"
            className="flex shrink-0 items-center py-1.5 transition-opacity duration-200 hover:opacity-80 max-lg:py-2.5"
            aria-label="Flauzino, ir para o início"
          >
            <Wordmark className={scrolled ? "!text-brand-950" : "!text-white"} />
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            {/* no celular o rótulo não cabe ao lado do CTA, mas voltar para
                a lista de cases é a segunda ação mais provável da página;
                vira botão de ícone com 44px em vez de simplesmente sumir */}
            <Link
              href="/#cases"
              aria-label="Todos os cases"
              className={`grid h-11 w-11 place-items-center rounded-xl transition-colors sm:hidden ${
                scrolled
                  ? "text-slate-500 hover:bg-slate-900/5"
                  : "text-white/70 hover:bg-white/10"
              }`}
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <Link
              href="/#cases"
              className={`hidden items-center gap-1.5 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors sm:inline-flex ${
                scrolled
                  ? "text-slate-500 hover:text-brand-950"
                  : "text-white/65 hover:text-white"
              }`}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Todos os cases
            </Link>
            <a
              href={whatsappHref(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className={`group inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg px-4 py-2.5 text-[13px] font-semibold transition-all duration-200 max-lg:h-11 max-lg:py-0 ${
                scrolled
                  ? "bg-brand-600 text-white hover:bg-brand-700"
                  : "bg-white text-[#0b1220] hover:bg-brand-50"
              }`}
            >
              Falar com especialista
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        <motion.div
          aria-hidden
          className="absolute bottom-0 left-0 h-px w-full origin-left bg-brand-600/60"
          style={{ scaleX: progress, opacity: scrolled ? 1 : 0 }}
        />
      </motion.div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

/* "#rrggbb" para rgba() — tinge a atmosfera do hero com a cor do cliente */
function hexToRgba(hex: string, alpha: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

export function CaseHero({
  logo,
  title,
  intro,
  accent = "#93C5FD",
  meta = [],
  image,
  siteUrl,
}: {
  logo: ReactNode;
  title: string;
  intro: string;
  /** cor de assinatura do cliente: tinge aurora, fio editorial e horizonte */
  accent?: string;
  meta?: string[];
  image?: { src: string; alt: string; width: number; height: number };
  siteUrl?: string;
}) {
  return (
    <section className="relative bg-[#04070f] px-2 pt-2 sm:px-3 sm:pt-3">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/5 bg-[#070c19]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{
            background:
              `radial-gradient(44% 52% at 84% 10%, ${hexToRgba(accent, 0.16)}, transparent 70%),` +
              `radial-gradient(34% 42% at 4% 98%, ${hexToRgba(accent, 0.08)}, transparent 75%),` +
              "radial-gradient(30% 34% at 48% 112%, rgba(37,99,235,0.12), transparent 75%)",
          }}
        />
        <StarField className="opacity-60" />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-[24rem] -top-[28rem] h-[56rem] w-[56rem] rounded-full border border-white/[0.07]"
        />

        <div
          className={`relative z-10 mx-auto w-full max-w-8xl px-5 pt-28 sm:px-8 sm:pt-32 lg:pt-40 ${
            image
              ? "grid items-center gap-8 pb-8 sm:gap-10 sm:pb-10 lg:grid-cols-[minmax(0,44%)_minmax(0,56%)] lg:gap-10 lg:pb-4"
              : "pb-16 sm:pb-24 lg:pb-32"
          }`}
        >
          <div>
            <Reveal>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <div className="shrink-0">{logo}</div>
                {siteUrl && (
                  <a
                    href={`https://${siteUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 py-2.5 text-xs font-medium text-white/55 transition-colors hover:text-white max-lg:py-3.5"
                  >
                    {siteUrl}
                    <ArrowUpRight className="h-3 w-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                )}
                <span
                  aria-hidden
                  className="h-px min-w-[2rem] flex-1"
                  style={{
                    background: `linear-gradient(90deg, ${hexToRgba(accent, 0.45)}, transparent 72%)`,
                  }}
                />
              </div>
            </Reveal>

            {/* título em branco sólido: o shimmer varrendo a headline inteira
               lia como efeito genérico e competia com a aurora do painel */}
            <Reveal delay={0.08}>
              <h1 className="mt-6 text-balance text-[clamp(1.9rem,3.6vw,3.1rem)] font-semibold leading-[1.08] tracking-tightest text-white sm:mt-8">
                {title}
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              {/* 14px era o menor corpo de texto de toda a página de case,
                  justamente no parágrafo que explica o projeto */}
              <p className="mt-5 max-w-2xl text-balance text-[15px] leading-relaxed text-white/70 sm:mt-6">
                {intro}
              </p>
            </Reveal>

            {meta.length > 0 && (
              <Reveal delay={0.24}>
                <dl className="mt-7 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-5 sm:mt-9 sm:gap-x-8 sm:gap-y-4 sm:pt-6">
                  {meta.map((m) => (
                    <dd key={m} className="text-xs font-medium text-white/60">
                      {m}
                    </dd>
                  ))}
                </dl>
              </Reveal>
            )}
          </div>

          {image && (
            <Reveal
              delay={0.22}
              y={20}
              className="relative mx-auto w-full max-w-[680px] lg:max-w-none"
            >
              <div
                aria-hidden
                className="absolute inset-[6%] rounded-full blur-[90px]"
                style={{ background: hexToRgba(accent, 0.34) }}
              />
              <div className="relative animate-floaty">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  priority
                  sizes="(min-width: 1024px) 760px, 94vw"
                  className="relative h-auto w-full"
                />
              </div>
            </Reveal>
          )}
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#04070f]/70 to-transparent"
        />
        <div aria-hidden className="pointer-events-none absolute inset-x-6 bottom-0 sm:inset-x-12">
          <span
            className="absolute bottom-0 left-0 right-0 h-[3px] blur-[6px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${hexToRgba(accent, 0.5)}, transparent)`,
            }}
          />
          <span
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${hexToRgba(accent, 0.85)}, transparent)`,
            }}
          />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Família 1 — enunciado empilhado                                    */
/* ------------------------------------------------------------------ */

export function CaseStatement({
  title,
  children,
  align = "left",
  className = "",
}: {
  title: string;
  children?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      <Reveal>
        <h2 className="text-balance text-[clamp(1.7rem,3.2vw,2.6rem)] font-semibold leading-[1.1] tracking-tightest text-brand-950">
          {title}
        </h2>
      </Reveal>
      {children && (
        <Reveal delay={0.08}>
          <div className="mt-5 max-w-[64ch] space-y-4 text-[15px] leading-relaxed text-slate-600 sm:mt-6 sm:space-y-5 sm:text-[17px]">
            {children}
          </div>
        </Reveal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Família 2 — números soltos em hairline                             */
/* ------------------------------------------------------------------ */

export function CaseMetrics({
  items,
}: {
  items: { value: string; desc: string }[];
}) {
  return (
    <div className="grid gap-x-10 gap-y-8 border-t border-slate-200 pt-8 sm:grid-cols-3 sm:gap-y-10 sm:pt-10">
      {items.map((m, i) => (
        <motion.div
          key={m.desc}
          initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, ease: EASE, delay: i * 0.1 }}
        >
          <div className="font-mono text-[clamp(2.2rem,4vw,3rem)] font-semibold leading-none tracking-tight text-brand-950">
            {m.value}
          </div>
          <p className="mt-3 max-w-[22ch] text-sm leading-snug text-slate-500 max-sm:max-w-none max-sm:text-[15px]">
            {m.desc}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Família 3 — comparativo antes e depois                             */
/* ------------------------------------------------------------------ */

export function CaseCompare({
  beforeLabel,
  before,
  afterLabel,
  after,
  accent = "#93C5FD",
}: {
  beforeLabel: string;
  before: string[];
  afterLabel: string;
  after: string[];
  accent?: string;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <motion.div
        className="flex flex-col rounded-3xl border border-slate-200 bg-canvas p-6 sm:p-9"
        initial={{ opacity: 0, x: -20, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.85, ease: EASE }}
      >
        {/* slate-500 e não slate-400: o rótulo precisa ser lido sobre o canvas */}
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          {beforeLabel}
        </span>
        <ul className="mt-7 space-y-4">
          {before.map((item) => (
            <li key={item} className="flex items-start gap-3.5">
              <span aria-hidden className="mt-2 h-px w-4 shrink-0 bg-slate-300" />
              <span className="text-[15px] leading-relaxed text-slate-500">{item}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        className="flex flex-col rounded-3xl bg-flauzino-navy-900 p-6 shadow-fl-lg sm:p-9"
        initial={{ opacity: 0, x: 20, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.85, ease: EASE, delay: 0.1 }}
      >
        <span
          className="text-[11px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: accent }}
        >
          {afterLabel}
        </span>
        <ul className="mt-7 space-y-4">
          {after.map((item, i) => (
            <motion.li
              key={item}
              className="flex items-start gap-3.5"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.25 + i * 0.08 }}
            >
              <span
                aria-hidden
                className="mt-2 h-px w-4 shrink-0"
                style={{ background: accent }}
              />
              <span className="text-[15px] leading-relaxed text-white/85">{item}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Família 4 — vitrine de imagem real do produto                      */
/* ------------------------------------------------------------------ */

export function CaseShowcase({
  items,
  feature = false,
}: {
  items: { src: string; alt: string; caption: string; width: number; height: number }[];
  /** primeiro item em largura cheia, o resto em duas colunas */
  feature?: boolean;
}) {
  return (
    <div className={`grid gap-5 ${feature ? "" : "sm:grid-cols-2"}`}>
      {items.map((it, i) => (
        <motion.figure
          key={it.src}
          className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-fl-md ${
            feature && i === 0 ? "sm:col-span-2" : ""
          }`}
          initial={{ opacity: 0, y: 34, filter: "blur(12px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.9, ease: EASE, delay: i * 0.1 }}
        >
          {/* Estas capturas têm 1917px de largura. Encaixadas na coluna de
              um celular elas saíam com 318 por 143 pixels: a interface
              inteira — menu, tabela, indicadores — virava um chuvisco de
              cinza e azul. A seção prometia "o produto por dentro" e não
              mostrava nada.

              Diminuir de vez não resolve, e cortar um pedaço escolhe pelo
              leitor o que ele pode ver. Então abaixo de 640px a captura
              mantém uma largura de leitura (880px, onde o texto da
              interface volta a existir) dentro de uma faixa que arrasta
              na horizontal. O degradê na borda direita é o que avisa que
              há mais imagem do lado de fora. De 640px para cima a imagem
              volta a caber inteira e nada disso se aplica. */}
          <div className="relative">
            <div className="rail overflow-hidden max-sm:overflow-x-auto">
              <Image
                src={it.src}
                alt={it.alt}
                width={it.width}
                height={it.height}
                sizes="(max-width: 640px) 880px, 50vw"
                className="h-auto w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] max-sm:w-[880px] max-sm:max-w-none"
              />
            </div>
            {/* fica FORA da faixa que rola, senão o degradê passearia
                junto com a imagem em vez de marcar a borda */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-white/85 to-transparent sm:hidden"
            />
          </div>
          <figcaption className="border-t border-slate-100 px-5 py-4 text-sm font-medium text-slate-600 sm:px-6">
            {it.caption}
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Família 5 — destaque editorial em painel escuro                    */
/* ------------------------------------------------------------------ */

export function CaseHighlight({
  children,
  footnote,
  accent = "#93C5FD",
}: {
  children: ReactNode;
  footnote?: string;
  accent?: string;
}) {
  return (
    <Reveal>
      {/* px-8 dentro de uma seção que já tem px-5 deixava a citação com
          256px de largura em uma tela de 360 — o texto de maior peso da
          página era o mais estreito dela */}
      <div className="relative overflow-hidden rounded-3xl bg-flauzino-navy-900 px-6 py-12 sm:px-14 sm:py-14 lg:px-20 lg:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(48% 64% at 88% 4%, ${hexToRgba(accent, 0.2)}, transparent 72%)`,
          }}
        />
        <p className="relative max-w-4xl text-balance text-[clamp(1.45rem,2.6vw,2rem)] font-semibold leading-[1.24] tracking-tight text-white">
          {children}
        </p>
        {footnote && (
          <p className="relative mt-6 text-sm text-white/55 max-sm:text-[15px]">{footnote}</p>
        )}
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Família 6 — frentes de trabalho em lista com guia                  */
/* ------------------------------------------------------------------ */

export function CaseTracks({
  items,
}: {
  /** `icon` chega já renderizado (ex.: <FlaskConical />), nunca o componente
      em si — passar a função quebra a fronteira server/client do RSC. */
  items: { title: string; body: string; icon?: ReactNode }[];
}) {
  return (
    <div className="grid gap-x-14 gap-y-7 sm:grid-cols-2 sm:gap-y-9">
      {items.map((item, i) => (
        <motion.div
          key={item.title}
          className="relative pl-6"
          initial={{ opacity: 0, x: -16, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.75, ease: EASE, delay: i * 0.08 }}
        >
          <motion.span
            aria-hidden
            className="absolute left-0 top-1.5 h-[calc(100%-0.75rem)] w-[2px] origin-top rounded-full bg-brand-500/80"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.2 + i * 0.08 }}
          />
          {item.icon && (
            <span
              aria-hidden
              className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600 [&_svg]:h-[18px] [&_svg]:w-[18px]"
            >
              {item.icon}
            </span>
          )}
          <h3 className="text-[17px] font-semibold tracking-tight text-brand-950">
            {item.title}
          </h3>
          <p className="mt-1.5 text-[15px] leading-relaxed text-slate-600">{item.body}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Família 7 — cards com ícone                                        */
/* ------------------------------------------------------------------ */

export function CaseCards({
  items,
  accent = "#93C5FD",
  columns = 3,
}: {
  /** `icon` chega já renderizado (ex.: <FlaskConical />) — passar o
      componente em si quebra a fronteira server/client do RSC. */
  items: { icon: ReactNode; title: string; body: string }[];
  accent?: string;
  /** duas colunas para pares, três para conjuntos maiores */
  columns?: 2 | 3;
}) {
  return (
    <div
      className={`grid gap-4 sm:gap-5 ${
        columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
      }`}
    >
      {items.map((item, i) => (
        <motion.div
          key={item.title}
          className="rounded-3xl border border-slate-200 bg-white p-6 transition-colors duration-300 hover:border-slate-300 sm:p-7"
          initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.75, ease: EASE, delay: i * 0.08 }}
        >
          <span
            aria-hidden
            className="grid h-11 w-11 place-items-center rounded-xl [&_svg]:h-5 [&_svg]:w-5"
            style={{ background: hexToRgba(accent, 0.12), color: accent }}
          >
            {item.icon}
          </span>
          <h3 className="mt-5 text-[16px] font-semibold tracking-tight text-brand-950">
            {item.title}
          </h3>
          <p className="mt-2 text-[14.5px] leading-relaxed text-slate-600">{item.body}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Seção: casca com respiro consistente                               */
/* ------------------------------------------------------------------ */

export function CaseSection({
  children,
  tone = "white",
  className = "",
}: {
  children: ReactNode;
  tone?: "white" | "canvas";
  className?: string;
}) {
  return (
    <section
      className={`border-t border-slate-200/70 py-16 sm:py-20 lg:py-28 ${
        tone === "canvas" ? "bg-canvas" : "bg-white"
      } ${className}`}
    >
      <div className="mx-auto max-w-8xl px-5 sm:px-8">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Outros cases                                                       */
/* ------------------------------------------------------------------ */

type RelatedCase = { slug: string; label: string; title: string; logo: ReactNode };

/* Os quatro wordmarks são normalizados pela altura da LETRA, não pela
   altura da caixa — é o que o olho compara. Antes cada um seguia a sua
   própria régua e o Canário, um PNG cortado rente às letras em h-6,
   aparecia quase o dobro do "Visage" em text-lg (cujas maiúsculas só
   ocupam 70% do corpo da fonte). Alvo: 15px de altura de letra.
     · Canário: PNG rente às letras → a altura renderizada é a da letra.
     · Máquina Code: a engrenagem estica a arte, e as letras ficam em
       61% da altura da imagem → 15 / 0,61 ≈ 24px de caixa.
     · Poppins e Bodoni têm caixa-alta em 0,70 do corpo → 15 / 0,70 ≈ 21px. */
const RELATED_CASES: RelatedCase[] = [
  {
    slug: "visage",
    label: "Visage",
    title: "A primeira chamada de aula por reconhecimento facial do Brasil.",
    logo: <VisageLogo className="text-[21px] text-brand-950" mark={24} />,
  },
  {
    slug: "canario",
    label: "Canário Capital",
    title: "Rotinas críticas até 51 vezes mais rápidas.",
    logo: (
      <Image
        src="/cases/canario/logo.png"
        alt="Canário Capital"
        width={720}
        height={88}
        className="h-[15px] w-auto"
      />
    ),
  },
  {
    slug: "maquina-code",
    label: "Máquina Code",
    title: "Parceria técnica que renovou um contrato estratégico.",
    logo: (
      <span className="inline-flex rounded-md bg-white px-2.5 py-1.5 ring-1 ring-slate-200">
        <Image
          src="/cases/maquina-code/logo.webp"
          alt="Máquina Code"
          width={640}
          height={106}
          className="h-6 w-auto"
        />
      </span>
    ),
  },
  {
    slug: "dalia",
    label: "Dália Semijoias",
    title: "Vitrine e estoque na mesma operação.",
    logo: <DaliaLogo className="text-[21px]" tracking="tracking-[0.08em]" />,
  },
];

/* Lista com hairline em vez de três cards iguais: os cards repetiam o
   desenho já usado nas seções de conteúdo de cada página. */
export function CaseRelated({ current }: { current: string }) {
  const others = RELATED_CASES.filter((c) => c.slug !== current);

  return (
    <CaseSection tone="canvas">
      <Reveal>
        <h2 className="text-balance text-[clamp(1.5rem,2.6vw,2.1rem)] font-semibold leading-[1.16] tracking-tightest text-brand-950">
          Outros projetos que já estão no ar.
        </h2>
      </Reveal>

      <div className="mt-9 border-t border-slate-200 sm:mt-12">
        {others.map((c, i) => (
          <motion.div
            key={c.slug}
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
          >
            <Link
              href={`/cases/${c.slug}`}
              aria-label={`${c.label}, ver estudo de caso`}
              className="group grid items-center gap-3 border-b border-slate-200 py-6 transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:pl-4 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_auto] sm:gap-10 sm:py-7"
            >
              <span className="flex items-center">{c.logo}</span>
              <span className="text-balance text-[15px] leading-snug text-slate-600 transition-colors duration-200 group-hover:text-brand-950">
                {c.title}
              </span>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 text-slate-400 transition-all duration-300 group-hover:border-brand-600 group-hover:bg-brand-600 group-hover:text-white">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </CaseSection>
  );
}

/* ------------------------------------------------------------------ */
/*  Fecho                                                              */
/* ------------------------------------------------------------------ */

export function CaseCta({
  title = "Quer um resultado assim no seu negócio?",
  desc = "Conte o seu desafio para a nossa equipe. Projetamos a solução sob medida, do primeiro diagnóstico à operação em produção.",
  whatsappMessage = "Olá! Vi um case no site da Flauzino e quero um resultado assim no meu negócio. Podemos conversar?",
}: {
  title?: string;
  desc?: string;
  whatsappMessage?: string;
}) {
  return (
    <section className="bg-canvas px-5 pb-16 pt-0 sm:px-8 sm:pb-20 lg:pb-28">
      <Reveal>
        <div className="relative mx-auto max-w-8xl overflow-hidden rounded-3xl bg-flauzino-navy-900 px-6 py-14 text-center sm:px-12 sm:py-16 lg:py-20">
          <StarField className="opacity-40" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(42% 60% at 50% 0%, rgba(37,99,235,0.22), transparent 70%)",
            }}
          />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-balance text-[clamp(1.5rem,3vw,2.2rem)] font-semibold leading-[1.14] tracking-tightest text-white">
              {title}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-balance text-sm leading-relaxed text-white/70 max-sm:text-[15px] sm:text-base">
              {desc}
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a
                href={whatsappHref(whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-[15px] font-semibold text-[#0b1220] transition-all duration-200 hover:bg-brand-50 max-sm:h-14 max-sm:w-full max-sm:justify-center max-sm:py-0"
              >
                Falar com especialista
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
              <Link
                href="/#cases"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-7 py-3.5 text-[15px] font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white max-sm:h-14 max-sm:w-full max-sm:justify-center max-sm:py-0"
              >
                <ArrowLeft className="h-4 w-4" />
                Todos os cases
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function CaseShell({
  children,
  whatsappMessage = "Olá! Estou vendo um case no site da Flauzino e quero uma solução parecida para o meu negócio.",
}: {
  children: ReactNode;
  whatsappMessage?: string;
}) {
  return (
    <main className="relative overflow-x-clip bg-white">
      <CaseTopBar whatsappMessage={whatsappMessage} />
      {children}
      <Footer />
    </main>
  );
}
