import type { Metadata } from "next";
import {
  CaseCta,
  CaseHero,
  CaseHighlight,
  CaseRelated,
  CaseSection,
  CaseShell,
  CaseStatement,
  CaseTracks,
} from "@/components/cases/chrome";
import { DaliaLogo } from "@/components/cases/logos";

export const metadata: Metadata = {
  title: "Dália Semijoias, vitrine e estoque na mesma operação | Flauzino",
  description:
    "Como a Flauzino desenvolveu o e-commerce da Dália Semijoias: vendas online integradas ao controle de estoque, gestão de produtos simplificada e uma experiência de compra pensada para converter.",
};

const OPERATION = [
  {
    title: "Catálogo ligado ao estoque",
    body: "O que sai do estoque some da vitrine na hora. Ninguém compra o que não existe mais.",
  },
  {
    title: "Gestão em um lugar só",
    body: "Produto, preço, foto e disponibilidade são editados no mesmo painel, sem planilha paralela.",
  },
  {
    title: "Checkout pensado para converter",
    body: "Caminho curto entre ver a peça e finalizar a compra, com menos etapa para desistir.",
  },
  {
    title: "Base pronta para crescer",
    body: "Novas categorias e campanhas entram sem precisar remexer na estrutura da loja.",
  },
];

export default function DaliaCasePage() {
  return (
    <CaseShell whatsappMessage="Olá! Estou vendo o case da Dália Semijoias no site da Flauzino e quero uma loja online parecida para o meu negócio.">
      <CaseHero
        logo={<DaliaLogo className="text-[26px]" color="#F3EDE2" />}
        title="Vitrine e estoque passaram a viver na mesma operação."
        intro="A Dália Semijoias precisava reunir venda online e controle de estoque em um ambiente só. Desenvolvemos um e-commerce que simplifica o dia a dia de quem administra a loja e entrega uma experiência de compra à altura das peças."
        accent="#F3EDE2"
        meta={["Varejo", "E-commerce", "Gestão integrada"]}
        siteUrl="daliaconcept.com.br"
        image={{
          src: "/cases/dalia/hero.png",
          alt: "Loja virtual da Dália Semijoias aberta em um notebook, tablet e smartphone",
          width: 3998,
          height: 2238,
        }}
      />

      {/* operação */}
      <CaseSection>
        <CaseStatement title="Menos processo manual, menos erro de estoque.">
          <p>
            Antes, disponibilidade e vitrine viviam em lugares diferentes, e a
            diferença entre os dois aparecia na forma de venda de peça
            esgotada. A plataforma amarrou os dois lados e tirou a conferência
            manual do caminho.
          </p>
        </CaseStatement>

        <div className="mt-10 sm:mt-14">
          <CaseTracks items={OPERATION} />
        </div>
      </CaseSection>

      <CaseSection tone="canvas">
        <CaseHighlight
          accent="#F3EDE2"
          footnote="Quem administra a loja passa o dia no painel. Quem compra nunca precisa saber que ele existe."
        >
          Uma loja de semijoias vende pelo olhar. O sistema tinha que sumir da
          frente da peça.
        </CaseHighlight>
      </CaseSection>

      {/* experiência */}
      <CaseSection>
        <CaseStatement title="Uma plataforma feita para vender.">
          <p>
            Além do lado administrativo, o projeto priorizou navegação simples
            e objetiva para o cliente final. O resultado é uma loja preparada
            para acompanhar o crescimento da marca, consistente tanto para quem
            compra quanto para quem administra.
          </p>
        </CaseStatement>
      </CaseSection>

      <CaseRelated current="dalia" />

      <CaseCta
        title="Quer uma loja que acompanhe o crescimento da sua marca?"
        desc="Conte o seu desafio para a nossa equipe. Projetamos a plataforma sob medida, da vitrine ao painel de gestão."
        whatsappMessage="Olá! Vi o case da Dália Semijoias no site da Flauzino e quero uma loja que acompanhe o crescimento da minha marca."
      />
    </CaseShell>
  );
}
