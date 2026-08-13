# Flauzino — Design System (condensado)

> **Flauzino** é uma *software house* brasileira especializada em sistemas com **reconhecimento facial**, plataformas corporativas e soluções críticas de negócio.

Fonte da verdade para marca e UI de produto. Cobre fundamentos visuais (cor, tipografia, espaçamento, elevação), ativos de marca (brasão/águia), componentes React reutilizáveis e um UI kit de produto (Sentinel).

---

## 1. Essência da marca

Flauzino precisa transmitir **extrema competência, sofisticação técnica e confiabilidade** — uma organização madura o suficiente para responsabilizar-se por sistemas críticos. **Não** é startup experimental, agência criativa ou empresa que persegue modismos. A sensação é de instituição respeitada: competência técnica, tradição, estabilidade, segurança e excelência operacional.

Primeira impressão desejada:
> *"Essa empresa parece extremamente competente."*
> *"Eu confiaria a eles sistemas importantes."*
> *"Aqui há engenharia séria, não só design bonito."*

**Valores centrais:** Competência · Segurança · Tradição · Inovação (evolução inteligente, não experimentação).

**Slogan:** **"Feito para confiar."** — tagline fixa, sentence case, com ponto final, nunca reformulada ou traduzida.

**Arquétipo:** Ruler (Autoridade) + Sage (Especialista), simbolizado pela **Águia** — visão ampla, inteligência, precisão, vigilância, proteção e liderança. Tratamento elegante, minimalista, corporativo (emblema heráldico/institucional). Evitar: águias agressivas, estilo esportivo/militar/gamer, mascotes cartunizados.

---

## 2. Voz e conteúdo

- **Idioma:** português brasileiro; termos técnicos em inglês só quando são padrão de indústria (*dashboard*, *deploy*). Uma língua por frase.
- **Pessoa:** registro neutro-formal. Prefira impessoal ou "nós" para afirmações de capacidade — *"Desenvolvemos sistemas críticos sob medida."* "Você" com moderação em UI de produto.
- **Caixa:** sentence case em títulos e labels. **UPPERCASE só para eyebrows/kickers curtos** (`RECONHECIMENTO FACIAL`, `SEGURANÇA`) com tracking largo. Nunca gritar no corpo do texto.
- **Tom:** declarativo e concreto. Afirme capacidade e resultado, não hype. *"Reconhecimento facial com 99,2% de precisão"* em vez de *"a revolução do futuro"*.
- **Números:** lidere com especificidades verificáveis (uptime, latência, precisão, LGPD). Precisão *é* a marca.
- **Emoji:** nunca, em nenhuma superfície.
- **Proibido:** gíria hacker, gamer, informalidade de startup, marketing com excesso de exclamação. Autoridade calma.

**Exemplos**
- Eyebrow → headline: `PLATAFORMA DE ACESSO` / *"Identidade verificada em menos de 300ms."*
- Botões: *"Iniciar verificação"*, *"Cadastrar rosto"*, *"Ver registros"* — verbo + objeto, sem enfeite.
- Estado vazio: *"Nenhum acesso registrado nas últimas 24 horas."* — factual, frase completa.

---

## 3. Fundamentos visuais

