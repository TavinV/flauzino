/* ================================================================== */
/*  Arte do banner do WhatsApp Business — 590 x 340 px                 */
/*                                                                     */
/*  Desenhada em canvas (e não em DOM) por um motivo só: o WhatsApp    */
/*  pede um arquivo, não uma página. Canvas devolve um PNG do tamanho  */
/*  exato pedido, sem depender de print screen nem do zoom da tela.    */
/*                                                                     */
/*  A atmosfera repete a da hero do site: painel navy quase preto,     */
/*  céu estrelado com a MESMA semente (7) do StarField, brilhos        */
/*  radiais em céu/violeta/azul aplicados em blend "screen" e anéis    */
/*  orbitais em branco quase transparente.                             */
/*                                                                     */
/*  O rodapé central fica propositalmente vazio: é onde a foto de      */
/*  perfil entra e cobre o banner. Todo o conteúdo vive na faixa de    */
/*  cima; embaixo ficam só os anéis, que passam a emoldurar a foto     */
/*  depois que ela é aplicada.                                         */
/* ================================================================== */

export const BANNER_W = 590;
export const BANNER_H = 340;

/* Círculo aproximado da foto de perfil sobreposta pelo WhatsApp.
   Serve para a máscara de conferência e delimita a zona livre. */
export const AVATAR = { cx: 295, cy: 330, r: 96 };

/* ------------------------------------------------------------------ */
/*  Estrelas — mesma semente e mesma distribuição do StarField da hero */
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
}));

/* As seis maiores ganham glare em cruz: é o brilho que a hero entrega
   pelo twinkle e que um PNG parado precisa ter desenhado, já que aqui
   não existe animação para chamar o olho. */
const SPARKLES = STARS.map((s, i) => ({ ...s, i }))
  .sort((a, b) => b.size - a.size)
  .slice(0, 6);

/* ------------------------------------------------------------------ */
/*  Águia da Flauzino — mesmo path de public/landing/flauzino-mark.svg */
/* ------------------------------------------------------------------ */

const EAGLE_D =
  "M47.0908 24.4504C47.242 24.5725 48.7058 28.9997 48.967 29.6907C50.4259 33.6485 52.2532 37.4606 54.4248 41.0768C67.6308 62.6023 97.502 77.4688 119.968 87.3778C145.627 98.6953 173.83 107.974 192.667 130.144C202.468 141.68 207.901 155.987 208.277 171.123C208.349 174.806 207.867 178.684 207.504 182.391C216.423 167.502 214.971 144.302 204.521 130.498C211.104 126.384 217.31 121.249 223.855 117.506C215.317 115.585 213.082 112.303 208.451 105.748C216.598 108.526 229.396 108.505 237.789 106.571C250.454 103.653 272.038 95.3596 280.644 109.918C291.775 110.458 303.259 110.558 307.41 122.733C308.512 125.966 308.691 128.496 309.283 131.797C306.526 130.348 302.157 129.064 298.996 129.318C264.004 131.925 245.779 167.482 227.066 192.588C201.945 226.292 174.074 237.792 133.178 238.926C118.799 239.083 106.613 236.501 92.9199 232.802C98.2245 231.81 102.624 231.35 107.946 229.795C121.038 225.971 134.164 218.154 142.578 207.252C143.995 205.415 145.45 203.728 146.589 201.688C150.646 210.31 150.048 218.141 146.062 226.79C153.048 222.543 156.681 212.907 156.027 204.978C154.243 183.517 131.954 176.262 114.899 170.072C95.374 162.986 75.3648 158.592 59.4409 144.407C47.702 133.949 40.3492 119.697 37.373 104.33C36.2028 98.2883 35.7842 91.7581 35.397 85.651C36.0516 87.3809 37.1141 89.2884 38.1206 90.8866C59.1748 124.318 100.724 129.271 134.226 143.071C141.74 146.167 150.267 152.267 156.517 156.774C148.857 143.55 136.606 136.845 123.365 130.028C97.8222 116.877 65.4093 107.667 50.1091 81.2409C39.2904 62.5552 41.8354 43.7497 47.0908 24.4504Z";
const EAGLE_VB = { w: 361, h: 257 };

/* ------------------------------------------------------------------ */
/*  Ícones (traçados do lucide-react, viewBox 24) usados nos contatos  */
/* ------------------------------------------------------------------ */

const ICONS = {
  globe: [
    "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20",
    "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",
    "M2 12h20",
  ],
  face: [
    "M3 7V5a2 2 0 0 1 2-2h2",
    "M17 3h2a2 2 0 0 1 2 2v2",
    "M21 17v2a2 2 0 0 1-2 2h-2",
    "M7 21H5a2 2 0 0 1-2-2v-2",
    "M8 14s1.5 2 4 2 4-2 4-2",
    "M9 9h.01",
    "M15 9h.01",
  ],
  phone: [
    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
  ],
} as const;

type IconName = keyof typeof ICONS;

function drawIcon(
  ctx: CanvasRenderingContext2D,
  name: IconName,
  x: number,
  y: number,
  size: number,
  color: string,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 24, size / 24);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const d of ICONS[name]) ctx.stroke(new Path2D(d));
  ctx.restore();
}

/* ------------------------------------------------------------------ */

const CONTACTS: { icon: IconName; text: string }[] = [
  { icon: "globe", text: "flauzinosistemas.com.br" },
  { icon: "face", text: "visage.app.br" },
  { icon: "phone", text: "+55 (11) 95023-1230" },
];

/**
 * Pinta o banner inteiro. `scale` multiplica o backing store: 1 para o
 * PNG final (590x340 cravado) e 2 para a pré-visualização em tela, que
 * de outro modo sairia serrilhada em telas de alta densidade.
 */
