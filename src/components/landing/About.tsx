"use client";

import { Cpu, Landmark, Lightbulb, ShieldCheck } from "lucide-react";
import { CountUp, Eyebrow, Item, Reveal, Stagger } from "./primitives";
import { EagleMark } from "@/components/ui/Logo";

/* ================================================================== */
/*  A Flauzino — seção institucional. Software house especialista em   */
/*  reconhecimento facial e IA. Voz: competente, precisa, confiável.   */
/* ================================================================== */

const VALUES = [
  {
    icon: Cpu,
    title: "Competência",
    desc: "Engenharia de software de alto nível, arquitetura robusta e atenção obsessiva ao detalhe.",
  },
  {
    icon: ShieldCheck,
    title: "Segurança",
    desc: "Proteção de dados, estabilidade e continuidade operacional em sistemas de missão crítica.",
  },
  {
    icon: Landmark,
    title: "Tradição",
    desc: "Solidez e permanência. Construímos software moderno, mas feito para durar.",
  },
  {
    icon: Lightbulb,
    title: "Inovação",
    desc: "Evolução inteligente: adotamos novas tecnologias quando geram valor real ao cliente.",
  },
];

const STATS = [
  { to: 8, suffix: "+", label: "anos desenvolvendo sistemas críticos" },
  { to: 40, suffix: "M+", label: "reconhecimentos processados" },
  { to: 99.98, suffix: "%", label: "de disponibilidade da plataforma", decimals: 2 },
];

export default function About() {
  return (
    <section
      id="quem-somos"
      className="relative scroll-mt-24 overflow-hidden border-t border-white/10 bg-flauzino-navy-900 py-24 text-white lg:py-32"
    >
      {/* textura blueprint sutil */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4] [mask-image:radial-gradient(80%_60%_at_50%_0%,black,transparent_80%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-9xl px-5 lg:px-8">
        <div className="grid items-start gap-14 lg:grid-cols-[1fr_1.05fr]">
          {/* coluna texto — posicionada à direita no desktop */}
          <div className="lg:order-2 lg:text-right">
            <Reveal>
              <Eyebrow className="text-brand-300">Quem somos</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-4 text-balance text-[clamp(1.9rem,3.6vw,3rem)] font-semibold leading-[1.08] tracking-tight">
                Uma software house de soluções individualizadas em tecnologia e IA.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#c4cede] lg:ml-auto">
                Projetamos sistemas sob medida para cada negócio, do software
                ao modelo de inteligência artificial. Não somos uma startup
                experimental: somos engenharia madura o suficiente para
                assumir a responsabilidade por sistemas importantes.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mt-4 max-w-xl leading-relaxed text-[#93a1ba] lg:ml-auto">
                Reconhecimento facial é o nosso maior case de sucesso, não o
                limite do que fazemos. Precisão é a marca: lideramos com
                números verificáveis (latência, disponibilidade, acurácia) e
                conformidade total com a LGPD em cada projeto.
              </p>
            </Reveal>

            {/* stats */}
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {STATS.map((s) => (
                <Reveal key={s.label} delay={0.1}>
                  <div>
                    <div className="font-mono text-3xl font-semibold tracking-tight text-white lg:text-4xl">
                      <CountUp
                        to={s.to}
                        format={(n) =>
                          n.toLocaleString("pt-BR", {
                            minimumFractionDigits: s.decimals ?? 0,
                            maximumFractionDigits: s.decimals ?? 0,
                          })
                        }
                      />
                      <span className="text-brand-400">{s.suffix}</span>
                    </div>
                    <p className="mt-2 text-xs leading-snug text-[#93a1ba]">
                      {s.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* coluna valores */}
          <div className="relative lg:order-1">
            {/* emblema da águia ao fundo */}
            <div
              className="pointer-events-none absolute -right-6 -top-10 text-white/[0.04]"
              aria-hidden
            >
              <EagleMark size={220} />
            </div>

            <Stagger className="relative grid gap-4 sm:grid-cols-2" gap={0.1}>
              {VALUES.map((v) => (
                <Item key={v.title}>
                  <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition-colors hover:border-brand-400/40 hover:bg-white/[0.06]">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-600/20 text-brand-300">
                      <v.icon className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <h3 className="mt-4 text-base font-semibold text-white">
                      {v.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#a9b4c7]">
                      {v.desc}
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
