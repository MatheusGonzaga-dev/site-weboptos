import type { FormEvent } from 'react';

const WHATSAPP = '5511942131306';

export function Contact() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const nome = String(data.get('nome') || '').trim();
    const email = String(data.get('email') || '').trim();
    const wpp = String(data.get('whatsapp') || '').trim();
    const mensagem = String(data.get('mensagem') || '').trim();

    const lines = ['*Contato | Weboptos*', `Nome: ${nome}`, `E-mail: ${email}`];
    if (wpp) lines.push(`WhatsApp: ${wpp}`);
    lines.push('', 'Mensagem:', mensagem || '(sem mensagem)');

    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="contact-grid">
          <div className="contact-info" data-aos="fade-right">
            <div className="section-label">Contato</div>
            <h2>Fale com nossa <span className="gradient-text">equipe</span></h2>
            <p>Nosso time está pronto para tirar suas dúvidas sobre o Weboptos e como começar pelo teste gratuito.</p>

            <div className="contact-items">
              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.06 6.06l1.27-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" /></svg>
                </div>
                <div>
                  <strong>Telefone / WhatsApp</strong>
                  <a href="https://wa.me/5511942131306" target="_blank" rel="noopener noreferrer">(11) 94213-1306</a>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" /><polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" /></svg>
                </div>
                <div>
                  <strong>E-mail</strong>
                  <a href="mailto:weboptoscomercial@gmail.com">weboptoscomercial@gmail.com</a>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-wrap" data-aos="fade-left">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Nome</label>
                  <input type="text" name="nome" placeholder="Seu nome" required />
                </div>
                <div className="form-group">
                  <label>E-mail</label>
                  <input type="email" name="email" placeholder="seu@email.com" required />
                </div>
              </div>
              <div className="form-group">
                <label>WhatsApp</label>
                <input type="tel" name="whatsapp" placeholder="(11) 9 9999-9999" />
              </div>
              <div className="form-group">
                <label>Mensagem</label>
                <textarea name="mensagem" placeholder="Como podemos ajudar?" rows={4} />
              </div>
              <button type="submit" className="btn-primary btn-full">Enviar Mensagem</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
