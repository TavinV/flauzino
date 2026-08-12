"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { EagleMark } from "@/components/ui/Logo";

/* Signature easing — long, confident decel curve used across the page. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ */
/*  Reveal — blur + lift on enter                                      */
/* ------------------------------------------------------------------ */

export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 26,
  blur = 10,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  blur?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: `blur(${blur}px)` }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stagger group + item                                               */
/* ------------------------------------------------------------------ */

export function Stagger({
  children,
  className = "",
  delay = 0,
  gap = 0.09,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  gap?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: gap, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.75, ease: EASE } },
};

export function Item({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  CountUp — institutional, tabular, eases to target on view          */
/* ------------------------------------------------------------------ */

export function CountUp({
  to,
  duration = 2.2,
  className = "",
  format = (n: number) => Math.round(n).toLocaleString("pt-BR"),
}: {
  to: number;
  duration?: number;
  className?: string;
  format?: (n: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: duration * 1000, bounce: 0 });
  const text = useTransform(spring, (v) => format(v));

  useEffect(() => {
    if (inView) mv.set(to);
  }, [inView, to, mv]);

  return (
    <motion.span ref={ref} className={`tabular ${className}`}>
      {text}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/*  Brand mark — a bespoke face-scan reticle                           */
/* ------------------------------------------------------------------ */

export function VisageMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden>
      <rect width="36" height="36" rx="10" fill="#172554" />
      {/* scan reticle corners */}
      <g stroke="#fff" strokeWidth="1.6" strokeLinecap="round">
        <path d="M11 9.5H9.5V11" />
        <path d="M25 9.5h1.5V11" />
        <path d="M11 26.5H9.5V25" />
        <path d="M25 26.5h1.5V25" />
      </g>
      {/* face arc */}
      <path
        d="M13 16c0 3.6 2.2 6.4 5 6.4s5-2.8 5-6.4"
        stroke="#60A5FA"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="18" cy="14.6" r="1.5" fill="#3B82F6" />
    </svg>
  );
}

/* Marca institucional Flauzino — águia heráldica (currentColor) + wordmark. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 text-brand-950 ${className}`}>
      <EagleMark size={36} />
      <span className="text-[17px] font-semibold tracking-tight">Flauzino</span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  ShinyText — gradient sweep across text, like reactbits' shiny-text */
/* ------------------------------------------------------------------ */

export function ShinyText({
  children,
  className = "",
  as: Tag = "span",
  color = "#172554",
  shine = "#8ba2f0",
}: {
  children: ReactNode;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3";
  /** base text color the shine sweeps over */
  color?: string;
  shine?: string;
}) {
  return (
    <Tag
      className={`inline-block animate-shimmer bg-[length:200%_100%] bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(110deg, ${color} 40%, ${shine} 50%, ${color} 60%)`,
      }}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/*  DecryptedText — scrambles into place on view, like reactbits'      */
/*  decrypted-text. Cycles random glyphs before settling per-char.     */
/* ------------------------------------------------------------------ */

const DECRYPT_CHARS = "!<>-_\\/[]{}—=+*^?#________";

export function DecryptedText({
  text,
  className = "",
  as: Tag = "span",
  speed = 32,
  revealDelay = 45,
}: {
  text: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3";
  /** ms between scramble frames */
  speed?: number;
  /** ms between each character locking in */
  revealDelay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [display, setDisplay] = useState(text);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!inView || started) return;
    setStarted(true);

    let revealed = 0;
    const scrambleFor = (index: number) =>
      text
        .split("")
        .map((ch, i) => {
          if (ch === " ") return " ";
          if (i < index) return text[i];
          return DECRYPT_CHARS[Math.floor(Math.random() * DECRYPT_CHARS.length)];
        })
        .join("");

    const scrambleInterval = setInterval(() => {
      setDisplay(scrambleFor(revealed));
    }, speed);

    const revealInterval = setInterval(() => {
      revealed += 1;
      if (revealed > text.length) {
        clearInterval(revealInterval);
        clearInterval(scrambleInterval);
        setDisplay(text);
        return;
      }
      setDisplay(scrambleFor(revealed));
    }, revealDelay);

    return () => {
      clearInterval(scrambleInterval);
      clearInterval(revealInterval);
    };
  }, [inView, started, text, speed, revealDelay]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={`tabular-nums ${className}`} aria-label={text}>
      {display}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/*  Eyebrow label                                                      */
/* ------------------------------------------------------------------ */

export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-600 dark:text-brand-400 ${className}`}
    >
      <span className="h-1 w-1 rounded-full bg-brand-600 dark:bg-brand-400" />
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Buttons                                                            */
/* ------------------------------------------------------------------ */

export function PrimaryButton({
  children,
  href = "/demonstracao",
  className = "",
}: {
  children: ReactNode;
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-pop transition-all duration-200 hover:bg-brand-700 hover:shadow-lift focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30 ${className}`}
    >
      {children}
    </Link>
  );
}

export function GhostButton({
  children,
  href = "#story",
  className = "",
}: {
  children: ReactNode;
  href?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`group inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-700 backdrop-blur transition-all duration-200 hover:border-slate-400 hover:bg-white hover:text-brand-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20 dark:border-white/15 dark:bg-white/5 dark:text-white/80 dark:hover:border-white/25 dark:hover:bg-white/10 dark:hover:text-white ${className}`}
    >
      {children}
    </a>
  );
}
