"use client";

import {
  createElement,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";

/* ================================================================== */
/*  Componentes adaptados do reactbits.dev para a hero escura:         */
/*  - StarBorder: botão com "cometa" percorrendo a borda               */
/*  - StarField: céu estrelado determinístico (SSR-safe) com twinkle   */
/*  - GradientText: gradiente animado recortado no texto               */
/*  - ShinyText: um brilho que varre o texto e volta a descansar       */
/*  - SplitText: letras (ou palavras) que entram uma a uma             */
/*  - DecryptedText: texto que se decifra a partir de caracteres        */
/*    embaralhados                                                     */
/*  - FlipText: letras que giram no eixo X até assentar (este vem do   */
/*    Magic UI; o reactbits não tem um "flip text")                    */
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
/*  SplitText — reactbits.dev/text-animations/split-text               */
/*                                                                     */
/*  O original quebra o texto com o plugin SplitText do GSAP e dispara */
/*  pelo ScrollTrigger. Aqui a quebra acontece no próprio JSX e o      */
/*  movimento vem do framer-motion, como nos outros portes deste       */
/*  arquivo: nenhuma dependência nova e nenhum nó mexido por fora do   */
/*  React. API e padrões seguem o oficial (delay em ms entre letras,   */
/*  duration em s, from/to, threshold e rootMargin do gatilho).        */
/*                                                                     */
/*  Duas adições para encaixar o texto numa coreografia maior:         */
/*  `startDelay` atrasa a primeira letra e `trigger` troca o gatilho   */
/*  próprio (entrar na tela) pelo de quem chama.                       */
/*                                                                     */
/*  Cada palavra vive num inline-block sem quebra, o smartWrap do      */
/*  original: a linha nunca se parte no meio de uma palavra. O texto   */
/*  inteiro fica num sr-only e as letras vão como aria-hidden, então   */
/*  leitor de tela e buscador leem a palavra, não uma letra por vez.   */
/* ------------------------------------------------------------------ */

type SplitTarget = {
  opacity?: number;
  x?: number | string;
  y?: number | string;
  scale?: number;
  rotate?: number;
  filter?: string;
};

/* as curvas do GSAP que o original aceita, em cubic-bezier: power1 é a
   quad, power2 a cubic, power3 a quart e power4 a quint */
const GSAP_EASE: Record<string, [number, number, number, number]> = {
  "power1.out": [0.25, 0.46, 0.45, 0.94],
  "power2.out": [0.215, 0.61, 0.355, 1],
  "power3.out": [0.165, 0.84, 0.44, 1],
  "power4.out": [0.23, 1, 0.32, 1],
  "expo.out": [0.19, 1, 0.22, 1],
};

export function SplitText({
  text,
  className = "",
  /** ms entre uma letra (ou palavra) e a seguinte */
  delay = 50,
  /** duração de cada letra, em segundos */
  duration = 1.25,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  tag = "p",
  textAlign = "center",
  /** segundos antes da primeira letra */
  startDelay = 0,
  /** gatilho externo; sem ele, o texto anima ao entrar na tela */
  trigger,
  onLetterAnimationComplete,
}: {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string | [number, number, number, number];
  splitType?: "chars" | "words";
  from?: SplitTarget;
  to?: SplitTarget;
  threshold?: number;
  rootMargin?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  textAlign?: CSSProperties["textAlign"];
  startDelay?: number;
  trigger?: boolean;
  onLetterAnimationComplete?: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const seen = useInView(ref, {
    once: true,
    amount: threshold,
    margin: rootMargin as NonNullable<Parameters<typeof useInView>[1]>["margin"],
  });
  const play = trigger ?? seen;
  const curve = typeof ease === "string" ? GSAP_EASE[ease] ?? GSAP_EASE["power3.out"] : ease;
  const words = text.split(" ");
  const total =
    splitType === "words" ? words.length : words.reduce((n, w) => n + Array.from(w).length, 0);
  let index = 0;

  /* createElement com a tag em texto: no @types/react 19, um <Tag> vindo
     de ElementType vira um tipo grande demais para o compilador resolver */
  return createElement(
    tag,
    {
      ref,
      className: `split-parent inline-block overflow-hidden whitespace-normal ${className}`,
      style: { textAlign, wordWrap: "break-word" },
    },
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, w) => (
          <Fragment key={w}>
            <span className="inline-block whitespace-nowrap">
              {(splitType === "words" ? [word] : Array.from(word)).map((piece, c) => {
                const i = index++;
                return (
                  <motion.span
                    key={c}
                    className="inline-block will-change-transform"
                    initial={reduced ? false : from}
                    animate={reduced || play ? to : from}
                    transition={{ duration, ease: curve, delay: startDelay + (i * delay) / 1000 }}
                    onAnimationComplete={() => {
                      if (play && i === total - 1) onLetterAnimationComplete?.();
                    }}
                  >
                    {piece}
                  </motion.span>
                );
              })}
            </span>
            {w < words.length - 1 && " "}
          </Fragment>
        ))}
      </span>
    </>,
  );
}

