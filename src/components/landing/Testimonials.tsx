"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Quote } from "lucide-react";
import { EASE, Eyebrow, Reveal } from "./primitives";
import { whatsappHref } from "@/lib/whatsapp";

/* ================================================================== */
/*  Depoimentos — a prova em primeira pessoa, logo depois dos cases.   */
/*  Cada card fala de um cliente que já apareceu na grade acima, então */
/*  a seção funciona como legenda do que foi mostrado: o case entrega  */
/*  o número, o depoimento entrega o tom de quem viveu o projeto.      */
/*  O quarto lugar da grade é o convite — enquanto o quarto            */
/*  depoimento não chega, ele evita o buraco visual de 2x2 incompleto. */
/* ================================================================== */

/*  ATENÇÃO: os textos abaixo são genéricos, escritos como espaço      */
/*  reservado. Substituir pelas frases reais antes de publicar —       */
/*  depoimento atribuído a pessoa real precisa ser dela.               */
type Testimonial = {
  name: string;
  role: string;
  company: string;
  quote: string;
  photo?: string;
  instagramHandle: string;
  instagramUrl: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Ederson Almeida",
    role: "Founder",
    company: "Máquina Code",
    quote:
      "Estamos extremamente satisfeitos com a agilidade e a excelência técnica nestes primeiros meses de trabalho conjunto, e projetamos uma longa e duradoura parceria entre a Flauzino e a MaquinaCode.",
    photo: "/social_proof/Ederson.png",
    instagramHandle: "maquinacode",
    instagramUrl: "https://www.instagram.com/maquinacode/",
  },
  {
    name: "Filipe Gomes Risson",
    role: "Co-founder",
    company: "Canário Capital",
    quote:
      "Contratamos a Flauzino para desenvolvimento de software dentro do ecossistema Canário e o resultado superou a expectativa. O que mais chamou atenção foi a postura: em vez de simplesmente executar o que foi pedido, a equipe questionou premissas, apontou riscos técnicos que eu não teria enxergado e propôs caminhos mais simples onde eu estava complicando. Prazos cumpridos, comunicação transparente e zero necessidade de cobrança. É o tipo de parceiro técnico que a gente quer manter por perto.",
    photo: "/social_proof/Filipe.jpeg",
    instagramHandle: "filiperisson",
    instagramUrl: "https://www.instagram.com/filiperisson/",
  },
  {
    name: "Nícolas Guilherme",
    role: "Co-founder",
    company: "Dália",
    quote:
      "Contratamos a Flauzino para desenvolver o catálogo digital da nossa loja de semijoias e ficamos muito satisfeitos com o resultado. Desde o início, eles entenderam bem o que precisávamos e foram muito atenciosos com os detalhes. Também tivemos bastante liberdade para sugerir alterações durante o processo, e sempre fomos bem atendidos. O resultado ficou exatamente como esperávamos. Com certeza recomendamos o trabalho da Flauzino.",
    instagramHandle: "ncrferreira",
    photo: "/social_proof/nicolas.jpg",
    instagramUrl: "https://www.instagram.com/ncrferreira/",
  },
];

/* iniciais como monograma: sem foto, o card não fica com o buraco de
   um avatar vazio nem com uma imagem genérica de banco */
function Monogram({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <span
      aria-hidden
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-600 to-brand-800 text-[13px] font-semibold tracking-tight text-white"
    >
      {initials}
    </span>
  );
}

function Avatar({ name, photo }: { name: string; photo?: string }) {
  if (!photo) return <Monogram name={name} />;

  return (
    <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
      <Image src={photo} alt={name} fill sizes="44px" className="object-cover" />
    </span>
  );
}

function TestimonialCard({ item, index }: { item: Testimonial; index: number }) {
  return (
    <motion.figure
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift sm:p-9"
      initial={{ opacity: 0, y: 34, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.85, ease: EASE, delay: index * 0.09 }}
    >
      <Quote
        aria-hidden
        className="absolute -right-3 -top-3 h-24 w-24 rotate-180 fill-brand-50 text-brand-50 transition-colors duration-300 group-hover:fill-brand-100 group-hover:text-brand-100"
        strokeWidth={1}
      />

      {/* 16px no celular: o depoimento é o bloco de leitura mais longo do
          ato claro e 15px numa coluna de 296px cansa antes do fim */}
      <blockquote className="relative text-[16px] leading-relaxed text-slate-700 sm:text-[17px]">
        {item.quote}
      </blockquote>

      <figcaption className="relative mt-6 flex items-center gap-3.5 border-t border-slate-200/80 pt-5 sm:mt-8 sm:pt-6">
        <a
          href={item.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-w-0 items-center gap-3.5"
        >
          <Avatar name={item.name} photo={item.photo} />
          <span className="min-w-0">
            <span className="block truncate text-[15px] font-semibold tracking-tight text-brand-950">
              {item.name}
            </span>
            <span className="block truncate text-sm text-slate-500">
              {item.role} • {item.company}
            </span>
            <span className="block truncate text-sm font-medium text-brand-600 hover:underline">
              @{item.instagramHandle}
            </span>
          </span>
        </a>
      </figcaption>
    </motion.figure>
  );
}

export default function Testimonials() {
  return (
    <section
      id="depoimentos"
      data-nav-theme="light"
      className="relative scroll-mt-24 border-t border-slate-200/70 bg-white py-24 sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-9xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>Prova Social</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-5 text-balance text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-[1.08] tracking-tightest text-brand-950">
              Quem trabalhou com a gente conta.
            </h2>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 sm:mt-16 sm:gap-5 lg:grid-cols-2">
          {TESTIMONIALS.map((item, i) => (
            <TestimonialCard key={item.name} item={item} index={i} />
          ))}

          {/* quarto lugar da grade: troque este bloco por mais um
              TestimonialCard quando o próximo depoimento chegar */}
          <motion.div
            className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-flauzino-navy-900 p-6 sm:p-9"
            initial={{ opacity: 0, y: 34, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.85, ease: EASE, delay: TESTIMONIALS.length * 0.09 }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(58% 76% at 92% 6%, rgba(124,197,255,0.20), transparent 72%)",
              }}
            />
            <p className="relative text-balance text-[clamp(1.35rem,2.4vw,1.75rem)] font-semibold leading-[1.16] tracking-tight text-white">
              O próximo depoimento aqui pode ser o da sua empresa.
            </p>
            <div className="relative mt-8">
              <a
                href={whatsappHref(
                  "Olá! Vi os depoimentos de clientes no site da Flauzino e quero ser o próximo case de sucesso. Podemos conversar sobre o meu projeto?",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-[15px] font-semibold text-[#0b1220] transition-all duration-200 hover:bg-brand-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30 max-sm:h-14 max-sm:w-full max-sm:justify-center max-sm:py-0"
              >
                Falar com especialista
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
