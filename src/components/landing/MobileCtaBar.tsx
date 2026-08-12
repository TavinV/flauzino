"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE } from "./primitives";
import { whatsappHref } from "@/lib/whatsapp";

/* ================================================================== */
/*  Barra de ação fixa — só existe abaixo de 640px.                    */
/*                                                                     */
/*  No desktop o CTA vive na pílula do header e está sempre à vista.   */
/*  No celular ele sumia: a pílula só tem a marca e o hambúrguer, e    */
/*  falar com a gente exigia abrir o menu ou rolar 14 mil pixels até   */
/*  o rodapé. Aqui ele volta como barra flutuante ao alcance do        */
/*  polegar, que entra depois que a hero sai de cena e se recolhe      */
/*  quando o rodapé chega — lá o convite já é o próprio conteúdo, e    */
/*  dois CTAs na mesma tela viram ruído.                               */
/*                                                                     */
/*  sm:hidden é display:none, então de 640px para cima ela não pinta   */
/*  nada nem ocupa espaço; o observer é um só e não escuta scroll.     */
/* ================================================================== */

export default function MobileCtaBar({
  label = "Falar com especialista",
  href = whatsappHref(
    "Olá! Estou no site da Flauzino e quero falar com um especialista sobre uma solução de tecnologia para minha empresa.",
  ),
  /** esconde a barra enquanto o drawer estiver aberto */
  suppressed = false,
}: {
  label?: string;
  href?: string;
  suppressed?: boolean;
}) {
  const { scrollY } = useScroll();
  const [past, setPast] = useState(false);
  const [atFooter, setAtFooter] = useState(false);

  /* entra depois de 60% da primeira tela: antes disso o CTA da hero
     ainda está visível e a barra seria uma segunda cópia do mesmo botão */
  useMotionValueEvent(scrollY, "change", (y) => setPast(y > window.innerHeight * 0.6));

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver(
      ([entry]) => setAtFooter(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  const show = past && !atFooter && !suppressed;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          /* pointer-events-auto porque o header que a hospeda é
             pointer-events-none — sem isso o botão não recebe toque */
          className="bottom-safe-3 pointer-events-auto fixed inset-x-3 z-40 sm:hidden"
          initial={{ y: 88, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 88, opacity: 0 }}
          transition={{ duration: 0.36, ease: EASE }}
        >
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 text-[15px] font-semibold text-white shadow-[0_16px_40px_-12px_rgba(37,99,235,0.6)] transition-colors duration-200 active:bg-brand-700"
          >
            {label}
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
