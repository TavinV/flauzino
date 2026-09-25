# Princípios de design da landing — guia de transplante

Este documento descreve **como** esta landing page foi pensada, não **com o quê**. Nenhuma cor, fonte ou nome de componente específico deste projeto deve ser copiado para o próximo — o que deve viajar é a lógica por trás de cada decisão. Sempre que um princípio pedir um exemplo concreto, ele vem entre parênteses e pode ser substituído livremente.

---

## 1. Filosofia central

A página não é uma lista de seções empilhadas — é encenada como uma sequência de **atos** que alternam de tom. Um ato escuro e denso (abertura de impacto) é seguido por um ato claro e respirado (prova e argumento), que volta a escurecer no clímax, e assim por diante até o fechamento. Essa alternância cumpre duas funções:

1. **Ritmo de leitura**: um usuário rolando a página sente marcos, não um scroll infinito e uniforme. Cada transição de tom é um "vire a página" implícito.
2. **Hierarquia de atenção**: os atos escuros carregam o discurso emocional/tecnológico (abertura, tecnologia de ponta); os atos claros carregam prova concreta (cases, depoimentos, preços, dúvidas). O usuário aprende, sem que ninguém explique, que "quando a página escurece, é para impressionar; quando clareia, é para provar".

Cada seção sinaliza seu próprio tom via um atributo semântico no DOM (aqui, `data-nav-theme="dark"|"light"`), e a navegação fixa lê essa sinalização para se adaptar automaticamente — o cabeçalho nunca é "burro": ele reage ao que está atrás dele.

**Regra de transplante**: escolha pelo menos dois tons de fundo contrastantes (não precisa ser claro/escuro — pode ser dois tons de saturação, duas texturas, duas densidades) e alterne-os section a section com propósito narrativo, nunca por acaso.

---

## 2. Estrutura em "atos" e função de cada bloco

A ordem das seções segue uma lógica argumentativa clássica, não uma lista de features:

1. **Abertura de impacto** (ato escuro) — uma cena, não uma explicação. Mostra o produto em uso via uma peça visual grande (aqui, um palco 3D interativo) e uma frase de posicionamento curta, com dois caminhos de ação claros (ação primária de conversão + ação secundária de exploração).
2. **Transição de credibilidade** (ato claro, comprimido) — por que confiar, em poucos compromissos objetivos, não em adjetivos soltos. Cada compromisso é uma frase de benefício + uma frase de prova, nunca só um adjetivo.
3. **Clímax tecnológico** (ato escuro novamente) — a seção mais visualmente ambiciosa da página, reservada para a mensagem mais importante. Repetir o fundo escuro aqui, depois de já ter sido usado na abertura, funciona porque cria um eco: o usuário reconhece que voltou ao "modo impressionar".
4. **Prova concreta** (ato claro) — cases reais com resultado quantificado em uma frase, não em parágrafo.
5. **Prova em primeira pessoa** (ato claro, imediatamente depois) — depoimentos logo após os cases, para que cada depoimento funcione como legenda emocional do case que acabou de ser mostrado.
6. **Detalhamento funcional** (ato claro) — como o produto funciona no dia a dia, contado como narrativa temporal (uma linha do tempo de um "dia típico"), não como grade de ícones genéricos.
7. **Objeções e preço** (ato claro) — perguntas frequentes e planos ficam próximos ao fim, depois que a confiança já foi construída, nunca antes.
8. **Fechamento** (ato escuro, ecoando a abertura) — repete o convite de ação principal e organiza a navegação de saída (rodapé). O fechamento reencontra o tom da abertura de propósito: a página "respira" abrindo e fechando no mesmo registro.

**Regra de transplante**: antes de desenhar qualquer seção, escreva em uma frase qual é o *trabalho argumentativo* dela (impressionar, provar, tranquilizar, converter). Uma seção sem trabalho argumentativo claro deve ser cortada ou fundida com a vizinha.

---

## 3. Tipografia como hierarquia narrativa (não decoração)