export function drawBanner(canvas: HTMLCanvasElement, scale = 1) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = BANNER_W * scale;
  canvas.height = BANNER_H * scale;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.clearRect(0, 0, BANNER_W, BANNER_H);

  /* família real da Poppins: next/font gera um nome com hash e o canvas
     não resolve var(--font-poppins) sozinho */
  const poppins =
    getComputedStyle(document.documentElement).getPropertyValue("--font-poppins").trim() ||
    "system-ui";
  const font = (weight: number, size: number) => `${weight} ${size}px ${poppins}, sans-serif`;

  /* ---------------- fundo navy do painel da hero ---------------- */
  ctx.fillStyle = "#070C19";
  ctx.fillRect(0, 0, BANNER_W, BANNER_H);

  /* ---------------- brilhos radiais (blend screen) ---------------- */
  const glow = (x: number, y: number, r: number, color: string) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, BANNER_W, BANNER_H);
  };
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  glow(452, 214, 236, "rgba(124,197,255,0.20)");
  glow(78, 300, 210, "rgba(167,139,250,0.15)");
  glow(AVATAR.cx, 352, 214, "rgba(96,165,250,0.32)");
  glow(96, 42, 168, "rgba(234,242,255,0.07)");
  ctx.restore();

  /* ---------------- céu estrelado ---------------- */
  for (const s of STARS) {
    ctx.beginPath();
    ctx.arc((s.x / 100) * BANNER_W, (s.y / 100) * BANNER_H, s.size / 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${s.opacity})`;
    ctx.fill();
  }

  /* glare em cruz nas maiores — o efeito estrelado, parado */
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  for (const s of SPARKLES) {
    const x = (s.x / 100) * BANNER_W;
    const y = (s.y / 100) * BANNER_H;
    const len = 5 + s.size * 2.4;

    const halo = ctx.createRadialGradient(x, y, 0, x, y, len * 1.4);
    halo.addColorStop(0, "rgba(214,233,255,0.5)");
    halo.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = halo;
    ctx.fillRect(x - len * 1.6, y - len * 1.6, len * 3.2, len * 3.2);

    const armH = ctx.createLinearGradient(x - len, y, x + len, y);
    armH.addColorStop(0, "rgba(255,255,255,0)");
    armH.addColorStop(0.5, "rgba(255,255,255,0.75)");
    armH.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = armH;
    ctx.fillRect(x - len, y - 0.35, len * 2, 0.7);

    const armV = ctx.createLinearGradient(x, y - len, x, y + len);
    armV.addColorStop(0, "rgba(255,255,255,0)");
    armV.addColorStop(0.5, "rgba(255,255,255,0.75)");
    armV.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = armV;
    ctx.fillRect(x - 0.35, y - len, 0.7, len * 2);
  }
  ctx.restore();

  /* ---------------- anéis orbitais ---------------- */
  const ring = (cx: number, cy: number, r: number, alpha: number) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  };
  ring(636, -104, 316, 0.07);
  ring(-72, 428, 292, 0.055);
  /* estes dois nascem centrados na foto de perfil: sozinhos são
     decoração, com a foto aplicada viram moldura dela */
  ring(AVATAR.cx, AVATAR.cy, AVATAR.r + 16, 0.18);
  ring(AVATAR.cx, AVATAR.cy, AVATAR.r + 46, 0.1);
  ring(AVATAR.cx, AVATAR.cy, AVATAR.r + 92, 0.055);

  /* ---------------- marca ---------------- */
  const eagleW = 72;
  const eagleH = (eagleW * EAGLE_VB.h) / EAGLE_VB.w;
  const eagleX = 38;
  const eagleY = 36;

  ctx.save();
  ctx.translate(eagleX, eagleY);
  ctx.scale(eagleW / EAGLE_VB.w, eagleH / EAGLE_VB.h);
  const eagleGrad = ctx.createLinearGradient(0, 0, 0, EAGLE_VB.h);
  eagleGrad.addColorStop(0, "#EAF2FF");
  eagleGrad.addColorStop(1, "#7CC5FF");
  ctx.fillStyle = eagleGrad;
  ctx.fill(new Path2D(EAGLE_D));
  ctx.restore();

  ctx.textBaseline = "alphabetic";
  ctx.font = font(600, 37);
  ctx.letterSpacing = "-0.02em";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("Flauzino", eagleX + eagleW + 16, eagleY + eagleH * 0.73);
  ctx.letterSpacing = "0px";

  /* filete + assinatura */
  const ruleY = eagleY + eagleH + 17;
  const ruleGrad = ctx.createLinearGradient(eagleX, 0, eagleX + 268, 0);
  ruleGrad.addColorStop(0, "rgba(124,197,255,0.65)");
  ruleGrad.addColorStop(1, "rgba(124,197,255,0)");
  ctx.fillStyle = ruleGrad;
  ctx.fillRect(eagleX, ruleY, 268, 1);

  ctx.font = font(500, 10);
  ctx.letterSpacing = "0.17em";
  ctx.fillStyle = "rgba(219,234,254,0.72)";
  ctx.fillText("SOFTWARE SOB MEDIDA · IA · RECONHECIMENTO FACIAL", eagleX, ruleY + 19);
  ctx.letterSpacing = "0px";

  /* ---------------- contatos, alinhados à direita ---------------- */
  const right = BANNER_W - 38;
  const iconSize = 14;
  ctx.font = font(500, 13.5);
  CONTACTS.forEach((c, i) => {
    const y = 50 + i * 25;
    const w = ctx.measureText(c.text).width;
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.fillText(c.text, right - w, y);
    drawIcon(ctx, c.icon, right - w - 9 - iconSize, y - iconSize + 3, iconSize, "#93C5FD");
  });
}