- **Cor:** superfícies claras institucionais (branco / `--slate-50`) carregam a maior parte da UI. **Navy** (`--navy-900/800/700`) é a cor de autoridade para headers, footers, hero panels e seções escuras. **Near-black** (`--ink-900`) para os momentos mais exclusivos/sérios. O **accent azul luminoso** (`#2563EB`) é racionado — links, estados ativos, focus rings, um único indicador-chave por vez. Nunca deve dominar a tela. Cores de status são discretas e institucionais, nunca "candy".
- **Tipografia:** Poppins em tudo. Autoridade vem da **disciplina de peso**: corpo 400, labels/UI 500, headings 600, display 700 (com moderação). Display usa tracking apertado (`-0.015em`); eyebrows usam tracking largo (`0.14em`) + uppercase. IBM Plex Mono para dados, IDs, timestamps, código.
- **Espaçamento/grid:** grid estrito de **4px**. Ritmo previsível e repetido sinaliza rigor de engenharia. Margens externas e padding de seção generosos.
- **Fundos:** superfícies sólidas. **Sem gradientes exagerados, sem glassmorphism, sem neon, sem ruído decorativo.** No máximo uma vinheta sutil navy ou textura fina de grid/blueprint em painéis escuros. Imagens (quando usadas): frias, nítidas, arquitetônicas/tecnológicas, dessaturadas em direção ao navy.
- **Bordas e cards:** cards brancos com hairline **1px `--border-subtle`** (slate-200) e sombra navy suave (`--shadow-sm`/`--shadow-md`). Raios restritos e estruturais (`--radius-md` 8px padrão; `--radius-lg` 12px para painéis grandes). Nada de "tudo em pílula". Inputs usam hairline inset + `--shadow-inset`.
- **Sombras:** suaves, frias, tingidas de navy (não preto puro); usadas para camadas, não drama.
- **Movimento:** medido e confiante. Easing padrão `cubic-bezier(0.4,0,0.2,1)`, duração 120–320ms. **Só fades e translações pequenas (≤8px) — sem bounce, sem spring, sem overshoot.** Respeitar `prefers-reduced-motion`.
- **Hover/press/focus:**
  - Hover: escurecer accent (`--accent` → `--accent-hover`) ou elevar card com `--shadow-md`; sutil, nunca brilhante.
  - Press: aprofundar cor e/ou nudge de 1px; sem mudanças grandes de escala.
  - Focus: sempre visível — ring de 3px `--focus-ring-alpha` (`--ring-focus`).
- **Transparência/blur:** raro; só em scrims de modal (navy ~55% opacidade). Sem UI frosted-glass.

---

## 4. Iconografia

- **Biblioteca:** **Lucide** (lucide.dev), via CDN. Traço 1.5–2px, geométrico, sem preenchimento. Usar 18–24px na UI. *(Substituição — se a Flauzino tiver um set próprio, trocar o Lucide.)*
- **Peso de traço:** consistente em 2px por superfície; não misturar ícones filled e outline.
- **Cor:** herdam `currentColor` — `--text-muted` em repouso, `--accent` só em estado ativo/focado.
- **Emblema:** `assets/flauzino-mark.svg` — águia heráldica fornecida pelo cliente. Monocromática, `currentColor`-driven, escala de 16px a tamanho hero. Usar como app mark/favicon/glyph de lockup. Não recolorir com gradientes nem adicionar efeitos.
- **Emoji/ícones unicode:** nunca.
- **SVG vs raster:** toda iconografia é SVG inline (stroke); sem PNG.

---

## 5. Design tokens

### Cores — Navy (autoridade)
| Token | Valor |
|---|---|
| `--navy-950` | `#080d18` |
| `--navy-900` | `#0b1220` |
| `--navy-800` | `#101a2d` |
| `--navy-700` | `#13213a` |
| `--navy-600` | `#1b2c4d` |
| `--navy-500` | `#25395f` |

### Cores — Ink (near-black, exclusividade)
| Token | Valor |
|---|---|
| `--ink-950` | `#050505` |
| `--ink-900` | `#0a0a0a` |
| `--ink-800` | `#111111` |
| `--ink-700` | `#1a1a1a` |

### Cores — Accent (azul, racionado)
| Token | Valor |
|---|---|
| `--accent-700` | `#1d4ed8` |
| `--accent-600` | `#2563eb` |
| `--accent-500` | `#3b82f6` |
| `--accent-100` | `#dbe6fe` |
| `--accent-050` | `#eef3ff` |

