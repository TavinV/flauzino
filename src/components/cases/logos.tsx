import { EagleMark } from "@/components/ui/Logo";

/* ================================================================== */
/*  Wordmarks dos clientes dos cases. Canário Capital e Máquina Code   */
/*  usam os arquivos de logo reais (ver /public/cases/*); Dália         */
/*  Semijoias (Bodoni Moda) e Visage (águia da casa + Poppins, mesmo    */
/*  tratamento do lockup Flauzino) seguem como wordmarks tipográficos.  */
/* ================================================================== */

export const CANARIO_LIME = "#C9F13F";
export const MAQUINA_BLUE = "#1362F0";
export const DALIA_INK = "#241F19";
/* Azul de assinatura da própria Flauzino (brand-600) — usado em cases onde
   o destaque deve reforçar a marca da casa, não a identidade do cliente. */
export const FLAUZINO_BLUE = "#2563EB";

export function DaliaLogo({
  className = "",
  color = DALIA_INK,
  tracking = "tracking-[0.16em]",
}: {
  className?: string;
  color?: string;
  /** tracking-* utility — wordmarks grandes (editorial) pedem menos tracking que o lockup pequeno */
  tracking?: string;
}) {
  return (
    <span
      className={`font-bodoni font-medium uppercase leading-none ${tracking} ${className}`}
      style={{ color }}
    >
      Dália
    </span>
  );
}

export function VisageLogo({
  className = "",
  mark = 28,
}: {
  className?: string;
  mark?: number;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-sans font-semibold leading-none tracking-tight ${className}`}
    >
      <EagleMark size={mark} />
      <span>Visage</span>
    </span>
  );
}
