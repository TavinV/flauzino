"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE, Reveal } from "./primitives";
import { whatsappHref } from "@/lib/whatsapp";

/* ================================================================== */
/*  Situações — o último degrau antes da conversa. Cada linha começa   */
/*  com a frase que o próprio cliente diz ao ligar, não com o nome     */
/*  comercial do serviço. Eram sete casos e viraram cinco: a lista     */
/*  longa competia com a decisão em vez de ajudá-la. Formato de índice */
/*  editorial, pergunta à esquerda e resposta à direita, com uma       */
/*  guia que acende no hover. Sem ícone e sem card, para não repetir   */
/*  a linguagem das seções anteriores.                                 */
/* ================================================================== */

const SITUATIONS = [
  {
    q: "Tenho uma ideia e preciso tirar do papel",
    a: "Plataformas sob medida, do primeiro desenho até o sistema rodando com cliente dentro.",
  },
  {
    q: "Meu sistema não acompanha mais a empresa",
    a: "Modernizamos o que já existe, destravamos os gargalos e preparamos a base para o próximo salto.",
  },
  {
    q: "Meu SaaS foi feito com IA e já dá sinais de cansaço",
    a: "Revisão de arquitetura, segurança, testes e performance para o produto voltar a crescer.",
  },
  {
    q: "Minha operação tem processo manual demais",
    a: "Tarefa repetitiva vira fluxo automático e a equipe volta a cuidar do que precisa de gente.",
  },
  {
    q: "Preciso de reconhecimento facial",
    a: "Autenticação, controle de acesso, registro de presença e prevenção de fraude.",
  },
];

export default function ServicesQuestions() {
  return (
    <section
      id="servicos"
      data-nav-theme="light"
      className="relative scroll-mt-24 border-t border-slate-200/70 bg-canvas py-24 sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-9xl px-5 lg:px-8">
        <Reveal>
          <h2 className="max-w-2xl text-balance text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-[1.08] tracking-tightest text-brand-950">
            Qual desses é o seu caso?
          </h2>
        </Reveal>

        <div className="mt-12 border-t border-slate-200 sm:mt-14">
          {SITUATIONS.map((item, i) => (
            <motion.div
              key={item.q}
              className="group relative border-b border-slate-200"
              initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.75, ease: EASE, delay: i * 0.07 }}
            >
              <span
                aria-hidden
                className="absolute bottom-0 left-0 top-0 w-[2px] origin-center scale-y-0 bg-brand-500 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100"
              />
              <div className="grid gap-2.5 py-6 transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:pl-6 sm:gap-3 sm:py-7 lg:grid-cols-[minmax(0,46%)_minmax(0,1fr)] lg:gap-10 lg:py-8">
                <h3 className="text-balance text-[clamp(1.2rem,1.9vw,1.4rem)] font-semibold leading-snug tracking-tight text-brand-950">
                  {item.q}
                </h3>
                <p className="max-w-xl text-[15px] leading-relaxed text-slate-600">
                  {item.a}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 sm:mt-14">
            <a
              href={whatsappHref(
                "Olá! Vi a seção \"Qual é o seu caso\" no site da Flauzino. Meu caso não estava na lista, quero contar a minha situação.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-brand-600 px-7 py-3.5 text-[15px] font-semibold text-white shadow-pop transition-all duration-200 hover:bg-brand-700 hover:shadow-lift focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30 max-sm:h-14 max-sm:w-full max-sm:justify-center max-sm:py-0"
            >
              Falar com especialista
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
            <p className="text-sm text-slate-500 max-sm:text-[15px]">
              Se o seu caso não estiver aí, conte para a gente mesmo assim.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
