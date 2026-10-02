"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, Lock, ShieldCheck, Zap, type LucideIcon } from "lucide-react";
import { EASE } from "./primitives";
import { DecryptedText, FlipText, SplitText } from "./reactbits";
import { whatsappHref } from "@/lib/whatsapp";

/* ================================================================== */
/*  Reconhecimento facial — reprodução do "Hero Reconhecimento Facial  */
/*  v2" do Claude Design, que tem dois artboards: desktop 1440×960 e   */
/*  celular 390×960. Os textos visíveis são os do arquivo; a única     */
/*  coisa que saiu dele foi a explicação que abria no hover dos chips, */
/*  retirada a pedido.                                                 */
/*                                                                     */
/*  A composição é um palco com a proporção do artboard. Posições são  */
/*  porcentagens do palco e tamanhos são cqw do container, então o     */
/*  desenho escala inteiro, sem se reorganizar. No desktop o palco     */
/*  para de crescer em 1440px e também acompanha a altura da tela      */
/*  (1,62 × svh): em notebook, ou com zoom alto no navegador, a seção  */
/*  não vira um paredão maior que a tela. O piso de 1024px segura      */
/*  chips e botões, que têm tamanho mínimo, sem se atropelarem. No     */
/*  celular o palco vai de 320 a 440px.                                */
/*                                                                     */
/*  Em relação ao artboard, título, rótulo, chips e o bloco dos CTAs   */
/*  subiram alguns pontos: mais do "Facial" fica à vista acima do      */
/*  cabelo e sobra respiro entre os botões e o fim da seção.           */
/*                                                                     */
/*  Chips, cartão e CTAs têm piso em px: abaixo de 1440 eles param de  */
/*  encolher, porque texto de 10px e botão de 34px não servem mais     */
/*  para ler nem para tocar. No celular, o que fica abaixo do rosto    */
/*  (chips, frase e botões) sai do palco e vira fluxo normal.          */
/*                                                                     */
/*  O fundo (grade e degradê escuro) sangra até a borda da seção pelo  */
/*  w-screen, mas mede as elipses em cqw do palco: com a tela mais     */
/*  larga que o palco, a luz continua proporcional ao rosto.           */
/* ================================================================== */

const WHATSAPP_MESSAGE =
  "Olá! Vi a seção de reconhecimento facial no site da Flauzino e gostaria de conversar sobre uma solução de reconhecimento facial para minha empresa.";

/* A ordem da entrada, em segundos depois que o palco aparece: o título,
   a foto surgindo na frente dele, os chips, a moldura fechando no rosto,
   o cartão de identidade e, por fim, a moldura saindo. Cada peça tem a
   sua própria animação; o que é compartilhado é só o relógio. */
const T = {
  title: 0.1,
  facial: 0.4,
  label: 0.9,
  photo: 0.6,
  text: 2.0,
  chips: 2.3,
  chipGap: 0.22,
  frame: 3.4,
  card: 4.05,
  frameOut: 5.4,
};

type Chip = {
  id: string;
  icon: LucideIcon;
  title: string;
  /** como o texto do chip entra */
  effect: "decrypt" | "flip";
  /** posição do artboard de 1440: A e C ancoram pela direita, B pela esquerda */
  position: string;
  /** período da flutuação, em segundos */
  float: number;
};

const CHIPS: Chip[] = [
  {
    id: "a",
    icon: Lock,
    title: "Criptografia de ponta",
    effect: "decrypt",
    position: "right-[59.1667%] top-[54.5%]",
    float: 6.2,
  },
  {
    id: "b",
    icon: Zap,
    title: "Velocidade surreal",
    effect: "flip",
    position: "left-[60.2778%] top-[60%]",
    float: 7.4,
  },
  {
    id: "c",
    icon: ShieldCheck,
    title: "Detecção de fraude",
    effect: "decrypt",
    position: "right-[60.2778%] top-[67.5%]",
    float: 8.6,
  },
];

/* o chip cresce de 40% até o tamanho real com um leve passo além */
const GROW = { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] as const };

