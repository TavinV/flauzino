"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useTransform } from "framer-motion";

/* ================================================================== */
/*  Componentes adaptados do reactbits.dev para a hero escura:         */
/*  - StarBorder: botão com "cometa" percorrendo a borda               */
/*  - StarField: céu estrelado determinístico (SSR-safe) com twinkle   */
/*  - GradientText: gradiente animado recortado no texto               */
/*  - ShinyText: um brilho que varre o texto e volta a descansar       */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  GradientText — reactbits.dev/text-animations/gradient-text         */
/*                                                                     */
/*  A paleta da casa para texto em fundo escuro. Nasceu para substituir */
/*  o glow azul-acinzentado que a hero e a seção de IA usavam: gelo →   */
/*  azul-céu → violeta, com o gelo repetido no fim para o loop fechar   */
/*  sem emenda. Todas as palavras de uma mesma frase compartilham a     */
/*  fase da animação, então a linha inteira muda de cor junto.          */
/* ------------------------------------------------------------------ */

export const BRAND_GRADIENT = ["#EAF2FF", "#7CC5FF"];

export function GradientText({
  children,
  className = "",
  colors = BRAND_GRADIENT,
  /** segundos para a varredura completa do gradiente */
  animationSpeed = 9,
  direction = "horizontal",
  pauseOnHover = false,
  yoyo = true,
}: {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  direction?: "horizontal" | "vertical" | "diagonal";
  pauseOnHover?: boolean;
  yoyo?: boolean;
}) {
  const reduced = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  const animationDuration = animationSpeed * 1000;

  useAnimationFrame((time) => {
    if (isPaused || reduced) {
      lastTimeRef.current = null;
      return;
    }
    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }

    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;
    elapsedRef.current += deltaTime;

    if (yoyo) {
      const fullCycle = animationDuration * 2;
      const cycleTime = elapsedRef.current % fullCycle;
      progress.set(
        cycleTime < animationDuration
          ? (cycleTime / animationDuration) * 100
          : 100 - ((cycleTime - animationDuration) / animationDuration) * 100
      );
    } else {
      progress.set((elapsedRef.current / animationDuration) * 100);
    }
  });

  useEffect(() => {
    elapsedRef.current = 0;
    progress.set(0);
  }, [animationSpeed, yoyo, progress]);

  const backgroundPosition = useTransform(progress, (p) =>
    direction === "vertical" ? `50% ${p}%` : `${p}% 50%`
  );

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsPaused(true);
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsPaused(false);
  }, [pauseOnHover]);

  const gradientAngle =
    direction === "horizontal"
      ? "to right"
      : direction === "vertical"
        ? "to bottom"
        : "to bottom right";

  /* a primeira cor volta no fim para o ciclo fechar sem salto */
  const gradientColors = [...colors, colors[0]].join(", ");

  return (
    <motion.span
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(${gradientAngle}, ${gradientColors})`,
        backgroundSize:
          direction === "horizontal"
            ? "300% 100%"
            : direction === "vertical"
              ? "100% 300%"
              : "300% 300%",
        backgroundRepeat: "repeat",
        backgroundPosition,
        WebkitBackgroundClip: "text",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/*  ShinyText — reactbits.dev/text-animations/shiny-text               */
/*                                                                     */
/*  Porte do componente oficial com duas adaptações ao projeto: o      */
/*  motion vem do framer-motion (mesma API do pacote motion/react, e   */
/*  é o que a casa já usa em todo lugar) e o `.shiny-text` do CSS      */
/*  original virou inline-block direto no className, já que era a      */
/*  única regra do arquivo. O texto pode vir como string (prop `text`, */
/*  igual ao original) ou como children, para conviver com o resto do  */
/*  título dentro do mesmo h1.                                         */
/*                                                                     */
/*  Diferente do GradientText, aqui a cor de base fica parada e só o   */
/*  brilho anda: com `delay`, a varredura vira um lampejo periódico    */
/*  em vez de um degradê em movimento constante.                       */
/* ------------------------------------------------------------------ */

export function ShinyText({
  text,
  children,
  disabled = false,
  /** duração de uma varredura, em segundos */
  speed = 2,
  /** pausa entre varreduras, em segundos */
  delay = 0,
  className = "",
  color = "#b5b5b5",
  shineColor = "#ffffff",
  /** ângulo do degradê, em graus */
  spread = 120,
  yoyo = false,
  pauseOnHover = false,
  direction = "left",
}: {
  text?: string;
  children?: ReactNode;
  disabled?: boolean;
  speed?: number;
  delay?: number;
  className?: string;
  color?: string;
  shineColor?: string;
  spread?: number;
  yoyo?: boolean;
  pauseOnHover?: boolean;
  direction?: "left" | "right";
}) {
  const reduced = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const directionRef = useRef(direction === "left" ? 1 : -1);

  const animationDuration = speed * 1000;
  const delayDuration = delay * 1000;

  useAnimationFrame((time) => {
    if (disabled || reduced || isPaused) {
      lastTimeRef.current = null;
      return;
    }
    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }

    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;
    elapsedRef.current += deltaTime;

    const cycleDuration = animationDuration + delayDuration;
    const forward = directionRef.current === 1;

    if (yoyo) {
      const cycleTime = elapsedRef.current % (cycleDuration * 2);

      if (cycleTime < animationDuration) {
        const p = (cycleTime / animationDuration) * 100;
        progress.set(forward ? p : 100 - p);
      } else if (cycleTime < cycleDuration) {
        progress.set(forward ? 100 : 0);
      } else if (cycleTime < cycleDuration + animationDuration) {
        const p = 100 - ((cycleTime - cycleDuration) / animationDuration) * 100;
        progress.set(forward ? p : 100 - p);
      } else {
        progress.set(forward ? 0 : 100);
      }
    } else {
      const cycleTime = elapsedRef.current % cycleDuration;

      if (cycleTime < animationDuration) {
        const p = (cycleTime / animationDuration) * 100;
        progress.set(forward ? p : 100 - p);
      } else {
        /* pausa com o brilho já fora do texto */
        progress.set(forward ? 100 : 0);
      }
    }
  });

  useEffect(() => {
    directionRef.current = direction === "left" ? 1 : -1;
    elapsedRef.current = 0;
    progress.set(0);
  }, [direction, progress]);

  /* p=0 → brilho fora à direita; p=100 → fora à esquerda */
  const backgroundPosition = useTransform(progress, (p) => `${150 - p * 2}% center`);

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsPaused(true);
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsPaused(false);
  }, [pauseOnHover]);

  return (
    <motion.span
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        backgroundPosition,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {text ?? children}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/*  StarBorder — reactbits.dev/animations/star-border                  */
/* ------------------------------------------------------------------ */

export function StarBorder({
  children,
  className = "",
  color = "#7CC5FF",
  speed = "6s",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  color?: string;
  speed?: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    /* inline-flex + p-px: o miolo estica para a altura que o pai mandar,
       então este botão consegue casar exatamente com o CTA vizinho */
    <a
      className={`relative inline-flex overflow-hidden rounded-xl p-px ${className}`}
      {...rest}
    >
      <span
        className="absolute bottom-[-12px] right-[-250%] z-0 h-1/2 w-[300%] animate-star-movement-bottom rounded-full opacity-70"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
        aria-hidden
      />
      <span
        className="absolute left-[-250%] top-[-12px] z-0 h-1/2 w-[300%] animate-star-movement-top rounded-full opacity-70"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
        aria-hidden
      />
      {/* py-3 é só o piso de quando ninguém define altura no root */}
      <span className="relative z-10 flex h-full w-full items-center justify-center gap-2 rounded-[11px] border border-white/15 bg-[#0b1526]/90 px-7 py-3 text-[15px] font-semibold text-white/85 backdrop-blur transition-colors hover:border-white/30 hover:text-white">
        {children}
      </span>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  StarField — posições pseudo-aleatórias com semente fixa, iguais    */
/*  no servidor e no cliente (sem hydration mismatch)                  */
/* ------------------------------------------------------------------ */

function seededRandom(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const rand = seededRandom(7);
const STARS = Array.from({ length: 110 }, () => ({
  x: rand() * 100,
  y: rand() * 100,
  size: 0.6 + rand() * 1.7,
  opacity: 0.18 + rand() * 0.55,
  delay: rand() * 5,
  duration: 2.4 + rand() * 3.6,
}));

export function StarField({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {STARS.map((s, i) => (
        <span
          key={i}
          className="absolute animate-twinkle rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SpotlightCard — reactbits.dev/components/spotlight-card             */
/*                                                                      */
/*  O holofote é um irmão do elemento, e não um ::before: assim ele     */
/*  fica sob o conteúdo sem exigir z-index em cada filho e o brilho     */
/*  acompanha o cursor pelas duas variáveis que o mousemove escreve.    */
/*  Só a variável muda a cada movimento — nenhum estado de React entra  */
/*  no caminho, então arrastar o mouse sobre uma trilha de cartões não  */
/*  provoca re-render. O foco por teclado acende o mesmo brilho, no     */
/*  centro, para quem navega sem mouse não perder o retorno visual.     */
/* ------------------------------------------------------------------ */

export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(147,197,253,0.22)",
}: {
  children: ReactNode;
  className?: string;
  /** cor do centro do holofote; a borda dele já se dissolve em transparente */
  spotlightColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`group/spot relative isolate overflow-hidden ${className}`}
      style={{ ["--spot-color" as string]: spotlightColor }}
    >
      {/* -z-10 dentro do isolate: o brilho passa por cima do fundo do
          cartão e por baixo do conteúdo, sem obrigar cada filho a virar
          um elemento posicionado */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100 group-focus-within/spot:opacity-100"
        style={{
          background:
            "radial-gradient(circle at var(--spot-x, 50%) var(--spot-y, 50%), var(--spot-color), transparent 72%)",
        }}
      />
      {children}
    </div>
  );
}
