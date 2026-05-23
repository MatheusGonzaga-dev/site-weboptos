import { apiBaseUrl, sistemaBaseUrl, painelOnly } from './config';

export type CnpjLookup = {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  email?: string;
  telefone?: string;
  endereco?: {
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    municipio?: string;
    uf?: string;
  };
};

export type OnboardingPayload = {
  empresa: {
    cnpj: string;
    tipoPessoa?: 'fisica' | 'juridica';
    razaoSocial: string;
    nomeFantasia?: string;
    telefone?: string;
    endereco?: CnpjLookup['endereco'];
  };
  admin: { nome: string; email: string; senha: string };
};

export type OnboardingStep = {
  key: string;
  label: string;
  state: 'pending' | 'running' | 'done' | 'failed';
};

export type OnboardingJob = {
  id: string;
  status: 'queued' | 'running' | 'ready' | 'failed';
  progress: number;
  current_step: string | null;
  current_step_label: string | null;
  steps: OnboardingStep[];
  message: string;
  error: { code: string; message: string } | null;
  result: OnboardingResult | null;
};

export type OnboardingResult = {
  ok: boolean;
  cliente?: { codigo: string; slug: string };
  admin?: { email: string };
};

export type PainelSession = {
  token: string;
  mode?: string;
  tenant?: { slug?: string; nome?: string; supabase?: { url: string; anonKey: string } };
};

const ERROR_MAP: Record<string, string> = {
  CNPJ_ALREADY_REGISTERED: 'Já existe um cadastro com este CPF/CNPJ.',
  DOCUMENTO_ALREADY_REGISTERED: 'Já existe um cadastro com este CPF/CNPJ.',
  EMAIL_ALREADY_REGISTERED: 'Este e-mail já está em uso.',
  EMAIL_EXISTS_TENANT: 'Este e-mail já está cadastrado em uma clínica.',
  CNPJ_INVALID: 'CNPJ inválido.',
  CPF_INVALID: 'CPF inválido.',
  DOCUMENTO_INVALID: 'CPF ou CNPJ inválido.',
  cnpj_invalid: 'CNPJ inválido. Informe 14 dígitos.',
  cpf_invalid: 'CPF inválido. Informe 11 dígitos.',
  cnpj_not_found: 'CNPJ não encontrado na Receita Federal. Confira os números.',
  cnpj_lookup_failed: 'Serviço de consulta indisponível. Tente de novo em instantes.',
  EMAIL_INVALID: 'E-mail inválido.',
  PASSWORD_TOO_SHORT: 'Senha deve ter no mínimo 8 caracteres.',
  SUPABASE_PROJECT_LIMIT_REACHED: 'Limite de projetos Supabase atingido. Tente novamente mais tarde.',
  SUPABASE_RATE_LIMITED: 'Muitas requisições. Aguarde alguns minutos e tente de novo.',
  too_many_attempts: 'Muitas tentativas. Aguarde e tente novamente.',
  painel_unreachable: 'Servidor do cadastro temporariamente indisponível.',
};

function friendlyError(data: Record<string, unknown>, status: number): string {
  const code = String(data.error || '');
  const detail = String(data.detail || '');
  if (ERROR_MAP[code]) return ERROR_MAP[code];
  if (detail) return detail;
  if (status === 502) return 'Não foi possível conectar ao servidor. Tente novamente.';
  return 'Não foi possível concluir o cadastro.';
}

export async function lookupCnpj(cnpjDigits: string): Promise<CnpjLookup> {
  const res = await fetch(`${apiBaseUrl()}/public/cnpj/${cnpjDigits}`);
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) throw new Error(friendlyError(data, res.status));
  return {
    cnpj: String(data.cnpj || cnpjDigits),
    razaoSocial: String(data.razaoSocial || ''),
    nomeFantasia: String(data.nomeFantasia || data.razaoSocial || ''),
    email: data.email ? String(data.email) : undefined,
    telefone: data.telefone ? String(data.telefone) : undefined,
    endereco: (data.endereco as CnpjLookup['endereco']) || undefined,
  };
}

async function startOnboardingJob(payload: OnboardingPayload): Promise<OnboardingJob> {
  const body = painelOnly() ? { ...payload, painel_only: true } : payload;
  const res = await fetch(`${apiBaseUrl()}/public/onboarding`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok && res.status !== 202) throw new Error(friendlyError(data, res.status));
  return data as unknown as OnboardingJob;
}

async function pollOnboardingJob(
  jobId: string,
  onProgress?: (job: OnboardingJob) => void,
): Promise<OnboardingJob> {
  const interval = 3000;
  const maxMs = 10 * 60 * 1000;
  const started = Date.now();
  let notFoundStreak = 0;

  while (Date.now() - started < maxMs) {
    const res = await fetch(`${apiBaseUrl()}/public/onboarding/jobs/${encodeURIComponent(jobId)}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
    });
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;

    if (res.status === 404 || data.error === 'job_not_found') {
      notFoundStreak += 1;
      if (notFoundStreak >= 3) {
        throw new Error('Sessão de cadastro perdida. Feche e tente criar a conta novamente.');
      }
      await new Promise((r) => setTimeout(r, interval));
      continue;
    }
    if (!res.ok) throw new Error(friendlyError(data, res.status));

    notFoundStreak = 0;
    const job = data as unknown as OnboardingJob;
    if (onProgress && job?.id) onProgress(job);
    if (job.status === 'ready') return job;
    if (job.status === 'failed') throw new Error(job.error?.message || 'Falha no cadastro.');
    await new Promise((r) => setTimeout(r, interval));
  }
  throw new Error('O cadastro está demorando mais que o esperado. Tente novamente em alguns minutos.');
}

export async function submitOnboardingAsync(
  payload: OnboardingPayload,
  onProgress?: (job: OnboardingJob) => void,
): Promise<OnboardingResult> {
  const job = await startOnboardingJob(payload);
  if (onProgress) onProgress(job);
  if (job.status === 'ready' && job.result) return job.result;
  const finished = await pollOnboardingJob(job.id, onProgress);
  if (!finished.result) throw new Error('Cadastro concluído sem dados de retorno.');
  return finished.result;
}

export async function loginPainelSession(email: string, senha: string): Promise<PainelSession> {
  const res = await fetch(`${apiBaseUrl()}/public/onboarding/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim().toLowerCase(), senha }),
  });
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) throw new Error(friendlyError(data, res.status));
  if (!data.token) throw new Error('Não foi possível iniciar a sessão após o cadastro.');
  return data as unknown as PainelSession;
}

function utf8ToBase64Url(json: string): string {
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export type EmpresaSnapshot = {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  telefone?: string;
  endereco?: CnpjLookup['endereco'];
};

export function buildSistemaAutologinUrl(session: PainelSession, empresa?: EmpresaSnapshot): string {
  const payloadObj = {
    ...session,
    ...(empresa?.cnpj ? { empresa } : {}),
  };
  const payload = encodeURIComponent(utf8ToBase64Url(JSON.stringify(payloadObj)));
  return `${sistemaBaseUrl()}/login?cadastro=ok&autologin=1&setup=1#s=${payload}`;
}

export function sistemaLoginUrl(email?: string): string {
  const params = new URLSearchParams({ cadastro: 'ok', setup: '1' });
  if (email) params.set('email', email);
  return `${sistemaBaseUrl()}/login?${params.toString()}`;
}
