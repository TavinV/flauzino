"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EagleMark } from "@/components/ui/Logo";
import { heroReady } from "./heroReady";

/* ================================================================== */
/*  Loader de página inteira da landing: overlay navy sobre o site     */
/*  todo (nav, hero, seções) com spinner simples. Só sai de cena —     */
/*  e só libera o scroll — quando página, fontes e palco 3D estão      */
/*  prontos. Renderiza já visível no HTML do servidor, então cobre a   */
/*  tela antes mesmo da hidratação.                                    */
/* ================================================================== */

/* Teto de espera: nunca segura o site para sempre (rede lenta, WebGL
   indisponível). Um pouco acima do fallback de 9s da Hero. */
const MAX_WAIT_MS = 11000;

/* Permanência mínima para o overlay não piscar em cargas instantâneas. */
const MIN_STAY_MS = 450;

export default function PageLoader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    let alive = true;

    const pageLoaded =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) =>
            window.addEventListener("load", () => resolve(), { once: true }),
          );
    const fontsLoaded: Promise<unknown> = document.fonts?.ready ?? Promise.resolve();
    const minStay = new Promise<void>((resolve) => setTimeout(resolve, MIN_STAY_MS));
    const cap = new Promise<void>((resolve) => setTimeout(resolve, MAX_WAIT_MS));

    const everything = Promise.all([pageLoaded, fontsLoaded, heroReady(), minStay]);
    Promise.race([everything, cap]).then(() => {
      if (alive) setDone(true);
    });

    return () => {
      alive = false;
    };
  }, []);

  /* Enquanto o overlay está de pé, ninguém rola nem interage. */
  useEffect(() => {
    if (done) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="page-loader"
          role="status"
          aria-label="Carregando o site"
          aria-busy
          className="fixed inset-0 z-[90] flex items-center justify-center bg-[#070c19]"
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeOut" } }}
        >
          <div className="relative grid h-28 w-28 place-items-center text-white">
            <span
              aria-hidden
              className="absolute inset-0 animate-spin rounded-full border-2 border-white/10 border-t-brand-300"
            />
            <EagleMark size={46} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
