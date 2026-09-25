import type { Metadata } from "next";
import type { ReactNode } from "react";

/* Bancada interna, não conteúdo do site. O robots.ts libera "/" inteiro,
   então o noindex precisa vir daqui — o sitemap.ts é uma lista fechada e
   já deixa esta rota de fora. */
export const metadata: Metadata = {
  title: "Banner WhatsApp Business | Flauzino",
  robots: { index: false, follow: false },
};

export default function BannerLayout({ children }: { children: ReactNode }) {
  return children;
}
