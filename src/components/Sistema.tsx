export function Sistema() {
  return (
    <section className="system-showcase" id="sistema">
      <div className="container">
        <div className="section-label" data-aos="fade-up">O sistema</div>
        <h2 className="section-title section-title--center" data-aos="fade-up" data-aos-delay="100">
          O mesmo painel no <span className="gradient-text">computador e no celular</span>
        </h2>
        <p className="section-subtitle system-showcase-lead" data-aos="fade-up" data-aos-delay="200">
          Interface administrativa com visão geral da clínica: <strong>saudação personalizada</strong>, <strong>indicadores em tempo real</strong>, <strong>gráfico de atendimentos</strong>, além de recursos de relacionamento para manter seus pacientes sempre próximos. Tudo responsivo para você consultar de onde estiver.
        </p>
      </div>

      <figure className="system-showcase-frame system-showcase-frame--full" data-aos="fade-up" data-aos-delay="250">
        <img
          src="/assets/dashboard-apresentacao.png"
          alt="Weboptos: painel administrativo em notebook e visão mobile do sistema"
          width={1024}
          height={682}
          loading="lazy"
        />
      </figure>

      <div className="container">
        <ul className="system-showcase-points" data-aos="fade-up" data-aos-delay="300">
          <li>
            <strong>Sistema de relacionamento</strong>
            <span>Mensagens automáticas de aniversário para clientes, lembretes de consulta e comunicação ativa para aumentar retorno.</span>
          </li>
          <li>
            <strong>KPIs e tendências</strong>
            <span>Pacientes ativos, consultas do dia, faturamento e gráfico de atendimentos para decisão rápida no dia a dia.</span>
          </li>
          <li>
            <strong>Criado por optometristas</strong>
            <span>Plataforma desenvolvida por quem vive a rotina da clínica, com selo de qualidade e foco em atendimento profissional.</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
