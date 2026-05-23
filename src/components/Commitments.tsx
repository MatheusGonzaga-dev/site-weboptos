import type { ReactNode } from 'react';

type Item = { icon: ReactNode; title: string; desc: string };

const ITEMS: Item[] = [
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" /></svg>,
    title: 'Fluxo pensado para a clínica',
    desc: 'Telas e processos desenhados para o dia a dia do optometrista: menos cliques, menos retrabalho e mais foco no paciente.',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" /></svg>,
    title: 'Privacidade em primeiro lugar',
    desc: 'Dados de pacientes exigem responsabilidade. Trabalhamos com boas práticas de segurança e conformidade com a LGPD.',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>,
    title: 'Teste sem pressão',
    desc: '7 dias para explorar tudo, sem cartão e sem fidelidade. Você decide se faz sentido para a sua clínica.',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" /><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" /></svg>,
    title: 'Suporte humanizado',
    desc: 'Quando precisar de ajuda, fale com gente que entende o contexto, não só um robô genérico.',
  },
];

export function Commitments() {
  return (
    <section className="commitments" id="diferenciais">
      <div className="container">
        <div className="section-label" data-aos="fade-up">Diferenciais</div>
        <h2 className="section-title" data-aos="fade-up" data-aos-delay="100">
          Tecnologia que acompanha <span className="gradient-text">seu consultório</span>
        </h2>
        <p className="section-subtitle commitments-intro" data-aos="fade-up" data-aos-delay="200">
          Do primeiro contato ao pós-consulta, o Weboptos une agilidade, segurança dos dados e uma experiência pensada para quem cuida da visão todos os dias.
        </p>

        <div className="commitments-grid">
          {ITEMS.map((item, i) => (
            <div key={item.title} className="commitment-card" data-aos="fade-up" data-aos-delay={i * 100}>
              <div className="commitment-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
