"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  BarChart3,
  Building2,
  CheckCircle2,
  IdCard,
  LayoutDashboard,
  Lock,
  LogOut,
  MapPin,
  ScanFace,
  Settings,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import { EagleMark } from "@/components/ui/Logo";
import { EASE } from "./primitives";

/* ================================================================== */
/*  Visualizações do sistema construídas em código, fiéis ao console  */
/*  real (tokens flauzino-*, IBM Plex Mono nos dados) — com a vida    */
/*  do produto acontecendo em tempo real: alunos chegando, contador   */
/*  subindo, etapas concluindo. Peças decorativas (aria-hidden).      */
/* ================================================================== */

export function WindowFrame({
  url,
  children,
}: {
  url: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lift">
      {/* barra do navegador */}
      <div className="flex items-center gap-3 border-b border-slate-100 bg-white px-5 py-3.5">
        <span className="flex gap-2">
          <span className="h-3 w-3 rounded-full bg-[#f87171]/70" />
          <span className="h-3 w-3 rounded-full bg-[#fbbf24]/70" />
          <span className="h-3 w-3 rounded-full bg-[#34d399]/70" />
        </span>
        <span className="mx-auto flex min-w-0 items-center gap-2 rounded-lg bg-slate-100 px-4 py-1.5 font-mono-ds text-[13px] text-slate-500">
          <Lock className="h-3.5 w-3.5 shrink-0" />
          <span className="min-w-0 truncate">{url}</span>
        </span>
        <span className="w-16" aria-hidden />
      </div>
      {children}
    </div>
  );
}

