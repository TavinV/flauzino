import type { Metadata } from "next";
import localFont from "next/font/local";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

/* Fontes self-hosted (src/fonts/*.woff2, subset latin) — sem dependência
   do Google Fonts em build ou runtime. Antes, qualquer falha de rede no
   next/font/google derrubava as variáveis --font-* e o site inteiro caía
   no serifado padrão do navegador. */

const poppins = localFont({
  src: [
    { path: "../fonts/poppins-300.woff2", weight: "300", style: "normal" },
    { path: "../fonts/poppins-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/poppins-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/poppins-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/poppins-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-poppins",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "Arial", "sans-serif"],
});

// JetBrains Mono variável — um único arquivo cobre os pesos 400–600.
const mono = localFont({
  src: [{ path: "../fonts/jetbrains-mono-var.woff2", weight: "400 600", style: "normal" }],
  variable: "--font-mono",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Consolas", "monospace"],
});

// IBM Plex Mono — fonte de dados do design system Flauzino (font-mono-ds),
// usada nos mockups de produto. O --font-mono da landing não muda.
const monoDs = localFont({
  src: [
    { path: "../fonts/ibm-plex-mono-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/ibm-plex-mono-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/ibm-plex-mono-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-mono-ds",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Consolas", "monospace"],
});

// Bodoni Moda variável (400–600) — usada exclusivamente pelo wordmark da
// Dália Semijoias na seção e na página de cases.
const bodoni = localFont({
  src: [{ path: "../fonts/bodoni-moda-var.woff2", weight: "400 600", style: "normal" }],
  variable: "--font-bodoni",
  display: "swap",
  fallback: ["Didot", "Bodoni MT", "serif"],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Flauzino | Software sob medida, IA e reconhecimento facial",
  description:
    "Software house brasileira especializada em sistemas sob medida, inteligência artificial, reconhecimento facial, automação e plataformas SaaS.",
  keywords: [
    "software house",
    "software sob medida",
    "desenvolvimento de sistemas",
    "inteligência artificial",
    "reconhecimento facial",
    "automação de processos",
    "plataformas SaaS",
    "modernização de sistemas",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Flauzino | Software sob medida, IA e reconhecimento facial",
    description:
      "Software house brasileira especializada em sistemas sob medida, inteligência artificial, reconhecimento facial, automação e plataformas SaaS.",
    url: "/",
    siteName: "Flauzino",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flauzino | Software sob medida, IA e reconhecimento facial",
    description:
      "Software house brasileira especializada em sistemas sob medida, inteligência artificial, reconhecimento facial, automação e plataformas SaaS.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${poppins.variable} ${mono.variable} ${monoDs.variable} ${bodoni.variable}`}
    >
      <body className="bg-white font-sans antialiased dark:bg-flauzino-navy-950">
        {children}
      </body>
    </html>
  );
}
