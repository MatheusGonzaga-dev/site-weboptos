export function Stats() {
  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          <div className="stat-item" data-aos="fade-up" data-aos-delay="0">
            <div className="stat-number"><span className="counter" data-target="7">0</span></div>
            <div className="stat-desc">Dias de teste grátis</div>
          </div>
          <div className="stat-item" data-aos="fade-up" data-aos-delay="100">
            <div className="stat-number"><span className="counter" data-target="100">0</span>%</div>
            <div className="stat-desc">Foco em clínicas de visão</div>
          </div>
          <div className="stat-item" data-aos="fade-up" data-aos-delay="200">
            <div className="stat-number stat-number--plain">24/7</div>
            <div className="stat-desc">Acesso na nuvem</div>
          </div>
          <div className="stat-item" data-aos="fade-up" data-aos-delay="300">
            <div className="stat-number stat-number--plain">LGPD</div>
            <div className="stat-desc">Privacidade e segurança</div>
          </div>
        </div>
      </div>
    </section>
  );
}
