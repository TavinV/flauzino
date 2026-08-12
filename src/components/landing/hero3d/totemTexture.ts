import * as THREE from "three";

/* ================================================================== */
/*  Réplica da tela do totem (/totem) desenhada em canvas e redesenhada */
/*  a cada segundo — relógio em tempo real, 100% WebGL (sem iframe por  */
/*  cima do canvas). flipY=false: UVs vêm de glTF (V origem no topo).   */
/* ================================================================== */

/* desenhado em coordenadas 800×1160 e renderizado com 1.25× de
   supersampling para a tela ficar nítida em telas grandes/dpr 2 */
const W = 800;
const H = 1160;
const SS = 1.25;

const SANS = "Poppins, ui-sans-serif, system-ui, sans-serif";
const MONO = "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

const WEEKDAYS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];
const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function draw(ctx: CanvasRenderingContext2D, logo: HTMLImageElement | null) {
  const now = new Date();
  const cx = W / 2;

  ctx.setTransform(SS, 0, 0, SS, 0, 0);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  /* marca */
  ctx.textAlign = "left";
  ctx.fillStyle = "#0f172a";
  ctx.font = `600 30px ${SANS}`;
  const brand = "Visage";
  const brandW = ctx.measureText(brand).width;
  const logoSize = 36;
  const startX = cx - (logoSize + 12 + brandW) / 2;
  if (logo) ctx.drawImage(logo, startX, 108, logoSize, logoSize);
  ctx.fillText(brand, startX + logoSize + 12, 135);

  /* relógio gigante — hh:mm escuro, segundos claros */
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  ctx.font = `600 128px ${MONO}`;
  const main = `${hh}:${mm}`;
  const mainW = ctx.measureText(main).width;
  const secW = ctx.measureText(`:${ss}`).width;
  const clockX = cx - (mainW + secW) / 2;
  ctx.fillStyle = "#0f172a";
  ctx.fillText(main, clockX, 560);
  ctx.fillStyle = "#cbd5e1";
  ctx.fillText(`:${ss}`, clockX + mainW, 560);

  ctx.textAlign = "center";
  ctx.fillStyle = "#94a3b8";
  ctx.font = `400 27px ${SANS}`;
  ctx.fillText(
    `${WEEKDAYS[now.getDay()]}, ${now.getDate()} De ${MONTHS[now.getMonth()]}`,
    cx,
    622,
  );
  ctx.fillStyle = "#64748b";
  ctx.font = `400 32px ${SANS}`;
  ctx.fillText("Totem de chamada", cx, 690);

  /* botão principal */
  const btnW = 600;
  const btnH = 94;
  const btnY = 936;
  roundRect(ctx, cx - btnW / 2, btnY, btnW, btnH, 18);
  ctx.fillStyle = "#0b1220";
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = `600 30px ${SANS}`;
  const label = "Registrar presença";
  const labelW = ctx.measureText(label).width;
  const iconR = 13;
  const groupW = iconR * 2 + 14 + labelW;
  const iconX = cx - groupW / 2 + iconR;
  const midY = btnY + btnH / 2;
  /* ícone: retícula de rosto simplificada */
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(iconX, midY, iconR * 0.55, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  const b = iconR;
  const l = 6;
  const corners: Array<[number, number, number, number]> = [
    [iconX - b, midY - b, 1, 1],
    [iconX + b, midY - b, -1, 1],
    [iconX - b, midY + b, 1, -1],
    [iconX + b, midY + b, -1, -1],
  ];
  corners.forEach(([x, y, sx, sy]) => {
    ctx.beginPath();
    ctx.moveTo(x + sx * l, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + sy * l);
    ctx.stroke();
  });
  ctx.textAlign = "left";
  ctx.fillText(label, iconX + iconR + 14, midY + 11);

  /* links secundários */
  ctx.textAlign = "center";
  ctx.fillStyle = "#94a3b8";
  ctx.font = `500 25px ${SANS}`;
  ctx.fillText("Configurar este totem", cx, 1078);
  ctx.fillStyle = "#b6bdc9";
  ctx.font = `400 20px ${SANS}`;
  ctx.fillText("Desenvolvido pela Flauzino · Feito para confiar.", cx, 1128);
  ctx.textAlign = "left";
}

/**
 * Cria a textura viva do totem. Chame `dispose` ao desmontar para parar
 * o ticker de 1s.
 */
export function createTotemTexture(): { texture: THREE.CanvasTexture; dispose: () => void } {
  const canvas = document.createElement("canvas");
  canvas.width = W * SS;
  canvas.height = H * SS;
  const ctx = canvas.getContext("2d")!;

  const texture = new THREE.CanvasTexture(canvas);
  texture.flipY = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  let logo: HTMLImageElement | null = null;
  const img = new Image();
  img.onload = () => {
    logo = img;
    draw(ctx, logo);
    texture.needsUpdate = true;
  };
  img.src = "/landing/flauzino-mark.svg";

  draw(ctx, logo);
  const tick = window.setInterval(() => {
    draw(ctx, logo);
    texture.needsUpdate = true;
  }, 1000);

  return {
    texture,
    dispose: () => {
      window.clearInterval(tick);
      texture.dispose();
    },
  };
}
