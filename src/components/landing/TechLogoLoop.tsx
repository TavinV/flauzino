"use client";

import {
  siAndroid,
  siApple,
  siArduino,
  siClaude,
  siCloudflare,
  siDeno,
  siDocker,
  siEslint,
  siEspressif,
  siExpress,
  siFastapi,
  siFigma,
  siFramer,
  siGit,
  siGithub,
  siGithubactions,
  siGooglegemini,
  siGraphql,
  siJavascript,
  siJest,
  siKubernetes,
  siLinux,
  siMercadopago,
  siMongodb,
  siMysql,
  siN8n,
  siNestjs,
  siNextdotjs,
  siNginx,
  siNodedotjs,
  siNumpy,
  siOpencv,
  siPandas,
  siPix,
  siPostgresql,
  siPostman,
  siPrisma,
  siPython,
  siRabbitmq,
  siReact,
  siShadcnui,
  siSocketdotio,
  siSqlite,
  siStripe,
  siSwagger,
  siTailwindcss,
  siThreedotjs,
  siTypescript,
  siVercel,
  siVite,
  siWhatsapp,
  type SimpleIcon,
} from "simple-icons";
import { siAws, siChatgpt, siRedisClassic } from "./techMarks";
import LogoLoop, { type LogoItem } from "./LogoLoop";

/* ================================================================== */
/*  Fita de tecnologias — reactbits.dev/animations/logo-loop.          */
/*                                                                     */
/*  Não é uma seção: é a divisa entre o ato escuro e o claro. Antes    */
/*  eram duas faixas de cards com nome escrito, título e eyebrow, e o  */
/*  bloco inteiro ocupava meia tela para dizer uma coisa só. Agora é   */
/*  uma fita de uma linha entre dois fios de 1px — só as marcas, sem   */
/*  moldura e sem legenda, maiores do que cabiam nos cards. O olho lê  */
/*  o volume da stack de passagem e segue para a próxima seção.        */
/*                                                                     */
/*  Cinza no repouso, cor da marca no hover: assim a fita lê como um   */
/*  sistema e não como uma colagem de logos. O nome de cada uma vive   */
/*  no title/aria-label, para leitor de tela e tooltip.                */
/* ================================================================== */

/* Uma fileira só, na ordem em que a casa trabalha: produto, dados,
   infraestrutura, IA e integrações. */
const STACK: SimpleIcon[] = [
  siTypescript,
  siJavascript,
  siNodedotjs,
  siReact,
  siNextdotjs,
  siTailwindcss,
  siShadcnui,
  siFramer,
  siThreedotjs,
  siVite,
  siDeno,
  siPython,
  siFastapi,
  siNestjs,
  siExpress,
  siGraphql,
  siSocketdotio,
  siAndroid,
  siApple,
  siFigma,
  siEslint,
  siJest,
  siPostgresql,
  siMysql,
  siMongodb,
  siRedisClassic,
  siSqlite,
  siPrisma,
  siRabbitmq,
  siDocker,
  siKubernetes,
  siNginx,
  siLinux,
  siAws,
  siVercel,
  siCloudflare,
  siGit,
  siGithub,
  siGithubactions,
  siSwagger,
  siPostman,
  siClaude,
  siChatgpt,
  siGooglegemini,
  siOpencv,
  siPandas,
  siNumpy,
  siArduino,
  siEspressif,
  siN8n,
  siStripe,
  siMercadopago,
  siPix,
  siWhatsapp,
];

function TechMark({ icon }: { icon: SimpleIcon }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={34}
      height={34}
      role="img"
      aria-label={icon.title}
      className="block shrink-0 fill-slate-400 transition-colors duration-300 hover:fill-[var(--brand-hex)]"
      style={{ ["--brand-hex" as string]: `#${icon.hex}` }}
    >
      <title>{icon.title}</title>
      <path d={icon.path} />
    </svg>
  );
}

const LOGOS: LogoItem[] = STACK.map((icon) => ({
  node: <TechMark icon={icon} />,
  title: icon.title,
  ariaLabel: icon.title,
}));

export default function TechLogoLoop() {
  return (
    <section
      data-nav-theme="light"
      className="relative border-y border-slate-200/80 bg-white py-7"
    >
      {/* O gap entra por variável CSS em vez do prop numérico: o LogoLoop
          espalha `style` depois das próprias variáveis, então este valor
          vence o `gap={56}`. Com 56px fixos, uma tela de 360px mostrava
          quatro marcas e três buracos — a fita lia como sequência de
          logos soltos em vez de volume de stack. O clamp bate exatos
          56px em 640px (8.75vw × 640 = 56) e permanece em 56 daí para
          cima, então de tablet a desktop o desenho é o mesmo de sempre;
          abaixo disso ele fecha até 36px e a fita volta a ser densa.
          A marca em si continua com 34px — encolher ícone no celular é
          justamente o que não se quer fazer. */}
      <LogoLoop
        logos={LOGOS}
        speed={44}
        direction="left"
        logoHeight={34}
        gap={56}
        style={{ ["--logoloop-gap" as string]: "clamp(2.25rem, 8.75vw, 3.5rem)" }}
        pauseOnHover
        scaleOnHover
        fadeOut
        fadeOutColor="#ffffff"
        ariaLabel="Tecnologias que a Flauzino opera"
      />
    </section>
  );
}
