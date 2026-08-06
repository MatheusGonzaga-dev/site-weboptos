/**
 * Manda erro de tela para o backend do WebOptos, que avisa o dev por WhatsApp e abre
 * demanda no painel. Ver docs/demandas-automaticas.md.
 *
 * Aqui dói mais do que parece: esta landing é onde o interessado se cadastra
 * (`/public/onboarding`). Erro de tela aqui é venda perdida em silêncio — o prospect
 * simplesmente vai embora e ninguém fica sabendo que houve uma quebra.
 *
 * Irmão de `src/lib/reportarErro.ts` (ERP), do portal de parcerias e do Site/.
 * ~70 linhas sem dependência: copiar é mais honesto do que montar pacote compartilhado.
 *
 * Não importa `config.ts` de propósito: este módulo existe para relatar quebra, inclusive
 * quebra na resolução de configuração. A cadeia de base é replicada abaixo.
 */

const APP = 'site';

const jaRelatados = new Map<string, number>();
const SILENCIO_MS = 5 * 60_000;

function ehLocal(): boolean {
  if (typeof window === 'undefined') return false;
  const h = window.location.hostname;
  return h === 'localhost' || h === '127.0.0.1';
}

/** Mesma cadeia do apiBaseUrl() em config.ts: window.WEBOPTOS_CONFIG → env → padrão. */
function baseDoBackend(): string {
  try {
    const doWindow = (window as unknown as { WEBOPTOS_CONFIG?: { apiUrl?: string } }).WEBOPTOS_CONFIG;
    if (doWindow?.apiUrl) return String(doWindow.apiUrl).replace(/\/+$/, '');
  } catch {
    /* config ausente não pode impedir o relato */
  }
  const env = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
  if (env) return env.replace(/\/+$/, '');
  return ehLocal() ? 'http://localhost:4000' : 'https://api.weboptos.com.br';
}

function deveRelatar(chave: string): boolean {
  const agora = Date.now();
  const ultimo = jaRelatados.get(chave);
  if (ultimo && agora - ultimo < SILENCIO_MS) return false;
  jaRelatados.set(chave, agora);
  return true;
}

export function reportarErro(origem: string, erro: unknown, detalhe?: string): void {
  try {
    const mensagem = erro instanceof Error ? erro.message : String(erro);
    if (!mensagem) return;

    // Ruído de rede (aba fechando, wifi caindo) não é defeito do sistema.
    if (/failed to fetch|networkerror|load failed/i.test(mensagem)) return;

    const chave = `${origem}|${mensagem}`.slice(0, 200);
    if (!deveRelatar(chave)) return;

    const corpo = JSON.stringify({
      app: APP,
      origem: `${origem} — ${location.pathname}`,
      mensagem,
      detalhe:
        detalhe || (erro instanceof Error ? erro.stack?.split('\n').slice(0, 5).join('\n') : undefined),
    });

    // keepalive: o relato sobrevive à navegação que costuma acontecer logo após o erro.
    void fetch(`${baseDoBackend()}/alertas/frontend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: corpo,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Relatar erro não pode gerar erro.
  }
}

/**
 * Assinaturas de codigo que NAO e nosso. O capturador global pega TUDO que estoura na
 * pagina: navegador embutido de app de celular (Instagram/LinkedIn no iOS injetam um script
 * que fala com o app nativo por `webkit.messageHandlers`), extensao do navegador, tag de
 * marketing. Sem filtro, visitante que abre pelo Instagram vira alerta no WhatsApp do dev e
 * chamado no painel — por um defeito que nao existe e que nao temos como consertar.
 *
 * Foi o caso da demanda #23 (06/08/2026): `sendDataToNative` e `sendPageHideMessage` nao
 * existem em lugar nenhum do repositorio.
 *
 * Gemeo de server/src/lib/ruidoDeTerceiro.ts, que aplica a MESMA regra do lado do servidor —
 * e e o que vale para o bundle antigo que ja esta carregado no navegador do visitante.
 */
const RUIDO_EXTERNO = [
  /webkit\.messageHandlers/i,
  /\bsendDataToNative\b/i,
  /\bsendPageHideMessage\b/i,
  /\b(?:chrome|moz|safari|safari-web|ms-browser)-extension:\/\//i,
  /\bwebkit-masked-url:/i,
];

function ehRuidoDeTerceiro(mensagem: string, pistas: string): boolean {
  const tudo = `${mensagem}\n${pistas}`;
  if (RUIDO_EXTERNO.some((re) => re.test(tudo))) return true;
  // Erro cross-origin opaco: o navegador esconde mensagem, arquivo e linha.
  if (/^script error\.?$/i.test(mensagem.trim())) return true;
  // Nosso codigo e sempre publicado como arquivo .js. Pilha que cita URLs e nenhuma delas e
  // arquivo de script = codigo embutido no documento, ou seja, injetado. So vale quando ha
  // URL para julgar: sem pilha a gente relata, porque perder quebra real e pior.
  if (/https?:\/\/\S+/.test(pistas) && !/\.[mc]?js\b/i.test(pistas)) return true;
  return false;
}

/**
 * Liga a captura global. Chamar uma vez, no boot da aplicacao.
 *
 * O filtro fica AQUI e nao dentro de reportarErro(): chamada manual de reportarErro e nossa
 * por definicao e nunca deve ser descartada. Quem precisa de desconfianca e a captura
 * automatica, que recolhe o que qualquer script da pagina jogar para cima.
 */
export function instalarCapturaDeErros(): void {
  window.addEventListener('error', (ev) => {
    const erro = ev.error;
    const mensagem = erro instanceof Error ? erro.message : String(ev.message || '');
    const pistas = `${ev.filename || ''}\n${erro instanceof Error ? erro.stack || '' : ''}`;
    if (ehRuidoDeTerceiro(mensagem, pistas)) return;
    reportarErro('erro não tratado', erro || ev.message);
  });

  window.addEventListener('unhandledrejection', (ev) => {
    const razao = ev.reason;
    const mensagem = razao instanceof Error ? razao.message : String(razao ?? '');
    const pistas = razao instanceof Error ? razao.stack || '' : '';
    if (ehRuidoDeTerceiro(mensagem, pistas)) return;
    reportarErro('promise rejeitada', razao);
  });
}
