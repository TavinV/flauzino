"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  BarChart3,
  CalendarCheck2,
  Clock3,
  FileCheck2,
  QrCode,
  ScanFace,
  Users,
} from "lucide-react";
import { Eyebrow, Reveal } from "./primitives";
import { TeacherIllustration } from "./illustrations";

/* ================================================================== */
/*  Um dia letivo com a Visage — narrativa em linha do tempo no lugar */
/*  de cards genéricos: cada momento mostra um recurso em uso.        */
/* ================================================================== */

const MOMENTS = [
  {
    time: "1ª semana",
    icon: QrCode,
    title: "Implantação leve",
    desc: "Alunos cadastrados por QR Code e cada tablet calibrado para a iluminação da sua sala. Sem projeto de TI, sem consultoria.",
    highlight: true,
  },
  {
    time: "07:00",
    icon: ScanFace,
    title: "O professor abre a chamada",
    desc: "Um toque no painel e o totem da sala está pronto para receber a turma.",
  },
  {
    time: "07:12",
    icon: Users,
    title: "Alunos chegando",
    desc: "Cada aluno é reconhecido em menos de 3 segundos ao entrar. A lista se preenche sozinha, em tempo real.",
  },
  {
    time: "07:31",
    icon: Clock3,
    title: "Atrasos sem interrupção",
    desc: "Quem chega depois é registrado do mesmo jeito — a aula não para, ninguém fica esperando.",
  },
  {
    time: "10:40",
    icon: BarChart3,
    title: "A coordenação acompanha",
    desc: "Frequência de todas as turmas ao vivo no painel, com alerta de quem precisa de atenção.",
  },
  {
    time: "17:30",
    icon: FileCheck2,
    title: "Fim do dia, zero papelada",
    desc: "Relatórios prontos para a secretaria. Nada para digitar, conferir ou arquivar.",
  },
  {
    time: "Fim do mês",
    icon: CalendarCheck2,
    title: "Sem surpresas",
    desc: "Plano mensal a partir de R$89, sem contrato de fidelidade. Cancele quando quiser.",
  },
];

function TimelineRail({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 72%", "end 62%"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className="relative">
      {/* trilho central (desktop) / à esquerda (mobile) */}
      <div
        className="absolute bottom-8 top-8 w-px bg-slate-200 max-lg:left-[29px] lg:left-1/2 lg:-translate-x-1/2"
        aria-hidden
      />
      <motion.div
        style={{ scaleY }}
        className="absolute bottom-8 top-8 w-px origin-top bg-gradient-to-b from-brand-600 via-brand-500 to-brand-300 max-lg:left-[29px] lg:left-1/2 lg:-translate-x-1/2"
        aria-hidden
      />
      {children}
    </div>
  );
}

function MomentCard({
  moment,
  side,
}: {
  moment: (typeof MOMENTS)[number];
  side: "left" | "right";
}) {
  return (
    <div className="grid gap-6 max-lg:grid-cols-[60px_1fr] lg:grid-cols-[1fr_60px_1fr] lg:items-center">
      {/* célula esquerda (só desktop) */}
      <div className="hidden lg:flex lg:justify-end">
        {side === "left" && <Card moment={moment} align="right" />}
      </div>

      {/* nó central com o ícone */}
      <div className="relative z-10 flex justify-center max-lg:items-start lg:items-center">
        <span
          className={`grid h-[60px] w-[60px] place-items-center rounded-2xl border shadow-card ${
            moment.highlight
              ? "border-brand-200 bg-brand-600 text-white"
              : "border-slate-200 bg-white text-brand-600"
          }`}
        >
          <moment.icon className="h-6 w-6" strokeWidth={1.8} />
        </span>
      </div>

      {/* célula direita (desktop) + conteúdo no mobile */}
      <div>
        <div className={side === "right" ? "" : "lg:hidden"}>
          <Card moment={moment} align="left" />
        </div>
      </div>
    </div>
  );
}

function Card({
  moment,
  align,
}: {
  moment: (typeof MOMENTS)[number];
  align: "left" | "right";
}) {
  return (
    <div
      className={`w-full max-w-md rounded-2xl border bg-white p-6 shadow-card transition-shadow duration-200 hover:shadow-lift ${
        moment.highlight ? "border-brand-200 ring-1 ring-brand-100" : "border-slate-200"
      } ${align === "right" ? "lg:text-right" : ""}`}
    >
      <span
        className={`inline-flex items-center rounded-full border border-slate-200 bg-canvas px-3 py-1 font-mono-ds text-xs font-medium text-slate-500 ${
          moment.highlight ? "border-brand-200 bg-brand-50 text-brand-700" : ""
        }`}
      >
        {moment.time}
      </span>
      <h3 className="mt-3 text-lg font-semibold text-slate-900">
        {moment.title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
        {moment.desc}
      </p>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section
      id="recursos"
      className="relative scroll-mt-24 border-t border-slate-200/70 bg-canvas py-24 lg:py-32"
    >
      <div className="mx-auto max-w-8xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal className="flex justify-center">
            <Eyebrow>Recursos</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-5 text-balance text-[clamp(2rem,4vw,3.1rem)] font-semibold leading-[1.06] tracking-tightest text-brand-950">
              Veja como a chamada acontece durante um dia de aula
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-slate-600">
              Da primeira chamada da manhã ao fechamento do mês — a plataforma
              trabalha pela escola em cada momento.
            </p>
          </Reveal>
        </div>

        <div className="mt-20">
          <TimelineRail>
            <div className="space-y-10 lg:space-y-14">
              {MOMENTS.map((moment, i) => (
                <Reveal key={moment.title} delay={0.04 * (i % 3)}>
                  <MomentCard
                    moment={moment}
                    side={i % 2 === 0 ? "left" : "right"}
                  />
                </Reveal>
              ))}
            </div>
          </TimelineRail>
        </div>

        {/* fecho da narrativa — unDraw "Teacher", recolorida para a marca */}
        <Reveal delay={0.1} y={32}>
          <div className="mx-auto mt-24 max-w-xl text-center text-brand-500">
            <TeacherIllustration className="mx-auto w-full max-w-[460px]" />
            <p className="mt-6 text-balance text-lg leading-relaxed text-slate-600">
              No fim do dia, a chamada deixou de ser tarefa —{" "}
              <span className="font-semibold text-brand-950">
                virou só mais uma coisa que funciona.
              </span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