/** O texto do chip, com a animação própria de cada um. */
function ChipTitle({
  chip,
  play,
  delay,
  encrypted,
}: {
  chip: Chip;
  play: boolean;
  delay: number;
  /** cor das letras ainda embaralhadas */
  encrypted: string;
}) {
  return chip.effect === "decrypt" ? (
    <DecryptedText
      text={chip.title}
      trigger={play}
      startDelay={delay + 0.15}
      sequential
      speed={38}
      encryptedClassName={encrypted}
    />
  ) : (
    <FlipText text={chip.title} trigger={play} startDelay={delay + 0.15} delayMultiple={0.04} />
  );
}

/* ------------------------------------------------------------------ */
/*  Moldura e cartão                                                   */
/* ------------------------------------------------------------------ */

const CORNERS = [
  { place: "left-0 top-0 border-l-2 border-t-2", x: -1, y: -1 },
  { place: "right-0 top-0 border-r-2 border-t-2", x: 1, y: -1 },
  { place: "left-0 bottom-0 border-l-2 border-b-2", x: -1, y: 1 },
  { place: "right-0 bottom-0 border-r-2 border-b-2", x: 1, y: 1 },
] as const;

/** Moldura de enquadramento do rosto: os cantos chegam de fora para
    dentro, seguram o rosto enquanto a identidade é confirmada e saem
    em fade logo depois que o cartão aparece. Com movimento reduzido ela
    não aparece, que é o estado final da sequência. */
