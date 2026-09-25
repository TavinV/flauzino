import type { Metadata } from "next";
import {
  ArrowLeftRight,
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Camera,
  ClipboardCheck,
  DoorOpen,
  Fingerprint,
  ImageIcon,
  KeyRound,
  Laptop,
  Lock,
  Monitor,
  MonitorSmartphone,
  ScanFace,
  ScanSearch,
  ScrollText,
  ShieldAlert,
  SlidersHorizontal,
  Smartphone,
  Tablet,
  Trash2,
  UserCheck,
  UserCog,
  UserRoundSearch,
  VenetianMask,
  Video,
  Workflow,
} from "lucide-react";
import {
  CaseCards,
  CaseCompare,
  CaseCta,
  CaseHero,
  CaseLinkCard,
  CaseSection,
  CaseShell,
  CaseStatement,
  CaseTracks,
} from "@/components/cases/chrome";
import { VisageLogo } from "@/components/cases/logos";
import FAQ, { type FAQEntry } from "@/components/landing/FAQ";
import { SITE_URL } from "@/lib/site";
import { whatsappHref } from "@/lib/whatsapp";

/* ================================================================== */
/*  /reconhecimento-facial — destino do "Saiba mais" da seção de       */
/*  reconhecimento facial da home. Usa as mesmas peças dos cases       */
/*  (topo escuro, enunciados, comparativo, trilhas, cartões) para      */
/*  parecer parte do site, e não uma landing à parte.                  */
/*                                                                     */
/*  Regras desta página, combinadas com o Otávio:                      */
/*  - os elementos gráficos explicam; o texto de cada seção fica entre */
/*    duas e três frases, e cada cartão tem uma frase completa;        */
/*  - nenhum título passa de duas linhas, do celular de 320px ao       */
/*    desktop: títulos curtos, largos e no eixo central;               */
/*  - a abertura ocupa a tela inteira e é só um convite para ler, sem  */
/*    selo e sem rodapé de rótulos;                                    */
/*  - nada de jargão de fornecedor ("hardware proprietário"): a        */
/*    empresa usa os próprios aparelhos, ou compra um, e ele é dela;   */
/*  - nenhuma afirmação de precisão com número absoluto.               */
/* ================================================================== */

const PATH = "/reconhecimento-facial";
const PAGE_URL = `${SITE_URL}${PATH}`;
const TITLE = "Reconhecimento facial para empresas, sob medida | Flauzino";
const DESCRIPTION =
  "A Flauzino desenvolve reconhecimento facial com tecnologia própria: acesso, presença, autenticação e antifraude integrados aos sistemas da sua empresa.";

const WHATSAPP_MESSAGE =
  "Olá! Conheci a solução de reconhecimento facial da Flauzino e gostaria de entender como ela poderia ser aplicada à minha empresa.";

/* ícones dos cartões no azul da marca: o azul-claro padrão da família
   some sobre o fundo branco do cartão */