export function Glow({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute -inset-12 -z-10 rounded-[56px] bg-[radial-gradient(50%_60%_at_50%_35%,rgba(59,130,246,0.20),rgba(147,197,253,0.10)_55%,transparent_78%)] blur-2xl ${className}`}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Console — chamada ao vivo com alunos chegando em tempo real        */
/*  Sidebar espelha a navegação real do console (seções e itens).      */
/* ------------------------------------------------------------------ */

const CONSOLE_NAV: {
  section: string;
  items: { icon: typeof ScanFace; label: string; active?: boolean }[];
}[] = [
  {
    section: "Visão geral",
    items: [{ icon: LayoutDashboard, label: "Painel" }],
  },
  { section: "Pessoas", items: [{ icon: Users, label: "Usuários" }] },
  {
    section: "Reconhecimento",
    items: [
      { icon: ScanFace, label: "Acessos", active: true },
      { icon: BarChart3, label: "Relatórios" },
    ],
  },
  {
    section: "Sistema",
    items: [
      { icon: ShieldCheck, label: "Auditoria" },
      { icon: Settings, label: "Configurações" },
    ],
  },
];

const QUEUE = [
  { initials: "AL", name: "Ana Beatriz Lima" },
  { initials: "BC", name: "Bruno Carvalho" },
  { initials: "CD", name: "Camila Duarte" },
  { initials: "DN", name: "Davi Nogueira" },
  { initials: "EM", name: "Elisa Martins" },
  { initials: "FS", name: "Felipe Santana" },
  { initials: "GR", name: "Giovana Rocha" },
  { initials: "HT", name: "Heitor Teixeira" },
  { initials: "IC", name: "Isabela Castro" },
  { initials: "JM", name: "João Pedro Moraes" },
];

const VISIBLE_ROWS = 5;
const ROW_H = 64;
const TICK_MS = 2600;

/** Horário fake crescente: 08:01:00 + 19s por chegada. */
function fakeTime(k: number) {
  const total = 60 + k * 19;
  const mm = String(1 + Math.floor(total / 60)).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");
  return `08:${mm}:${ss}`;
}

export function ConsoleMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-8% 0px -8% 0px" });
  const [tick, setTick] = useState(VISIBLE_ROWS - 1);

  useEffect(() => {
    if (!inView) return;
    const interval = window.setInterval(() => setTick((t) => t + 1), TICK_MS);
    return () => window.clearInterval(interval);
  }, [inView]);

  // Últimas 5 chegadas; a mais recente entra pulsando em azul.
  const rows = Array.from({ length: VISIBLE_ROWS }, (_, i) => {
    const k = tick - (VISIBLE_ROWS - 1) + i;
    return { k, ...QUEUE[((k % QUEUE.length) + QUEUE.length) % QUEUE.length] };
  });
  const newest = rows[rows.length - 1];
  const present = 20 + (tick % 6);

  return (
    <div ref={ref} className="relative" aria-hidden="true">
      <Glow />

      <WindowFrame url="console.flauzino.com.br/reconhecimento/acessos">
        <div className="flex bg-flauzino-slate-50">
          {/* sidebar navy do console */}
          <div className="hidden w-60 shrink-0 flex-col bg-flauzino-navy-900 p-4 text-white md:flex">
            <span className="flex items-center gap-2.5 px-2 pb-3">
              <EagleMark size={30} />
              <span className="text-[15px] font-semibold tracking-tight">
                Flauzino
              </span>
            </span>
            <span className="mb-1 flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5">
              <Building2 className="h-4 w-4 shrink-0 text-flauzino-accent-500" />
              <span className="truncate text-xs font-medium text-white/80">
                Sede corporativa
              </span>
            </span>
            <div className="flex-1">
              {CONSOLE_NAV.map((group) => (
                <div key={group.section}>
                  <span className="block px-3 pb-1.5 pt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
                    {group.section}
                  </span>
                  {group.items.map((item) => (
                    <span
                      key={item.label}
                      className={`mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                        item.active
                          ? "bg-flauzino-accent-600 text-white shadow-fl-sm"
                          : "text-[#c4cede]"
                      }`}
                    >
                      <item.icon
                        className={`h-4 w-4 ${item.active ? "" : "text-white/50"}`}
                      />
                      {item.label}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            {/* usuário logado, como no console real */}
            <div className="mt-3 flex items-center gap-2.5 border-t border-white/10 pt-3">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-flauzino-accent-600 text-xs font-semibold">
                O
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block truncate text-[13px] font-semibold">
                  Otávio
                </span>
                <span className="block truncate text-[11px] text-white/50">
                  Administrador
                </span>
              </span>
              <LogOut className="h-4 w-4 text-[#c4cede]" />
            </div>
          </div>

          {/* painel da chamada */}
          <div className="min-w-0 flex-1 p-5 lg:p-7">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-base font-semibold tracking-tight text-flauzino-navy-900 lg:text-lg">
                Reconhecimento ao vivo — Entrada principal
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-flauzino-success-100 px-3 py-1 text-xs font-semibold text-flauzino-success-600">
                <span className="h-1.5 w-1.5 rounded-full bg-flauzino-success-600" />
                Operando
              </span>
              <span className="ml-auto hidden items-center gap-1.5 text-sm text-flauzino-slate-500 lg:inline-flex">
                <MapPin className="h-4 w-4" /> Câmera 03
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3.5">
              {[
                { label: "Reconhecidos", value: present, live: true },
                { label: "Cadastrados", value: 25 },
                { label: "Câmeras", value: 4 },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-flauzino-slate-200 bg-white p-4 shadow-fl-xs"
                >
                  <span className="block text-xs font-medium text-flauzino-slate-500">
                    {s.label}
                  </span>
                  <span className="mt-1 block font-mono-ds text-3xl font-semibold tracking-tight text-flauzino-navy-900">
                    {s.live ? (
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={s.value}
                          className="inline-block"
                          initial={{ y: 14, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -14, opacity: 0 }}
                          transition={{ duration: 0.35, ease: EASE }}
                        >
                          {s.value}
                        </motion.span>
                      </AnimatePresence>
                    ) : (
                      s.value
                    )}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-flauzino-slate-200 bg-white shadow-fl-xs">
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-flauzino-slate-100 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-flauzino-slate-400">
                <span>Pessoa</span>
                <span className="hidden sm:block">Horário</span>
                <span className="text-right">Situação</span>
              </div>

              {/* altura travada: linhas entram/saem sem "respirar" o card */}
              <div
                className="relative overflow-hidden"
                style={{ height: ROW_H * VISIBLE_ROWS }}
              >
                <AnimatePresence initial={false} mode="popLayout">
                  {rows.map((row) => {
                    const isNew = row.k === newest.k;
                    return (
                      <motion.div
                        layout
                        key={row.k}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -18 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        style={{ height: ROW_H }}
                        className={`grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-flauzino-slate-100 px-4 ${
                          isNew ? "bg-flauzino-accent-50/70" : "bg-white"
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <span
                            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                              isNew
                                ? "bg-flauzino-accent-600 text-white"
                                : "bg-flauzino-accent-100 text-flauzino-accent-700"
                            }`}
                          >
                            {row.initials}
                          </span>
                          <span className="truncate text-[15px] font-medium text-flauzino-navy-900">
                            {row.name}
                          </span>
                        </span>
                        <span
                          className={`hidden font-mono-ds text-sm sm:block ${
                            isNew
                              ? "text-flauzino-accent-600"
                              : "text-flauzino-slate-500"
                          }`}
                        >
                          {isNew ? "agora" : fakeTime(row.k)}
                        </span>
                        {isNew ? (
                          <span className="inline-flex items-center gap-2 justify-self-end rounded-full bg-flauzino-accent-100 px-3 py-1 text-xs font-semibold text-flauzino-accent-700">
                            <span className="relative flex h-2 w-2">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-flauzino-accent-500/70" />
                              <span className="relative inline-flex h-2 w-2 rounded-full bg-flauzino-accent-600" />
                            </span>
                            Reconhecida
                          </span>
                        ) : (
                          <span className="justify-self-end rounded-full bg-flauzino-success-100 px-3 py-1 text-xs font-semibold text-flauzino-success-600">
                            Liberado
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              <div className="px-4 py-2.5 text-center text-sm text-flauzino-slate-400">
                + {present - VISIBLE_ROWS} acessos registrados hoje
              </div>
            </div>
          </div>
        </div>
      </WindowFrame>

      {/* cartão flutuante — confirmação em tempo real */}
      <div className="absolute -right-3 top-16 hidden animate-floaty rounded-2xl border border-slate-200 bg-white/95 px-5 py-4 shadow-lift backdrop-blur md:block lg:-right-10">
        <div className="flex items-center gap-3.5">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-flauzino-success-100 text-flauzino-success-600">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold text-slate-800">
              Acesso liberado
            </span>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={newest.k}
                className="block font-mono-ds text-xs text-slate-400"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                {newest.name} · agora
              </motion.span>
            </AnimatePresence>
          </span>
        </div>
      </div>

      {/* selo ao vivo */}
      <div className="absolute -bottom-5 left-6 hidden items-center gap-2.5 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 shadow-lift backdrop-blur sm:flex lg:-left-8">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/70" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>
        <span className="text-sm font-semibold text-slate-700">
          {present} reconhecimentos hoje · ao vivo
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Relatórios — frequência por turma (barras crescem ao entrar)       */
/* ------------------------------------------------------------------ */

const REPORT_BARS = [
  { label: "Recepção", pct: 88 },
  { label: "Garagem", pct: 92 },
  { label: "Andar 2", pct: 81 },
  { label: "Andar 5", pct: 90 },
  { label: "Data center", pct: 96, highlight: true },
  { label: "Doca", pct: 85 },
];

export function ReportsMockup() {
  return (
    <div className="relative" aria-hidden="true">
      <Glow />

      <WindowFrame url="console.flauzino.com.br/reconhecimento/relatorios">
        <div className="bg-flauzino-slate-50 p-5 lg:p-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-base font-semibold tracking-tight text-flauzino-navy-900 lg:text-lg">
              Reconhecimentos por unidade
            </span>
            <span className="rounded-lg border border-flauzino-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-flauzino-slate-500">
              Últimos 30 dias
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-[1.5fr_1fr]">
            {/* gráfico de barras */}
            <div className="rounded-xl border border-flauzino-slate-200 bg-white p-5 shadow-fl-xs">
              <div className="flex h-52 items-end justify-between gap-2 px-1 sm:gap-3.5">
                {REPORT_BARS.map((bar, i) => (
                  <div
                    key={bar.label}
                    className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                  >
                    <span
                      className={`font-mono-ds text-xs ${
                        bar.highlight
                          ? "font-semibold text-flauzino-accent-700"
                          : "text-flauzino-slate-400"
                      }`}
                    >
                      {bar.pct}%
                    </span>
                    <motion.div
                      className={`w-full rounded-t-lg ${
                        bar.highlight
                          ? "bg-flauzino-accent-600"
                          : "bg-flauzino-accent-100"
                      }`}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${bar.pct * 0.78}%` }}
                      viewport={{ once: true, margin: "-15% 0px" }}
                      transition={{ duration: 0.9, delay: i * 0.08, ease: EASE }}
                    />
                    <span className="text-xs font-medium text-flauzino-slate-500">
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* média + alertas */}
            <div className="flex flex-col gap-3.5">
              <div className="rounded-xl border border-flauzino-slate-200 bg-white p-5 shadow-fl-xs">
                <span className="block text-xs font-medium text-flauzino-slate-500">
                  Média geral
                </span>
                <span className="mt-1 flex items-baseline gap-2.5">
                  <span className="font-mono-ds text-4xl font-semibold tracking-tight text-flauzino-navy-900">
                    88,7%
                  </span>
                  <span className="rounded-full bg-flauzino-success-100 px-2.5 py-1 text-xs font-semibold text-flauzino-success-600">
                    +2,1%
                  </span>
                </span>
              </div>
              <div className="flex-1 rounded-xl border border-flauzino-slate-200 bg-white p-5 shadow-fl-xs">
                <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-flauzino-slate-400">
                  Atenção
                </span>
                {[
                  { name: "Pedro Santana", pct: "68%" },
                  { name: "Júlia Ribeiro", pct: "71%" },
                ].map((s) => (
                  <span
                    key={s.name}
                    className="mt-3 flex items-center justify-between gap-3"
                  >
                    <span className="flex items-center gap-2.5 text-sm font-medium text-flauzino-navy-900">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-flauzino-warning-600/50" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-flauzino-warning-600" />
                      </span>
                      {s.name}
                    </span>
                    <span className="font-mono-ds text-sm text-flauzino-warning-600">
                      {s.pct}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </WindowFrame>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Cadastro — o fluxo real do totem: CPF → confirmação →              */
/*  consentimento → captura (EnrollmentWizard), em loop.               */
/* ------------------------------------------------------------------ */

const WIZARD_STEPS = [
  { key: "cpf", label: "Identificação", icon: IdCard },
  { key: "confirm", label: "Confirmação", icon: UserCheck },
  { key: "terms", label: "Consentimento", icon: ShieldCheck },
  { key: "capture", label: "Captura", icon: ScanFace },
] as const;

const CPF_DIGITS = "101.101.101-88".split("");

function EnrollPhaseCpf() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <span className="text-sm font-medium text-flauzino-slate-600">
        Digite o CPF para começar
      </span>
      <div className="flex items-center rounded-xl border border-flauzino-slate-300 bg-white px-5 py-3.5 shadow-fl-inset">
        <span className="font-mono-ds text-xl tracking-wider text-flauzino-navy-900">
          {CPF_DIGITS.map((d, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.09 }}
            >
              {d}
            </motion.span>
          ))}
        </span>
        <motion.span
          className="ml-1 h-5 w-[2px] rounded bg-flauzino-accent-600"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
      <span className="text-xs text-flauzino-slate-400">
        A pessoa digita direto no totem — sem fila, sem operador
      </span>
    </div>
  );
}

