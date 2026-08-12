"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, Lock, RadioTower } from "lucide-react";
import { Reveal, EASE, DecryptedText } from "./primitives";

/* ================================================================== */
/*  Cadeado em ASCII art (public/landing/ascii-art.png — glifos pretos */
/*  fundo branco opaco). Sobre a seção escura usamos invert (preto →   */
/*  branco) + mix-blend-mode screen (o fundo branco→preto some, os     */
/*  glifos brancos ficam). Blend + flutuação vivem NO MESMO elemento:  */
/*  um wrapper com transform isolaria o contexto de empilhamento e o   */
/*  screen deixaria de enxergar o fundo da seção (ver memória).        */
/* ================================================================== */

function AsciiLock() {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-[420px]" aria-hidden="true">
      {/* aura suave — glow atrás da arte, sem virar caixa */}
      <motion.div
        className="absolute inset-[14%] rounded-full bg-brand-500/25 blur-[70px]"
        animate={reduce ? {} : { opacity: [0.5, 1, 0.5], scale: [0.96, 1.05, 0.96] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* A arte: invert + screen no PRÓPRIO elemento que flutua, para o
          blend enxergar o fundo escuro da seção. Entrada sobe e revela;
          depois flutua em loop. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src="/landing/ascii-art.png"
        alt=""
        className="relative w-full scale-150"
        initial={{ opacity: 0, y: 24 }}
        whileInView={
          reduce
            ? { opacity: 1, y: 0 }
            : { opacity: 1, y: [24, -12, 0, -12, 0] }
        }
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{
          opacity: { duration: 0.9, ease: EASE },
          y: reduce
            ? { duration: 0.9, ease: EASE }
            : { duration: 7, repeat: Infinity, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1] },
        }}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

const ASSURANCES = [
  {
    icon: ShieldCheck,
    title: "Criptografia de ponta a ponta",
    desc: "Os dados biométricos são protegidos do momento da captura até o armazenamento.",
  },
  {
    icon: RadioTower,
    title: "Tráfego seguro dos dados",
    desc: "Toda a comunicação entre o totem e a plataforma acontece por canais protegidos.",
  },
  {
    icon: Lock,
    title: "Conformidade com a LGPD",
    desc: "Consentimento formal e total transparência sobre o uso das informações dos alunos.",
  },
];

export default function CryptoSection() {
  return (
    <section
      id="seguranca"
      className="relative scroll-mt-24 overflow-hidden bg-[#0A0E1A] py-20 text-white lg:py-24"
    >
      {/* atmospheric backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.05]" />
      <div className="pointer-events-none absolute -left-40 top-0 h-[480px] w-[480px] rounded-full bg-brand-700/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[480px] w-[480px] rounded-full bg-brand-900/30 blur-[120px]" />

      <div className="relative mx-auto max-w-9xl px-5 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* copy */}
          <div className="order-2 lg:order-1">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-200">
                <span className="h-1 w-1 rounded-full bg-brand-400" />
                Segurança
              </span>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-5 text-balance text-[clamp(2.1rem,4.4vw,3.4rem)] font-semibold leading-[1.02] tracking-tightest text-white">
                <DecryptedText text="Os dados dos alunos" />
                <br className="hidden sm:block" />{" "}
                <DecryptedText text="permanecem protegidos" revealDelay={55} />
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-lg text-balance text-lg leading-relaxed text-slate-300">
                As informações biométricas são criptografadas automaticamente e
                armazenadas de forma segura, seguindo os requisitos da LGPD.
              </p>
            </Reveal>

            <div className="mt-10 space-y-3">
              {ASSURANCES.map((a, i) => (
                <Reveal key={a.title} delay={0.06 * i}>
                  <div className="flex items-start gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur transition-colors hover:border-white/15 hover:bg-white/[0.05]">
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-white/[0.06] text-brand-200">
                      <a.icon className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {a.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-400">
                        {a.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* arte */}
          <Reveal delay={0.1} y={36} className="order-1 lg:order-2">
            <AsciiLock />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