const ICON_ACCENT = "#2563EB";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "reconhecimento facial",
    "reconhecimento facial para empresas",
    "empresa de reconhecimento facial",
    "sistema de reconhecimento facial",
    "desenvolvimento de sistema de reconhecimento facial",
    "reconhecimento facial para controle de acesso",
    "reconhecimento facial para controle de presença",
    "reconhecimento facial antifraude",
    "reconhecimento facial no celular",
    "prova de vida",
    "biometria facial",
    "reconhecimento facial LGPD",
  ],
  alternates: {
    canonical: PATH,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PATH,
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

/* ------------------------------------------------------------------ */
/*  Conteúdo                                                           */
/* ------------------------------------------------------------------ */

const API_WAY = [
  "Regras de decisão definidas pelo fornecedor da API",
  "Custo por consulta que cresce junto com o volume",
  "Imagens processadas na infraestrutura de outra empresa",
  "Pouca margem para cenários fora do padrão",
];

const OWN_WAY = [
  "Critério de decisão calibrado para o risco da operação",
  "Reconhecimento integrado ao sistema que a empresa já usa",
  "Arquitetura e hospedagem definidas junto com o cliente",
  "Evolução contínua a partir da operação real",
];

const STEPS = [
  {
    icon: <Camera />,
    title: "1. Captura da imagem",
    body: "A câmera do celular, do tablet ou do totem registra a imagem de quem está diante dela.",
  },
  {
    icon: <ScanFace />,
    title: "2. Detecção do rosto",
    body: "O sistema localiza o rosto e descarta imagens sem enquadramento ou iluminação suficientes.",
  },
  {
    icon: <Fingerprint />,
    title: "3. Assinatura facial",
    body: "Um modelo de inteligência artificial converte os traços do rosto em uma representação numérica.",
  },
  {
    icon: <ArrowLeftRight />,
    title: "4. Comparação",
    body: "A assinatura é comparada com as cadastradas, e o sistema calcula o grau de semelhança entre elas.",
  },
  {
    icon: <BadgeCheck />,
    title: "5. Decisão",
    body: "Acima do limite definido para o cenário, a identidade é confirmada e a ação acontece: a catraca libera, a presença é registrada.",
  },
  {
    icon: <ScrollText />,
    title: "6. Registro",
    body: "Reconhecimentos, recusas e tentativas suspeitas ficam registrados para auditoria.",
  },
];

const LOOKALIKES = [
  {
    icon: <ScanSearch />,
    title: "Análise de detalhes finos",
    body: "O modelo considera traços sutis do rosto, que uma comparação superficial deixa passar.",
  },
  {
    icon: <SlidersHorizontal />,
    title: "Rigor proporcional ao risco",
    body: "O nível de semelhança exigido é calibrado conforme o impacto de um erro em cada fluxo.",
  },
  {
    icon: <UserRoundSearch />,
    title: "Confirmação adicional",
    body: "Quando dois cadastros ficam próximos demais, o sistema solicita uma segunda verificação em vez de arriscar.",
  },
];

const ATTACKS = [
  {
    icon: <ImageIcon />,
    title: "Fotografias impressas",
    body: "Retratos, fotos 3x4 e imagens recortadas de documentos: a tentativa mais comum.",
  },
  {
    icon: <MonitorSmartphone />,
    title: "Imagens em telas",
    body: "O rosto exibido em outro celular, tablet ou monitor, às vezes com o brilho ajustado.",
  },
  {
    icon: <Video />,
    title: "Vídeos gravados",
    body: "Gravações que simulam piscadas e movimentos naturais da cabeça diante da câmera.",
  },
  {
    icon: <VenetianMask />,
    title: "Máscaras e réplicas",
    body: "Representações físicas do rosto de outra pessoa, das mais simples às mais elaboradas.",
  },
];

const DEVICES = [
  {
    icon: <Smartphone />,
    title: "Celulares",
    body: "Para equipes externas, visitas em campo e autenticação no aplicativo da empresa.",
  },
  {
    icon: <Tablet />,
    title: "Tablets",
    body: "Na recepção, na entrada da sala ou no refeitório, como um totem de baixo custo.",
  },
  {
    icon: <Laptop />,
    title: "Notebooks e computadores",
    body: "Login sem senha e confirmação de identidade em sistemas internos e aprovações sensíveis.",
  },
  {
    icon: <Monitor />,
    title: "Totens e câmeras",
    body: "Em portarias e catracas de grande fluxo. Câmeras existentes são avaliadas caso a caso.",
  },
];

const APPLICATIONS = [
  {
    icon: <DoorOpen />,
    title: "Controle de acesso",
    body: "Entrada de funcionários, visitantes e prestadores em portarias, catracas e áreas restritas.",
  },
  {
    icon: <CalendarCheck />,
    title: "Registro de presença",
    body: "Presença de equipes, chamada de alunos e treinamentos, sem crachá e sem lista para assinar.",
  },
  {
    icon: <KeyRound />,
    title: "Autenticação",
    body: "Login sem senha e confirmação de identidade antes de ações sensíveis, como aprovar um pagamento.",
  },
  {
    icon: <ShieldAlert />,
    title: "Prevenção de fraude",
    body: "Bloqueia o crachá emprestado, a presença marcada por outra pessoa e o cadastro em nome de terceiros.",
  },
  {
    icon: <UserCheck />,
    title: "Validação de identidade",
    body: "Confirma que a pessoa é quem afirma ser na contratação, no cadastro ou na abertura de conta.",
  },
  {
    icon: <Workflow />,
    title: "Automação de processos",
    body: "A identificação aciona a etapa seguinte: libera um pedido, registra uma entrega, inicia um atendimento.",
  },
];

const PRIVACY = [
  {
    icon: <Lock />,
    title: "Criptografia",
    body: "Dados protegidos em trânsito e armazenados de forma criptografada.",
  },
  {
    icon: <Fingerprint />,
    title: "Assinatura no lugar da foto",
    body: "Sempre que o projeto permite, o sistema armazena a representação numérica do rosto, e não a imagem.",
  },
  {
    icon: <UserCog />,
    title: "Acesso restrito",
    body: "Cada perfil visualiza apenas o necessário, e todo acesso aos dados biométricos fica registrado.",
  },
  {
    icon: <ScrollText />,
    title: "Trilha de auditoria",
    body: "Reconhecimentos, recusas e tentativas suspeitas ficam registrados, com data e origem.",
  },
  {
    icon: <Trash2 />,
    title: "Retenção e exclusão",
    body: "Prazos de guarda definidos com o cliente e exclusão dos dados nos termos da lei.",
  },
  {
    icon: <ClipboardCheck />,
    title: "Transparência e consentimento",
    body: "Fluxos para informar o titular e registrar o consentimento quando essa for a base legal.",
  },
];

/* As perguntas que chegam antes da primeira conversa. O FAQPage do
   schema sai deste mesmo array (dentro do componente FAQ). */
const QUESTIONS: FAQEntry[] = [
  {
    q: "Como funciona o reconhecimento facial?",
    a: "A câmera capta o rosto, o sistema o converte em uma representação numérica e a compara com os cadastros. Se a semelhança supera o limite definido para o cenário, a identidade é confirmada, tudo em frações de segundo.",
  },
  {
    q: "É possível usar reconhecimento facial em celulares e tablets?",
    a: "Sim. A solução funciona em celulares, tablets, notebooks e totens com câmera. Um tablet na recepção, por exemplo, pode operar como terminal de reconhecimento.",
  },
  {
    q: "Preciso comprar um equipamento específico?",
    a: "Não é preciso comprar equipamento da Flauzino. A solução usa os aparelhos que a empresa já tem; se a operação pedir um totem, indicamos as especificações e a empresa compra o modelo que preferir, que passa a ser dela.",
  },
  {
    q: "O sistema consegue diferenciar gêmeos?",
    a: "A tecnologia foi desenvolvida e testada também com pessoas muito parecidas, incluindo gêmeos. Em fluxos sensíveis, pode solicitar uma segunda verificação quando dois cadastros ficam próximos demais.",
  },
  {
    q: "Como funciona a proteção contra fraude?",
    a: "Antes de comparar o rosto, a prova de vida confirma que há uma pessoa real diante da câmera. Isso barra fotos impressas, imagens em telas, vídeos gravados e máscaras, e as tentativas suspeitas ficam registradas.",
  },
  {
    q: "O reconhecimento facial pode ser integrado ao meu sistema?",
    a: "Sim. Integramos ao ERP, ao sistema de RH, ao controle de acesso, ao aplicativo ou à plataforma que a empresa já usa. Se não houver um sistema, a Flauzino também o desenvolve.",
  },
  {
    q: "Pode ser usado para controle de acesso?",
    a: "Sim, e essa é uma das aplicações mais comuns: portarias, catracas e áreas restritas. Quando o equipamento de acesso já instalado permite integração, ele é aproveitado.",
  },
  {
    q: "Pode ser usado para controle de presença?",
    a: "Sim. O reconhecimento impede que outra pessoa marque a presença no lugar do titular e elimina a chamada manual. A Visage, produto da Flauzino, faz isso em instituições de ensino.",
  },
  {
    q: "Como os dados biométricos são tratados?",
    a: "Com criptografia, acesso restrito por perfil e trilha de auditoria. Sempre que o projeto permite, o sistema guarda a representação numérica do rosto em vez da foto, com prazos de retenção definidos com o cliente.",
  },
  {
    q: "A solução atende às exigências da LGPD?",
    a: "A arquitetura é projetada considerando os requisitos da LGPD para dados biométricos, que a lei classifica como sensíveis. Como a conformidade também depende do uso que a empresa faz, atuamos junto com o jurídico ou o DPO do cliente.",
  },
  {
    q: "É possível desenvolver uma solução personalizada?",
    a: "Sim. Todo projeto começa pelo entendimento da operação: quem precisa ser reconhecido, onde, em que volume e com qual nível de rigor. A solução é construída a partir disso.",
  },
  {
    q: "Como implementar reconhecimento facial na minha empresa?",
    a: "O processo passa por diagnóstico, definição de escopo e dispositivos, um piloto em ambiente real e a expansão para o restante da operação. O primeiro passo é falar com um especialista da Flauzino.",
  },
];

/* Service + WebPage + BreadcrumbList. A Organization repete só o que o
   JSON-LD da home já publica (nome, URL, e-mail, logo), para esta página
   se explicar sozinha a quem a ler sem passar pela home. O FAQPage vem
   do componente FAQ, a partir das perguntas visíveis. */
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Flauzino",
      url: SITE_URL,
      email: "contato@flauzino.com.br",
      logo: `${SITE_URL}/apple-icon.png`,
    },
    {
      "@type": "WebPage",
      "@id": `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: "pt-BR",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${PAGE_URL}#service` },
      breadcrumb: { "@id": `${PAGE_URL}#breadcrumb` },
    },
    {
      "@type": "Service",
      "@id": `${PAGE_URL}#service`,
      name: "Desenvolvimento de sistemas de reconhecimento facial",
      serviceType: "Reconhecimento facial",
      description:
        "Tecnologia própria de reconhecimento facial da Flauzino, desenvolvida sob medida e integrada aos sistemas da empresa: controle de acesso, registro de presença, autenticação, validação de identidade e prevenção de fraude com prova de vida. Funciona em celulares, tablets, notebooks e totens da própria empresa, sem exigir a compra de equipamentos da Flauzino.",
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: { "@type": "Country", name: "Brasil" },
      audience: { "@type": "BusinessAudience" },
      url: PAGE_URL,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Aplicações de reconhecimento facial",
        itemListElement: APPLICATIONS.map((a) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: a.title, description: a.body },
        })),
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${PAGE_URL}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Reconhecimento facial", item: PAGE_URL },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Página                                                             */
/* ------------------------------------------------------------------ */

