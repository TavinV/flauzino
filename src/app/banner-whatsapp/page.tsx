"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AVATAR, BANNER_H, BANNER_W, drawBanner } from "./bannerArt";

/* ================================================================== */
/*  Página de produção do banner do WhatsApp Business.                 */
/*                                                                     */
/*  Não faz parte da landing: é uma bancada interna para gerar o       */
/*  arquivo. Mostra o banner no tamanho real, deixa ligar a máscara    */
/*  da foto de perfil para conferir a zona livre do rodapé e baixa o   */
/*  PNG em 590x340 exatos (e em 2x, para quando o WhatsApp reamostrar  */
/*  a imagem em telas de alta densidade).                              */
/* ================================================================== */

export default function BannerWhatsAppPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mask, setMask] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    /* sem esperar as fontes, o primeiro paint sai no fallback do sistema
       e o wordmark nasce com a métrica errada */
    document.fonts.ready.then(() => {
      if (!alive || !canvasRef.current) return;
      drawBanner(canvasRef.current, 2);
      setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const download = useCallback((scale: number) => {
    const off = document.createElement("canvas");
    drawBanner(off, scale);
    const a = document.createElement("a");
    a.download = `flauzino-whatsapp-banner-${BANNER_W * scale}x${BANNER_H * scale}.png`;
    a.href = off.toDataURL("image/png");
    a.click();
  }, []);

  return (
    <main className="min-h-dvh bg-[#04070f] px-6 py-14 text-white">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-brand-300">
            Bancada interna
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Banner do WhatsApp Business — 590 × 340
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-white/60">
            Mesma atmosfera da hero do site: navy, céu estrelado e brilhos em azul e violeta. O
            rodapé central fica livre porque a foto de perfil o cobre.
          </p>
        </header>

        {/* moldura do tamanho real; a máscara é um overlay em DOM para
            não sujar o PNG exportado */}
        <div
          className="relative overflow-hidden rounded-lg ring-1 ring-white/10"
          style={{ width: BANNER_W, height: BANNER_H }}
        >
          <canvas
            ref={canvasRef}
            style={{ width: BANNER_W, height: BANNER_H, display: "block" }}
          />
          {mask && (
            <>
              <div
                className="pointer-events-none absolute rounded-full border-2 border-dashed border-emerald-400/80 bg-emerald-400/10"
                style={{
                  left: AVATAR.cx - AVATAR.r,
                  top: AVATAR.cy - AVATAR.r,
                  width: AVATAR.r * 2,
                  height: AVATAR.r * 2,
                }}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-2 text-center text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-300">
                área coberta pela foto
              </div>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={!ready}
            onClick={() => download(1)}
            className="rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:opacity-40"
          >
            Baixar PNG 590 × 340
          </button>
          <button
            type="button"
            disabled={!ready}
            onClick={() => download(2)}
            className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/85 transition hover:border-white/30 disabled:opacity-40"
          >
            Baixar 2× (1180 × 680)
          </button>
          <label className="ml-auto flex cursor-pointer items-center gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              checked={mask}
              onChange={(e) => setMask(e.target.checked)}
              className="h-4 w-4 accent-emerald-400"
            />
            Mostrar máscara da foto de perfil
          </label>
        </div>
      </div>
    </main>
  );
}