### Cores — Neutro (slate, frio)
| Token | Valor |
|---|---|
| `--white` | `#ffffff` |
| `--slate-50` | `#f6f8fb` |
| `--slate-100` | `#eef2f7` |
| `--slate-200` | `#e1e7ef` |
| `--slate-300` | `#cbd4e1` |
| `--slate-400` | `#9aa7bd` |
| `--slate-500` | `#69788f` |
| `--slate-600` | `#4d5b72` |
| `--slate-700` | `#364152` |
| `--slate-800` | `#232c3a` |
| `--slate-900` | `#151b26` |

### Cores — Semânticas
| Token | Valor |
|---|---|
| `--success-600` / `--success-100` | `#1f7a4d` / `#dcefe4` |
| `--warning-600` / `--warning-100` | `#b07410` / `#f6ecd4` |
| `--danger-600` / `--danger-100` | `#b3261e` / `#f6dcd9` |
| `--info-600` / `--info-100` | = `--accent-600` / `--accent-100` |

### Cores — Alias semânticos (surfaces, texto, bordas)
| Token | Aponta para |
|---|---|
| `--surface-base` | `--slate-50` |
| `--surface-card` / `--surface-raised` | `--white` |
| `--surface-sunken` | `--slate-100` |
| `--surface-inverse` | `--navy-900` |
| `--surface-inverse-2` | `--navy-800` |
| `--surface-ink` | `--ink-900` |
| `--text-strong` | `--navy-900` |
| `--text-body` | `--slate-700` |
| `--text-muted` | `--slate-500` |
| `--text-faint` | `--slate-400` |
| `--text-inverse` | `--white` |
| `--text-inverse-muted` | `#aab6c8` |
| `--text-link` | `--accent-600` |
| `--text-on-accent` | `--white` |
| `--border-subtle` | `--slate-200` |
| `--border-default` | `--slate-300` |
| `--border-strong` | `--slate-400` |
| `--border-inverse` | `rgba(255,255,255,.12)` |
| `--accent` / `--accent-hover` | `--accent-600` / `--accent-700` |
| `--focus-ring` | `--accent-500` |
| `--focus-ring-alpha` | `rgba(59,130,246,.35)` |

### Tipografia
| Token | Valor |
|---|---|
| `--font-sans` / `--font-display` | `"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` |
| `--font-mono` | `"IBM Plex Mono", "SFMono-Regular", ui-monospace, "Cascadia Mono", Menlo, monospace` |
| `--weight-regular / medium / semibold / bold` | `400 / 500 / 600 / 700` |
| `--text-xs` … `--text-4xl` | `0.75rem, 0.875rem, 1rem, 1.125rem, 1.375rem, 1.75rem, 2.25rem, 2.875rem, 3.75rem` |
| `--leading-tight / snug / normal / relaxed` | `1.1 / 1.25 / 1.5 / 1.65` |
| `--tracking-tighter / tight / normal / wide / eyebrow` | `-0.03em / -0.015em / 0em / 0.04em / 0.14em` |
| `--display-weight` | `--weight-semibold` |
| `--display-tracking` | `--tracking-tight` |
| `--heading-weight` | `--weight-semibold` |
| `--body-weight` | `--weight-regular` |
| `--label-weight` | `--weight-medium` |

### Espaçamento (grid 4px)
`--space-0` a `--space-12`: `0, 0.25rem, 0.5rem, 0.75rem, 1rem, 1.5rem, 2rem, 2.5rem, 3rem, 4rem, 5rem, 7rem` (space-1 a space-10 e space-12).

### Raios
| Token | Valor |
|---|---|
| `--radius-xs / sm / md / lg / xl / pill` | `3px / 5px / 8px / 12px / 16px / 999px` |

`--radius-md` (8px) é o padrão; nada de "tudo em pílula".

### Bordas
`--border-thin` 1px · `--border-medium` 1.5px · `--border-thick` 2px

### Containers e controles
| Token | Valor |
|---|---|
| `--container-sm / md / lg / xl` | `640px / 880px / 1120px / 1320px` |
| `--control-sm / md / lg` | `32px / 40px / 48px` |

