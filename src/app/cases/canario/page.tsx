import type { Metadata } from "next";
import Image from "next/image";
import { siWhatsapp } from "simple-icons";
import {
  DatabaseBackup,
  FileSignature,
  FlaskConical,
  Gavel,
  Radar,
  Rocket,
  ShieldCheck,
} from "lucide-react";
import {
  CaseCards,
  CaseCompare,
  CaseCta,
  CaseHero,
  CaseHighlight,
  CaseMetrics,
  CaseRelated,
  CaseSection,
  CaseShell,
  CaseStatement,
  CaseTracks,
} from "@/components/cases/chrome";
import { FLAUZINO_BLUE } from "@/components/cases/logos";
import { Reveal } from "@/components/landing/primitives";

const TITLE = "Canário Capital | Engenharia de software e performance | Flauzino";
const DESCRIPTION =
  "Como a Flauzino assumiu a responsabilidade técnica da Canário Capital, plataforma financeira de milhares de traders, com rotinas críticas até 51 vezes mais rápidas.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/cases/canario",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/cases/canario",
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
  "Respostas lentas em operações críticas",
  "Gargalos durante consultas frequentes",
  "Crescimento limitado pela arquitetura existente",
];

const AFTER = [
  "Rotinas críticas com resposta quase imediata",
  "Cache distribuído nas operações mais usadas",
  "Base preparada para receber novos recursos",
];

/* lista com ícone: mesma família visual das outras seções em duas colunas,
   mas sem caixa — o card já foi usado na seção de fraude, repetir aqui
   faria as duas seções lerem como uma coisa só */
const RELIABILITY = [
  {
    icon: <FlaskConical strokeWidth={2} />,
    title: "Testes automatizados nas rotinas de dinheiro",
    body: "A empresa não tinha nenhum. As rotinas que movimentam dinheiro passaram a ter cobertura.",
  },
  {
    icon: <Rocket strokeWidth={2} />,
    title: "Implantação automatizada",
    body: "Colocar uma versão nova no ar deixou de depender de passo manual e virou processo repetível.",
  },
  {
    icon: <Radar strokeWidth={2} />,
    title: "Monitoramento próprio da operação",
    body: "Antes, uma falha só aparecia depois de afetar um cliente. Agora o alerta chega enquanto o problema ainda está acontecendo.",
  },
  {
    icon: <DatabaseBackup strokeWidth={2} />,
    title: "Backup e recuperação de desastre",
    body: "Uma política testada na prática para o pior dia possível, não apenas documentada.",
  },
];

/* único uso de card com caixa na página — reservado para o momento de
   maior peso institucional (a defesa contra chargeback) */
const CHARGEBACK = [
  {
    icon: <ShieldCheck strokeWidth={2} />,
    title: "Titularidade validada pela Pagar.me",
    body: "A verificação confirma que só o dono do cartão pode assinar o reconhecimento da compra.",
  },
  {
    icon: <FileSignature strokeWidth={2} />,
    title: "Assinatura formalizada pelo ZapSign",
    body: "A assinatura acontece com confirmação de identidade, criando um registro formal da operação.",
  },
  {
    icon: <Gavel strokeWidth={2} />,
    title: "Evidência para contestar chargebacks",
    body: "Cada assinatura vira prova concreta, usada na defesa contra contestações indevidas.",
  },
];

const SAQUE_BEFORE = [
  "Saque preso ao calendário do financeiro",
  "Trader sem escolher quando ou quanto sacar",
  "Liberação parada esperando a nota fiscal",
];

const SAQUE_AFTER = [
  "O trader pede o saque na hora que quiser",
  "Valor e momento na mão de quem opera",
  "Nota fiscal emitida dentro do próprio fluxo",
];

/* três rótulos grandes em vez de número — o mesmo desenho de CaseMetrics,
   só que o "dado" aqui é qual perfil de pagamento, não uma métrica */
const PAGAMENTOS = [
  { value: "CLT", desc: "folha calculada por período, com prêmio de meta batida na régua certa" },
  { value: "PJ", desc: "remuneração de profissionais PJ na mesma estrutura, sem planilha paralela" },
  { value: "Afiliados", desc: "metas e comissões da rede com histórico de cada pagamento" },
];

const AUDIT_STEPS = ["Quem fez a ação", "Quando aconteceu", "O que foi alterado", "Vira laudo técnico"];

/* As três marcas vivem em placa branca: os arquivos são versões escuras,
   feitas para fundo claro, e sumiriam sobre o canvas da seção. */
