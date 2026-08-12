"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { ArrowRight, ArrowUpRight, Mail, Menu, X } from "lucide-react";
import MobileCtaBar from "./MobileCtaBar";
import { EASE, Wordmark } from "./primitives";
import { whatsappHref } from "@/lib/whatsapp";

const NAV_WHATSAPP_MESSAGE =
  "Olá! Estou no site da Flauzino e quero falar com um especialista sobre uma solução de tecnologia para minha empresa.";

/* ================================================================== */
/*  Header — uma pílula que começa larga e translúcida sobre a hero e  */
/*  contrai em vidro sólido depois dos primeiros 40px de scroll. A cor */
/*  do conteúdo não é fixa: um IntersectionObserver mede qual seção    */
/*  está chegando na barra e inverte texto e bordas conforme o         */
/*  data-nav-theme dela, então a marca continua legível tanto no ato   */
/*  escuro quanto no claro. O indicador de link é um layoutId que      */
/*  desliza entre os itens, e a régua inferior mostra o progresso da   */
/*  leitura. Nada disso escuta o evento de scroll direto: useScroll e  */
/*  IntersectionObserver dão o mesmo resultado sem custo por frame.    */
/* ================================================================== */

const LINKS = [
  { id: "quem-somos", label: "Quem somos" },
  { id: "inteligencia-artificial", label: "IA" },
  { id: "cases", label: "Cases" },
  { id: "servicos", label: "Serviços" },
];

const CTA_LABEL = "Falar com especialista";

/* Faixa de decisão: uma fita fina logo ABAIXO da pílula (que termina por
   volta de 66px). Quem encosta nela manda no header, então a troca
   acontece enquanto a seção se aproxima — e não depois de já ter passado
   por trás da barra. */
