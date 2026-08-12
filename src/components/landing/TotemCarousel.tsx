"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Laptop,
  ScanFace,
  Smartphone,
  Tablet,
  UserPlus,
} from "lucide-react";
import { EagleMark } from "@/components/ui/Logo";
import { Reveal, EASE } from "./primitives";

/* ================================================================== */
/*  Tela de descanso do totem — cópia fiel de app/totem/page.tsx      */
/*  (relógio gigante ao vivo, chip de chamada aberta e ações).        */
/* ================================================================== */

type DeviceSize = "phone" | "tablet" | "laptop";

function LiveClock({ size }: { size: DeviceSize }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const time = now
    ? new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).formatToParts(now)
    : null;
  const get = (type: string) =>
    time?.find((p) => p.type === type)?.value ?? "--";
  const date = now
    ? new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(now)
    : "";

  const clockSize = {
    phone: "text-[2.9rem]",
    tablet: "text-[4.2rem]",
    laptop: "text-[3.6rem]",
  }[size];

  return (
    <div className="text-center">
      <p
        className={`font-mono-ds font-semibold tabular-nums leading-none tracking-tight text-flauzino-navy-900 ${clockSize}`}
      >
        {get("hour")}:{get("minute")}
        <span className="text-flauzino-slate-300">:{get("second")}</span>
      </p>
      <p className="mt-3 text-sm capitalize text-flauzino-slate-500">{date}</p>
    </div>
  );
}

export type TotemDeviceSize = DeviceSize;