- **Escala fluida em vez de breakpoints fixos**: títulos usam uma função de interpolação contínua entre um tamanho mínimo e um máximo, ligada à largura da viewport (`clamp(mínimo, preferencial-em-vw, máximo)`), em vez de trocar de tamanho abruptamente em cada breakpoint. O texto cresce e encolhe suavemente com a tela.
- **Piso mínimo explícito por contexto**: quando a escala fluida cai abaixo do confortável em telas muito pequenas, define-se um piso manual maior que o cálculo puro devolveria — e esse piso é escolhido comparando com a hierarquia vizinha (um título de destaque nunca pode renderizar menor que um subtítulo comum só porque a viewport é pequena).
- **Peso e tracking fazem o trabalho de "tamanho"**: títulos de destaque usam peso semi-negrito (não o mais pesado disponível) combinado com *tracking* levemente negativo (letras mais próximas), o que dá sensação de "editorial apertado" sem precisar aumentar o corpo da fonte.
- **Alturas de linha diferentes por função**: títulos usam entrelinha bem compacta (perto de 1.0–1.15), parágrafos de leitura usam entrelinha relaxada (perto de 1.6–1.7). A diferença entre as duas é deliberada e grande — títulos são "blocos", parágrafos são "fluxo".
- **Quebra de linha controlada em títulos**: usa-se a propriedade de balanceamento de texto (`text-wrap: balance` ou equivalente) para que títulos de duas ou três linhas não deixem uma última linha órfã com uma palavra solta.
- **Uma família monoespaçada reservada a dados**: qualquer número que represente um dado "medido" (métricas, IDs, timestamps, preços, contadores) usa uma fonte com números tabulares — nunca a mesma fonte proporcional do corpo de texto. Isso comunica inconscientemente "isto é um dado real", mesmo que o número seja pequeno.
- **Rótulos eyebrow (categoria acima do título)**: cada seção pode abrir com um pequeno rótulo em caixa alta, letras bem espaçadas (tracking largo), peso semi-negrito, acompanhado de um marcador visual mínimo (um ponto, um traço). Esse rótulo nomeia a seção antes do título dar a mensagem — funciona como uma "categoria de revista".

**Regra de transplante**: defina três tamanhos de título (hero, seção, subseção) e dois de corpo (leitura longa, legenda curta) — nada além disso. Cada um tem seu próprio par peso/tracking/entrelinha, não apenas um `font-size` diferente.

---

## 4. Espaço, respiro e ritmo vertical

- **Seções são muito mais altas do que parecem necessário à primeira vista**: o padding vertical de uma seção completa costuma equivaler a 20–40% da altura de uma tela de desktop. Esse excesso de respiro é o que dá sensação de "produto caro" — conteúdo espremido lê como orçamento apertado.
- **A escala de espaçamento cresce em degraus, não linearmente**: o espaço entre elementos íntimos (ícone e título dentro de um cartão) é pequeno e constante; o espaço entre blocos de conteúdo dentro da seção é médio; o espaço entre seções inteiras é grande. Nunca se usa o mesmo valor de gap para as três escalas.
- **Divisores como pontuação, não como decoração**: uma linha finíssima e de baixo contraste no topo de cada seção (borda superior quase invisível) funciona como uma vírgula visual — separa sem gritar. Uma linha de contraste mais alto é reservada para separações importantes (ex: dentro de um cartão, entre o corpo e a assinatura).
- **Respiro assimétrico proposital**: nem todo espaçamento é centrado/simétrico. Um título pode ficar fixo (sticky) numa coluna estreita enquanto conteúdo mais longo rola ao lado — o espaço em branco vira parte da composição, não sobra descartável.

**Regra de transplante**: ao dobrar o padding vertical de uma seção que "parece já estar bem", teste de novo — na prática web, o instinto do desenvolvedor costuma subestimar o respiro necessário para parecer premium.

---

## 5. Cor como sistema de dois registros, não paleta única

Independentemente de qual cor de marca for usada:

