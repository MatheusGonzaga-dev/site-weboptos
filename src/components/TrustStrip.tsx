const ITEMS = [
  'Agenda e calendário',
  'Prontuário eletrônico',
  'Financeiro da clínica',
  'Faturamento e parcerias',
  'Mensagens por WhatsApp',
  'Painel administrativo',
  'Multi-unidade',
  'Relatórios e indicadores',
  'Acesso na nuvem 24/7',
  'LGPD e segurança',
];

export function TrustStrip() {
  return (
    <section className="trust-section">
      <div className="container">
        <p className="trust-label">Um fluxo completo para a sua clínica de visão</p>
        <div className="logos-track">
          <div className="logos-slide">
            {[...ITEMS, ...ITEMS].map((label, i) => (
              <span key={i} className="logo-item">{label}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
