"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Eyebrow, Item, Reveal, Stagger } from "./primitives";

const PLANS = [
  {
    name: "Starter",
    price: "R$89",
    scope: "Até 5 turmas",
    desc: "Para escolas que querem começar pequeno e ver o resultado.",
    features: [
      "Totens ilimitados nos dispositivos da escola",
      "Proteção contra fraudes incluída",
      "Relatórios de frequência em tempo real",
    ],
  },
  {
    name: "Escola",
    price: "R$149",
    scope: "Até 20 turmas",
    desc: "O equilíbrio ideal para a maioria das instituições.",
    features: [
      "Tudo do Starter",
      "Auditoria completa para a coordenação",
      "Suporte prioritário",
    ],
    highlight: true,
  },
  {
    name: "Instituto",
    price: "R$249",
    scope: "Turmas ilimitadas",
    desc: "Para redes e instituições de ensino superior.",
    features: [
      "Tudo do plano Escola",
      "Múltiplos períodos letivos",
      "Acompanhamento dedicado na implantação",
    ],
  },
];

export default function PlansSection() {
  return (
    <section
      id="planos"
      className="relative scroll-mt-24 border-t border-slate-200/70 bg-canvas py-24 lg:py-32"
    >
      <div className="mx-auto max-w-8xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal className="flex justify-center">
            <Eyebrow>Planos</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-5 text-balance text-[clamp(2.1rem,4.4vw,3.4rem)] font-semibold leading-[1.02] tracking-tightest text-brand-950">
              Um plano para cada tamanho de escola
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-slate-600">
              Mensal, sem contrato de fidelidade e sem equipamento para
              comprar. Cancele quando quiser.
            </p>
          </Reveal>
        </div>

        <Stagger className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <Item key={plan.name} className="h-full">
              <div
                className={`relative flex h-full flex-col rounded-3xl border bg-white p-7 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift ${
                  plan.highlight
                    ? "border-brand-200 ring-2 ring-brand-500/60"
                    : "border-slate-200"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-pop">
                    Mais escolhido
                  </span>
                )}

                <span className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-600">
                  {plan.name}
                </span>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-4xl font-semibold tracking-tight text-brand-950">
                    {plan.price}
                  </span>
                  <span className="text-sm text-slate-500">/mês</span>
                </div>
                <span className="mt-1 text-sm font-medium text-slate-500">
                  {plan.scope}
                </span>
                <p className="mt-4 text-sm leading-relaxed text-slate-500">
                  {plan.desc}
                </p>

                <div className="mt-6 flex-1 space-y-3 border-t border-slate-100 pt-6">
                  {plan.features.map((f) => (
                    <span key={f} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-brand-600" />
                      <span className="text-sm leading-relaxed text-slate-600">
                        {f}
                      </span>
                    </span>
                  ))}
                </div>

                <Link
                  href={`/demonstracao?plano=${encodeURIComponent(plan.name)}`}
                  className={`group mt-7 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 ${
                    plan.highlight
                      ? "bg-brand-600 text-white shadow-pop hover:bg-brand-700 hover:shadow-lift"
                      : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:text-brand-800"
                  }`}
                >
                  Solicitar demonstração
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </Item>
          ))}
        </Stagger>

        <Reveal delay={0.15}>
          <p className="mt-10 text-center text-sm text-slate-400">
            Todos os planos incluem conformidade com a LGPD, criptografia dos
            dados e atualizações contínuas.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
