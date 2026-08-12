const WHATSAPP_NUMBER = "5511950231230";

/** Monta o link do WhatsApp com uma mensagem pré-preenchida contextual ao CTA de origem. */
export function whatsappHref(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
