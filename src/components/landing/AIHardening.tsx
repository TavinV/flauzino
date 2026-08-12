"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Item, Reveal, Stagger } from "./primitives";

/* ================================================================== */
/*  Serviço — blindagem de SaaS nascidos de vibecoding. Painel claro,   */
/*  CTA direto para o funil de serviços; a contraparte "vendida" das    */
/*  perguntas de ServicesQuestions ("Meu SaaS foi desenvolvido com IA").*/
/* ================================================================== */

const DELIVERABLES = [
  "Revisão completa da arquitetura do sistema",
  "Testes automatizados e integração contínua",
  "Auditoria de segurança e identificação de vulnerabilidades",
  "Otimização de performance e banco de dados",
  "Estrutura preparada para crescimento e manutenção",
  "Acompanhamento técnico contínuo",
];

export default function AIHardening() {
  return (
    <section className="border-t border-slate-200/70 bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-9xl px-5 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,38%)_1fr] lg:gap-16">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                Serviço
              </span>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-5 text-balance text-[clamp(1.9rem,3.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight text-brand-950">
                Blindagem para projetos desenvolvidos com IA.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-slate-600 sm:text-base">
                Já tem um SaaS criado com vibecoding? Podemos assumir a
                evolução do projeto, revisar a arquitetura, implementar
                testes automatizados, identificar riscos de segurança,
                corrigir gargalos de performance e preparar sua aplicação
                para crescer com previsibilidade. Em muitos casos, essa
                revisão evita meses de retrabalho no futuro.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <Link
                href="/demonstracao"
                className="group mt-8 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-pop transition-all duration-200 hover:bg-brand-700 hover:shadow-lift"
              >
                Conheça nossos serviços
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          </div>

          <div>
            <Reveal className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              <span>O que entregamos</span>
              <span className="whitespace-nowrap">0{DELIVERABLES.length} frentes</span>
            </Reveal>

            <Stagger className="mt-6 grid gap-4 sm:grid-cols-2" gap={0.08}>
              {DELIVERABLES.map((d, i) => (
                <Item key={d} className="h-full">
                  <div className="h-full rounded-2xl border border-slate-200 bg-canvas p-6 transition-colors duration-300 hover:border-brand-200 hover:bg-brand-50/40">
                    <span className="font-mono text-xs text-brand-500">0{i + 1}</span>
                    <p className="mt-2 text-[15px] font-medium leading-snug text-brand-950">
                      {d}
                    </p>
                  </div>
                </Item>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  );
}