### Elevação
| Token | Valor |
|---|---|
| `--shadow-xs` | `0 1px 2px rgba(11,18,32,.06)` |
| `--shadow-sm` | `0 1px 3px rgba(11,18,32,.08), 0 1px 2px rgba(11,18,32,.04)` |
| `--shadow-md` | `0 4px 12px rgba(11,18,32,.08), 0 2px 4px rgba(11,18,32,.04)` |
| `--shadow-lg` | `0 12px 28px rgba(11,18,32,.12), 0 4px 8px rgba(11,18,32,.05)` |
| `--shadow-xl` | `0 24px 56px rgba(11,18,32,.16)` |
| `--shadow-inset` | `inset 0 1px 2px rgba(11,18,32,.06)` |
| `--ring-focus` | `0 0 0 3px var(--focus-ring-alpha)` |

### Motion
| Token | Valor |
|---|---|
| `--ease-standard` | `cubic-bezier(0.4,0,0.2,1)` |
| `--ease-out` | `cubic-bezier(0.16,1,0.3,1)` |
| `--ease-in` | `cubic-bezier(0.4,0,1,1)` |
| `--duration-fast / base / slow` | `120ms / 200ms / 320ms` |

---

## 6. Componentes (React, namespace `FlauzinoDesignSystem_b9b227`)

```js
const { Button, Input, Checkbox, Switch, Card, Badge, Avatar, Logo } = window.FlauzinoDesignSystem_b9b227;
```

- **Button** — `variant`: `primary | accent | secondary | ghost | danger` (default `primary`) · `size`: `sm | md | lg` (default `md`) · `block`, `loading`, `iconLeft`, `iconRight`. Navy é a autoridade padrão; `accent` só para a ação mais importante da tela.
- **Input** — `label`, `hint`, `error` (sobrescreve hint), `required`, `icon`. Borda 1px, inset shadow, focus ring visível.
- **Checkbox** — `label`, `description`. Fundo navy, checkmark em accent.
- **Switch** — `label`. Track navy, thumb accent.
- **Card** — `title`, `eyebrow`, `headerAction`, `footer`, `interactive` (hover lift), `flat` (sem sombra), `inverse` (superfície navy, texto claro). Fundo branco, hairline `--border-subtle`, `--shadow-sm`.
- **Badge** — `variant`: `neutral | accent | success | warning | danger | solid` (default `neutral`) · `dot`, `square` (cantos quadrados em vez de pílula).
- **Avatar** — `name` (gera iniciais), `src` (substitui iniciais), `size`: `sm | md | lg` (default `md`) · `status`: `online | away | offline | null`.
- **Logo** — `variant`: `mark | lockup | stacked` (default `lockup`) · `size` (altura do mark em px, default 40), `tagline` (`""` esconde), `color` (default navy). Herda cor via `currentColor`.

---

## 7. UI Kits e ativos

- **Sentinel** (`ui_kits/sentinel/`) — console de controle de acesso por reconhecimento facial: login → dashboard → diretório de identidades, construído com os componentes acima.
- **Website** (`ui_kits/website/`) — site institucional Flauzino: homepage (2 sketches de layout) + página de case Canário Capital.
- **Ativos de marca:** `assets/flauzino-mark.svg` (águia); logos de clientes/integrações em `assets/logos/` (Canário Capital, Máquina Code, UMC, NeLogica, ZapSign).

---

## 8. Ressalvas

- O **brasão da águia é o logo fornecido pelo cliente**, não uma invenção do design system.
- Fontes carregadas via Google Fonts CDN; self-host o `.woff2` em produção.
- Todos os componentes e telas foram **derivados do brief da marca**, não são recriação de um produto Flauzino já existente — alinhar a código/Figma real quando disponível.
- Lucide é uma substituição de ícone (nenhum set foi fornecido no brief); trocar se a Flauzino tiver um set próprio.

---

*Fonte: `design-system - Copia/readme.md`, `_ds_manifest.json` e `.d.ts` dos componentes.*