export default function FacialRecognitionPage() {
  return (
    <CaseShell back={{ href: "/#reconhecimento-facial", label: "Voltar ao site" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <CaseHero
        align="center"
        title="Reconhecimento facial, sob medida para a sua empresa"
        intro="Tecnologia própria da Flauzino, integrada ao sistema da sua empresa e aos aparelhos que você já possui."
        accent="#93C5FD"
        scrollHint="#tecnologia-propria"
        actions={
          <>
            <a
              href={whatsappHref(WHATSAPP_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-[3.25rem] cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-7 text-[15px] font-semibold text-[#0b1220] shadow-[0_16px_48px_-16px_rgba(147,197,253,0.55)] transition-all duration-200 hover:bg-blue-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
            >
              Falar com especialista
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
            <a
              href="#como-funciona"
              className="inline-flex h-[3.25rem] items-center justify-center rounded-xl border border-white/15 px-7 text-[15px] font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              Entenda como funciona
            </a>
          </>
        }
      />

      <CaseSection id="tecnologia-propria">
        <CaseStatement align="center" title="Tecnologia própria de reconhecimento facial">
          <p>
            Boa parte das soluções do mercado é uma interface construída sobre a API de outra
            empresa, com regras que o fornecedor define. A Flauzino desenvolve o próprio motor de
            reconhecimento e, por isso, consegue ajustá-lo às regras e aos processos da sua
            operação.
          </p>
        </CaseStatement>
        <div className="mt-10 sm:mt-14">
          <CaseCompare
            beforeLabel="Consumir a API de terceiros"
            before={API_WAY}
            afterLabel="Tecnologia própria da Flauzino"
            after={OWN_WAY}
          />
        </div>
      </CaseSection>

      <CaseSection id="como-funciona" tone="canvas">
        <CaseStatement align="center" title="Como funciona o reconhecimento facial">
          <p>
            O sistema compara o rosto de quem está diante da câmera com os rostos cadastrados.
            Para o usuário, é imediato; nos bastidores, são seis etapas concluídas em frações de
            segundo.
          </p>
        </CaseStatement>
        <div className="mt-10 sm:mt-14">
          <CaseTracks items={STEPS} />
        </div>
      </CaseSection>

      <CaseSection id="gemeos">
        <CaseStatement align="center" title="Preparado para gêmeos e rostos parecidos">
          <p>
            Identificar um rosto bem iluminado é o requisito mínimo. O desafio está em diferenciar
            pessoas com traços muito próximos, como irmãos e gêmeos, e a tecnologia da Flauzino
            foi desenvolvida e testada também para esses casos.
          </p>
        </CaseStatement>
        <div className="mt-10 sm:mt-14">
          <CaseCards items={LOOKALIKES} accent={ICON_ACCENT} />
        </div>
      </CaseSection>

      <CaseSection id="antifraude" tone="canvas">
        <CaseStatement align="center" title="Antifraude com prova de vida">
          <p>
            Antes de comparar o rosto, a detecção de prova de vida confirma que há uma pessoa real
            e presente diante da câmera. Tentativas como as abaixo são bloqueadas e registradas
            para auditoria.
          </p>
        </CaseStatement>
        <div className="mt-10 sm:mt-14">
          <CaseCards items={ATTACKS} columns={4} accent={ICON_ACCENT} />
        </div>
      </CaseSection>

      <CaseSection id="dispositivos">
        <CaseStatement align="center" title="Funciona nos aparelhos que você já tem">
          <p>
            A solução roda em aparelhos comuns com câmera, e não é preciso comprar nenhum
            equipamento da Flauzino. Se a operação pedir um aparelho dedicado, como um totem para
            a portaria, a empresa compra o modelo que preferir, e ele é dela.
          </p>
        </CaseStatement>
        <div className="mt-10 sm:mt-14">
          <CaseCards items={DEVICES} columns={4} accent={ICON_ACCENT} />
        </div>
      </CaseSection>

      <CaseSection id="aplicacoes" tone="canvas">
        <CaseStatement align="center" title="Integrado ao sistema da sua empresa">
          <p>
            A identidade confirmada aciona uma ação dentro da operação: abrir uma porta, registrar
            uma presença, liberar uma transação. Integramos o reconhecimento ao ERP, ao controle de
            acesso, ao RH ou ao aplicativo da empresa e, se não houver um sistema, nossa equipe
            desenvolve.
          </p>
        </CaseStatement>
        <div className="mt-10 sm:mt-14">
          <CaseCards items={APPLICATIONS} accent={ICON_ACCENT} />
        </div>
      </CaseSection>

      <CaseSection id="privacidade-e-lgpd">
        <CaseStatement align="center" title="Privacidade, segurança e LGPD">
          <p>
            A LGPD classifica o dado biométrico como dado pessoal sensível, o que exige base legal
            adequada e segurança proporcional ao risco. A arquitetura das nossas soluções considera
            esses requisitos desde o início, em conjunto com o jurídico ou o DPO do cliente.
          </p>
        </CaseStatement>
        <div className="mt-10 sm:mt-14">
          <CaseTracks items={PRIVACY} />
        </div>
      </CaseSection>

      <FAQ id="perguntas-frequentes" title="Perguntas frequentes" questions={QUESTIONS} />

      <CaseSection id="case-visage" tone="canvas">
        <CaseLinkCard
          href="/cases/visage"
          logo={<VisageLogo className="text-xl text-white" mark={26} />}
          label="Case de sucesso"
          title="Chamada de aula por reconhecimento facial"
          cta="Ler o case completo"
          image={{
            src: "/cases/visage/hero.png",
            alt: "Painel da Visage em um notebook, ao lado do totem de chamada em um tablet",
            width: 4056,
            height: 2211,
          }}
        />
      </CaseSection>

      <CaseCta
        title="Tem um projeto em mente?"
        desc="Conte o que você precisa resolver. Nossa equipe avalia o cenário, indica os dispositivos adequados e mostra como o reconhecimento facial se integra à sua operação."
        whatsappMessage={WHATSAPP_MESSAGE}
        secondary={null}
      />
    </CaseShell>
  );
}
