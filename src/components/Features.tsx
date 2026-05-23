import type { ReactNode } from 'react';

type Feature = {
  icon: ReactNode;
  title: string;
  desc: string;
  tag?: { label: string; cls?: string };
};

const FEATURES: Feature[] = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>
    ),
    title: 'Prontuário Eletrônico',
    desc: 'Histórico completo do paciente com refração, biomicroscopia, retinografia e muito mais. Acesse em qualquer dispositivo, a qualquer hora.',
    tag: { label: 'Mais usado' },
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/></svg>
    ),
    title: 'Agendamento Online',
    desc: 'Pacientes agendam pelo link personalizado 24h/7. Lembretes automáticos por WhatsApp reduzem faltas em até 70%.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2"/></svg>
    ),
    title: 'IA para Diagnóstico',
    desc: 'Inteligência artificial que auxilia na interpretação de resultados e sugere condutas baseadas em evidências científicas atualizadas.',
    tag: { label: 'Novo', cls: 'new' },
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2"/></svg>
    ),
    title: 'Gestão Financeira',
    desc: 'Controle receitas, despesas e repasses com relatórios em tempo real. Integração com boleto, PIX e cartão de crédito.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/></svg>
    ),
    title: 'WhatsApp Automático',
    desc: 'Confirmações, lembretes, envio de prescrição direto a óticas e campanhas de retorno enviadas automaticamente pelo WhatsApp.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    title: 'Relatórios e Analytics',
    desc: 'Dashboards completos com métricas de produtividade, satisfação dos pacientes e projeções de crescimento para sua clínica.',
  },
];

export function Features() {
  return (
    <section className="features" id="features">
      <div className="container">
        <div className="section-label" data-aos="fade-up">Funcionalidades</div>
        <h2 className="section-title" data-aos="fade-up" data-aos-delay="100">
          Tudo que sua clínica precisa,<br />
          <span className="gradient-text">em um só lugar</span>
        </h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="200">
          Do primeiro atendimento ao pós-venda, o Weboptos cobre cada etapa da sua jornada com tecnologia de ponta.
        </p>

        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`feature-card${i === 0 ? ' featured' : ''}`}
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              {f.tag && <div className={`feature-tag${f.tag.cls ? ` ${f.tag.cls}` : ''}`}>{f.tag.label}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
