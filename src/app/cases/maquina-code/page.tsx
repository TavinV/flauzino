import type { Metadata } from "next";
import Image from "next/image";
import {
  CaseCompare,
  CaseCta,
  CaseHero,
  CaseHighlight,
  CaseRelated,
  CaseSection,
  CaseShell,
  CaseStatement,
  CaseTracks,
} from "@/components/cases/chrome";
import { MAQUINA_BLUE } from "@/components/cases/logos";

const TITLE = "Máquina Code | Parceria técnica e desenvolvimento de software | Flauzino";
const DESCRIPTION =
  "Como a Flauzino atuou como parceira técnica da Máquina Code, elevando a previsibilidade das entregas e revertendo um contrato que caminhava para a não renovação.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/cases/maquina-code",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/cases/maquina-code",
    siteName: "Flauzino",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const BEFORE = [
  "Contrato caminhando para a não renovação",
  "Retrabalho consumindo prazo de entrega",
  "Cliente sem visibilidade do andamento",
];

const AFTER = [
  "Contrato estratégico renovado",
  "Entregas previsíveis, com escopo fechado antes",
  "Cliente acompanhando a evolução de perto",
];

const PROCESS = [
  {
    title: "Levantamento de requisitos",
    body: "Entramos antes do código, na conversa em que o escopo ainda está sendo definido.",
  },
  {
    title: "Testes automatizados",
    body: "Passaram a fazer parte da rotina da empresa, não de um projeto isolado.",
  },
  {
    title: "Integração contínua",
    body: "O caminho entre escrever e publicar virou processo, com menos passo manual.",
  },
  {
    title: "Fluxo de implantação",
    body: "Subir versão deixou de ser evento de risco e virou rotina previsível.",
  },
];

/* Esta página não tem captura de produto: o trabalho foi feito dentro de
   projetos de terceiros, que não são nossos para publicar. Em vez de
   inventar mockup, o peso vem da tipografia e do painel de destaque. */
export default function MaquinaCodeCasePage() {
  return (
    <CaseShell>
      <CaseHero
        logo={
          <span className="inline-flex rounded-lg bg-white px-3.5 py-2.5">
            <Image
              src="/cases/maquina-code/logo.webp"
              alt="Máquina Code"
              width={640}
              height={106}
              className="h-7 w-auto sm:h-8"
              priority
            />
          </span>
        }
        title="A parceria técnica que trouxe um contrato de volta."
        intro="A Máquina Code é uma software house que desenvolve soluções sob medida para empresas de vários segmentos. Passamos a atuar nos projetos estratégicos da casa, do levantamento de requisitos à entrega das funcionalidades, como time técnico de confiança."
        accent={MAQUINA_BLUE}
        meta={["Software house", "Parceiro técnico", "Desenvolvimento full stack"]}
        siteUrl="maquinacode.com.br"
      />

      {/* o resultado primeiro: é a informação mais forte do case */}
      <CaseSection>
        <CaseHighlight
          accent={MAQUINA_BLUE}
          footnote="O contrato caminhava para encerrar. A virada veio da qualidade percebida entrega após entrega."
        >
          Um contrato que estava para ser encerrado foi renovado depois que a
          qualidade das entregas mudou de patamar.
        </CaseHighlight>
      </CaseSection>

      {/* confiança */}
      <CaseSection tone="canvas">
        <CaseStatement title="Quem terceiriza software quer mais do que código funcionando.">
          <p>
            Quer alguém que assuma responsabilidade técnica, tome decisão e
            responda pelo que entregou. Foi esse o papel ao longo do projeto:
            reduzir retrabalho, aumentar a previsibilidade e deixar o cliente
            final enxergar o progresso sem precisar cobrar.
          </p>
        </CaseStatement>

        <div className="mt-10 sm:mt-14">
          <CaseCompare
            beforeLabel="No começo"
            before={BEFORE}
            afterLabel="Depois da virada"
            after={AFTER}
            accent={MAQUINA_BLUE}
          />
        </div>
      </CaseSection>

      {/* processo */}
      <CaseSection>
        <CaseStatement title="O que ficou na casa depois que o projeto acabou.">
          <p>
            Boa parte do valor não foi funcionalidade entregue, e sim prática
            instalada. Estes quatro processos passaram a fazer parte da rotina
            da empresa e seguem rodando sem a gente.
          </p>
        </CaseStatement>

        <div className="mt-10 sm:mt-14">
          <CaseTracks items={PROCESS} />
        </div>
      </CaseSection>

      <CaseRelated current="maquina-code" />

      <CaseCta
        title="Precisa de um time técnico que assuma responsabilidade?"
        desc="Atuamos como parceiros de software houses e times internos, do levantamento de requisitos à entrega em produção."
        whatsappMessage="Olá! Vi o case da Máquina Code no site da Flauzino e quero um time técnico que assuma responsabilidade pelo meu projeto."
      />
    </CaseShell>
  );
}