/* ------------------------------------------------------------------ */
/*  DecryptedText — reactbits.dev/text-animations/decrypted-text       */
/*                                                                     */
/*  Porte do oficial com o motion do framer-motion. A lógica de        */
/*  embaralhar e revelar é a mesma: sequencial (uma letra por vez, na  */
/*  direção pedida) ou não sequencial (maxIterations rodadas de ruído  */
/*  e o texto assenta de uma vez). Ficaram de fora os modos "click" e  */
/*  "toggle", que nada no site usa.                                    */
/*                                                                     */
/*  Duas adaptações. `trigger` + `startDelay` deixam quem chama decidir */
/*  quando decifrar (o chip da seção de reconhecimento facial decifra  */
/*  no instante em que aparece, não quando entra na tela). E o texto   */
/*  final fica invisível ocupando o lugar, com o embaralhado por cima: */
/*  letra aleatória tem outra largura, e sem essa reserva o chip       */
/*  inteiro tremia a cada quadro.                                      */
/*                                                                     */
/*  O DecryptedText de primitives.tsx é outro componente (o da seção   */
/*  de criptografia, mais antigo) e continua como está.                */
/* ------------------------------------------------------------------ */

export function DecryptedText({
  text,
  /** ms entre um quadro de ruído e o seguinte */
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = "start",
  useOriginalCharsOnly = false,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+",
  className = "",
  parentClassName = "",
  encryptedClassName = "",
  animateOn = "view",
  /** gatilho externo; quando passa a true, decifra (uma vez) */
  trigger,
  /** segundos entre o gatilho e o começo da decifragem */
  startDelay = 0,
}: {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: "start" | "end" | "center";
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: "view" | "hover";
  trigger?: boolean;
  startDelay?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.1 });
  const [displayText, setDisplayText] = useState(text);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [animating, setAnimating] = useState(false);
  const [done, setDone] = useState(false);

  const pool = useMemo(
    () =>
      useOriginalCharsOnly
        ? Array.from(new Set(text.split(""))).filter((c) => c !== " ")
        : characters.split(""),
    [useOriginalCharsOnly, text, characters],
  );

  const shuffle = useCallback(
    (set: Set<number>) =>
      text
        .split("")
        .map((c, i) => (c === " " || set.has(i) ? c : pool[Math.floor(Math.random() * pool.length)]))
        .join(""),
    [text, pool],
  );

  const nextIndex = useCallback(
    (set: Set<number>) => {
      const len = text.length;
      if (revealDirection === "end") return len - 1 - set.size;
      if (revealDirection === "center") {
        const middle = Math.floor(len / 2);
        const offset = Math.floor(set.size / 2);
        const idx = set.size % 2 === 0 ? middle + offset : middle - offset - 1;
        if (idx >= 0 && idx < len && !set.has(idx)) return idx;
        for (let i = 0; i < len; i++) if (!set.has(i)) return i;
        return 0;
      }
      return set.size;
    },
    [text, revealDirection],
  );

  const start = useCallback(() => {
    setRevealed(new Set());
    setDisplayText(shuffle(new Set()));
    setDone(false);
    setAnimating(true);
  }, [shuffle]);

  /* gatilho: o externo manda; sem ele, entrar na tela (modo "view") */
  const fire = trigger ?? (animateOn === "view" ? seen : false);
  useEffect(() => {
    if (!fire || reduced || done || animating) return;
    const id = setTimeout(start, startDelay * 1000);
    return () => clearTimeout(id);
    // só a borda de subida do gatilho importa
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fire, reduced]);

  useEffect(() => {
    if (!animating) return;
    let iteration = 0;
    const id = setInterval(() => {
      setRevealed((prev) => {
        if (sequential) {
          if (prev.size >= text.length) {
            clearInterval(id);
            setAnimating(false);
            setDone(true);
            setDisplayText(text);
            return prev;
          }
          const next = new Set(prev);
          next.add(nextIndex(prev));
          setDisplayText(shuffle(next));
          return next;
        }
        setDisplayText(shuffle(prev));
        iteration++;
        if (iteration >= maxIterations) {
          clearInterval(id);
          setAnimating(false);
          setDone(true);
          setDisplayText(text);
        }
        return prev;
      });
    }, speed);
    return () => clearInterval(id);
  }, [animating, sequential, text, speed, maxIterations, shuffle, nextIndex]);

  const hover =
    animateOn === "hover" && !reduced
      ? {
          onMouseEnter: () => !animating && start(),
          onMouseLeave: () => {
            setAnimating(false);
            setDisplayText(text);
            setDone(true);
          },
        }
      : {};

  return (
    <span ref={ref} className={`relative inline-block ${parentClassName}`} {...hover}>
      <span className="sr-only">{text}</span>
      {/* reserva o espaço do texto final, letra a letra como o de cima:
          um bloco de texto corrido tem kerning entre as letras e sai uns
          pixels mais estreito que letras em spans separados — a última
          palavra do texto animado quebrava para uma linha cortada. O
          embaralhado quebra nos mesmos espaços, então vale também para
          texto de duas linhas. */}
      <span aria-hidden className="invisible whitespace-pre-wrap">
        {text.split("").map((char, i) => (
          <span key={i}>{char}</span>
        ))}
      </span>
      <span aria-hidden className="absolute inset-0 overflow-hidden whitespace-pre-wrap">
        {displayText.split("").map((char, i) => (
          <span key={i} className={!animating || revealed.has(i) ? className : encryptedClassName}>
            {char}
          </span>
        ))}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  FlipText — magicui.design/docs/components/flip-text                */
/*                                                                     */
/*  O reactbits não tem um "flip text"; este segue o do Magic UI: cada */
/*  letra nasce deitada (rotateX -90°) e gira até ficar de pé, uma     */
/*  depois da outra. Mesmas adições do SplitText (`trigger` e          */
/*  `startDelay`), e o mesmo cuidado com leitor de tela: a frase vai   */
/*  num sr-only e as letras ficam aria-hidden.                         */
/* ------------------------------------------------------------------ */

export function FlipText({
  text,
  className = "",
  /** duração de cada letra, em segundos */
  duration = 0.5,
  /** segundos entre uma letra e a seguinte */
  delayMultiple = 0.08,
  startDelay = 0,
  trigger,
}: {
  text: string;
  className?: string;
  duration?: number;
  delayMultiple?: number;
  startDelay?: number;
  trigger?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const seen = useInView(ref, { once: true, amount: 0.1 });
  const play = trigger ?? seen;

  /* palavras inteiras em blocos sem quebra e espaço de verdade entre
     elas: a frase quebra linha como texto comum quando o espaço acaba */
  const words = text.split(" ");
  let index = 0;

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, w) => (
          <Fragment key={w}>
            <span className="inline-block whitespace-nowrap [perspective:600px]">
              {Array.from(word).map((char, c) => {
                const i = index++;
                return (
                  <motion.span
                    key={c}
                    className="inline-block origin-center"
                    initial={reduced ? false : { rotateX: -90, opacity: 0 }}
                    animate={reduced || play ? { rotateX: 0, opacity: 1 } : { rotateX: -90, opacity: 0 }}
                    transition={{ duration, delay: startDelay + i * delayMultiple, ease: "easeOut" }}
                  >
                    {char}
                  </motion.span>
                );
              })}
            </span>
            {w < words.length - 1 && " "}
          </Fragment>
        ))}
      </span>
    </span>
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