const BAND_TOP = 96;
const BAND_HEIGHT = 48;

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [onDark, setOnDark] = useState(true);
  /* seções marcadas com data-nav-chrome="bare" pedem o header do jeito
     que ele fica no topo da hero: largo, sem vidro, sem borda e sem
     régua. São os dois painéis WebGL de tela cheia — a pílula de vidro
     por cima deles cortava a imagem no meio. */
  const [bareSection, setBareSection] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 40));

  /* qual seção manda na cor do header agora. Quando a emenda entre dois
     atos cai dentro da faixa, as duas seções aparecem como visíveis; a
     que vence é a de baixo (maior offsetTop), que é justamente a que
     está chegando. O rootMargin é montado em pixels e refeito no resize
     porque a versão em % dava faixas de altura absurda em telas altas —
     e, com os números antigos, uma faixa de altura negativa. */
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-nav-theme]"),
    );
    if (!sections.length) return;

    const visible = new Set<HTMLElement>();
    let io: IntersectionObserver | null = null;

    const pick = () => {
      let winner: DOMStringMap | undefined;
      let lowest = -1;
      visible.forEach((s) => {
        if (s.offsetTop > lowest) {
          lowest = s.offsetTop;
          winner = s.dataset;
        }
      });
      if (!winner) return;
      setOnDark(winner.navTheme === "dark");
      setBareSection(winner.navChrome === "bare");
    };

    const connect = () => {
      io?.disconnect();
      visible.clear();

      const bottomInset = Math.max(0, window.innerHeight - BAND_TOP - BAND_HEIGHT);
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            const el = e.target as HTMLElement;
            if (e.isIntersecting) visible.add(el);
            else visible.delete(el);
          }
          pick();
        },
        { rootMargin: `-${BAND_TOP}px 0px -${bottomInset}px 0px`, threshold: 0 },
      );

      sections.forEach((s) => io?.observe(s));
    };

    connect();
    window.addEventListener("resize", connect);
    return () => {
      window.removeEventListener("resize", connect);
      io?.disconnect();
    };
  }, []);

  /* trava o scroll do body enquanto o drawer está aberto */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  /* "vidro" é o estado contraído com fundo e borda. Ele some no topo da
     página e volta a sumir dentro das seções bare: nelas o header abre
     de novo para 88rem e os links se afastam, exatamente como na hera. */
  const glass = scrolled && !bareSection;
  const dark = onDark || !glass;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4">
      <motion.div
        className="pointer-events-auto relative w-full overflow-hidden rounded-2xl border"
        animate={{
          maxWidth: glass ? "64rem" : "88rem",
          /* sobre o ato escuro a pílula é mais opaca e tem borda mais
             viva do que a versão antiga: por cima de um fundo quase
             preto, 72% de opacidade e 10% de borda sumiam no fundo e o
             header virava parte da seção em vez de flutuar sobre ela */
          backgroundColor: glass
            ? onDark
              ? "rgba(7,12,24,0.82)"
              : "rgba(255,255,255,0.78)"
            : "rgba(8,13,24,0)",
          borderColor: glass
            ? onDark
              ? "rgba(255,255,255,0.16)"
              : "rgba(15,23,42,0.08)"
            : "rgba(255,255,255,0)",
          backdropFilter: glass ? "blur(20px)" : "blur(0px)",
          boxShadow: glass
            ? onDark
              ? "0 0 0 1px rgba(255,255,255,0.06), 0 26px 60px -20px rgba(2,6,17,0.95)"
              : "0 18px 50px -28px rgba(16,24,40,0.35)"
            : "0 0 0 0 rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.45, ease: EASE }}
        style={{ WebkitBackdropFilter: glass ? "blur(20px)" : "blur(0px)" }}
      >
        {/* brilho interno de borda, o detalhe que separa vidro de fundo chapado */}
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 top-0 h-px transition-opacity duration-500 ${
            glass ? "opacity-100" : "opacity-0"
          } ${dark ? "bg-white/15" : "bg-white/70"}`}
        />

        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
          <a
            href="#top"
            /* max-lg e não max-sm: o iPad também é toque, e até 1023px a
               marca é um alvo de 38px. De 1024 para cima nada muda. */
            className="flex shrink-0 items-center py-1.5 transition-opacity duration-200 hover:opacity-80 max-lg:py-2.5"
            aria-label="Flauzino, ir para o início"
          >
            <Wordmark className={dark ? "!text-white" : "!text-brand-950"} />
          </a>

          <nav
            className="hidden items-center lg:flex"
            onMouseLeave={() => setHovered(null)}
          >
            {LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onMouseEnter={() => setHovered(l.id)}
                className={`relative whitespace-nowrap rounded-lg px-3.5 py-2 text-[13.5px] font-medium transition-colors duration-200 ${
                  dark
                    ? "text-white/65 hover:text-white"
                    : "text-slate-500 hover:text-brand-950"
                }`}
              >
                {hovered === l.id && (
                  <motion.span
                    layoutId="nav-pill"
                    aria-hidden
                    className={`absolute inset-0 -z-10 rounded-lg ${
                      dark ? "bg-white/10" : "bg-slate-900/[0.05]"
                    }`}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={whatsappHref(NAV_WHATSAPP_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className={`group hidden cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg px-4 py-2 text-[13px] font-semibold transition-all duration-200 sm:inline-flex max-lg:h-11 max-lg:py-0 ${
                dark
                  ? "bg-white text-[#0b1220] hover:bg-blue-50"
                  : "bg-brand-600 text-white hover:bg-brand-700"
              }`}
            >
              {CTA_LABEL}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>

            {/* 44px de área de toque: o botão de 36px era o único caminho
                para o menu no celular e ficava abaixo do mínimo confortável */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Abrir menu"
              aria-expanded={open}
              className={`-mr-1 grid h-11 w-11 place-items-center rounded-xl transition-colors lg:hidden ${
                dark
                  ? "text-white hover:bg-white/10 active:bg-white/15"
                  : "text-brand-950 hover:bg-slate-900/5 active:bg-slate-900/10"
              }`}
            >
              <Menu className="h-[22px] w-[22px]" />
            </button>
          </div>
        </div>

        {/* progresso de leitura */}
        <motion.div
          aria-hidden
          className={`absolute bottom-0 left-0 h-px w-full origin-left ${
            dark ? "bg-brand-400/70" : "bg-brand-600/60"
          }`}
          style={{ scaleX: progress, opacity: glass ? 1 : 0 }}
        />
      </motion.div>

      {/* ---------------------- drawer lateral (mobile) ---------------------- */}
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Fechar menu"
              className="pointer-events-auto fixed inset-0 z-[55] bg-[#04070f]/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
            />
            {/* o drawer é a navegação inteira do celular, então cada linha
                tem 56px de altura, seta de destino à direita e o convite
                de contato fecha a coluna acima da barra de gestos */}
            <motion.aside
              className="pb-safe-6 pointer-events-auto fixed bottom-0 right-0 top-0 z-[60] flex w-[87%] max-w-[22rem] flex-col overflow-y-auto border-l border-white/10 bg-[#080d18]/95 px-5 pt-5 backdrop-blur-xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.36, ease: EASE }}
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
            >
              <div className="flex items-center justify-between">
                <Wordmark className="!text-white" />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Fechar menu"
                  className="-mr-1 grid h-11 w-11 place-items-center rounded-xl text-white/70 transition-colors hover:bg-white/10 hover:text-white active:bg-white/15"
                >
                  <X className="h-[22px] w-[22px]" />
                </button>
              </div>

              <nav className="mt-8 flex flex-col">
                {LINKS.map((l, i) => (
                  <motion.a
                    key={l.id}
                    href={`#${l.id}`}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: 24, filter: "blur(6px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.08 + i * 0.06, duration: 0.5, ease: EASE }}
                    className="group flex min-h-[3.5rem] items-center justify-between gap-4 border-b border-white/[0.07] py-3.5 text-[19px] font-medium tracking-tight text-white/80 transition-colors hover:text-white active:text-white"
                  >
                    {l.label}
                    <ArrowUpRight className="h-[18px] w-[18px] shrink-0 text-white/25 transition-colors group-hover:text-brand-300" />
                  </motion.a>
                ))}
              </nav>

              <div className="mt-auto pt-10">
                <a
                  href={whatsappHref(NAV_WHATSAPP_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-white text-[15px] font-semibold text-[#0b1220] transition-colors duration-200 hover:bg-blue-50 active:bg-blue-100"
                >
                  {CTA_LABEL}
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="mailto:contato@flauzino.com.br"
                  className="mt-2 flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-medium text-white/50 transition-colors hover:text-white/80"
                >
                  <Mail className="h-4 w-4" />
                  contato@flauzino.com.br
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* no celular o CTA não cabe na pílula; ele volta ao alcance do polegar */}
      <MobileCtaBar label={CTA_LABEL} suppressed={open} />
    </header>
  );
}