function EnrollPhaseConfirm() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-flauzino-accent-100 text-base font-semibold text-flauzino-accent-700">
        HE
      </span>
      <span className="text-center leading-tight">
        <span className="block text-base font-semibold text-flauzino-navy-900">
          Henrique Eduardo dos Santos de Souza
        </span>
        <span className="mt-0.5 block font-mono-ds text-xs text-flauzino-slate-400">
          Colaborador · Matriz
        </span>
      </span>
      <motion.span
        className="rounded-xl bg-flauzino-navy-900 px-6 py-2.5 text-sm font-semibold text-white shadow-fl-md"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1, 0.96, 1] }}
        transition={{ duration: 1.6, times: [0, 0.7, 0.8, 1], delay: 0.4 }}
      >
        Sou eu
      </motion.span>
    </div>
  );
}

function EnrollPhaseTerms() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3.5 px-6">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-flauzino-accent-50 text-flauzino-accent-600">
        <ShieldCheck className="h-6 w-6" strokeWidth={1.75} />
      </span>
      <span className="text-sm font-semibold text-flauzino-navy-900">
        Termo de consentimento
      </span>
      <div className="w-full max-w-[260px] space-y-1.5">
        <span className="block h-1.5 w-full rounded bg-flauzino-slate-200" />
        <span className="block h-1.5 w-[85%] rounded bg-flauzino-slate-200" />
        <span className="block h-1.5 w-[70%] rounded bg-flauzino-slate-200" />
      </div>
      <motion.span
        className="mt-1 inline-flex items-center gap-2 rounded-xl bg-flauzino-accent-600 px-5 py-2.5 text-sm font-semibold text-white shadow-fl-md"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1, 0.96, 1] }}
        transition={{ duration: 1.6, times: [0, 0.7, 0.8, 1], delay: 0.4 }}
      >
        <CheckCircle2 className="h-4 w-4" /> Li e aceito
      </motion.span>
    </div>
  );
}