function ScanFrame({
  className,
  corner,
  play,
  delay,
  hideDelay,
}: {
  /** posição e tamanho da moldura */
  className: string;
  /** tamanho de cada canto */
  corner: string;
  play: boolean;
  delay: number;
  hideDelay: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute ${className}`}
      initial={{ opacity: 1 }}
      animate={play ? { opacity: 0 } : undefined}
      transition={{ duration: 0.6, ease: EASE, delay: hideDelay }}
    >
      {CORNERS.map((c) => (
        <motion.span
          key={c.place}
          className={`absolute border-flauzino-accent-500 ${c.place} ${corner}`}
          initial={{ opacity: 0, x: c.x * 14, y: c.y * 14 }}
          animate={play ? { opacity: 1, x: 0, y: 0 } : undefined}
          transition={{ duration: 0.6, ease: EASE, delay }}
        />
      ))}
    </motion.div>
  );
}

/** O cartão de identidade confirmada. O tempo de verificação conta de
    0 até 280 enquanto o cartão aparece; sem JS (e para buscador) o
    número já nasce no valor final. As medidas seguem os dois artboards:
    abaixo de lg, o de 390 ("Verificado", cqw de 390); de lg para cima, o
    de 1440 ("Identidade verificada", cqw de 1440), sempre com piso em px. */
function VerifiedCard({
  className,
  play,
  delay,
}: {
  /** posição do cartão */
  className: string;
  play: boolean;
  delay: number;
}) {
  const reduced = useReducedMotion();
  const [ms, setMs] = useState(280);

  useEffect(() => {
    if (!play || reduced) return;
    setMs(0);
    const counter = animate(0, 280, {
      delay: delay + 0.1,
      duration: 0.9,
      ease: EASE,
      onUpdate: (v) => setMs(Math.round(v)),
    });
    return () => counter.stop();
  }, [play, reduced, delay]);

  return (
    <div className={`absolute ${className}`}>
      <motion.div
        className="flex flex-col gap-[3px] rounded-lg border border-flauzino-slate-200 bg-white px-[max(9px,2.5641cqw)] py-[max(7px,2.0513cqw)] shadow-fl-md lg:gap-1 lg:px-[max(14px,0.9722cqw)] lg:py-[max(10px,0.6944cqw)]"
        initial={reduced ? false : { opacity: 0, y: 10, scale: 0.96, filter: "blur(6px)" }}
        animate={play || reduced ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : undefined}
        transition={{ duration: 0.6, ease: EASE, delay }}
      >
        <span className="text-[length:max(11px,3.0769cqw)] font-semibold text-flauzino-navy-900 lg:text-[length:max(14px,0.9722cqw)]">
          Otávio Vinícius
        </span>
        <span className="flex items-center gap-[5px] whitespace-nowrap font-mono-ds text-[length:max(9px,2.5641cqw)] text-flauzino-slate-600 lg:gap-1.5 lg:text-[length:max(11px,0.7639cqw)]">
          <span className="relative flex h-[5px] w-[5px] shrink-0 lg:h-1.5 lg:w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-flauzino-success-600 opacity-60" />
            <span className="relative inline-flex h-full w-full rounded-full bg-flauzino-success-600" />
          </span>
          <span className="lg:hidden">Verificado</span>
          <span className="hidden lg:inline">Identidade verificada</span>
          {" · "}
          <span className="tabular">{ms}</span>
          {" ms"}
        </span>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Seção                                                              */
/* ------------------------------------------------------------------ */

export default function FacialRecognition() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const reduced = !!useReducedMotion();
  const play = useInView(stageRef, { once: true, amount: 0.3 });
  const chipsPlay = useInView(chipsRef, { once: true, amount: 0.4 });
  const textPlay = useInView(textRef, { once: true, amount: 0.25 });

  /* O relógio da sequência começa quando o palco aparece. Blocos com
     gatilho próprio (frase e CTAs; chips do celular) descontam o tempo
     que já passou: se entram junto com o palco, esperam a vez deles na
     ordem; se só entram na tela depois, sobem quase na hora, sem deixar
     quem rolou até ali olhando para um espaço vazio. */
  const playAt = useRef<number | null>(null);
  if (play && playAt.current === null) playAt.current = Date.now();
  const waitUntil = (at: number) =>
    Math.max(0.12, at - (playAt.current === null ? 0 : (Date.now() - playAt.current) / 1000));
  const textDelay = useRef<number | null>(null);
  if (textPlay && textDelay.current === null) textDelay.current = waitUntil(T.text);
  const mobileChipsDelay = useRef<number | null>(null);
  if (chipsPlay && mobileChipsDelay.current === null) mobileChipsDelay.current = waitUntil(T.chips);

  /* o título desliza um pouco mais devagar que o resto da seção: o
     cabelo cobre mais ou menos do "Facial" conforme a leitura avança.
     Em cqw, a amplitude acompanha o tamanho do palco, e o desvio é
     zero quando o meio da seção cruza o meio da tela. */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const drift = useSpring(scrollYProgress, { stiffness: 80, damping: 26, restDelta: 0.001 });
  const titleY = useTransform(drift, [0, 1], reduced ? ["0cqw", "0cqw"] : ["2.2cqw", "-2.2cqw"]);

  /* entrada com o relógio do palco; com movimento reduzido, tudo já
     nasce no lugar */
  const enter = (
    from: Record<string, number | string>,
    delay: number,
    transition: Record<string, unknown> = { duration: 0.9, ease: EASE },
  ) =>
    reduced
      ? { initial: false as const }
      : {
          initial: from,
          animate: play ? { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" } : undefined,
          transition: { ...transition, delay },
        };

  /* a frase e os botões sobem com o gatilho do próprio bloco */
  const rise = (extra: number) =>
    reduced
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 22, filter: "blur(8px)" },
          animate: textPlay ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined,
          transition: { duration: 0.85, ease: EASE, delay: (textDelay.current ?? 0) + extra },
        };

  return (
    <section
      ref={sectionRef}
      id="reconhecimento-facial"
      data-nav-theme="light"
      aria-labelledby="reconhecimento-facial-titulo"
      className="relative scroll-mt-24 overflow-hidden bg-flauzino-slate-50 lg:pt-14"
    >
      {/* Faixas para o header. Sobre a parte clara da seção ele abre sem
          vidro, como sobre o painel de IA (data-nav-chrome="bare"), só que
          com texto escuro. Onde a seção escurece embaixo, volta a pílula
          de vidro — no celular a versão escura, porque ali o fundo é navy
          sólido. As faixas não se sobrepõem, então o Nav nunca empata. */}
      <div
        aria-hidden
        data-nav-theme="light"
        data-nav-chrome="bare"
        className="pointer-events-none absolute inset-x-0 top-0 hidden h-[calc(75%_+_0.875rem)] lg:block"
      />

      <div className="relative mx-auto w-full max-w-[440px] [container-type:inline-size] lg:max-w-[min(1440px,max(1024px,calc(100svh*1.62)))]">
        <div
          aria-hidden
          data-nav-theme="light"
          data-nav-chrome="bare"
          className="pointer-events-none absolute inset-x-0 top-0 h-[128cqw] lg:hidden"
        />
        <div
          aria-hidden
          data-nav-theme="dark"
          className="pointer-events-none absolute inset-x-0 bottom-0 top-[128cqw] lg:hidden"
        />

        {/* ------------------------------ palco ------------------------------ */}
        <div ref={stageRef} className="relative aspect-[390/560] lg:aspect-[3/2]">
          {/* grade de engenharia: 32px no celular, 48px no desktop, com a
              máscara elíptica de cada artboard */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 lg:hidden"
            style={{
              backgroundImage:
                "linear-gradient(rgba(37,57,95,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(37,57,95,0.06) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              backgroundPosition: "center top",
              WebkitMaskImage:
                "radial-gradient(ellipse 80cqw 86.1538cqw at 50% 73.8462cqw, #000 20%, transparent 75%)",
              maskImage:
                "radial-gradient(ellipse 80cqw 86.1538cqw at 50% 73.8462cqw, #000 20%, transparent 75%)",
            }}
            {...(reduced
              ? {}
              : { initial: { opacity: 0 }, animate: play ? { opacity: 1 } : undefined, transition: { duration: 1.4 } })}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-screen -translate-x-1/2 lg:block"
            style={{
              backgroundImage:
                "linear-gradient(rgba(37,57,95,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(37,57,95,0.06) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              backgroundPosition: "center top",
              WebkitMaskImage:
                "radial-gradient(ellipse 60cqw 33.3333cqw at 50% 28cqw, #000 20%, transparent 75%)",
              maskImage:
                "radial-gradient(ellipse 60cqw 33.3333cqw at 50% 28cqw, #000 20%, transparent 75%)",
            }}
            {...(reduced
              ? {}
              : { initial: { opacity: 0 }, animate: play ? { opacity: 1 } : undefined, transition: { duration: 1.4 } })}
          />

          {/* foco de luz azul atrás do rosto: entra crescendo e depois
              respira devagar, num ciclo que não coincide com nenhum outro */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[75%] h-[128.2051cqw] w-[128.2051cqw] -translate-x-1/2 -translate-y-1/2 lg:top-[54.1667%] lg:h-[55.5556cqw] lg:w-[55.5556cqw]"
          >
            <motion.div className="h-full w-full" {...enter({ opacity: 0, scale: 0.8 }, 0, { duration: 1.6, ease: EASE })}>
              <motion.div
                className="h-full w-full rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(37,99,235,0.16) 0%, rgba(37,99,235,0.06) 40%, transparent 70%)",
                }}
                animate={reduced ? undefined : { scale: [1, 1.06, 1], opacity: [1, 0.82, 1] }}
                transition={{ duration: 9, ease: "easeInOut", repeat: Infinity, delay: 1.8 }}
              />
            </motion.div>
          </div>

          {/* rótulo: pílula centralizada no celular; texto solto à direita
              do "Facial" no desktop */}
          <div className="absolute inset-x-0 top-[15%] flex justify-center px-3 lg:left-[72.9167%] lg:right-0 lg:top-[25.2%] lg:px-0">
            <motion.p
              className="flex items-center gap-[2.0513cqw] rounded-full border border-flauzino-slate-200 bg-white px-[3.5897cqw] py-[1.5385cqw] shadow-fl-sm lg:gap-[0.6944cqw] lg:border-0 lg:bg-transparent lg:px-[1.25cqw] lg:py-[0.5556cqw] lg:shadow-none"
              {...enter({ opacity: 0, y: 10, filter: "blur(8px)" }, T.label)}
            >
              <span aria-hidden className="h-[5px] w-[5px] shrink-0 rounded-full bg-brand-600 lg:hidden" />
              <span className="whitespace-nowrap text-center text-[length:max(9px,2.5641cqw)] font-semibold uppercase tracking-[0.16em] text-flauzino-navy-900 lg:whitespace-normal lg:text-balance lg:text-[length:max(10px,0.8333cqw)] lg:tracking-[0.18em]">
                Feito sob medida para a sua operação
              </span>
            </motion.p>
          </div>

          {/* título monumental, atrás da foto: o cabelo cobre o "Facial" */}
          <motion.div className="absolute inset-x-0 top-[25%] lg:top-[7.8%]" style={{ y: titleY }}>
            <h2 id="reconhecimento-facial-titulo" className="text-center text-flauzino-navy-900">
              <span className="block text-[length:11.5385cqw] font-light leading-none tracking-[-0.03em] lg:text-[length:10.4167cqw] lg:tracking-[-0.025em]">
                <SplitText
                  text="Reconhecimento"
                  tag="span"
                  className="align-top"
                  trigger={play}
                  startDelay={T.title}
                  delay={30}
                  duration={0.9}
                  from={{ opacity: 0, y: "60%" }}
                  to={{ opacity: 1, y: 0 }}
                />
              </span>
              <span className="-mt-[1.7949cqw] block text-[length:26.6667cqw] font-bold leading-none tracking-[-0.04em] lg:-mt-[2.5cqw] lg:text-[length:15.5556cqw] lg:tracking-[-0.035em]">
                <SplitText
                  text="Facial"
                  tag="span"
                  className="align-top"
                  trigger={play}
                  startDelay={T.facial}
                  delay={60}
                  duration={1}
                  ease="power4.out"
                  from={{ opacity: 0, y: "85%" }}
                  to={{ opacity: 1, y: 0 }}
                />
              </span>
            </h2>
          </motion.div>

          {/* a foto surge depois do título, na frente dele: no desktop
              termina rente à base do palco; no celular desce um pouco além
              dele e some no degradê. A foto atual é 1500×1035, com o rosto
              ocupando bem mais do quadro que a anterior (2072×1177): por
              isso a largura caiu de 195% para 150% no celular e de 83% para
              67% no desktop. Com a largura antiga o cabelo cobria o
              "Facial" inteiro e o queixo ia parar atrás dos chips. */}
          <div className="absolute left-[-20%] top-[40.5%] w-[150%] lg:left-[18.8%] lg:top-[30.9%] lg:w-[66.7%]">
            <motion.div {...enter({ opacity: 0, filter: "blur(6px)" }, T.photo, { duration: 0.45, ease: "easeOut" })}>
              <Image
                src="/facial_recognition/otavio.png"
                alt="Otávio Vinícius, fundador da Flauzino, com o rosto enquadrado por uma moldura de reconhecimento facial"
                width={1500}
                height={1035}
                sizes="(min-width: 1024px) min(67vw, 961px), min(150vw, 660px)"
                className="block h-auto w-full select-none"
                draggable={false}
              />
            </motion.div>
          </div>

          {/* degradê escuro que assenta a foto e dá fundo para o texto
              branco. Desktop: elipse na base. Celular: sobe da base até
              pouco acima dos chips e desce sólido até o fim da seção. */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-1/2 hidden h-[33.3333cqw] w-screen -translate-x-1/2 lg:block"
            style={{
              background:
                "radial-gradient(ellipse 60cqw 30cqw at 50% 100%, rgba(11,18,32,0.82) 0%, rgba(11,18,32,0.66) 25%, rgba(11,18,32,0.4) 50%, rgba(11,18,32,0.16) 75%, rgba(11,18,32,0) 100%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[calc(100%_-_10.2564cqw)] h-[400cqw] w-screen -translate-x-1/2 lg:hidden"
            style={{
              background:
                "linear-gradient(to bottom, rgba(11,18,32,0) 0, rgba(11,18,32,0.15) 7.6923cqw, rgba(11,18,32,0.4) 16.6667cqw, rgba(11,18,32,0.7) 28.2051cqw, rgba(11,18,32,0.9) 38.4615cqw, #0b1220 48.7179cqw)",
            }}
          />

          <ScanFrame
            className="left-[31.7949%] top-[58.2143%] h-[50.2564cqw] w-[38.4615cqw] lg:left-[42.0833%] lg:top-[47.7083%] lg:h-[21.1111cqw] lg:w-[15.8333cqw]"
            corner="h-[4.6154cqw] w-[4.6154cqw] lg:h-[1.9444cqw] lg:w-[1.9444cqw]"
            play={play}
            delay={T.frame}
            hideDelay={T.frameOut}
          />

          <VerifiedCard
            className="right-[3.0769%] top-[78.5714%] lg:left-[58.75%] lg:right-auto lg:top-[42.9167%]"
            play={play}
            delay={T.card}
          />

          {/* chips de vidro do desktop: cada um cresce no seu lugar, com a
              animação de texto dele, e depois flutua no seu próprio período */}
          <div className="hidden lg:block">
            {CHIPS.map((chip, i) => {
              const Icon = chip.icon;
              const delay = T.chips + i * T.chipGap;
              return (
                <div key={chip.id} className={`absolute ${chip.position}`}>
                  <motion.div {...enter({ opacity: 0, scale: 0.4 }, delay, GROW)}>
                    <div
                      className="animate-floaty"
                      style={{ animationDuration: `${chip.float}s`, animationDelay: `${i * 0.9}s` }}
                    >
                      <div className="flex items-center gap-3 rounded-[12px] border border-white/75 bg-white/[0.42] py-2.5 pl-2.5 pr-[18px] shadow-[0_8px_24px_rgba(11,18,32,0.10),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-[16px] backdrop-saturate-[1.4]">
                        <span className="grid h-[max(36px,2.5cqw)] w-[max(36px,2.5cqw)] flex-none place-items-center rounded-lg bg-white/70 text-brand-600">
                          <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                        </span>
                        <span className="whitespace-nowrap text-[length:max(14px,0.9722cqw)] font-semibold text-flauzino-navy-900">
                          <ChipTitle chip={chip} play={play} delay={delay} encrypted="text-brand-600/70" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* --------------- chips do celular: três colunas em vidro escuro --------------- */}
        <div ref={chipsRef} className="relative mx-[4.1026cqw] grid grid-cols-3 gap-[2.0513cqw] lg:hidden">
          {CHIPS.map((chip, i) => {
            const Icon = chip.icon;
            const delay = (mobileChipsDelay.current ?? 0) + i * T.chipGap;
            return (
              <motion.div
                key={chip.id}
                className="flex flex-col gap-[2.5641cqw] rounded-[12px] border border-white/[0.28] bg-white/[0.14] p-[3.0769cqw] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-[16px] backdrop-saturate-[1.4]"
                initial={reduced ? false : { opacity: 0, scale: 0.4 }}
                animate={chipsPlay || reduced ? { opacity: 1, scale: 1 } : undefined}
                transition={{ ...GROW, delay }}
              >
                <span className="grid h-[8.2051cqw] w-[8.2051cqw] place-items-center rounded-lg bg-white/[0.16] text-white">
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </span>
                <span className="text-[length:max(12px,3.3333cqw)] font-semibold leading-[1.3] text-white">
                  <ChipTitle chip={chip} play={chipsPlay} delay={delay} encrypted="text-brand-300/80" />
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* ------------------------ frase e CTAs ------------------------ */}
        <div
          ref={textRef}
          className="relative mx-[6.1538cqw] mt-[11.2821cqw] flex flex-col gap-[7.1795cqw] pb-[17cqw] lg:absolute lg:inset-x-0 lg:top-[77.3%] lg:mx-0 lg:mt-0 lg:items-center lg:gap-[1.9444cqw] lg:pb-0"
        >
          <motion.div {...rise(0)}>
            <p className="text-balance text-center text-[length:max(16px,4.6154cqw)] font-medium leading-[1.35] tracking-[-0.01em] text-white lg:mx-auto lg:max-w-[50cqw] lg:text-[length:1.8056cqw] lg:[text-shadow:0_1px_16px_rgba(11,18,32,0.5)]">
              Somos a única empresa que constrói sistemas sob medida{" "}
              <span className="text-[#9cc0ff]">especialista em reconhecimento facial.</span>
            </p>
          </motion.div>

          <motion.div {...rise(0.15)}>
            <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:gap-3">
              <a
                href={whatsappHref(WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-12 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-brand-600 px-8 text-base font-semibold tracking-[0.01em] text-white transition-colors duration-150 hover:bg-brand-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/40 active:translate-y-px"
              >
                Falar com especialista
                <ArrowRight
                  className="h-[18px] w-[18px] transition-transform duration-200 group-hover:translate-x-0.5"
                  strokeWidth={2}
                />
              </a>
              <Link
                href="/reconhecimento-facial"
                className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-lg border border-white/[0.28] px-6 text-base font-semibold text-white transition-colors duration-150 hover:border-white/50 hover:bg-white/[0.08] focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
              >
                Saiba mais
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