- **Um registro escuro quase-preto** (não preto puro — um tom muito escuro com uma leve dominante de cor da marca) para os atos de impacto. Superfícies dentro desse registro usam variações de opacidade branca sobre esse fundo (ex: bordas em branco a 10–15% de opacidade, texto secundário em branco a 60–70%) em vez de cores sólidas diferentes — isso mantém tudo visualmente "da mesma família" mesmo com muitos elementos sobrepostos.
- **Um registro claro quase-branco** (um branco levemente fora do puro, tipo "papel", não `#FFFFFF` cru) para os atos de prova. Dentro dele, uma escala neutra de cinzas frios organiza hierarquia de texto (título mais escuro/saturado, corpo em cinza médio, legendas em cinza claro).
- **Uma cor de destaque única atravessa os dois registros** e é usada com extrema disciplina: reservada para ações (botões primários), estados de foco, ícones ativos e pequenos acentos (um ponto, uma barra de progresso). Ela nunca vira cor de fundo de bloco grande — isso a manteria "gritando" o tempo todo e destruiria seu poder de destaque.
- **Gradientes são sutis e radiais, não decorativos e lineares cobrindo tudo**: manchas de luz suave posicionadas em cantos específicos (não no centro, não cobrindo a seção inteira) sugerem uma fonte de luz física, como um holofote de teatro apontado para um canto do palco.
- **Sombras tingidas com a cor de fundo, não cinza neutro**: uma sombra sob um cartão claro fica ligeiramente mais fria/quente conforme a temperatura da marca, em vez de um cinza genérico — isso faz a sombra parecer "pertencer" à mesma cena.

**Regra de transplante**: escolha 1 cor de destaque e proíba-se de usá-la em qualquer superfície maior que um botão ou ícone. Toda a "cor" percebida na página deve vir de luz (gradientes suaves), não de blocos pintados.

---

## 6. Superfícies, cartões e profundidade

- **Cantos muito arredondados em elementos grandes** (cartões, painéis, botões) — mais arredondados do que o padrão "seguro" costuma sugerir. Raios grandes comunicam software amigável; raios pequenos comunicam ferramenta técnica. Escolha conscientemente qual sensação a marca quer.
- **Bordas de 1px em opacidade baixíssima** em vez de bordas sólidas de cor — sobre fundo escuro, uma borda branca quase transparente; sobre fundo claro, uma borda cinza muito clara. A borda deve ser sentida, não vista.
- **Elevação por sombra em camadas, não por uma sombra só**: uma sombra "de contato" pequena e nítida perto do elemento, somada a uma sombra "de flutuação" grande e difusa mais distante. A combinação das duas é o que faz um cartão parecer fisicamente suspenso, e não apenas "com uma borda desfocada embaixo".
- **Estado de repouso deliberadamente discreto, estado de hover deliberadamente generoso**: cartões em repouso têm sombra mínima; ao passar o mouse, sobem levemente (translação negativa no eixo Y de poucos pixels) e a sombra cresce numa transição suave. Esse pequeno "levantar" é o que faz a interface parecer responsiva ao toque mesmo antes do clique.
- **Holofote que segue o cursor** em cartões interativos: uma luz radial suave posicionada exatamente onde o mouse está sobre o cartão (calculada em tempo real a partir da posição do cursor), que aparece só no hover. É uma técnica de baixíssimo custo perceptivo altíssimo — poucos concorrentes fazem isso, e quando fazem, sinaliza cuidado artesanal.
- **Imagens de produto como protagonistas dentro de cartões escuros**: quando o cartão existe para mostrar uma captura de tela ou foto real, a imagem cobre o cartão inteiro (não fica emoldurada com padding) e o texto flutua por cima com um gradiente de legibilidade (scrim) que escurece progressivamente na direção onde o texto vive, deixando o resto da imagem respirar sem véu.

**Regra de transplante**: todo cartão precisa responder visivelmente a três estados — repouso, hover, foco por teclado — e a diferença entre eles deve ser perceptível sem ser abrupta (transições de 200–400ms).

---

## 7. Linguagem de movimento (motion language)

O movimento nesta página nunca é usado "porque sim" — cada padrão de animação tem um papel comunicativo específico e é reutilizado de forma consistente em toda a página (um vocabulário, não animações ad-hoc por seção).

