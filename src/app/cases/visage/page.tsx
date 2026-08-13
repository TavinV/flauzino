import type { Metadata } from "next";
import {
  CaseCompare,
  CaseCta,
  CaseHero,
  CaseHighlight,
  CaseMetrics,
  CaseRelated,
  CaseSection,
  CaseShell,
  CaseShowcase,
  CaseStatement,
} from "@/components/cases/chrome";
import { VisageLogo } from "@/components/cases/logos";

const TITLE = "Visage | Reconhecimento facial para chamada de aula | Flauzino";
const DESCRIPTION =
  "Como a Flauzino transformou qualquer celular, tablet ou notebook em um totem de reconhecimento facial para chamada de aula, com detecção de fraude e conformidade com a LGPD.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/cases/visage",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/cases/visage",
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

const TRADITIONAL = [
  "Câmeras dedicadas e totens proprietários",
  "Contrato preso ao hardware do fornecedor",
  "Instalação complexa e demorada",
  "Investimento inicial alto em equipamento",
];

const VISAGE_WAY = [
  "Roda no celular, tablet ou notebook que a instituição já tem",
  "Nenhum equipamento proprietário",
  "Implantação em poucas horas",
  "Sem dependência do fornecedor para crescer",
];

const METRICS = [
  { value: "99%+", desc: "de assertividade no bloqueio e sinalização de fraudes" },
  { value: "< 3s", desc: "de reconhecimento por aluno, em média" },
  { value: "90%+", desc: "de acurácia de reconhecimento" },
];

/* Capturas reais do produto. A versão anterior desta página desenhava
   molduras de navegador com URL fictícia e um ícone no meio, enquanto
   estes arquivos já estavam no repositório sem uso. */
const SCREENS = [
  {
    src: "/cases/visage/painel.png",
    alt: "Painel administrativo da Visage com indicadores de frequência por turma",
    caption: "Painel administrativo: frequência por turma, em tempo real.",
    width: 1917,
    height: 862,
  },
  {
    src: "/cases/visage/totem.png",
    alt: "Tela do totem da Visage reconhecendo um aluno na entrada da sala",
    caption: "O totem rodando no tablet da própria instituição.",
    width: 1917,
    height: 867,
  },
  {
    src: "/cases/visage/usuarios.png",
    alt: "Tela de gestão de usuários e matrículas da Visage",
    caption: "Gestão de alunos, turmas e matrículas.",
    width: 1917,
    height: 861,
  },
  {
    src: "/cases/visage/landing.png",
    alt: "Site público da Visage apresentando o produto",
    caption: "O produto tem site, marca e identidade próprios.",
    width: 1917,
    height: 867,
  },
];

export default function VisageCasePage() {
  return (
    <CaseShell>
      <CaseHero
        logo={<VisageLogo className="text-2xl text-white" mark={40} />}
        title="A primeira chamada de aula por reconhecimento facial do Brasil."
        intro="A Visage resolve dois problemas caros das instituições de ensino superior: fraude no registro de presença e o tempo perdido com chamada manual. A plataforma automatiza o processo inteiro por reconhecimento facial, e a coordenação acompanha a frequência em tempo real sem atrasar o começo da aula."
        accent="#93C5FD"
        meta={["Produto próprio", "Instituições de ensino", "Conformidade com a LGPD"]}
        siteUrl="visage.app.br"
        image={{
          src: "/cases/visage/hero.png",
          alt: "Painel administrativo da Visage em um notebook, ao lado do totem de chamada em um tablet",
          width: 4056,
          height: 2211,
        }}
      />

      {/* infraestrutura */}
      <CaseSection>
        <CaseStatement title="Reconhecimento facial sem equipamento proprietário.">
          <p>
            As soluções tradicionais exigem câmera dedicada, totem próprio e
            contrato amarrado ao hardware. A Visage foi por outro caminho:
            qualquer celular, tablet ou notebook da instituição vira um totem
            inteligente, sem instalação complexa nem compra de dispositivo.
          </p>
          <p>
            Isso derruba o custo de implantação e tira a dependência do
            fornecedor. Uma tecnologia que era restrita a quem podia bancar a
            infraestrutura passou a caber no orçamento de faculdades e
            universidades.
          </p>
        </CaseStatement>

        <div className="mt-10 sm:mt-14">
          <CaseCompare
            beforeLabel="Como o mercado faz"
            before={TRADITIONAL}
            afterLabel="Como a Visage faz"
            after={VISAGE_WAY}
            accent="#93C5FD"
          />
        </div>
      </CaseSection>

      {/* o produto por dentro, com capturas reais */}
      <CaseSection tone="canvas">
        <CaseStatement title="O produto por dentro.">
          <p>
            Da tela que o aluno encara na porta da sala ao relatório que a
            coordenação abre no fim do mês, tudo foi desenhado e construído
            aqui.
          </p>
        </CaseStatement>

        <div className="mt-10 sm:mt-14">
          <CaseShowcase items={SCREENS} />
        </div>
      </CaseSection>

      {/* segurança */}
      <CaseSection>
        <CaseStatement title="Segurança pensada para corredor cheio.">
          <p>
            O sistema opera em ambiente de grande circulação sem perder
            velocidade no horário de pico. São várias camadas de detecção
            trabalhando juntas contra foto impressa, vídeo em celular, imagem em
            tela de computador e até máscara.
          </p>
          <p>
            Cada evento fica registrado para auditoria, então a instituição
            consegue reconstruir todo o histórico de reconhecimentos, rejeições
            e tentativas suspeitas.
          </p>
        </CaseStatement>

        <div className="mt-10 sm:mt-14">
          <CaseMetrics items={METRICS} />
        </div>
      </CaseSection>

      <CaseSection tone="canvas">
        <CaseHighlight footnote="O reconhecimento acontece enquanto o aluno entra na sala, sem fila e sem parar o fluxo.">
          A melhor tecnologia de chamada é a que ninguém percebe que está
          funcionando.
        </CaseHighlight>
      </CaseSection>

      <CaseRelated current="visage" />

      <CaseCta
        title="Quer modernizar a gestão de presença da sua instituição?"
        desc="Conte o seu desafio para a nossa equipe e veja a Visage funcionando, da chamada automática aos relatórios de auditoria."
        whatsappMessage="Olá! Vi o case da Visage no site da Flauzino e quero modernizar a gestão de presença da minha instituição com reconhecimento facial."
      />
    </CaseShell>
  );
}