function EnrollPhaseCapture() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <div className="relative h-[104px] w-[84px] rounded-[50%] border-2 border-flauzino-accent-500/90 shadow-[0_0_28px_rgba(59,130,246,0.3)]">
        <div className="absolute inset-0 overflow-hidden rounded-[50%]">
          <div className="h-7 w-full animate-scan bg-gradient-to-b from-transparent via-brand-400/40 to-transparent" />
        </div>
      </div>
      <span className="text-sm font-medium text-flauzino-navy-900">
        Olhe para o centro
      </span>
      <span className="font-mono-ds text-xs text-flauzino-slate-400">
        captura 1 de 3
      </span>
    </div>
  );
}

function EnrollPhaseDone() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <motion.span
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className="grid h-14 w-14 place-items-center rounded-full bg-flauzino-success-100 text-flauzino-success-600"
      >
        <CheckCircle2 className="h-7 w-7" />
      </motion.span>
      <span className="text-base font-semibold text-flauzino-navy-900">
        Biometria cadastrada!
      </span>
      <span className="text-xs text-flauzino-slate-400">
        Já pode ser reconhecida nas câmeras da unidade
      </span>
    </div>
  );
}

const ENROLL_PHASES = [
  EnrollPhaseCpf,
  EnrollPhaseConfirm,
  EnrollPhaseTerms,
  EnrollPhaseCapture,
  EnrollPhaseDone,
];