### 7.1 Entrada de conteúdo ao rolar (scroll reveal)
- Todo bloco de conteúdo nasce **desfocado, levemente deslocado para baixo e transparente**, e se resolve para **nítido, na posição final e opaco** conforme entra na viewport. A combinação de desfoque + deslocamento + opacidade (em vez de só opacidade) é o que dá a sensação de "foco de câmera assentando", muito mais rica que um simples fade-in.
- A curva de tempo usada é uma curva de desaceleração longa e confiante (o conteúdo "pousa" suavemente, sem quicar e sem parar abruptamente) — a mesma curva é reaproveitada em toda a página para todo tipo de entrada, criando uma "assinatura de movimento" coerente.
- Grupos de itens (cartões, itens de lista, ícones) entram em **cascata (stagger)**: cada item começa sua animação um pouco depois do anterior (deslocamento de 60–100ms entre eles), nunca todos de uma vez. Isso guia o olho a ler em ordem, mesmo sem o usuário perceber conscientemente a técnica.
- Essas entradas disparam **uma única vez** por elemento (não repetem ao rolar para cima e para baixo de novo) — animação repetida infinitamente irrita; animação de "primeira apresentação" impressiona.

### 7.2 Números que contam
- Métricas de destaque (anos de mercado, quantidade de clientes, percentuais) nunca aparecem estáticas: contam de zero até o valor final assim que entram na viewport, usando uma curva de mola suave (não linear) para o incremento — os números desaceleram ao chegar perto do valor final, como um contador físico de verdade. Isso transforma um número simples em um pequeno momento de espetáculo.

### 7.3 Texto com animação própria
Diferentes textos merecem diferentes tratamentos de animação conforme sua importância relativa — não existe um único efeito de "texto chega bonito" aplicado a tudo:
- **Varredura de brilho periódica**: um brilho sutil atravessa o texto e depois descansa por alguns segundos antes de repetir — usado em uma palavra-chave isolada dentro de um título, para puxar o olho sem competir com o resto da cena.
- **Gradiente animado que se move devagar dentro do próprio texto** (cores fluindo de um tom a outro e voltando, num ciclo lento e contínuo) — usado quando a frase inteira precisa parecer "viva" e tecnológica, não estática.
- **Efeito de decodificação/scramble**: o texto nasce como caracteres aleatórios e vai "travando" caractere por caractere até revelar a palavra final — reservado para contextos que quer comunicar "sistema", "dado", "segurança" (usar com moderação, é um efeito forte).
- **Máscara com revelação por palavra**: cada palavra de um título nasce escondida atrás de uma máscara (overflow oculto) e sobe para dentro do lugar com um leve atraso entre cada palavra — dá impacto editorial a uma manchete importante sem depender de cor.
- Todos esses efeitos de texto **respeitam a preferência de "movimento reduzido"** do sistema operacional do usuário — quando o usuário pediu para reduzir animações, a página troca para os estados finais instantaneamente, sem forçar o movimento.

### 7.4 Preenchimento por progresso de leitura
- Linhas do tempo verticais (trilho fino e neutro) recebem uma **segunda linha sobreposta, colorida com a cor de destaque, que se preenche de cima para baixo conforme o usuário rola a página** — ligada diretamente ao progresso de scroll da seção, não a um timer. O usuário literalmente vê seu próprio progresso de leitura materializado como uma barra de energia se enchendo.
- A mesma lógica aparece na barra de progresso de leitura fininha sob a navegação fixa, que cresce da esquerda para a direita conforme a página inteira é rolada.

### 7.5 Elementos que respiram e sinalizam vida ambiente
- Elementos decorativos secundários (selos flutuantes, ícones de contexto) recebem uma oscilação vertical lentíssima e contínua (subir e descer poucos pixels, em ciclos de 5–8 segundos, com atrasos diferentes entre eles) — nunca perfeitamente sincronizados entre si, para não parecer mecânico. Isso simula "vida ambiente" sem exigir atenção do usuário.
- Um céu de partículas (pontos pequenos com opacidades variadas) pode piscar em ciclos lentos e assíncronos como ambientação de fundo em painéis escuros — desde que a posição de cada partícula seja gerada de forma determinística (mesma "semente" sempre), para não haver diferença entre o que o servidor renderiza e o que o navegador mostra (evita o conteúdo "pular" na primeira renderização).

### 7.6 Ícones com entrada física
- Ícones dentro de círculos/quadrados de destaque não aparecem — eles **giram levemente de um ângulo negativo até zero enquanto crescem de uma escala pequena até o tamanho final**, com uma física de mola (leve ultrapassagem e assentamento) em vez de uma curva de tempo suave comum. Esse pequeno exagero físico é o que faz ícones parecerem "encaixando" em vez de só "aparecendo".

