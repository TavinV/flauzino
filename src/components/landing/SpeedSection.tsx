"use client";

import { motion } from "framer-motion";
import { ScanFace, ShieldCheck, Lock, CheckCircle2, Zap } from "lucide-react";
import { CountUp, Eyebrow, Reveal, EASE } from "./primitives";

const SWEEP = 2.6; // seconds the playhead takes to cross

const STAGES = [
  { icon: ScanFace, title: "Detecção", desc: "Rosto localizado", pos: 6, t: "0,0s" },
  { icon: ShieldCheck, title: "Validação", desc: "Vivacidade confirmada", pos: 36, t: "0,9s" },
  { icon: Lock, title: "Criptografia", desc: "Dados protegidos", pos: 66, t: "1,8s" },
  { icon: CheckCircle2, title: "Presença", desc: "Frequência registrada", pos: 94, t: "2,4s" },
];

function StageNode({ stage }: { stage: (typeof STAGES)[number] }) {
  const delay = (stage.pos / 100) * SWEEP;
  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        className="relative flex h-14 w-14 flex-none items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-card"
        initial={{ scale: 0.85, opacity: 0.4 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay, ease: EASE }}
      >
        <stage.icon className="h-6 w-6 text-brand-600" strokeWidth={1.8} />
        <motion.span
          className="absolute inset-0 rounded-2xl ring-2 ring-brand-500"
          initial={{ opacity: 0, scale: 1 }}
          whileInView={{ opacity: [0, 0.8, 0], scale: [1, 1.5, 1.8] }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay, ease: "easeOut" }}
        />
      </motion.div>
      <motion.div
        className="mt-4"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delay + 0.1, ease: EASE }}
      >
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-semibold text-slate-900">{stage.title}</span>
          <span className="font-mono text-[11px] text-brand-600">{stage.t}</span>
        </div>
        <p className="mt-0.5 text-xs text-slate-500">{stage.desc}</p>
      </motion.div>
    </div>
  );
}

export default function SpeedSection() {
  return (
    <section
      id="velocidade"
      className="relative scroll-mt-24 border-t border-slate-200/70 bg-white py-24 lg:py-36"
    >
      <div className="mx-auto max-w-8xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal delay={0.06}>
            <h2 className="mt-5 text-balance text-[clamp(2.1rem,4.4vw,3.4rem)] font-semibold leading-[1.02] tracking-tightest text-brand-950">
              Velocidade extrema
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-lg text-balance text-lg leading-relaxed text-slate-600">
              Todo o processo ocorre em menos de 3 segundos por aluno.
            </p>
          </Reveal>
        </div>

        {/* big stat */}
        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-wrap items-end justify-center gap-x-4 gap-y-2">
            <span className="text-[clamp(4rem,12vw,8rem)] font-semibold leading-none tracking-tightest text-brand-950">
              <CountUp
                to={2.4}
                duration={SWEEP}
                format={(n) => n.toFixed(1).replace(".", ",")}
              />
              <span className="text-brand-600">s</span>
            </span>
            <div className="mb-3 flex flex-col gap-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                <Zap className="h-3.5 w-3.5 fill-current" /> garantido &lt; 3s
              </span>
              <span className="text-xs text-slate-400">tempo médio medido por aluno</span>
            </div>
          </div>
        </Reveal>

        {/* desktop horizontal timeline */}
        <Reveal delay={0.14}>
          <div className="relative mt-20 hidden lg:block">
            {/* base track */}
            <div className="absolute left-0 right-0 top-7 h-px bg-slate-200" />
            {/* filled beam */}
            <motion.div
              className="absolute left-0 top-7 h-px bg-gradient-to-r from-brand-600 to-brand-400"
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: SWEEP, ease: EASE }}
            />
            {/* playhead */}
            <motion.div
              className="absolute top-7 -translate-y-1/2"
              initial={{ left: "0%", opacity: 0 }}
              whileInView={{ left: "100%", opacity: [0, 1, 1, 0] }}
              viewport={{ once: true }}
              transition={{ duration: SWEEP, ease: EASE }}
            >
              <span className="block h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-brand-600 shadow-[0_0_0_4px_rgba(37,99,235,0.18)]" />
            </motion.div>

            <div className="grid grid-cols-4">
              {STAGES.map((s) => (
                <StageNode key={s.title} stage={s} />
              ))}
            </div>
          </div>
        </Reveal>

        {/* mobile: cartões centralizados, sem trilho lateral */}
        <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 lg:hidden">
          {STAGES.map((s) => (
            <StageNode key={s.title} stage={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
