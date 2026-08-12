"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Check,
  CheckCircle2,
  Loader2,
  Mail,
  Phone,
  Send,
  Users,
  UserRound,
  X,
} from "lucide-react";
import { Wordmark } from "@/components/landing/primitives";
import { api, ApiError } from "@/lib/api";

/* ================================================================== */
/*  Página dedicada de "Solicitar demonstração" — um wizard de         */
/*  perguntas em tom pessoal, uma de cada vez, no mesmo espírito do    */
/*  wizard de cadastro biométrico do totem (EnrollmentWizard): cartão  */
/*  central, barra de passos com ícones e transições de entrada.       */
/* ================================================================== */

const PLANS = [
  { name: "Starter", scope: "Até 5 turmas" },
  { name: "Escola", scope: "Até 20 turmas" },
  { name: "Instituto", scope: "Turmas ilimitadas" },
] as const;

type PlanName = (typeof PLANS)[number]["name"];

function isPlanName(v: string | null): v is PlanName {
  return !!v && PLANS.some((p) => p.name === v);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function onlyDigits(v: string): string {
  return v.replace(/\D/g, "");
}

function maskPhone(v: string): string {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 2) return d.replace(/^(\d{0,2})/, "($1");
  if (d.length <= 6) return d.replace(/^(\d{2})(\d{0,4})/, "($1) $2");
  if (d.length <= 10) return d.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  return d.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}

const STEPS = [
  { key: "name", label: "Você", icon: UserRound },
  { key: "institution", label: "Instituição", icon: Building2 },
  { key: "scope", label: "Porte", icon: Users },
  { key: "contact", label: "Contato", icon: Mail },
] as const;

type StepKey = (typeof STEPS)[number]["key"] | "done";

interface FormState {
  contactName: string;
  institutionName: string;
  studentCount: string;
  plan: PlanName;
  email: string;
  phone: string;
}

const INITIAL: FormState = {
  contactName: "",
  institutionName: "",
  studentCount: "",
  plan: "Escola",
  email: "",
  phone: "",
};

export default function DemonstracaoPage() {
  return (
    <Suspense fallback={null}>
      <DemoWizard />
    </Suspense>
  );
}