### 7.7 Faixas contínuas (marquee) com física real
- Faixas de logos ou conteúdo que rolam infinitamente **não usam um loop de CSS simples com velocidade fixa** — usam um laço de animação por frame que integra velocidade e aplica suavização exponencial. O resultado prático: ao passar o mouse, a faixa desacelera suavemente até quase parar (em vez de travar instantaneamente), e ao tirar o mouse, reacelera com a mesma suavidade. Essa physicalidade sutil é quase imperceptível conscientemente, mas eleva a percepção de qualidade.
- As bordas de uma faixa horizontal são sempre esmaecidas com uma máscara de gradiente (a faixa "nasce" e "morre" no transparente nas pontas), nunca cortadas abruptamente.

### 7.8 Navegação que reage ao cenário
- A barra de navegação fixa **muda de aparência conforme a seção que está passando atrás dela**: larga e sem fundo no topo da página, contraindo para uma "pílula" de vidro fosco (fundo semitransparente + desfoque) depois de um pequeno scroll inicial — e trocando de esquema claro/escuro automaticamente conforme o tom da seção atual embaixo dela, para permanecer sempre legível.
- O item de menu sob o cursor recebe um "fundo" que **desliza fisicamente de um item para o outro** (uma forma compartilhada que se move com física de mola entre posições, em vez de aparecer/desaparecer em cada item) — técnica que faz a navegação parecer um objeto físico único em vez de vários estados independentes.

### 7.9 Parallax discreto, nunca vertiginoso
- Elementos de fundo grandes (uma peça 3D, um efeito de luz) se movem numa fração mínima da velocidade do scroll (deslocamentos de poucos pixels ou poucos por cento, nunca dezenas), criando profundidade sutil sem nunca causar desconforto ou "efeito montanha-russa".

**Regra de transplante**: escolha no máximo 6–8 padrões de movimento reutilizáveis (uma entrada padrão, uma cascata, um contador, 2–3 efeitos de texto, um preenchimento de progresso, uma entrada de ícone) e aplique-os consistentemente em toda a página. Nunca inventar uma animação nova por seção — a repetição do mesmo vocabulário é o que faz o site parecer desenhado por uma mão só.

---

## 8. Composição de grade — variar o ritmo, nunca repetir o mesmo padrão duas vezes seguidas

- **Grades assimétricas em vez de grades uniformes**: uma seção de destaques pode misturar um bloco grande (ocupando 60% da largura e o dobro da altura) com dois blocos menores empilhados ao lado — em vez de quatro quadrados idênticos. A quebra de simetria comunica hierarquia de importância só pela forma.
- **O padrão de grade muda de seção para seção**: se uma seção usa 3 colunas, a próxima que tiver uma grade não deve repetir exatamente 3 colunas iguais — alterna-se a proporção (ex: uma seção com um item grande + dois pequenos, a seguinte com dois exatamente iguais) para a página não parecer "montada com o mesmo template repetido".
- **Colunas fixas (sticky) para títulos guia enquanto o conteúdo relacionado rola ao lado**: em seções com bastante conteúdo lateral (linha do tempo, lista de perguntas), o título e uma frase de contexto ficam fixos numa coluna estreita à esquerda/topo enquanto a coluna de conteúdo mais longa rola por baixo dele — cria uma sensação de "acompanhamento" em vez de o título sumir de vista assim que a seção começa.
- **Layout narrativo em vez de grade de features**: uma lista de funcionalidades pode ser recontada como uma sequência temporal real (os momentos de um dia, os passos de um processo) com marcadores de tempo/etapa junto a cada item, em vez de uma grade neutra de "ícone + título + descrição" sem ordem aparente. Contar uma história é sempre mais memorável que listar atributos.

**Regra de transplante**: antes de repetir uma grade de N colunas pela terceira vez na página, pergunte-se se a variação de ritmo (proporções diferentes, layout narrativo, coluna fixa) contaria a mesma informação de forma mais viva.

---

## 9. Comportamento responsivo — reconstruir, não apenas encolher

