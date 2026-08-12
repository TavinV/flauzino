"use client";

import { CheckCircle2 } from "lucide-react";
import { Eyebrow, Reveal } from "./primitives";
import { EnrollMockup, ReportsMockup } from "./mockups";
import TotemDeviceRow from "./TotemCarousel";

const VIEWS: {
  title: string;
  desc: string;
  bullets: string[];
  mockup: React.ReactNode;
  reverse?: boolean;
}[] = [
  {
    title: "O professor acompanha tudo ao vivo",
    desc: "Enquanto os alunos entram, a lista de presença se preenche sozinha no painel. A coordenação enxerga a frequência de todas as turmas em um só lugar.",
    bullets: [
      "Frequência consolidada por aluno, turma e período.",
      "Alertas de baixa frequência antes de virarem reprovação.",
      "Relatórios prontos para a secretaria, sem planilhas.",
    ],
    mockup: <ReportsMockup />,
    reverse: true,
  },
  {
    title: "Cadastro em minutos, com consentimento",
    desc: "Sem papel e sem fila: o aluno digita o CPF no próprio totem, confirma quem é, aceita o termo de consentimento e faz a captura guiada — pronto para a próxima chamada.",
    bullets: [
      "O aluno digita o CPF direto no totem — sem convite impresso.",
      "Termo de consentimento claro, em conformidade com a LGPD.",
      "Captura guiada em segundos: centro, direita e esquerda.",
    ],
    mockup: <EnrollMockup />,
  },
];

export default function SystemShowcase() {
  return (
    <section
      id="plataforma"
      className="relative scroll-mt-24 border-t border-slate-200/70 bg-canvas py-24 lg:py-32"
    >
      <div className="mx-auto max-w-9xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal className="flex justify-center">
            <Eyebrow>Como funciona</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-5 text-balance text-[clamp(2.1rem,4.4vw,3.4rem)] font-semibold leading-[1.02] tracking-tightest text-brand-950">
              Simples para quem usa
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-slate-600">
              O professor abre a chamada com um clique. O restante acontece
              automaticamente.
            </p>
          </Reveal>
        </div>

        <div className="mt-20 space-y-24 lg:space-y-32">
          {/* carrossel de dispositivos com a tela real do totem */}
          <TotemDeviceRow />

          {VIEWS.map((view) => (
            <div
              key={view.title}
              className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20"
            >
              <div className={view.reverse ? "lg:order-2" : ""}>
                <Reveal>
                  <h3 className="text-balance text-3xl font-semibold tracking-tight text-brand-950 lg:text-4xl">
                    {view.title}
                  </h3>
                </Reveal>
                <Reveal delay={0.06}>
                  <p className="mt-5 max-w-lg text-balance text-lg leading-relaxed text-slate-600">
                    {view.desc}
                  </p>
                </Reveal>
                <div className="mt-8 space-y-4">
                  {view.bullets.map((bullet, i) => (
                    <Reveal key={bullet} delay={0.08 + i * 0.05}>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-brand-600" />
                        <p className="text-[15px] leading-relaxed text-slate-600">
                          {bullet}
                        </p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>

              <Reveal
                delay={0.1}
                y={36}
                className={view.reverse ? "lg:order-1" : ""}
              >
                {view.mockup}
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
