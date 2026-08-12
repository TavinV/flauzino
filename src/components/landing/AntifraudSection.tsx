"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  Eye,
  Image as ImageIcon,
  Monitor,
  ScanFace,
  ShieldAlert,
  Smartphone,
  VenetianMask,
} from "lucide-react";
import { Reveal, EASE } from "./primitives";
import { WindowFrame } from "./mockups";
import { TotemIdleScreen } from "./TotemCarousel";
import { EagleMark } from "@/components/ui/Logo";

/* O que o sistema barra — um cartão por tipo de fraude, empilhados. */
const BLOCKED = [
  {
    icon: Smartphone,
    k: "Fotos e vídeos no celular",
    v: "Uma foto ou vídeo exibido na tela de um celular é rejeitado na hora.",
  },
  {
    icon: ImageIcon,
    k: "Fotos impressas",
    v: "Retratos em papel, crachás e recortes não passam pela verificação.",
  },
  {
    icon: Monitor,
    k: "Telas de computador",
    v: "Imagens abertas em um monitor ou tablet são identificadas e barradas.",
  },
  {
    icon: VenetianMask,
    k: "Máscaras e disfarces",
    v: "Máscaras e outras tentativas sofisticadas de burlar o rosto são detectadas.",
  },
];

/* ------------------------------------------------------------------ */
/*  A visão do totem: a foto real dentro de um tablet, reproduzindo    */
/*  a sequência de abertura de câmera do totem (StageError → vídeo →   */
/*  StageBottom com marca d'água), até o desfecho da fraude — que,     */
/*  diferente da chamada real, fica permanente aqui para leitura.      */
/* ------------------------------------------------------------------ */

/* Reproduz o fluxo real do totem: começa na tela padrão (idle), o operador
   toca em "Registrar presença", a câmera abre com fade-in e as orientações
   surgem na base — até o desfecho da fraude, que aqui fica permanente para o
   visitante conseguir ler o resultado. Roda uma vez ao entrar na tela. */
const SEQUENCE = [
  { id: "idle", dur: 1900 },
  { id: "scanning", dur: 2600 },
  { id: "overlay", dur: null },
] as const;

type StageState = (typeof SEQUENCE)[number]["id"];