- **O mobile não é o desktop espremido** — layouts que fazem sentido em grade horizontal no desktop (ex: quatro cartões lado a lado) são **reconstruídos** no mobile como uma trilha horizontal com deslize (scroll snap), mostrando uma fatia do próximo item na borda da tela para sinalizar "há mais para o lado" sem precisar de texto instrucional. Um indicador de posição (pontinhos, o ativo mais largo que os demais) substitui uma barra de rolagem visível.
- **Cartões com imagem trocam de composição, não só de tamanho**: um cartão que no desktop usa a imagem como fundo cheio com texto sobreposto por cima (com gradiente de legibilidade) vira, no mobile, uma composição empilhada — faixa de imagem no topo em proporção generosa (a interface/produto precisa continuar reconhecível, nunca virar uma textura borrada) e texto abaixo, sobre fundo sólido, sem precisar de gradiente de contraste.
- **Hierarquia tipográfica nunca inverte entre tamanhos de tela**: garanta explicitamente que nenhum título de destaque fique visualmente menor que um subtítulo comum em nenhuma largura — teste os extremos (a menor tela suportada) e ajuste o piso mínimo da escala fluida em vez de deixar o cálculo automático decidir.
- **Área de toque mínima consistente**: qualquer elemento clicável no mobile (link de menu, item de lista, botão) respeita uma altura mínima confortável (na casa de 44–56px), mesmo que isso signifique um espaçamento vertical maior que o "necessário" visualmente — dedos não são cursores de precisão.
- **Botões pareados dividem exatamente a mesma caixa**: quando duas ações (primária e secundária) aparecem lado a lado, ambas compartilham a mesma altura e, no mobile, empilham ocupando a largura toda — nunca um botão maior que o outro sugerindo desequilíbrio não intencional.
- **Respeito às áreas seguras do dispositivo**: conteúdo fixo na borda inferior da tela (barras de ação flutuantes, gavetas de navegação) soma o recorte físico do aparelho (notch, barra de gestos) ao seu espaçamento, em vez de assumir uma tela retangular perfeita.
- **Altura de viewport estável em vez de saltitante**: ao dimensionar painéis de tela cheia no mobile, usa-se a unidade de viewport "pequena/estável" em vez da unidade "dinâmica" que encolhe e cresce com a barra de endereço do navegador aparecendo/sumindo — evita que o layout "pule" a cada rolagem.

**Regra de transplante**: para cada seção com grade horizontal complexa no desktop, desenhe deliberadamente uma versão mobile separada (não confie no `flex-wrap` automático) — pergunte "qual é a melhor forma de contar isso em uma coluna estreita e alta?", não "como faço isso caber?".

---

## 10. Micro-interações e feedback

- **Feedback de hover sempre com transição suave e nunca instantâneo** — mudanças de cor, sombra, posição e escala usam durações curtas mas perceptíveis (150–400ms) com curvas de saída suaves, nunca `transition: none`.
- **Setas e ícones direcionais em botões se deslocam sutilmente no hover** (um pequeno avanço horizontal na direção que apontam) — reforça fisicamente a ideia de "ir para frente" antes mesmo do clique.
- **Zoom sutil em imagens dentro de cartões clicáveis ao passar o mouse** (escala de 100% para ~105%, nunca mais que isso, com transição lenta de ~800-900ms) — rápido demais parece nervoso; essa duração alongada parece cinematográfico.
- **Estado de foco por teclado tratado com o mesmo cuidado do hover de mouse**: um anel de foco visível e de alto contraste, e em componentes com efeitos de hover elaborados (como o holofote que segue cursor), o mesmo efeito é replicado para navegação por teclado (centralizado, já que não há posição de mouse) — acessibilidade não é tratada como uma versão degradada, é uma versão equivalente.
- **Toque em dispositivos móveis sem delay e sem flash cinza padrão do sistema**: remoção do destaque cinza nativo de toque e do atraso de 300ms para duplo-toque em todo elemento clicável, mantendo o gesto de pinça para zoom da página intacto.
- **Seleção de texto com cor de marca**: até o "highlight" de texto selecionado pelo usuário (Ctrl+A / arrastar o mouse) é estilizado com um tom suave da cor de destaque, em vez do azul genérico do sistema operacional — um detalhe que quase ninguém nota conscientemente, mas que contribui para a sensação de "tudo aqui foi desenhado, nada foi deixado no automático".

