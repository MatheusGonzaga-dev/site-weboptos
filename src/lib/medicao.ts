/**
 * Contador de visitas e cliques do site, gravado no painel da WebOptos (backend/lib/siteEventos.js).
 *
 * Sem cookie, sem localStorage e sem dado pessoal: manda só o tipo do evento, o botão, a página,
 * o site de onde veio (referrer) e as utm do link. Quem é "visitante único" o painel calcula do
 * lado dele, por dia. Por isso não precisa de banner de cookies.
 *
 * Os cliques são lidos por UM ouvinte no documento: botão novo com `data-open-signup`, link do
 * WhatsApp ou para #pricing já entra na conta sem mexer no componente. Para nomear um botão à
 * mão, ponha `data-evento="nome"` nele.
 *
 * Nada aqui pode quebrar o site: tudo em try/catch e o envio é por sendBeacon (não segura a
 * página nem a navegação para o app depois do cadastro).
 */
import { painelBaseUrl } from './config';

type Tipo =
  | 'visita'
  | 'clique'
  | 'secao'
  | 'cadastro_aberto'
  | 'cadastro_etapa'
  | 'cadastro_enviado'
  | 'cadastro_concluido'
  | 'cadastro_erro';

type Contexto = {
  pagina: string;
  ref: string;
  utm: Record<string, string>;
  gclid?: string;
  fbclid?: string;
};

let contexto: Contexto | null = null;

/** Lido uma vez, na chegada: as utm e o referrer são da entrada, não do clique. */
function lerContexto(): Contexto {
  const q = new URLSearchParams(location.search);
  const utm: Record<string, string> = {};
  for (const k of ['source', 'medium', 'campaign', 'content', 'term']) {
    const v = q.get(`utm_${k}`);
    if (v) utm[k] = v.slice(0, 80);
  }
  return {
    pagina: location.pathname,
    ref: document.referrer || '',
    utm,
    ...(q.get('gclid') ? { gclid: '1' } : {}),
    ...(q.get('fbclid') ? { fbclid: '1' } : {}),
  };
}

function enviar(corpo: string): void {
  const url = `${painelBaseUrl()}/api/public/site-evento`;
  // text/plain não dispara preflight de CORS; o painel lê o JSON do texto.
  const blob = new Blob([corpo], { type: 'text/plain' });
  if (navigator.sendBeacon?.(url, blob)) return;
  void fetch(url, { method: 'POST', body: corpo, keepalive: true, mode: 'no-cors' }).catch(() => {});
}

export function registrarEvento(t: Tipo, alvo?: string): void {
  try {
    if (navigator.webdriver) return; // navegador automatizado (robô, teste)
    if (!contexto) contexto = lerContexto();
    enviar(JSON.stringify({ t, ...(alvo ? { alvo } : {}), ...contexto }));
  } catch {
    /* medir não pode quebrar o site */
  }
}

/** Onde o botão está: o mesmo "Teste grátis" no topo e no preço são cliques diferentes. */
function lugar(el: Element): string {
  if (el.closest('header')) return 'menu';
  if (el.closest('footer')) return 'rodape';
  if (el.closest('.cta-section')) return 'cta';
  const sec = el.closest('section[id]')?.id || '';
  const nomes: Record<string, string> = { home: 'topo', pricing: 'planos', contact: 'contato', features: 'funcionalidades', sistema: 'sistema' };
  return nomes[sec] || sec || 'pagina';
}

export function alvoDoClique(el: Element): string | null {
  const manual = el.getAttribute('data-evento');
  if (manual) return manual;
  const href = el.getAttribute('href') || '';
  const onde = lugar(el);
  if (el.hasAttribute('data-open-signup')) return `teste_gratis_${onde}`;
  if (/wa\.me|whatsapp\.com/i.test(href)) return `whatsapp_${onde}`;
  if (el.closest('.contact-form') && el.getAttribute('type') === 'submit') return 'whatsapp_formulario';
  if (href === '#pricing') return `planos_${onde}`;
  if (href === '#contact') return `contato_${onde}`;
  if (href.startsWith('mailto:')) return `email_${onde}`;
  return null;
}

/** Chamar uma vez, no boot: conta a visita, liga os cliques e avisa quando o preço aparece na tela. */
export function iniciarMedicao(): void {
  try {
    registrarEvento('visita');

    document.addEventListener(
      'click',
      (ev) => {
        try {
          const el = (ev.target as Element | null)?.closest?.('a,button');
          const alvo = el && alvoDoClique(el);
          if (alvo) registrarEvento('clique', alvo);
        } catch {
          /* idem */
        }
      },
      true,
    );

    // "Viu o preço" separa quem desceu até os planos de quem saiu no topo.
    const vigiarSecao = (id: string) => {
      const alvo = document.getElementById(id);
      if (!alvo || !('IntersectionObserver' in window)) return false;
      const obs = new IntersectionObserver((itens) => {
        if (itens.some((i) => i.isIntersecting)) {
          registrarEvento('secao', id);
          obs.disconnect();
        }
      }, { threshold: 0.4 });
      obs.observe(alvo);
      return true;
    };
    // A seção nasce com o React; tenta de novo até ela existir.
    let tentativas = 0;
    const tentar = () => {
      if (!vigiarSecao('pricing') && ++tentativas < 20) window.setTimeout(tentar, 250);
    };
    tentar();
  } catch {
    /* idem */
  }
}
