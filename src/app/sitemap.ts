import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/* Só páginas públicas e indexáveis. /demonstracao fica de fora: não tem
   nenhum link de entrada no site publicado hoje (nem no Nav, nem na Hero,
   nem em nenhuma seção renderizada em page.tsx) e não possui metadata
   própria — ver relatório da auditoria de SEO. */
const ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  // sem barra final: o Next normaliza o canonical/og:url da home para
  // "https://.../" → "https://..." (trailingSlash:false é o padrão do
  // next.config.mjs), e o sitemap precisa bater com essa mesma URL.
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/cases/visage", changeFrequency: "monthly", priority: 0.8 },
  { path: "/cases/canario", changeFrequency: "monthly", priority: 0.8 },
  { path: "/cases/maquina-code", changeFrequency: "monthly", priority: 0.8 },
  { path: "/cases/dalia", changeFrequency: "monthly", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