function DemoWizard() {
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();

  const [form, setForm] = useState<FormState>(INITIAL);
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const plano = searchParams.get("plano");
    if (isPlanName(plano)) setForm((f) => ({ ...f, plan: plano }));
  }, [searchParams]);

  const step: StepKey = done ? "done" : STEPS[stepIndex].key;
  const firstName = form.contactName.trim().split(/\s+/)[0] || "";

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  function validate(key: StepKey): boolean {
    const next: Record<string, string> = {};
    if (key === "name" && form.contactName.trim().length < 2) {
      next.contactName = "Digite seu nome, com pelo menos duas letras.";
    }
    if (key === "institution" && form.institutionName.trim().length < 2) {
      next.institutionName = "Digite o nome da instituição.";
    }
    if (key === "scope") {
      const count = Number(form.studentCount);
      if (!form.studentCount || !Number.isInteger(count) || count < 1) {
        next.studentCount = "Digite a quantidade de alunos.";
      }
    }
    if (key === "contact") {
      if (!EMAIL_RE.test(form.email.trim())) next.email = "Digite um e-mail válido.";
      const digits = onlyDigits(form.phone);
      if (digits.length !== 10 && digits.length !== 11) {
        next.phone = "Digite um telefone válido, com DDD.";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (!validate(step)) return;
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function goBack() {
    setSubmitError(null);
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  async function submit() {
    if (!validate("contact")) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await api.post("/demo-requests", {
        contactName: form.contactName.trim(),
        institutionName: form.institutionName.trim(),
        studentCount: Number(form.studentCount),
        plan: form.plan,
        email: form.email.trim(),
        phone: onlyDigits(form.phone),
      });
      setDone(true);
    } catch (err) {
      setSubmitError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível enviar agora. Tente novamente em instantes."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[100svh] flex-col bg-canvas px-4 py-5 md:min-h-screen md:px-8 md:py-8">
      {/* topo: marca + voltar */}
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between">
        <Link href="/" className="flex items-center max-lg:py-2.5" aria-label="Visage — início">
          <Wordmark />
        </Link>
        <Link
          href="/"
          aria-label="Voltar ao site"
          className="rounded-lg p-2.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-brand-800 max-sm:-mr-1.5 max-sm:grid max-sm:h-11 max-sm:w-11 max-sm:place-items-center max-sm:rounded-xl max-sm:p-0"
        >
          <X size={20} />
        </Link>
      </div>

      {/* barra de passos */}
      {!done && (
        <div className="mx-auto mt-6 flex w-full max-w-2xl items-center gap-2">
          {STEPS.map((s, i) => {
            const isDone = i < stepIndex;
            const current = i === stepIndex;
            return (
              <div key={s.key} className="flex flex-1 flex-col gap-1.5">
                <div
                  className={`h-1 rounded-full transition-colors duration-300 ${
                    isDone ? "bg-emerald-500" : current ? "bg-brand-600" : "bg-slate-200"
                  }`}
                />
                <span
                  className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.08em] sm:gap-1.5 sm:tracking-[0.12em] ${
                    isDone ? "text-emerald-600" : current ? "text-brand-700" : "text-slate-400"
                  }`}
                >
                  {/* os rótulos cabem: "Instituição", o mais longo, ocupa
                      ~56px dos ~78px de coluna em uma tela de 360. Sem
                      eles o celular via quatro ícones de 12px sem nome e
                      não sabia em que passo estava nem quanto faltava. */}
                  {isDone ? <Check size={12} strokeWidth={3} /> : <s.icon size={12} strokeWidth={2} />}
                  <span className="max-sm:min-w-0 max-sm:truncate">{s.label}</span>
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* conteúdo do passo */}
      <div className="mx-auto flex w-full max-w-2xl flex-1 items-center py-8">
        <div className="w-full">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: reduceMotion ? 0 : 42 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: reduceMotion ? 0 : -42 }}
              transition={{ type: "spring", stiffness: 190, damping: 24 }}
              className="w-full"
            >
              {step === "name" && (
                <StepCard eyebrow="Solicitar demonstração">
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-brand-950 md:text-3xl">
                    Oi! Vamos te guiar até a sua demonstração.
                  </h2>
                  <p className="mt-2 text-[15px] text-slate-500">
                    Para começar, como podemos te chamar?
                  </p>
                  <FieldForm onSubmit={goNext}>
                    <Field icon={UserRound} label="Seu nome" error={errors.contactName}>
                      <input
                        autoFocus
                        value={form.contactName}
                        onChange={(e) => set("contactName", e.target.value)}
                        placeholder="Ex.: Mariana Alves"
                        className={inputCls}
                        maxLength={150}
                      />
                    </Field>
                    <ContinueButton disabled={false} />
                  </FieldForm>
                </StepCard>
              )}

              {step === "institution" && (
                <StepCard eyebrow="Sobre a instituição">
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-brand-950 md:text-3xl">
                    Prazer, {firstName}!
                  </h2>
                  <p className="mt-2 text-[15px] text-slate-500">
                    Qual instituição você representa?
                  </p>
                  <FieldForm onSubmit={goNext}>
                    <Field icon={Building2} label="Nome da instituição" error={errors.institutionName}>
                      <input
                        autoFocus
                        value={form.institutionName}
                        onChange={(e) => set("institutionName", e.target.value)}
                        placeholder="Ex.: Colégio São Bento"
                        className={inputCls}
                        maxLength={200}
                      />
                    </Field>
                    <div className="mt-6 flex flex-col gap-3 lg:flex-row">
                      <BackButton onClick={goBack} />
                      <ContinueButton disabled={false} />
                    </div>
                  </FieldForm>
                </StepCard>
              )}

              {step === "scope" && (
                <StepCard eyebrow="Porte e plano">
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-brand-950 md:text-3xl">
                    E quantos alunos a {form.institutionName.trim() || "instituição"} atende
                    hoje?
                  </h2>
                  <p className="mt-2 text-[15px] text-slate-500">
                    Isso nos ajuda a preparar a demonstração no tamanho certo.
                  </p>
                  <FieldForm onSubmit={goNext}>
                    <Field icon={Users} label="Quantidade de alunos" error={errors.studentCount}>
                      <input
                        autoFocus
                        type="number"
                        inputMode="numeric"
                        min={1}
                        value={form.studentCount}
                        onChange={(e) => set("studentCount", e.target.value)}
                        placeholder="Ex.: 480"
                        className={inputCls}
                      />
                    </Field>

                    <div className="mt-5">
                      <span className="mb-2 block text-sm font-medium text-slate-700">
                        Qual plano parece mais adequado?
                      </span>
                      <div className="space-y-2.5">
                        {PLANS.map((p) => {
                          const active = p.name === form.plan;
                          return (
                            <button
                              key={p.name}
                              type="button"
                              onClick={() => set("plan", p.name)}
                              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all ${
                                active
                                  ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500"
                                  : "border-slate-200 bg-white hover:border-slate-300"
                              }`}
                            >
                              <span
                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                                  active ? "border-brand-600 bg-brand-600" : "border-slate-300"
                                }`}
                              >
                                {active && <Check className="h-3 w-3 text-white" />}
                              </span>
                              <span className="flex-1">
                                <span className="block text-[15px] font-semibold text-brand-950">
                                  {p.name}
                                </span>
                                <span className="block text-sm text-slate-500">{p.scope}</span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 lg:flex-row">
                      <BackButton onClick={goBack} />
                      <ContinueButton disabled={false} />
                    </div>
                  </FieldForm>
                </StepCard>
              )}

              {step === "contact" && (
                <StepCard eyebrow="Por último">
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-brand-950 md:text-3xl">
                    Perfeito. Como a gente fala com você?
                  </h2>
                  <p className="mt-2 text-[15px] text-slate-500">
                    Usamos esses dados só para combinar a sua demonstração.
                  </p>
                  <FieldForm onSubmit={() => void submit()}>
                    <div className="space-y-4">
                      <Field icon={Mail} label="E-mail" error={errors.email}>
                        <input
                          autoFocus
                          type="email"
                          value={form.email}
                          onChange={(e) => set("email", e.target.value)}
                          placeholder="voce@instituicao.edu.br"
                          className={inputCls}
                          maxLength={255}
                        />
                      </Field>
                      <Field icon={Phone} label="Telefone (com DDD)" error={errors.phone}>
                        <input
                          type="tel"
                          inputMode="tel"
                          value={form.phone}
                          onChange={(e) => set("phone", maskPhone(e.target.value))}
                          placeholder="(11) 98888-7777"
                          className={inputCls}
                        />
                      </Field>
                    </div>

                    {submitError && (
                      <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {submitError}
                      </p>
                    )}

                    <div className="mt-6 flex flex-col gap-3 lg:flex-row">
                      <BackButton onClick={goBack} disabled={submitting} />
                      <button
                        type="submit"
                        disabled={submitting}
                        className="group flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 text-base font-semibold text-white shadow-pop transition-all duration-200 hover:bg-brand-700 hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Enviando…
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Enviar solicitação
                          </>
                        )}
                      </button>
                    </div>
                  </FieldForm>
                </StepCard>
              )}

              {step === "done" && (
                <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-card md:p-14">
                  <motion.span
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 280, damping: 15 }}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
                  >
                    <CheckCircle2 className="h-10 w-10" />
                  </motion.span>
                  <h2 className="mt-6 text-3xl font-semibold tracking-tight text-brand-950">
                    Prontinho, {firstName}!
                  </h2>
                  <p className="mt-3 max-w-sm text-balance text-[15px] leading-relaxed text-slate-600">
                    Recebemos sua solicitação e nossa equipe vai entrar em contato pelo
                    e-mail <span className="font-semibold text-brand-900">{form.email.trim()}</span>{" "}
                    em breve.
                  </p>
                  <Link
                    href="/"
                    className="mt-8 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:text-brand-800"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar ao site
                  </Link>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function StepCard({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card md:p-10">
      <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-brand-600">
        {eyebrow}
      </p>
      {children}
    </div>
  );
}

function FieldForm({
  children,
  onSubmit,
}: {
  children: React.ReactNode;
  onSubmit: () => void;
}) {
  return (
    <form
      className="mt-7"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      {children}
    </form>
  );
}

function ContinueButton({ disabled }: { disabled: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="mt-6 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 text-base font-semibold text-white shadow-pop transition-all duration-200 hover:bg-brand-700 hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-60 lg:flex-1"
    >
      Continuar
    </button>
  );
}

function BackButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 text-base font-semibold text-slate-600 transition-colors hover:border-slate-400 hover:bg-slate-100 disabled:opacity-60 lg:flex-none lg:px-6"
    >
      <ArrowLeft size={18} /> Voltar
    </button>
  );
}

/* 16px no celular não é escolha estética: abaixo disso o Safari do iOS
   dá zoom sozinho ao focar o campo, o layout salta e o usuário precisa
   fazer pinça para voltar. É o bug de formulário mais comum em mobile.
   De 640px para cima volta aos 15px de sempre. */
const inputCls =
  "w-full bg-transparent text-[16px] text-slate-900 placeholder:text-slate-400 focus:outline-none max-sm:self-stretch sm:text-[15px]";

function Field({
  icon: Icon,
  label,
  error,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      <span
        /* no celular o py sai e o input estica para os 52px inteiros: sem
           isso a caixa tem 52px mas o campo em si só ocupa 26px no meio
           dela, e metade dos toques cai fora do controle */
        className={`flex min-h-[3.25rem] items-center gap-2.5 rounded-xl border bg-white px-3.5 py-3 transition-colors focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 max-sm:py-0 sm:min-h-0 ${
          error ? "border-red-300" : "border-slate-300"
        }`}
      >
        <Icon className="h-[18px] w-[18px] shrink-0 text-slate-400 sm:h-4 sm:w-4" />
        {children}
      </span>
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
