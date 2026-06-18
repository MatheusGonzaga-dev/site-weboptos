import { useEffect, useRef, useState, type FormEvent } from 'react';
import { formatDoc, isValidCpf, isValidCnpj, formatTelefone, formatCep } from '@/lib/formatters';
import {
  lookupCnpj,
  submitOnboardingAsync,
  loginPainelSession,
  buildSistemaAutologinUrl,
  sistemaLoginUrl,
  type OnboardingJob,
} from '@/lib/onboarding';

type Props = { open: boolean; onClose: () => void };
type Step = 1 | 2 | 3 | 4;

export function SignupModal({ open, onClose }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [docInput, setDocInput] = useState('');
  const [loadingCnpj, setLoadingCnpj] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [razao, setRazao] = useState('');
  const [fantasia, setFantasia] = useState('');
  // Contato + endereço (obrigatórios — exigidos pelo checkout do Asaas). Telefone/CEP em dígitos.
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressJob, setProgressJob] = useState<OnboardingJob | null>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const docDigits = docInput.replace(/\D/g, '');
  const isCpf = docDigits.length <= 11;

  const reset = () => {
    setStep(1);
    setDocInput('');
    setLoadingCnpj(false);
    setManualMode(false);
    setRazao('');
    setFantasia('');
    setTelefone('');
    setCep('');
    setLogradouro('');
    setNumero('');
    setBairro('');
    setCidade('');
    setUf('');
    setBuscandoCep(false);
    setNome('');
    setEmail('');
    setPassword('');
    setShowPassword(false);
    setSubmitting(false);
    setError(null);
    setProgressJob(null);
  };

  useEffect(() => {
    if (!open) return;
    reset();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && step !== 4) handleClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (open && step === 1) {
      const t = window.setTimeout(() => docInputRef.current?.focus(), 50);
      return () => window.clearTimeout(t);
    }
  }, [open, step]);

  const handleClose = () => {
    if (submitting && step === 4) return;
    onClose();
  };

  if (!open) return null;

  const handleDocSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isCpf) {
      if (!isValidCpf(docDigits)) {
        setError('Informe um CPF válido com 11 dígitos.');
        return;
      }
      setError(null);
      setManualMode(true);
      setRazao('');
      setFantasia('');
      setStep(2);
      return;
    }
    if (!isValidCnpj(docDigits)) {
      setError('Informe um CNPJ válido com 14 dígitos.');
      return;
    }
    setError(null);
    setLoadingCnpj(true);
    try {
      const data = await lookupCnpj(docDigits);
      setManualMode(false);
      setRazao(data.razaoSocial);
      setFantasia(data.nomeFantasia || data.razaoSocial);
      if (data.email) setEmail(data.email);
      // Pré-preenche contato/endereço com o que veio da Receita (editável).
      if (data.telefone) setTelefone(data.telefone.replace(/\D/g, '').slice(0, 11));
      const ed = data.endereco;
      if (ed) {
        if (ed.cep) setCep(ed.cep.replace(/\D/g, '').slice(0, 8));
        if (ed.logradouro) setLogradouro(ed.logradouro);
        if (ed.numero) setNumero(ed.numero);
        if (ed.bairro) setBairro(ed.bairro);
        if (ed.municipio) setCidade(ed.municipio);
        if (ed.uf) setUf(ed.uf);
      }
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao consultar CNPJ.');
    } finally {
      setLoadingCnpj(false);
    }
  };

  const enterManualMode = () => {
    setError(null);
    setManualMode(true);
    setRazao('');
    setFantasia('');
    setStep(2);
  };

  const buscarCep = async (digits: string) => {
    if (digits.length !== 8) return;
    setBuscandoCep(true);
    try {
      const r = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const d = (await r.json()) as Record<string, string>;
      if (!d.erro) {
        if (d.logradouro) setLogradouro(d.logradouro);
        if (d.bairro) setBairro(d.bairro);
        if (d.localidade) setCidade(d.localidade);
        if (d.uf) setUf(d.uf);
      }
    } catch {
      /* sem autopreenchimento: usuário digita manualmente */
    } finally {
      setBuscandoCep(false);
    }
  };

  const handleEmpresaNext = (e: FormEvent) => {
    e.preventDefault();
    if (!razao.trim()) {
      setError(isCpf ? 'Informe seu nome completo.' : 'Razão social é obrigatória.');
      return;
    }
    if (telefone.length < 10) {
      setError('Informe um telefone (WhatsApp) com DDD.');
      return;
    }
    if (cep.length !== 8) {
      setError('Informe um CEP válido (8 dígitos).');
      return;
    }
    if (!logradouro.trim()) {
      setError('Informe o logradouro (rua/avenida).');
      return;
    }
    if (!numero.trim()) {
      setError('Informe o número.');
      return;
    }
    if (!bairro.trim()) {
      setError('Informe o bairro.');
      return;
    }
    setError(null);
    setStep(3);
  };

  const handleFinalSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) { setError('Informe o nome do responsável.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError('E-mail inválido.'); return; }
    if (password.length < 8) { setError('Senha com no mínimo 8 caracteres.'); return; }

    setError(null);
    setSubmitting(true);
    setProgressJob(null);
    setStep(4);

    const enderecoPayload = {
      cep,
      logradouro: logradouro.trim(),
      numero: numero.trim(),
      complemento: '',
      bairro: bairro.trim(),
      municipio: cidade.trim(),
      uf: uf.trim().toUpperCase(),
    };

    try {
      await submitOnboardingAsync(
        {
          empresa: {
            cnpj: docDigits,
            tipoPessoa: isCpf ? 'fisica' : 'juridica',
            razaoSocial: razao.trim(),
            nomeFantasia: fantasia.trim() || razao.trim(),
            telefone,
            endereco: enderecoPayload,
          },
          admin: { nome: nome.trim(), email: email.trim().toLowerCase(), senha: password },
        },
        (job) => setProgressJob(job),
      );

      const emailNorm = email.trim().toLowerCase();
      try {
        const session = await loginPainelSession(emailNorm, password);
        const empresaSnap = {
          cnpj: docDigits,
          razaoSocial: razao.trim(),
          nomeFantasia: fantasia.trim() || razao.trim(),
          telefone,
          endereco: enderecoPayload,
        };
        window.location.assign(buildSistemaAutologinUrl(session, empresaSnap));
      } catch (loginErr) {
        console.warn('[onboarding] autologin falhou, indo para login manual:', loginErr);
        window.location.href = sistemaLoginUrl(emailNorm);
      }
    } catch (err) {
      setSubmitting(false);
      setError(err instanceof Error ? err.message : 'Erro ao criar conta.');
      setStep(3);
    }
  };

  return (
    <div
      className="wo-modal-overlay open"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && step !== 4) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="wo-signup-title"
    >
      <div className="wo-modal" onMouseDown={(e) => e.stopPropagation()}>
        {step !== 4 && (
          <button type="button" className="wo-modal-close" aria-label="Fechar" onClick={handleClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        )}

        <h2 id="wo-signup-title">Criar sua conta</h2>
        <p className="wo-modal-sub">Trial 7 dias · Cancele quando quiser</p>

        {step !== 4 && (
          <div className="wo-signup-steps" aria-hidden="true">
            <span className={`wo-signup-step${step >= 1 ? ' active' : ''}`}>1. Empresa</span>
            <span className={`wo-signup-step${step >= 2 ? ' active' : ''}`}>2. Dados</span>
            <span className={`wo-signup-step${step >= 3 ? ' active' : ''}`}>3. Acesso</span>
          </div>
        )}

        {error && <div className="wo-form-error" role="alert">{error}</div>}

        {step === 1 && (
          <form onSubmit={handleDocSubmit} noValidate>
            <div className="wo-field">
              <label htmlFor="wo-doc">CPF ou CNPJ da clínica</label>
              <input
                ref={docInputRef}
                id="wo-doc"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={formatDoc(docDigits)}
                onChange={(e) => setDocInput(e.target.value.replace(/\D/g, '').slice(0, 14))}
                placeholder="000.000.000-00 ou 00.000.000/0001-00"
              />
              <span className="wo-field-hint">
                {isCpf
                  ? 'Cadastro como pessoa física — preenchimento manual dos dados.'
                  : 'Buscamos razão social e endereço na Receita Federal.'}
              </span>
            </div>
            <button
              type="submit"
              className="wo-btn wo-btn-primary wo-btn-block wo-btn-lg"
              disabled={loadingCnpj}
            >
              {loadingCnpj ? 'Consultando…' : 'Continuar'}
            </button>
            {error && !isCpf && docDigits.length === 14 && !loadingCnpj && (
              <button type="button" className="wo-btn wo-btn-ghost wo-btn-block" onClick={enterManualMode} style={{ marginTop: 8 }}>
                Preencher manualmente
              </button>
            )}
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleEmpresaNext} noValidate>
            {manualMode && !isCpf && (
              <p className="wo-warn">CNPJ não localizado na Receita Federal. Preencha os dados manualmente.</p>
            )}
            <div className="wo-field">
              <label htmlFor="wo-razao">{isCpf ? 'Nome completo' : 'Razão social'}</label>
              <input
                id="wo-razao"
                type="text"
                value={razao}
                onChange={(e) => setRazao(e.target.value)}
                placeholder={isCpf ? 'Seu nome como no CPF' : (manualMode ? 'Razão social da empresa' : '')}
                autoFocus={manualMode || isCpf}
              />
            </div>
            <div className="wo-field">
              <label htmlFor="wo-fantasia">{isCpf ? 'Nome da clínica (opcional)' : 'Nome fantasia'}</label>
              <input
                id="wo-fantasia"
                type="text"
                value={fantasia}
                onChange={(e) => setFantasia(e.target.value)}
                placeholder="Como sua clínica é conhecida"
              />
            </div>
            <div className="wo-field">
              <label htmlFor="wo-telefone">Telefone (WhatsApp)</label>
              <input
                id="wo-telefone"
                type="text"
                inputMode="numeric"
                autoComplete="tel"
                value={formatTelefone(telefone)}
                onChange={(e) => setTelefone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div className="wo-field">
              <label htmlFor="wo-cep">CEP</label>
              <input
                id="wo-cep"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                value={formatCep(cep)}
                onChange={(e) => {
                  const d = e.target.value.replace(/\D/g, '').slice(0, 8);
                  setCep(d);
                  if (d.length === 8) void buscarCep(d);
                }}
                placeholder="00000-000"
              />
              {buscandoCep && <span className="wo-field-hint">Buscando endereço…</span>}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div className="wo-field" style={{ flex: 1 }}>
                <label htmlFor="wo-logradouro">Logradouro</label>
                <input id="wo-logradouro" type="text" autoComplete="address-line1" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} placeholder="Rua / Avenida" />
              </div>
              <div className="wo-field" style={{ width: 110 }}>
                <label htmlFor="wo-numero">Número</label>
                <input id="wo-numero" type="text" inputMode="numeric" value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="123" />
              </div>
            </div>
            <div className="wo-field">
              <label htmlFor="wo-bairro">Bairro</label>
              <input id="wo-bairro" type="text" autoComplete="address-level3" value={bairro} onChange={(e) => setBairro(e.target.value)} placeholder="Bairro" />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div className="wo-field" style={{ flex: 1 }}>
                <label htmlFor="wo-cidade">Cidade</label>
                <input id="wo-cidade" type="text" autoComplete="address-level2" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Cidade" />
              </div>
              <div className="wo-field" style={{ width: 90 }}>
                <label htmlFor="wo-uf">UF</label>
                <input id="wo-uf" type="text" maxLength={2} value={uf} onChange={(e) => setUf(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2))} placeholder="SP" />
              </div>
            </div>
            <div className="wo-signup-actions">
              <button type="button" className="wo-btn wo-btn-ghost" onClick={() => { setError(null); setStep(1); }}>Voltar</button>
              <button type="submit" className="wo-btn wo-btn-primary wo-btn-lg wo-flex-1">Próximo</button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleFinalSubmit} noValidate>
            <p className="wo-empresa-resumo">
              <strong>{fantasia || razao}</strong><br />
              <span className="wo-text-muted">{isCpf ? 'CPF' : 'CNPJ'} {formatDoc(docDigits)}</span>
            </p>
            <div className="wo-field">
              <label htmlFor="wo-name">Seu nome (primeiro acesso)</label>
              <input id="wo-name" type="text" autoComplete="name" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Maria Silva" />
            </div>
            <div className="wo-field">
              <label htmlFor="wo-email">E-mail de login</label>
              <input id="wo-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@clinica.com.br" />
            </div>
            <div className="wo-field wo-field-password">
              <label htmlFor="wo-pass">Senha</label>
              <input
                id="wo-pass"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
              />
              <button type="button" aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'} onClick={() => setShowPassword((s) => !s)}>
                {showPassword
                  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-10-7-10-7a17.84 17.84 0 0 1 3.06-4.32M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 7 10 7a17.83 17.83 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" /></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>}
              </button>
            </div>
            <div className="wo-signup-actions">
              <button type="button" className="wo-btn wo-btn-ghost" onClick={() => { setError(null); setStep(2); }} disabled={submitting}>Voltar</button>
              <button type="submit" className="wo-btn wo-btn-primary wo-btn-lg wo-flex-1" disabled={submitting}>
                {submitting ? 'Criando conta…' : 'Criar minha conta'}
              </button>
            </div>
          </form>
        )}

        {step === 4 && (
          <div className="wo-signup-progress">
            <strong>Preparando sua clínica…</strong>
            <span className="wo-text-muted">Isso pode levar até 3 minutos. Estamos criando seu banco de dados privado.</span>
            <div className="wo-progress-bar">
              <div className="wo-progress-bar-fill" style={{ width: `${progressJob?.progress ?? 5}%` }} />
            </div>
            <ul className="wo-progress-list">
              {(progressJob?.steps ?? []).map((s) => {
                const icon = s.state === 'done' ? '✓' : s.state === 'running' ? '◌' : s.state === 'failed' ? '✗' : '·';
                return (
                  <li key={s.key} className={`wo-progress-step ${s.state}`}>
                    <span className="wo-progress-icon">{icon}</span>
                    {s.label}
                  </li>
                );
              })}
            </ul>
            {progressJob?.message && <p className="wo-text-muted wo-progress-msg">{progressJob.message}</p>}
          </div>
        )}

        {step !== 4 && (
          <p className="wo-modal-foot">
            Já tem conta?{' '}
            <button type="button" onClick={() => { window.location.href = sistemaLoginUrl(); }}>
              Entrar no sistema
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
