"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { EASE, Reveal } from "./primitives";
import { whatsappHref } from "@/lib/whatsapp";

/* ================================================================== */
/*  FAQ — as objeções que aparecem antes da primeira conversa. Título  */
/*  e contato ficam na coluna da esquerda para o acordeão não repetir  */
/*  o desenho de linhas cheias usado logo acima, em Situações.         */
/* ================================================================== */

export type FAQEntry = { q: string; a: string };

const QUESTIONS: FAQEntry[] = [
  {
    q: "A Flauzino só faz reconhecimento facial?",
    a: "Não. É o nosso case mais conhecido, mas a maior parte do que entregamos são plataformas sob medida, automação de processo e IA aplicada a outros problemas de negócio.",
  },
  {
    q: "Como funciona um projeto sob medida?",
    a: "Começa por entender o problema, não por escolher um pacote. Definimos escopo, arquitetura e, quando faz sentido, o modelo de IA. Depois do lançamento seguimos cuidando do sistema.",
  },
  {
    q: "Os dados dos usuários ficam protegidos?",
    a: "Sim. Criptografia de ponta a ponta, consentimento explícito e conformidade com a LGPD, com trilha de auditoria desde a primeira linha de código.",
  },
  {
    q: "Quanto tempo leva para colocar no ar?",
    a: "Depende do escopo. Sobre um produto que já existe, como o Visage, são poucas semanas. Projetos construídos do zero seguem o cronograma acertado no início.",
  },
  {
    q: "Vocês atendem empresas de qualquer porte?",
    a: "Sim. Vai de mesa proprietária de investimentos a empresa menor que precisa de um sistema específico bem resolvido, sem escopo inflado.",
  },
  {
    q: "Existe acompanhamento depois da entrega?",
    a: "Boa parte dos nossos contratos inclui sustentação contínua, com monitoramento e evolução do sistema ao longo dos anos seguintes.",
  },
];

function FAQItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-slate-200">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left transition-colors duration-200 hover:text-brand-700 sm:gap-6 sm:py-5"
      >
        <span className="text-[17px] font-semibold leading-snug tracking-tight text-brand-950">
          {q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className={`grid h-9 w-9 flex-none place-items-center rounded-full transition-colors duration-200 sm:h-8 sm:w-8 ${
            open ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-600"
          }`}
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            {/* pr-10 reservava 40px à direita para a coluna do ícone; no
                celular isso é 11% da linha desperdiçado sem motivo */}
            <p className="max-w-[62ch] pb-5 pr-0 text-[15px] leading-relaxed text-slate-600 sm:pb-6 sm:pr-10">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* FAQPage a partir das mesmas perguntas renderizadas no acordeão — nunca
   gera schema para pergunta sem resposta visível, porque lê do mesmo
   array que o acordeão usa. */
function faqJsonLd(questions: FAQEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

const DEFAULT_INTRO = (
  <>
    Ficou alguma dúvida de fora?{" "}
    <a
      href={whatsappHref(
        "Olá! Li as perguntas frequentes no site da Flauzino e fiquei com uma dúvida. Podem me ajudar?",
      )}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-brand-700 underline decoration-brand-200 underline-offset-4 transition-colors hover:decoration-brand-500"
    >
      Mande um WhatsApp para nós
    </a>
    .
  </>
);

/* Sem props, é o FAQ da home. Páginas internas (ex.: /reconhecimento-facial)
   passam as próprias perguntas e o próprio título, e herdam o acordeão e
   o FAQPage sem duplicar nada. */
export default function FAQ({
  questions = QUESTIONS,
  title = "Antes de falar com a gente.",
  intro = DEFAULT_INTRO,
  id = "faq",
}: {
  questions?: FAQEntry[];
  title?: string;
  intro?: ReactNode;
  id?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id={id}
      data-nav-theme="light"
      className="relative scroll-mt-24 border-t border-slate-200/70 bg-white py-24 sm:py-28 lg:py-36"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(questions)) }}
      />
      <div className="mx-auto max-w-9xl px-5 lg:px-8">
        <div className="grid gap-9 sm:gap-12 lg:grid-cols-[minmax(0,34%)_minmax(0,1fr)] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <h2 className="text-balance text-[clamp(1.85rem,3.4vw,2.6rem)] font-semibold leading-[1.1] tracking-tightest text-brand-950">
                {title}
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-slate-500">{intro}</p>
            </Reveal>
          </div>

          <Reveal delay={0.06}>
            <div className="border-t border-slate-200">
              {questions.map((item, i) => (
                <FAQItem
                  key={item.q}
                  q={item.q}
                  a={item.a}
                  open={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
