type Props = { onSignup: () => void };

export function CTA({ onSignup }: Props) {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-card" data-aos="zoom-in">
          <div className="cta-glow" />
          <div className="section-label">Comece Hoje</div>
          <h2>
            Pronto para transformar<br />
            <span className="gradient-text">sua clínica?</span>
          </h2>
          <p>
            Experimente todas as funções por 7 dias, sem fidelidade. Veja na prática como organizar agenda, prontuário e financeiro em um só lugar.
          </p>
          <div className="cta-actions">
            <a
              href="#cadastro"
              className="btn-primary btn-lg"
              data-open-signup
              onClick={(e) => { e.preventDefault(); onSignup(); }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Começar Grátis, 7 dias
            </a>
            <a href="#contact" className="btn-ghost btn-lg">Falar com especialista</a>
          </div>
          <p className="cta-note">
            <span>Plano de assinatura</span>
            <span>Cancele quando quiser</span>
            <span>Suporte 24 horas</span>
          </p>
        </div>
      </div>
    </section>
  );
}
