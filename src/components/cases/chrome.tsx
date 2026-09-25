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
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, X } from "lucide-react";
import { CountUp, EASE, Reveal, Wordmark } from "@/components/landing/primitives";
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

type BackLink = { href: string; label: string };

/* páginas que não são case (ex.: /reconhecimento-facial) trocam o destino
   do "voltar"; os cases seguem com a lista de cases */
const CASES_BACK: BackLink = { href: "/#cases", label: "Todos os cases" };

export function CaseTopBar({ back = CASES_BACK }: { back?: BackLink }) {
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
              href={back.href}
              aria-label={back.label}
              className={`grid h-11 w-11 place-items-center rounded-xl transition-colors sm:hidden ${
                scrolled
                  ? "text-slate-500 hover:bg-slate-900/5"
                  : "text-white/70 hover:bg-white/10"
              }`}
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <Link
              href={back.href}
              className={`hidden items-center gap-1.5 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors sm:inline-flex ${
                scrolled
                  ? "text-slate-500 hover:text-brand-950"
                  : "text-white/65 hover:text-white"
              }`}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {back.label}
            </Link>
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
  actions,
  siteUrl,
  align = "left",
  scrollHint,
}: {
  /** marca do cliente acima do título; opcional na abertura centralizada */
  logo?: ReactNode;
  title: string;
  intro: string;
  /** cor de assinatura do cliente: tinge aurora, fio editorial e horizonte */
  accent?: string;
  meta?: string[];
  image?: { src: string; alt: string; width: number; height: number };
  /** CTAs logo abaixo do parágrafo de abertura */
  actions?: ReactNode;
  siteUrl?: string;
  /** "center" monta a abertura só de texto, no eixo do painel (sem imagem) */
  align?: "left" | "center";
  /** âncora da seta de rolagem no pé da abertura centralizada */
  scrollHint?: string;
}) {
  const hasMedia = Boolean(image);
  const centered = align === "center" && !hasMedia;
  const accentLine = (direction: "90deg" | "270deg") => (
    <span
      aria-hidden
      className={`h-px ${centered ? "w-10 sm:w-16" : "min-w-[2rem] flex-1"}`}
      style={{
        background: `linear-gradient(${direction}, ${hexToRgba(accent, 0.45)}, transparent 72%)`,
      }}
    />
  );
  return (
    <section className="relative bg-[#04070f] px-2 pt-2 sm:px-3 sm:pt-3">
      {/* centralizada, a abertura ocupa a tela inteira, como a hero da
          home: o conteúdo fica no meio do painel e a seta no pé convida a
          descer */}
      <div
        className={`relative overflow-hidden rounded-[1.75rem] border border-white/5 bg-[#070c19] ${
          centered ? "flex min-h-[calc(100svh-0.5rem)] flex-col sm:min-h-[calc(100svh-0.75rem)]" : ""
        }`}
      >
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
          className={`relative z-10 mx-auto w-full max-w-8xl px-5 sm:px-8 ${
            hasMedia
              ? "grid items-center gap-8 pb-8 pt-28 sm:gap-10 sm:pb-10 sm:pt-32 lg:grid-cols-[minmax(0,44%)_minmax(0,56%)] lg:gap-10 lg:pb-4 lg:pt-40"
              : centered
                ? "flex flex-1 flex-col justify-center py-28 sm:py-32"
                : "pb-16 pt-28 sm:pb-24 sm:pt-32 lg:pb-32 lg:pt-40"
          }`}
        >
          {/* no celular a imagem entra antes do texto: h1 + parágrafo + meta
              empilhados sem nenhum respiro visual liam como parede de texto
              antes de qualquer imagem aparecer. A ordem no DOM não muda —
              só a visual (order), então H1 continua sendo o primeiro
              conteúdo real da página para leitor de tela e SEO. De 1024px
              para cima a ordem volta a ser a original (texto à esquerda). */}
          <div
            className={
              hasMedia ? "order-2 lg:order-1" : centered ? "mx-auto max-w-5xl text-center" : undefined
            }
          >
            {(logo || siteUrl) && (
            <Reveal>
              <div
                className={`flex flex-wrap items-center gap-x-5 gap-y-3 ${centered ? "justify-center" : ""}`}
              >
                {centered && accentLine("270deg")}
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
                {accentLine("90deg")}
              </div>
            </Reveal>
            )}

            {/* título em branco sólido: o shimmer varrendo a headline inteira
               lia como efeito genérico e competia com a aurora do painel.
               Centralizado e sem imagem, a abertura é só um convite para a
               leitura: título curto, largo e em no máximo duas linhas. */}
            <Reveal delay={0.08}>
              <h1
                className={`text-balance font-semibold leading-[1.08] tracking-tightest text-white ${
                  logo || siteUrl ? "mt-6 sm:mt-8" : ""
                } ${
                  centered
                    ? "mx-auto text-[clamp(1.15rem,5.8vw,1.6rem)] sm:text-[clamp(2rem,4vw,3.4rem)]"
                    : "text-[clamp(1.9rem,3.6vw,3.1rem)]"
                }`}
              >
                {title}
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              {/* 14px era o menor corpo de texto de toda a página de case,
                  justamente no parágrafo que explica o projeto */}
              <p
                className={`mt-5 max-w-2xl text-balance leading-relaxed text-white/70 sm:mt-6 ${
                  centered ? "mx-auto text-[15px] sm:mt-7 sm:text-[18px]" : "text-[15px]"
                }`}
              >
                {intro}
              </p>
            </Reveal>

            {actions && (
              <Reveal delay={0.2}>
                <div
                  className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center ${
                    centered ? "mt-9 sm:mt-11 sm:justify-center" : "mt-7 sm:mt-9"
                  }`}
                >
                  {actions}
                </div>
              </Reveal>
            )}

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
              className="relative order-1 mx-auto w-full max-w-[680px] lg:order-2 lg:max-w-none"
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

        {centered && scrollHint && (
          <a
            href={scrollHint}
            aria-label="Continuar lendo"
            className="absolute bottom-6 left-1/2 z-10 grid h-11 w-11 -translate-x-1/2 place-items-center rounded-full border border-white/15 text-white/60 transition-colors duration-200 hover:border-white/30 hover:text-white sm:bottom-8"
          >
            <ChevronDown className="h-5 w-5 animate-floaty" style={{ animationDuration: "2.6s" }} />
          </a>
        )}
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
  const centered = align === "center";
  return (
    /* centralizado, o enunciado usa a largura: título em até 64rem e com
       piso menor no celular, para caber em duas linhas em vez de virar
       uma coluna estreita de quatro */
    <div className={`${centered ? "mx-auto max-w-5xl text-center" : "max-w-3xl"} ${className}`}>
      <Reveal>
        <h2
          className={`text-balance font-semibold leading-[1.1] tracking-tightest text-brand-950 ${
            centered ? "text-[clamp(1.45rem,3.2vw,2.6rem)]" : "text-[clamp(1.7rem,3.2vw,2.6rem)]"
          }`}
        >
          {title}
        </h2>
      </Reveal>
      {children && (
        <Reveal delay={0.08}>
          {/* centralizado, o bloco de texto também precisa do mx-auto: sem
              ele, os 64ch ficavam encostados à esquerda dentro dos 48rem */}
          <div
            className={`mt-5 max-w-[64ch] space-y-4 text-[15px] leading-relaxed text-slate-600 sm:mt-6 sm:space-y-5 sm:text-[17px] ${
              align === "center" ? "mx-auto" : ""
            }`}
          >
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
            <MetricValue value={m.value} />
          </div>
          <p className="mt-3 max-w-[22ch] text-sm leading-snug text-slate-500 max-sm:max-w-none max-sm:text-[15px]">
            {m.desc}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

/* "99%+", "< 3s" viram contagem até o número com o prefixo/sufixo em volta
   intactos; algo sem dígito (ex.: "CLT") não tem o que contar e cai direto
   no texto estático — nunca força uma animação sem sentido. */
function MetricValue({ value }: { value: string }) {
  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(\D*)$/);
  if (!match) return <>{value}</>;
  const [, prefix, number, suffix] = match;
  return (
    <>
      {prefix}
      <CountUp to={Number(number)} />
      {suffix}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Família 3 — comparativo antes e depois                             */
/*                                                                     */
/*  Duas colunas que se leem linha a linha: no desktop os dois cartões */
/*  são subgrids da mesma grade, então o item 2 da esquerda fica na    */
/*  mesma altura do item 2 da direita, mesmo quando um texto quebra    */
/*  em duas linhas e o outro não. A versão anterior tinha um traço     */
/*  antes de cada item que não assentava na linha do texto, e o rótulo */
/*  do cartão escuro era azul-claro sobre navy — ambos saíram. Agora   */
/*  o cabeçalho é um título de verdade com um selo (✕ / ✓), e os itens */
/*  são só texto, em corpo de leitura.                                 */
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
  /** tinge só a luz do cartão escuro, nunca texto */
  accent?: string;
}) {
  const rows = Math.max(before.length, after.length) + 1;

  return (
    <div
      className="grid gap-5 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-0 lg:[grid-template-rows:repeat(var(--compare-rows),auto)]"
      style={{ ["--compare-rows" as string]: rows }}
    >
      <motion.div
        className="flex flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-fl-xs sm:p-10 lg:row-span-full lg:grid lg:grid-rows-subgrid"
        initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.85, ease: EASE }}
      >
        <div className="flex items-center gap-3.5 pb-5 sm:pb-7">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500">
            <X className="h-[18px] w-[18px]" strokeWidth={2} />
          </span>
          <h3 className="text-[17px] font-semibold tracking-tight text-slate-700 sm:text-lg">
            {beforeLabel}
          </h3>
        </div>
        {before.map((item) => (
          <p key={item} className="py-3 text-[15px] leading-relaxed text-slate-500 sm:py-3.5 sm:text-base">
            {item}
          </p>
        ))}
      </motion.div>

      <motion.div
        className="relative flex flex-col overflow-hidden rounded-3xl bg-flauzino-navy-900 p-7 shadow-fl-xl sm:p-10 lg:row-span-full lg:grid lg:grid-rows-subgrid"
        initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.85, ease: EASE, delay: 0.1 }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(55% 70% at 100% 0%, ${hexToRgba(accent, 0.16)}, transparent 70%)`,
          }}
        />
        <div className="relative flex items-center gap-3.5 pb-5 sm:pb-7">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-flauzino-navy-900">
            <Check className="h-[18px] w-[18px]" strokeWidth={2.25} />
          </span>
          <h3 className="text-[17px] font-semibold tracking-tight text-white sm:text-lg">{afterLabel}</h3>
        </div>
        {after.map((item, i) => (
          <motion.p
            key={item}
            className="relative py-3 text-[15px] font-medium leading-relaxed text-white/90 sm:py-3.5 sm:text-base"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.25 + i * 0.08 }}
          >
            {item}
          </motion.p>
        ))}
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
          <div className="relative overflow-hidden">
            <Image
              src={it.src}
              alt={it.alt}
              width={it.width}
              height={it.height}
              sizes="(max-width: 640px) 100vw, 50vw"
              className="h-auto w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
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
  /** duas colunas para pares, três para conjuntos maiores, quatro para uma faixa só */
  columns?: 2 | 3 | 4;
}) {
  return (
    <div
      className={`grid gap-4 sm:gap-5 ${
        columns === 2
          ? "sm:grid-cols-2"
          : columns === 4
            ? "sm:grid-cols-2 lg:grid-cols-4"
            : "sm:grid-cols-2 lg:grid-cols-3"
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
/*  Família 8 — convite para um case                                   */
/*                                                                     */
/*  Um cartão inteiro clicável que leva a um estudo de caso: marca,    */
/*  uma frase de resultado e a imagem real do produto. Serve para      */
/*  páginas que falam de uma capacidade (ex.: /reconhecimento-facial)  */
/*  apontarem para a prova, sem repetir o case dentro delas.           */
/* ------------------------------------------------------------------ */

export function CaseLinkCard({
  href,
  logo,
  label,
  title,
  cta,
  image,
}: {
  href: string;
  logo: ReactNode;
  /** rótulo pequeno acima do título (ex.: "Case de sucesso") */
  label: string;
  title: string;
  cta: string;
  image: { src: string; alt: string; width: number; height: number };
}) {
  return (
    <Reveal>
      <Link
        href={href}
        className="group relative grid overflow-hidden rounded-3xl bg-flauzino-navy-900 shadow-fl-lg transition-shadow duration-300 hover:shadow-fl-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/40 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 80% at 85% 50%, rgba(37,99,235,0.28), transparent 70%)",
          }}
        />
        <div className="relative px-6 py-9 sm:px-10 sm:py-12 lg:py-14 lg:pl-14 lg:pr-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {logo}
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
              {label}
            </span>
          </div>
          <h3 className="mt-6 max-w-md text-balance text-[clamp(1.1rem,5.6vw,1.35rem)] font-semibold leading-[1.2] tracking-tight text-white sm:text-[clamp(1.35rem,2.2vw,1.75rem)]">
            {title}
          </h3>
          <span className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-[15px] font-semibold text-[#0b1220] transition-colors duration-200 group-hover:bg-blue-50">
            {cta}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
        <div className="relative px-6 pb-8 sm:px-10 lg:py-10 lg:pl-0 lg:pr-10">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(min-width: 1024px) 700px, 92vw"
            className="relative h-auto w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
          />
        </div>
      </Link>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Seção: casca com respiro consistente                               */
/* ------------------------------------------------------------------ */

export function CaseSection({
  children,
  tone = "white",
  className = "",
  id,
}: {
  children: ReactNode;
  tone?: "white" | "canvas";
  className?: string;
  /** âncora da seção; o scroll-mt desconta a barra fixa do topo */
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-20 border-t border-slate-200/70 py-16 sm:py-20 lg:py-28 ${
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
  secondary = { ...CASES_BACK, direction: "back" },
}: {
  title?: string;
  desc?: string;
  whatsappMessage?: string;
  /** segundo botão; nos cases, a volta para a lista. null tira o botão */
  secondary?: (BackLink & { direction: "back" | "forward" }) | null;
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
              {secondary && (
                <Link
                  href={secondary.href}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-7 py-3.5 text-[15px] font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white max-sm:h-14 max-sm:w-full max-sm:justify-center max-sm:py-0"
                >
                  {secondary.direction === "back" && <ArrowLeft className="h-4 w-4" />}
                  {secondary.label}
                  {secondary.direction === "forward" && <ArrowRight className="h-4 w-4" />}
                </Link>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function CaseShell({ children, back }: { children: ReactNode; back?: BackLink }) {
  return (
    <main className="relative overflow-x-clip bg-white">
      <CaseTopBar back={back} />
      {children}
      <Footer />
    </main>
  );
}