function FraudTotemStage() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [stateIndex, setStateIndex] = useState(0);
  const state: StageState = SEQUENCE[stateIndex].id;

  useEffect(() => {
    if (!inView) return;
    const dur = SEQUENCE[stateIndex].dur;
    if (dur == null) return; // overlay final: permanece
    const t = window.setTimeout(() => setStateIndex((i) => i + 1), dur);
    return () => window.clearTimeout(t);
  }, [stateIndex, inView]);

  const cameraOpen = state !== "idle";
  const chromeVisible = state === "scanning";

  return (
    <div ref={ref} className="relative mx-auto w-fit" aria-hidden="true">
      <div className="pointer-events-none absolute -inset-12 -z-10 rounded-[64px] bg-[radial-gradient(50%_60%_at_50%_45%,rgba(220,38,38,0.10),rgba(59,130,246,0.07)_55%,transparent_78%)] blur-2xl" />

      {/* sombra de chão — o totem “pousa” sobre a seção */}
      <div className="absolute inset-x-14 -bottom-5 h-10 rounded-[100%] bg-flauzino-navy-950/30 blur-2xl" />

      {/* moldura de tablet — o totem na porta da sala */}
      <div className="relative w-[min(460px,88vw)] rounded-[2.1rem] border-[13px] border-slate-900 bg-slate-900 shadow-lift">
        <div className="absolute left-1/2 top-[5px] z-20 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-slate-700" />

        {/* a tela do totem */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-[1.35rem] bg-flauzino-navy-950">
          {/* vídeo real da câmera: recorte vertical enviesado à esquerda,
              onde está o celular com a foto — surge com fade-in ao abrir */}
          <motion.video
            src="/landing/fraude-frame.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover [object-position:28%_50%]"
            initial={{ opacity: 0 }}
            animate={{ opacity: cameraOpen ? 1 : 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          />

          {/* tela padrão do totem (idle) — igual ao início real, some no fade */}
          <AnimatePresence>
            {state === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: EASE }}
                className="absolute inset-0 z-20"
              >
                <TotemIdleScreen size="tablet" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* cabeçalho glass do totem, fiel ao StageHeader (sobre vídeo escuro) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: chromeVisible ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none absolute inset-x-0 top-0 z-30 p-3"
          >
            <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 py-2.5 pl-3 pr-3.5 shadow-fl-lg backdrop-blur-xl">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-black">
                <ScanFace size={19} strokeWidth={1.75} />
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block truncate text-sm font-semibold text-black">
                  Matemática · 3º B
                </span>
                <span className="flex items-center gap-1.5 truncate text-xs text-black/65">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-flauzino-accent-500" />
                  Chamada aberta · Sala 12
                </span>
              </span>
            </div>
          </motion.div>

          {/* overlays de baixo do totem: texto-guia (fiel ao StageBottom) +
              marca d’água Flauzino — surgem sobre o vídeo da câmera */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: chromeVisible ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-4 bg-gradient-to-t from-flauzino-navy-950/85 via-flauzino-navy-950/35 to-transparent px-5 pb-3 pt-16"
          >
            <div className="flex flex-col items-center gap-1.5 text-center">
              <p className="text-lg font-bold leading-snug text-white drop-shadow-[0_1px_6px_rgba(8,13,24,0.7)]">
                Posicione o rosto dentro da guia
              </p>
              <p className="max-w-xs text-[13px] leading-relaxed text-white/60">
                Mantenha o rosto centralizado e bem iluminado.
              </p>
            </div>
            <span className="flex items-center gap-2 text-white/60">
              <EagleMark size={16} />
              <span className="text-[11px] font-semibold tracking-wide">
                Flauzino
              </span>
            </span>
          </motion.div>

          {/* desfecho em tela cheia — réplica do StageResultOverlay (erro),
              fica permanente para o visitante ler o resultado */}
          <AnimatePresence>
            {state === "overlay" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.32 }}
                className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-5 bg-gradient-to-b from-[#7f1d1d]/95 via-[#b91c1c]/94 to-[#450a0a]/96 px-8 text-center backdrop-blur-sm"
              >
                <div className="relative flex items-center justify-center">
                  {[0, 1].map((i) => (
                    <motion.span
                      key={i}
                      className="absolute h-24 w-24 rounded-full border-2 border-white/35"
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: [0.75, 2], opacity: [0.5, 0] }}
                      transition={{
                        duration: 1.7,
                        delay: 0.3 + i * 0.6,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                  <span className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-white/80">
                    <motion.svg
                      viewBox="0 0 24 24"
                      className="h-10 w-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.4}
                      strokeLinecap="round"
                    >
                      <motion.path
                        d="M6 18L18 6M6 6l12 12"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
                      />
                    </motion.svg>
                  </span>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <p className="text-xl font-semibold text-white">
                    Tentativa de fraude detectada
                  </p>
                  <p className="mt-1.5 text-sm text-white/80">
                    A presença não foi registrada.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Réplica fiel de /dashboard/audit + cursor roteirizado que clica    */
/*  em "Ver frame" e abre o modal da tentativa de fraude.              */
/*  Visual do cursor adaptado do componente "Cursor" (skyleen77) do    */
/*  21st.dev.                                                          */
/* ------------------------------------------------------------------ */

const LOGS: {
  when: string;
  who: string;
  status: string;
  tone: "success" | "neutral" | "danger";
  conf: string;
  live: string;
  ms: string;
  fraud?: boolean;
}[] = [
  { when: "19/07/2026 07:41", who: "Ana Beatriz Lima", status: "Reconhecido", tone: "success", conf: "71,8%", live: "0.99", ms: "1313ms" },
  { when: "19/07/2026 07:41", who: "Bruno Carvalho", status: "Reconhecido", tone: "success", conf: "70,8%", live: "0.92", ms: "1183ms" },
  { when: "19/07/2026 07:42", who: "—", status: "Sem rosto", tone: "neutral", conf: "—", live: "—", ms: "856ms" },
  { when: "19/07/2026 07:43", who: "—", status: "Falha de vivacidade", tone: "danger", conf: "—", live: "0.29", ms: "1758ms", fraud: true },
  { when: "19/07/2026 07:44", who: "Camila Duarte", status: "Reconhecido", tone: "success", conf: "68,4%", live: "0.95", ms: "2094ms" },
];

const BADGE_TONES: Record<string, string> = {
  success: "bg-flauzino-success-100 text-flauzino-success-600 border-transparent",
  neutral: "bg-flauzino-slate-100 text-flauzino-slate-700 border-flauzino-slate-200",
  danger: "bg-flauzino-danger-100 text-flauzino-danger-600 border-transparent",
};

/* Roteiro do cursor: descansa → vai ao botão → clica → modal abre →
   vai ao "Fechar" → clica → modal fecha → volta. */
const SCRIPT = [
  { id: "rest", dur: 1600 },
  { id: "toButton", dur: 1100 },
  { id: "press", dur: 320 },
  { id: "reading", dur: 1600 },
  { id: "toClose", dur: 950 },
  { id: "pressClose", dur: 320 },
  { id: "return", dur: 1000 },
] as const;

type ScriptStep = (typeof SCRIPT)[number]["id"];

/* O cursor roteirizado assume uma tabela sem scroll horizontal — em telas
   estreitas a tabela vira scrollável (min-w-[720px]) e o "clique" deixa de
   fazer sentido (o botão pode estar fora da área visível). Por isso o
   roteiro só roda em telas ≥768px; no celular a tabela fica estática e
   navegável por scroll nativo, sem cursor nem modal automático. */
function useIsDesktopReplica() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return isDesktop;
}

function AuditReplica() {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const inView = useInView(containerRef, { margin: "-10% 0px" });
  const isDesktop = useIsDesktopReplica();

  const [stepIndex, setStepIndex] = useState(0);
  const [cursor, setCursor] = useState({ x: 80, y: 80 });

  const step: ScriptStep = isDesktop ? SCRIPT[stepIndex].id : "rest";
  const modalOpen =
    step === "reading" || step === "toClose" || step === "pressClose";
  const pressing = step === "press" || step === "pressClose";

  // avança o roteiro (parado no celular — ver useIsDesktopReplica)
  useEffect(() => {
    if (!inView || !isDesktop) return;
    const t = window.setTimeout(
      () => setStepIndex((i) => (i + 1) % SCRIPT.length),
      SCRIPT[stepIndex].dur
    );
    return () => window.clearTimeout(t);
  }, [stepIndex, inView, isDesktop]);

  // mede o alvo do passo atual — cursor e alvos compartilham o MESMO
  // referencial (o contêiner externo), senão o clique erra o botão
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const c = container.getBoundingClientRect();
    const centerOf = (el: HTMLElement | null) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { x: b.left - c.left + b.width / 2, y: b.top - c.top + b.height / 2 };
    };

    if (step === "toButton" || step === "press") {
      const p = centerOf(buttonRef.current);
      if (p) setCursor(p);
    } else if (step === "toClose" || step === "pressClose") {
      const p = centerOf(closeRef.current);
      if (p) setCursor(p);
    } else if (step === "rest" || step === "return") {
      setCursor({ x: c.width - 90, y: c.height - 60 });
    }
  }, [step]);

  return (
    <div ref={containerRef} className="relative" aria-hidden="true">
      <WindowFrame url="console.visage.app/dashboard/auditoria">
        <div className="bg-flauzino-slate-50 p-6 lg:p-9">
          {/* cabeçalho da página, como no console */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-flauzino-accent-50 text-flauzino-accent-600">
              <ShieldAlert className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-semibold tracking-tight text-flauzino-navy-900 lg:text-xl">
                Auditoria de reconhecimento
              </span>
              <span className="block text-sm text-flauzino-slate-500">
                Todos os eventos da instituição, incluindo tentativas de fraude.
              </span>
            </span>
            <span className="ml-auto hidden gap-2.5 md:flex">
              <span className="rounded-lg border border-flauzino-slate-200 bg-white px-4 py-2 text-sm font-medium text-flauzino-slate-500">
                19/07/2026
              </span>
              <span className="rounded-lg border border-flauzino-slate-200 bg-white px-4 py-2 text-sm font-medium text-flauzino-slate-500">
                Status · Todos
              </span>
            </span>
          </div>

          {/* tabela */}
          <div className="mt-5 overflow-hidden rounded-xl border border-flauzino-slate-200 bg-white shadow-fl-xs">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead>
                  <tr className="border-b border-flauzino-slate-100">
                    {["Quando", "Pessoa", "Status", "Confiança", "Vivacidade", "Tempo", ""].map(
                      (h) => (
                        <th
                          key={h}
                          className={`px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-flauzino-slate-400 ${
                            h === "" ? "text-right" : ""
                          }`}
                        >
                          {h || "Fraude"}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {LOGS.map((log, i) => (
                    <tr
                      key={i}
                      className={`border-b border-flauzino-slate-100 last:border-b-0 ${
                        log.fraud ? "bg-flauzino-danger-100/25" : ""
                      }`}
                    >
                      <td className="px-5 py-4 font-mono-ds text-[13px] text-flauzino-slate-500">
                        {log.when}
                      </td>
                      <td className="px-5 py-4 text-[15px] text-flauzino-navy-900">
                        {log.who}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold leading-none tracking-wide ${BADGE_TONES[log.tone]}`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono-ds text-[13px] text-flauzino-slate-500">
                        {log.conf}
                      </td>
                      <td className="px-5 py-4 font-mono-ds text-[13px] text-flauzino-slate-500">
                        {log.live}
                      </td>
                      <td className="px-5 py-4 font-mono-ds text-[13px] text-flauzino-slate-500">
                        {log.ms}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          {log.fraud && (
                            <button
                              ref={buttonRef}
                              type="button"
                              tabIndex={-1}
                              className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-semibold transition-all duration-150 ${
                                step === "press"
                                  ? "scale-95 border-flauzino-accent-500 bg-flauzino-accent-50 text-flauzino-accent-700"
                                  : "border-flauzino-slate-300 bg-white text-flauzino-navy-900"
                              }`}
                            >
                              <Eye size={15} />
                              Ver frame
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </WindowFrame>

      {/* modal fiel ao FraudFrameModal — cobre a janela inteira */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden rounded-2xl bg-flauzino-navy-900/55 p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-fl-xl"
            >
              <div className="px-6 pb-4 pt-5">
                <span className="block text-lg font-semibold tracking-tight text-flauzino-navy-900">
                  Frame da tentativa de fraude
                </span>
                <span className="mt-1 block text-sm text-flauzino-slate-500">
                  Registrado em 19/07/2026 07:43 · retenção limitada conforme a
                  LGPD.
                </span>
              </div>
              <div className="px-6">
                <div className="flex items-center justify-center rounded-lg bg-flauzino-slate-100 p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/landing/fraude.png"
                    alt=""
                    className="max-h-[230px] w-auto rounded-lg"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end border-t border-flauzino-slate-100 px-6 py-4">
                <button
                  ref={closeRef}
                  type="button"
                  tabIndex={-1}
                  className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-all duration-150 ${
                    step === "pressClose"
                      ? "scale-95 border-flauzino-accent-500 bg-flauzino-accent-50 text-flauzino-accent-700"
                      : "border-flauzino-slate-300 bg-white text-flauzino-navy-900"
                  }`}
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* cursor roteirizado (visual adaptado do Cursor do 21st.dev) — só no
          desktop, onde a tabela cabe sem scroll e o clique aponta certo */}
      <motion.div
        className="pointer-events-none absolute left-0 top-0 z-30 hidden md:block"
        animate={{ x: cursor.x, y: cursor.y }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <motion.div animate={{ scale: pressing ? 0.82 : 1 }} transition={{ duration: 0.15 }}>
          <svg className="h-5 w-5 text-brand-600 drop-shadow-sm" viewBox="0 0 40 40">
            <path
              fill="currentColor"
              d="M1.8 4.4 7 36.2c.3 1.8 2.6 2.3 3.6.8l3.9-5.7c1.7-2.5 4.5-4.1 7.5-4.3l6.9-.5c1.8-.1 2.5-2.4 1.1-3.5L5 2.5c-1.4-1.1-3.5 0-3.3 1.9Z"
            />
          </svg>
        </motion.div>
        {/* ondinha do clique */}
        <AnimatePresence>
          {pressing && (
            <motion.span
              initial={{ opacity: 0.5, scale: 0.3 }}
              animate={{ opacity: 0, scale: 1.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="absolute -left-2 -top-2 h-9 w-9 rounded-full border-2 border-brand-500"
            />
          )}
        </AnimatePresence>
        <span className="ml-4 mt-1 inline-block whitespace-nowrap rounded-lg bg-brand-600 px-2 py-1 text-xs font-semibold text-white shadow-lg">
          Coordenação
        </span>
      </motion.div>
    </div>
  );
}

/* ================================================================== */

export default function AntifraudSection() {
  return (
    <section
      id="antifraude"
      className="relative scroll-mt-24 border-t border-slate-200/70 bg-white py-24 lg:py-32"
    >
      <div className="mx-auto max-w-9xl px-5 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* copy */}
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-600">
                <ShieldAlert className="h-3.5 w-3.5" /> Antifraude
              </span>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-5 text-balance text-[clamp(2.1rem,4.4vw,3.4rem)] font-semibold leading-[1.02] tracking-tightest text-brand-950">
                Tentativas de fraude não passam
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-lg text-balance text-lg leading-relaxed text-slate-600">
                Um sistema avançado de detecção de fraudes protege cada
                chamada: fotos impressas, fotos e vídeos no celular, telas de
                computador e até máscaras são barrados na hora.
              </p>
            </Reveal>

            <div className="mt-10 max-w-lg space-y-3">
              {BLOCKED.map((row, i) => (
                <Reveal key={row.k} delay={0.05 * i}>
                  <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-card transition-shadow duration-200 hover:shadow-lift">
                    <span className="mt-0.5 flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-red-50 text-red-600">
                      <row.icon className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <div className="flex-1">
                      <span className="text-[15px] font-semibold text-slate-900">
                        {row.k}
                      </span>
                      <p className="mt-1 text-sm leading-relaxed text-slate-500">
                        {row.v}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* a visão do totem */}
          <Reveal delay={0.1} y={36}>
            <FraudTotemStage />
          </Reveal>
        </div>

        {/* auditoria: réplica fiel da tela do console */}
        <div className="mt-24">
          <Reveal>
            <p className="mx-auto max-w-2xl text-balance text-center text-lg leading-relaxed text-slate-600">
              Toda tentativa fica registrada para consulta da coordenação, com{" "}
              <span className="font-semibold text-brand-950">
                horário, motivo da rejeição e imagem capturada
              </span>
              .
            </p>
          </Reveal>
          <Reveal delay={0.1} y={36} className="mt-10">
            <AuditReplica />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