const INTEGRATIONS = [
  { name: "Nelogica", src: "/cases/canario/integracoes/nelogica-light.svg" },
  { name: "Pagar.me", src: "/cases/canario/integracoes/pagarme-light.svg" },
  { name: "ZapSign", src: "/cases/canario/integracoes/zapsign-light.svg" },
];

export default function CanarioCasePage() {
  return (
    <CaseShell>
      <CaseHero
        logo={
          <Image
            src="/cases/canario/logo.png"
            alt="Canário Capital"
            width={720}
            height={88}
            className="h-8 w-auto sm:h-9"
            priority
          />
        }
        title="Tecnologia para uma das maiores mesas proprietárias do Brasil."
        intro="A Canário Capital é uma plataforma financeira usada todo dia por milhares de traders. Assumimos a responsabilidade técnica do sistema em um momento decisivo da operação, para conduzir a evolução do produto e modernizar uma base que precisava acompanhar o crescimento sem abrir mão de estabilidade."
        accent={FLAUZINO_BLUE}
        meta={[
          "Mercado financeiro",
          "Mais de 5 mil usuários ativos",
          "Responsável técnico",
        ]}
        siteUrl="canariocapital.com.br"
        image={{
          src: "/cases/canario/hero.png",
          alt: "Site institucional da Canário Capital em um notebook, ao lado do painel de indicadores em um smartphone",
          width: 4289,
          height: 2565,
        }}
      />

      {/* performance */}
      <CaseSection>
        <CaseStatement title="O que travava a operação e o que mudou.">
          <p>
            Boa parte do trabalho aconteceu nos bastidores. Reformulamos
            componentes críticos, colocamos uma camada de cache distribuído,
            revisamos os fluxos de autenticação e reescrevemos as consultas
            por trás das operações que os clientes mais usam.
          </p>
        </CaseStatement>

        <div className="mt-10 sm:mt-14">
          <CaseCompare
            beforeLabel="Antes"
            before={BEFORE}
            afterLabel="Depois"
            after={AFTER}
            accent={FLAUZINO_BLUE}
          />
        </div>
      </CaseSection>

      {/* o número, sozinho, com o peso que ele merece — única aparição do
          "51x" na página, para não diluir o impacto do dado */}
      <CaseSection tone="canvas">
        <CaseHighlight accent={FLAUZINO_BLUE} footnote="Medido nas funcionalidades mais acessadas da plataforma, antes e depois da reformulação.">
          Funcionalidades que os traders usam o dia inteiro passaram a responder
          até 51 vezes mais rápido.
        </CaseHighlight>
      </CaseSection>

      {/* confiabilidade */}
      <CaseSection>
        <CaseStatement title="Uma operação que deixou de depender de improviso.">
          <p>
            Com dinheiro real passando pela plataforma, entregar rápido sem rede
            de proteção é risco. Processos importantes passaram a contar com
            mais controle e previsibilidade, e uma falha deixou de ser algo que
            só se descobre depois que já afetou um cliente.
          </p>
        </CaseStatement>

        <div className="mt-10 sm:mt-14">
          <CaseTracks items={RELIABILITY} />
        </div>
      </CaseSection>

      {/* fraude e chargeback */}
      <CaseSection tone="canvas">
        <CaseStatement title="Mais proteção contra fraudes e chargebacks.">
          <p>
            A Canário enfrentava um problema recorrente: clientes contestando
            compras no cartão por fraude mesmo tendo feito a compra. Cada
            chargeback é dinheiro perdido, e sem evidência formal a empresa
            tinha pouca margem para contestar.
          </p>
        </CaseStatement>

        <div className="mt-10 sm:mt-14">
          <CaseCards items={CHARGEBACK} accent={FLAUZINO_BLUE} />
        </div>
      </CaseSection>

      {/* saques */}
      <CaseSection>
        <CaseStatement title="Saques sob controle do próprio trader.">
          <p>
            O saque antes dependia do calendário e da atuação do financeiro, e
            a liberação ainda esperava a nota fiscal no fim do mês. O processo
            virou self-service.
          </p>
        </CaseStatement>

        <div className="mt-10 sm:mt-14">
          <CaseCompare
            beforeLabel="Antes"
            before={SAQUE_BEFORE}
            afterLabel="Depois"
            after={SAQUE_AFTER}
            accent={FLAUZINO_BLUE}
          />
        </div>
      </CaseSection>

      {/* pagamentos */}
      <CaseSection tone="canvas">
        <CaseStatement title="Gestão de pagamentos centralizada.">
          <p>
            Funcionários CLT, profissionais PJ e a rede de afiliados têm regras
            próprias de remuneração. Centralizamos esses cálculos em um único
            sistema, que aplica a regra certa e mantém o histórico de cada
            pagamento — o financeiro passou a ter uma visão só, com menos
            trabalho operacional.
          </p>
        </CaseStatement>

        <div className="mt-10 sm:mt-14">
          <CaseMetrics items={PAGAMENTOS} />
        </div>
      </CaseSection>

      {/* auditoria */}
      <CaseSection>
        <CaseStatement title="Cada operação deixa uma história.">
          <p>
            Operações sensíveis passaram a contar com trilha completa de
            auditoria. Quando necessário, esse histórico vira laudo técnico
            automaticamente, pronto para uso judicial.
          </p>
        </CaseStatement>

        <div className="mt-10 sm:mt-14">
          <Reveal>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-4 sm:flex-nowrap sm:gap-x-3">
              {AUDIT_STEPS.map((step, i) => (
                <div key={step} className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={`flex h-12 items-center justify-center rounded-full px-5 text-center text-[13px] font-semibold leading-tight transition-colors sm:h-14 sm:px-6 ${
                      i === AUDIT_STEPS.length - 1
                        ? "bg-brand-600 text-white shadow-pop"
                        : "border border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    {step}
                  </div>
                  {i < AUDIT_STEPS.length - 1 && (
                    <span aria-hidden className="h-px w-5 shrink-0 bg-slate-300 sm:w-8" />
                  )}
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-xl text-balance text-[15px] leading-relaxed text-slate-500">
              A mesma estrutura ajuda no controle interno e fornece evidências
              para situações como a contestação de chargebacks.
            </p>
          </Reveal>
        </div>
      </CaseSection>

      {/* integrações */}
      <CaseSection tone="canvas">
        <CaseStatement
          align="center"
          title="Conectada ao ecossistema que a operação já usa."
        >
          <p>
            Os novos processos foram integrados às ferramentas que a Canário já
            utilizava, para que as diferentes partes da operação trabalhassem
            juntas em vez de criar processos paralelos.
          </p>
        </CaseStatement>

        <Reveal delay={0.08}>
          {/* quatro placas empilhadas eram 400px de rolagem para dizer
              "conecta com estes quatro"; em duas colunas o bloco lê de
              uma olhada só, que é como logo de integração funciona */}
          <div className="mx-auto mt-9 grid max-w-4xl grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {INTEGRATIONS.map((it) => (
              <div
                key={it.name}
                className="grid h-20 place-items-center rounded-2xl border border-slate-200 bg-white px-4 transition-colors duration-300 hover:border-slate-300 sm:h-24 sm:px-7"
              >
                <Image
                  src={it.src}
                  alt={it.name}
                  width={200}
                  height={48}
                  className="h-7 w-auto max-w-[9rem] object-contain"
                />
              </div>
            ))}
            <div className="grid h-20 place-items-center rounded-2xl border border-slate-200 bg-white px-4 transition-colors duration-300 hover:border-slate-300 sm:h-24 sm:px-7">
              <svg
                viewBox="0 0 24 24"
                width={28}
                height={28}
                fill={`#${siWhatsapp.hex}`}
                role="img"
                aria-label="WhatsApp"
              >
                <title>WhatsApp</title>
                <path d={siWhatsapp.path} />
              </svg>
            </div>
          </div>
        </Reveal>
      </CaseSection>

      {/* evolução */}
      <CaseSection>
        <CaseStatement title="Uma base preparada para os próximos anos.">
          <p>
            Mais do que somar funcionalidades, o projeto reorganizou a forma
            como a plataforma evolui. Hoje um recurso novo nasce sobre uma
            arquitetura consistente, enquanto a operação ganha mais controle
            sobre aquilo que já existe. A tecnologia passou a acompanhar o
            ritmo do negócio, em vez de limitar sua evolução.
          </p>
        </CaseStatement>
      </CaseSection>

      <CaseRelated current="canario" />

      <CaseCta
        title="Quer performance assim na sua plataforma?"
        desc="Conte o seu desafio para a nossa equipe. Assumimos desde a responsabilidade técnica até a operação em produção."
        whatsappMessage="Olá! Vi o case da Canário Capital no site da Flauzino e quero performance assim na minha plataforma."
      />
    </CaseShell>
  );
}
