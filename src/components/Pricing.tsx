type Props = { onSignup: () => void };

const CHECK = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17l-5-5" stroke="#00d464" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const FEATURES = [
  'Pacientes ilimitados',
  'Prontuário eletrônico completo',
  'Agendamento online e lembretes',
  'WhatsApp automático',
  'Gestão financeira e relatórios',
  'Suporte humanizado',
];

export function Pricing({ onSignup }: Props) {
  return (
    <section className="pricing" id="pricing">
      <div className="container">
        <div className="section-label" data-aos="fade-up">Preço</div>
        <h2 className="section-title" data-aos="fade-up" data-aos-delay="100">
          Um plano, <span className="gradient-text">tudo incluso</span>
        </h2>
        <p className="section-subtitle pricing-lead" data-aos="fade-up" data-aos-delay="200">
          <strong>R$ 99,00 por mês.</strong> Modelo pré-pago: <strong>pagou, usou</strong>. Com a mensalidade em dia você mantém o acesso completo ao sistema. Sem taxas escondidas, sem fidelidade. Teste grátis por 7 dias antes de assinar.
        </p>

        <div className="pricing-grid pricing-grid--single">
          <div className="pricing-card popular" data-aos="fade-up" data-aos-delay="300">
            <div className="popular-badge">Pré-pago</div>
            <div className="plan-name">Weboptos</div>
            <div className="plan-desc">Plano único para sua clínica</div>
            <div className="plan-price">
              <span className="currency">R$</span>
              <span className="amount">99,00</span>
              <span className="period">/mês</span>
            </div>
            <p className="plan-prepaid-note">Cobrança mensal. Enquanto estiver pago, você usa à vontade.</p>
            <ul className="plan-features">
              {FEATURES.map((f) => (
                <li key={f}>{CHECK} {f}</li>
              ))}
            </ul>
            <a
              href="#cadastro"
              className="btn-primary btn-full"
              data-open-signup
              onClick={(e) => { e.preventDefault(); onSignup(); }}
            >
              Começar, teste 7 dias grátis
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