---

## 11. Iconografia e ilustração

- **Ícones de linha fina (não preenchidos), dentro de um contêiner geométrico próprio** (quadrado ou círculo de cantos arredondados, com fundo sutil e borda quase transparente) — o ícone nunca fica solto no layout; ele sempre "mora" dentro de uma pequena moldura consistente em toda a página.
- **Peso de traço consistente entre todos os ícones da página** (mesma espessura de linha em todos), para não parecer que os ícones vieram de bibliotecas ou estilos diferentes.
- **Ilustrações editoriais (quando usadas) recoloridas para a paleta da marca**, nunca deixadas na cor original de um banco de ilustrações — mesmo um asset de terceiros precisa parecer desenhado para aquela marca específica.
- **Uma marca/monograma bespoke reservada para identidade**, distinta dos ícones funcionais — usada apenas no cabeçalho, rodapé e favicon, nunca misturada com os ícones de conteúdo.

---

## 12. Voz e estrutura do copy (como texto e design trabalham juntos)

- **Título de seção sempre curto e declarativo, nunca uma pergunta genérica de marketing** — afirmações específicas e um pouco ousadas funcionam melhor que perguntas retóricas.
- **Um subtítulo de uma frase apoia cada título**, nunca um parágrafo longo nessa posição — profundidade vem depois, no corpo da seção.
- **Provas sempre quantificadas em uma frase curta**, nunca em parágrafo explicativo longo — "resultado em uma linha" é mais persuasivo que "processo em um parágrafo". Quando o leitor quiser profundidade, ofereça um link para o estudo completo, não force a leitura ali.
- **Placeholder de conteúdo sinalizado explicitamente em comentário no código-fonte** quando um dado real (depoimento, nome, número) ainda não está disponível — nunca inventar uma citação atribuída a uma pessoa fictícia sem sinalizar que é placeholder.
- **Convite de ação (CTA) sempre reaparece ao fim de cada bloco de confiança**: depois de mostrar cases, depois de mostrar depoimentos, no rodapé — a ação de conversão nunca fica só no topo da página esperando o usuário rolar de volta.

---

## 13. Acessibilidade como parte do design, não um adendo

- Toda animação de entrada e todo movimento contínuo é **suprimido automaticamente** quando o sistema do usuário pede "reduzir movimento" — trocando para os estados finais instantâneos, sem quebrar o layout.
- **Textos alternativos descritivos** em toda imagem funcional (não decorativa), e elementos puramente decorativos (partículas, linhas de grade, glows) marcados para serem ignorados por leitores de tela.
- **Contraste de texto verificado nos dois registros de cor** (claro e escuro) — nunca assumir que "branco sobre qualquer fundo escuro funciona"; opacidades de texto secundário são calibradas para permanecerem legíveis mesmo no tom mais claro daquele registro.
- **Todo elemento interativo alcançável e operável por teclado**, incluindo estados de hover elaborados, com um equivalente de foco visível.

---

## 14. Checklist rápido para aplicar isso a um novo projeto

1. Definir 2 registros de cor de fundo (não precisa ser claro/escuro — pode ser duas densidades da mesma paleta) e mapear cada seção da nova página para um dos dois, com propósito narrativo.
2. Escrever, em uma frase, o "trabalho argumentativo" de cada seção antes de desenhar layout.
3. Escolher 3 tamanhos de título + 2 de corpo, com escala fluida (`clamp`) e pisos mínimos testados na menor tela.
4. Escolher 1 cor de destaque única e proibir seu uso como fundo de blocos grandes.
5. Definir o vocabulário de movimento (6–8 padrões reutilizáveis) antes de animar a primeira seção, e aplicá-lo identicamente em toda a página.
6. Para cada grade de conteúdo, desenhar deliberadamente sua versão mobile — nunca deixar o `flex-wrap` decidir sozinho.
7. Garantir que cada cartão/elemento interativo tenha três estados desenhados: repouso, hover, foco por teclado.
8. Revisar o espaçamento vertical entre seções assumindo que o primeiro instinto foi conservador demais — aumentar.
9. Rodar o checklist de `prefers-reduced-motion` e contraste de texto nos dois registros de cor antes de considerar pronto.
