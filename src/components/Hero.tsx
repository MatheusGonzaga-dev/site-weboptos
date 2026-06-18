type Props = { onSignup: () => void };

export function Hero({ onSignup }: Props) {
  return (
    <section className="hero" id="home">
      <div className="container hero-grid">
        <div className="hero-content" data-aos="fade-right">
          <h1 className="hero-title">
            O Sistema Mais{' '}
            <span className="gradient-text">Inteligente</span>{' '}
            para Optometrista
          </h1>
          <p className="hero-subtitle">
            Gerencie pacientes, agendamentos, prontuários e financeiro em uma única plataforma. Feito exclusivamente para optometristas que querem crescer.
          </p>
          <div className="hero-actions">
            <a
              href="#cadastro"
              className="btn-primary btn-lg"
              data-open-signup
              onClick={(e) => { e.preventDefault(); onSignup(); }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Teste Grátis por 7 Dias
            </a>
          </div>
          <div className="hero-trust">
            <div className="hero-trust-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
            </div>
            <p className="hero-trust-text">
              <strong>Menos planilha, mais tempo com o paciente.</strong> Agenda, prontuário e financeiro integrados em uma plataforma feita para clínicas de visão.{' '}
              <span className="hero-trust-muted">Teste grátis por 7 dias. Cancele quando quiser.</span>
            </p>
          </div>
        </div>

        <div className="hero-visual" data-aos="fade-left">
          <div className="dashboard-mockup mockup-v2">
            <div className="mockup-bar">
              <div className="dots"><span /><span /><span /></div>
              <div className="mockup-title">Weboptos | Sistema Completo</div>
            </div>

            <div className="mockup-app">
              <aside className="m-side">
                <div className="m-side-brand">
                  <div className="m-brand-logo">OM</div>
                  <div className="m-brand-info">
                    <strong>Instituto Olhar Mais</strong>
                    <span>Administrador</span>
                  </div>
                </div>

                <div className="m-side-unit">
                  <span>Unidade Operacional</span>
                  <strong>Matriz</strong>
                </div>

                <ul className="m-side-menu">
                  <li className="active"><span className="m-ico" />Dashboard</li>
                  <li><span className="m-ico" />Calendário</li>
                  <li><span className="m-ico" />Atendimento</li>
                  <li><span className="m-ico" />Cadastros</li>
                  <li><span className="m-ico" />Financeiro</li>
                  <li><span className="m-ico" />Faturado</li>
                  <li><span className="m-ico" />Relatórios</li>
                </ul>
              </aside>

              <main className="m-main">
                <div className="m-greet">
                  <div className="m-greet-text">
                    <span className="m-greet-tag">PAINEL ADMINISTRATIVO</span>
                    <h3>Boa noite, Matheus <span className="wave" aria-hidden="true">👋</span></h3>
                    <p>Resumo do que está acontecendo hoje na sua unidade.</p>
                  </div>
                  <button className="m-greet-btn" type="button">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Atendimento rápido
                  </button>
                </div>

                <div className="m-kpis">
                  <div className="m-kpi m-kpi--blue">
                    <span className="m-kpi-label">PACIENTES ATIVOS</span>
                    <strong className="m-kpi-value">1.865</strong>
                    <span className="m-kpi-sub">total cadastrado</span>
                    <span className="m-kpi-trend down">▾ 2%</span>
                  </div>
                  <div className="m-kpi">
                    <span className="m-kpi-label">CONSULTAS HOJE</span>
                    <strong className="m-kpi-value">12</strong>
                    <span className="m-kpi-sub">3 em andamento</span>
                    <span className="m-kpi-trend up">▴ 8%</span>
                  </div>
                  <div className="m-kpi">
                    <span className="m-kpi-label">FATURAMENTO</span>
                    <strong className="m-kpi-value">R$ 28,4k</strong>
                    <span className="m-kpi-sub">maio de 2026</span>
                    <span className="m-kpi-trend up">▴ 23%</span>
                  </div>
                  <div className="m-kpi">
                    <span className="m-kpi-label">TAXA CONCLUSÃO</span>
                    <strong className="m-kpi-value">96%</strong>
                    <span className="m-kpi-sub">últimos 30 dias</span>
                    <span className="m-kpi-trend up">▴ 4%</span>
                  </div>
                </div>

                <div className="m-chart">
                  <div className="m-chart-head">
                    <div>
                      <strong>Atendimentos nos últimos 7 dias</strong>
                      <span>Total na semana: 78 atendimentos</span>
                    </div>
                    <div className="m-chart-legend">
                      <span><i className="dot dot--blue" /> Total</span>
                      <span><i className="dot dot--green" /> Concluídas</span>
                    </div>
                  </div>
                  <svg className="m-chart-svg" viewBox="0 0 600 160" preserveAspectRatio="none" aria-hidden="true">
                    <defs>
                      <linearGradient id="wo-area-blue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0066ff" stopOpacity="0.55" />
                        <stop offset="100%" stopColor="#0066ff" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0 120 C 80 70, 140 130, 220 80 C 300 30, 360 100, 440 70 C 500 50, 560 90, 600 60 L 600 160 L 0 160 Z" fill="url(#wo-area-blue)" />
                    <path d="M0 120 C 80 70, 140 130, 220 80 C 300 30, 360 100, 440 70 C 500 50, 560 90, 600 60" fill="none" stroke="#3385ff" strokeWidth="2.2" strokeLinecap="round" />
                    <path d="M0 140 C 80 110, 140 145, 220 115 C 300 90, 360 130, 440 110 C 500 95, 560 120, 600 100" fill="none" stroke="#00d464" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <div className="m-chart-axis">
                    <span>ter</span><span>qua</span><span>qui</span><span>sex</span><span>sáb</span><span>dom</span><span>seg</span>
                  </div>
                </div>
              </main>
            </div>
          </div>

          <div className="float-pill float-pill--ai">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="#00d464" strokeWidth="2.2"/><polyline points="22 4 12 14.01 9 11.01" stroke="#00d464" strokeWidth="2.2"/></svg>
            IA Ativada
          </div>

          <div className="float-pop float-pop--whats">
            <div className="pop-head">
              <span className="pop-tag whats">WhatsApp Local</span>
              <span className="pop-conn">● conectado</span>
            </div>
            <ul className="pop-menu">
              <li className="active">Dashboard</li>
              <li>Conexão</li>
              <li>Log de envios</li>
            </ul>
          </div>

          <div className="float-pop float-pop--receber">
            <div className="pop-head">
              <span className="pop-tag">Contas a Receber</span>
              <span className="pop-pill">+ Adicionar</span>
            </div>
            <div className="pop-stats">
              <div><span>Total</span><strong>R$ 50.196</strong></div>
              <div><span>Recebido</span><strong>R$ 50.196</strong></div>
              <div><span>Vencidos</span><strong>R$ 0,00</strong></div>
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-indicator">
        <div className="scroll-line" />
        <span>scroll</span>
      </div>
    </section>
  );
}