export function EnrollMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const interval = window.setInterval(
      () => setPhase((p) => (p + 1) % ENROLL_PHASES.length),
      2400
    );
    return () => window.clearInterval(interval);
  }, [inView]);

  const Phase = ENROLL_PHASES[phase];
  // no painel de progresso, a fase "done" marca tudo como concluído
  const doneUpTo = phase >= WIZARD_STEPS.length ? WIZARD_STEPS.length : phase;

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-md" aria-hidden="true">
      <Glow className="-inset-14" />

      <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-lift">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-2 text-flauzino-navy-900">
            <EagleMark size={22} />
            <span className="text-[15px] font-semibold tracking-tight">
              Cadastro de biometria
            </span>
          </span>
          <span className="rounded-full bg-flauzino-accent-50 px-3 py-1 text-[11px] font-semibold text-flauzino-accent-700">
            Totem — Recepção
          </span>
        </div>

        {/* trilha de passos do wizard real */}
        <div className="mt-6 flex items-center">
          {WIZARD_STEPS.map((step, i) => {
            const done = i < doneUpTo;
            const current = i === phase;
            return (
              <div key={step.key} className="flex flex-1 items-center last:flex-none">
                <span className="flex flex-col items-center gap-1.5">
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-xl border transition-colors duration-300 ${
                      done
                        ? "border-flauzino-success-600/30 bg-flauzino-success-100 text-flauzino-success-600"
                        : current
                          ? "border-flauzino-accent-500 bg-flauzino-accent-600 text-white shadow-fl-sm"
                          : "border-flauzino-slate-200 bg-white text-flauzino-slate-400"
                    }`}
                  >
                    <step.icon className="h-4 w-4" strokeWidth={1.9} />
                  </span>
                  <span
                    className={`text-[10px] font-medium ${
                      current
                        ? "text-flauzino-accent-700"
                        : "text-flauzino-slate-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </span>
                {i < WIZARD_STEPS.length - 1 && (
                  <span
                    className={`mx-2 mb-5 h-px flex-1 ${
                      i < doneUpTo
                        ? "bg-flauzino-success-600/40"
                        : "bg-flauzino-slate-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* palco da fase atual — altura fixa para não “respirar” */}
        <div className="relative mt-5 h-[224px] overflow-hidden rounded-2xl border border-flauzino-slate-100 bg-flauzino-slate-50/60">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={phase}
              className="absolute inset-0"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <Phase />
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="mt-4 text-center text-xs text-flauzino-slate-400">
          Fluxo real de cadastro · menos de um minuto por pessoa
        </p>
      </div>
    </div>
  );
}