export function TotemIdleScreen({ size }: { size: DeviceSize }) {
  const stacked = size !== "laptop";
  return (
    <div
      className={`flex h-full w-full select-none flex-col items-center justify-between bg-white ${
        size === "laptop"
          ? "px-10 py-6"
          : size === "phone"
            ? "px-4 pb-6 pt-9"
            : "px-8 py-8"
      }`}
    >
      {/* marca no topo */}
      <span className="flex shrink-0 items-center gap-2 text-flauzino-navy-900">
        <EagleMark size={size === "phone" ? 26 : 32} />
        <span
          className={`font-semibold tracking-tight ${
            size === "phone" ? "text-[15px]" : "text-[17px]"
          }`}
        >
          Visage
        </span>
      </span>

      {/* relógio central */}
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-2.5">
        <LiveClock size={size} />
        <p
          className={`max-w-full text-balance text-center leading-snug text-flauzino-slate-600 ${
            size === "phone" ? "text-xs" : "text-[15px]"
          }`}
        >
          Totem de chamada · Totem da sala 12
        </p>
        <span
          className={`inline-flex max-w-[94%] items-center justify-center gap-2 rounded-2xl border border-flauzino-accent-100 bg-flauzino-accent-50 px-3.5 py-1.5 text-center font-medium leading-snug text-flauzino-accent-700 ${
            size === "phone" ? "text-[10.5px]" : "text-[13px]"
          }`}
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-flauzino-accent-600" />
          <span className="min-w-0 text-balance">
            Chamada aberta · Engenharia de Software 1 - C
          </span>
        </span>
      </div>

      {/* ações — empilhadas (uma sobre a outra) no celular e no tablet */}
      <div className="flex w-full max-w-md shrink-0 flex-col items-center gap-3">
        <div
          className={`flex w-full gap-2.5 ${stacked ? "flex-col" : "flex-col sm:flex-row"}`}
        >
          <span
            className={`flex flex-1 items-center justify-center gap-2.5 whitespace-nowrap rounded-xl bg-flauzino-navy-900 font-semibold text-white shadow-fl-md ${
              size === "phone" ? "py-3 text-sm" : "py-3.5 text-[15px]"
            }`}
          >
            <ScanFace size={20} strokeWidth={1.75} />
            Registrar presença
          </span>
          <span
            className={`flex flex-1 items-center justify-center gap-2.5 whitespace-nowrap rounded-xl border border-flauzino-slate-300 bg-white font-semibold text-flauzino-navy-900 shadow-fl-xs ${
              size === "phone" ? "py-3 text-sm" : "py-3.5 text-[15px]"
            }`}
          >
            <UserPlus size={20} strokeWidth={1.75} />
            Cadastrar biometria
          </span>
        </div>
        <p className="text-center text-[11px] leading-snug tracking-wide text-flauzino-slate-400">
          Desenvolvido pela Flauzino · Feito para confiar.
        </p>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Molduras de dispositivo                                            */
/* ================================================================== */

function PhoneFrame() {
  return (
    <div className="relative w-[min(300px,78vw)] rounded-[2.8rem] border-[10px] border-slate-900 bg-slate-900 shadow-lift">
      <div className="absolute left-1/2 top-2.5 z-20 h-4 w-24 -translate-x-1/2 rounded-full bg-slate-900" />
      <div className="relative aspect-[9/17] overflow-hidden rounded-[2.15rem]">
        <TotemIdleScreen size="phone" />
      </div>
    </div>
  );
}

function TabletFrame() {
  return (
    <div className="relative w-[min(440px,88vw)] rounded-[2.1rem] border-[13px] border-slate-900 bg-slate-900 shadow-lift">
      <div className="absolute left-1/2 top-[5px] z-20 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-slate-700" />
      <div className="relative aspect-[3/4] overflow-hidden rounded-[1.35rem]">
        <TotemIdleScreen size="tablet" />
      </div>
    </div>
  );
}

function LaptopFrame() {
  return (
    <div className="w-[min(660px,92vw)]">
      <div className="relative rounded-t-2xl border-[12px] border-b-0 border-slate-900 bg-slate-900 shadow-lift">
        <div className="absolute left-1/2 top-[3px] z-20 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-slate-700" />
        <div className="relative aspect-[16/10] overflow-hidden rounded-t-lg">
          <TotemIdleScreen size="laptop" />
        </div>
      </div>
      {/* base do notebook */}
      <div className="relative mx-[-4%] h-[16px] rounded-b-2xl bg-slate-800 shadow-lift">
        <div className="absolute left-1/2 top-0 h-[6px] w-24 -translate-x-1/2 rounded-b-lg bg-slate-700" />
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Carrossel automático + palavra digitada em gradiente              */
/* ================================================================== */

const DEVICES = [
  { id: "phone", word: "celular", icon: Smartphone, frame: <PhoneFrame /> },
  { id: "tablet", word: "tablet", icon: Tablet, frame: <TabletFrame /> },
  { id: "laptop", word: "notebook", icon: Laptop, frame: <LaptopFrame /> },
] as const;

const TYPE_MS = 90;
const DELETE_MS = 45;
const HOLD_MS = 2600;

const TOTEM_BULLETS = [
  "Calibração personalizada para cada dispositivo: o sistema se ajusta à câmera e à iluminação de cada sala.",
  "Orientações na tela guiam o aluno do início ao fim.",
  "O equipamento que a escola já tem — sem comprar nada novo.",
];

/** Digita, segura, apaga e troca de dispositivo — tudo em um relógio só. */
function useTypedDevice() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState<string>(DEVICES[0].word);
  const [mode, setMode] = useState<"typing" | "holding" | "deleting">(
    "holding"
  );

  useEffect(() => {
    const word = DEVICES[index].word;
    let t: number;

    if (mode === "typing") {
      if (text.length < word.length) {
        t = window.setTimeout(
          () => setText(word.slice(0, text.length + 1)),
          TYPE_MS
        );
      } else {
        setMode("holding");
        return;
      }
    } else if (mode === "holding") {
      t = window.setTimeout(() => setMode("deleting"), HOLD_MS);
    } else {
      if (text.length > 0) {
        t = window.setTimeout(() => setText(text.slice(0, -1)), DELETE_MS);
      } else {
        // palavra apagada: o dispositivo troca junto com a nova digitação
        setIndex((i) => (i + 1) % DEVICES.length);
        setMode("typing");
        return;
      }
    }
    return () => window.clearTimeout(t);
  }, [text, mode, index]);

  const select = (i: number) => {
    setIndex(i);
    setText(DEVICES[i].word);
    setMode("holding");
  };

  return { index, text, select };
}

export default function TotemDeviceRow() {
  const { index, text, select } = useTypedDevice();
  const device = DEVICES[index];

  return (
    <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
      {/* copy com a palavra digitada */}
      <div className="text-center lg:text-left">
        <Reveal>
          <h3 className="text-balance text-3xl font-semibold tracking-tight text-brand-950 lg:text-4xl">
            {/* a palavra fecha a linha: digitar não reflui o resto do título */}
            <span className="block">
              Qualquer{" "}
              <span className="whitespace-nowrap">
                <span className="bg-gradient-to-r from-brand-500 via-brand-600 to-brand-800 bg-clip-text font-semibold text-transparent">
                  {text}
                </span>
                <motion.span
                  aria-hidden
                  className="ml-0.5 inline-block h-[0.95em] w-[3px] translate-y-[0.12em] rounded-full bg-brand-500"
                  animate={{ opacity: [1, 1, 0, 0] }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    times: [0, 0.5, 0.5, 1],
                  }}
                />
              </span>
            </span>
            <span className="block">vira um totem</span>
          </h3>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="mx-auto mt-5 max-w-lg text-balance text-lg leading-relaxed text-slate-600 lg:mx-0">
            Qualquer celular, tablet ou notebook pode ser usado na entrada da
            sala. Basta abrir o navegador e começar a chamada.
          </p>
        </Reveal>
        <div className="mt-8 space-y-4">
          {TOTEM_BULLETS.map((bullet, i) => (
            <Reveal key={bullet} delay={0.08 + i * 0.05}>
              <div className="mx-auto flex max-w-md items-start justify-center gap-3 text-left lg:mx-0 lg:max-w-none lg:justify-start">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-brand-600" />
                <p className="text-[15px] leading-relaxed text-slate-600">
                  {bullet}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* seletor de dispositivos */}
        {/* <Reveal delay={0.2}>
          <div className="mt-9 flex items-center gap-2">
            {DEVICES.map((d, i) => (
              <button
                key={d.id}
                type="button"
                onClick={() => select(i)}
                aria-label={`Ver no ${d.word}`}
                className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  i === index
                    ? "border-brand-200 bg-brand-50 text-brand-700 shadow-soft"
                    : "border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:text-slate-600"
                }`}
              >
                <d.icon className="h-4 w-4" />
                <span className="hidden capitalize sm:block">{d.word}</span>
              </button>
            ))}
          </div>
        </Reveal> */}
      </div>

      {/* palco do carrossel */}
      <Reveal delay={0.1} y={36}>
        <div
          className="relative flex h-[560px] items-center justify-center sm:h-[620px]"
          aria-hidden="true"
        >
          <div className="pointer-events-none absolute inset-[-8%] rounded-[64px] bg-[radial-gradient(50%_55%_at_50%_45%,rgba(59,130,246,0.18),rgba(147,197,253,0.08)_55%,transparent_78%)] blur-2xl" />
          <AnimatePresence initial={false}>
            <motion.div
              key={device.id}
              initial={{ opacity: 0, x: 56, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -56, scale: 0.94 }}
              transition={{ duration: 0.65, ease: EASE }}
              className="absolute flex items-center justify-center"
            >
              {device.frame}
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </div>
  );
}
