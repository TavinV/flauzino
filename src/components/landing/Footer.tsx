import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Wordmark } from "./primitives";
import { whatsappHref } from "@/lib/whatsapp";

/* ================================================================== */
/*  Rodapé — fecha a página devolvendo o tom escuro da abertura e leva */
/*  o último convite antes dos links. As colunas seguem as mesmas      */
/*  âncoras da navegação para não quebrar links já publicados.         */
/* ================================================================== */

const COLS = [
  {
    title: "O que fazemos",
    links: [
      { label: "Inteligência artificial", href: "/#inteligencia-artificial" },
      { label: "Reconhecimento facial", href: "/cases/visage" },
      { label: "Situações que atendemos", href: "/#servicos" },
      { label: "Perguntas frequentes", href: "/#faq" },
    ],
  },
  {
    title: "Cases",
    links: [
      { label: "Visage", href: "/cases/visage" },
      { label: "Canário Capital", href: "/cases/canario" },
      { label: "Máquina Code", href: "/cases/maquina-code" },
      { label: "Dália Semijoias", href: "/cases/dalia" },
    ],
  },
  {
    title: "Contato",
    links: [
      { label: "Quem somos", href: "/#quem-somos" },
      { label: "contato@flauzino.com.br", href: "mailto:contato@flauzino.com.br" },
      { label: "Privacidade e LGPD", href: "/#faq" },
    ],
  },
];

export default function Footer() {
  return (
    <footer data-nav-theme="dark" className="relative overflow-hidden bg-[#070c19]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(42% 60% at 78% 0%, rgba(37,99,235,0.16), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-9xl px-5 lg:px-8">
        {/* último convite */}
        <div className="grid gap-8 border-b border-white/10 py-16 sm:gap-10 sm:py-20 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:py-24">
          <h2 className="max-w-2xl text-balance text-[clamp(1.85rem,3.8vw,3rem)] font-semibold leading-[1.08] tracking-tightest text-white">
            Conte o problema. A gente diz como consegue resolver.
          </h2>
          <a
            href={whatsappHref(
              "Olá! Vim pelo site da Flauzino. Quero contar meu problema e saber se vocês conseguem resolver.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex w-fit shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-[15px] font-semibold text-[#0b1220] transition-all duration-200 hover:bg-blue-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30 max-sm:h-14 max-sm:w-full max-sm:justify-center max-sm:py-0"
          >
            Falar com especialista
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
        </div>

        <div className="grid gap-10 py-14 sm:gap-12 sm:py-16 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Wordmark className="!text-white" />
            <p className="mt-5 text-sm leading-relaxed text-white/50 max-sm:text-[15px]">
              Software house brasileira. Projetamos sistemas sob medida e
              inteligência artificial aplicada para empresas que dependem de
              tecnologia funcionando.
            </p>
          </div>
          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                {col.title}
              </h3>
              {/* py generoso: no celular cada link precisa de área de toque,
                 não só da altura da própria linha de texto */}
              <ul className="mt-4 space-y-0.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      /* 48px de altura no celular: com py-2.5 a linha
                         fechava em 40px, abaixo do mínimo confortável de
                         toque, e são treze links seguidos */
                      className="block py-3 text-sm text-white/65 transition-colors duration-200 hover:text-white lg:py-2.5"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-white/10 py-7 pb-9 sm:flex-row sm:items-center sm:pb-7">
          <span className="text-xs text-white/35">
            © {new Date().getFullYear()} Flauzino. Todos os direitos reservados.
          </span>
          <span className="text-xs text-white/35">Feito para confiar.</span>
        </div>
      </div>
    </footer>
  );
}
