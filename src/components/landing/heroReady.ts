/* Sinal único de "palco 3D pronto" compartilhado entre a Hero e o
   PageLoader. Módulo singleton no client: a promise resolve uma vez e
   permanece resolvida em navegações internas subsequentes (o chunk 3D já
   está em cache — o loader não segura a página de novo). */

let resolved = false;
let resolveFn: (() => void) | undefined;

const promise = new Promise<void>((resolve) => {
  resolveFn = resolve;
});

export function markHeroReady() {
  if (resolved) return;
  resolved = true;
  resolveFn?.();
}

export function heroReady(): Promise<void> {
  return promise;
}
