import { useState } from 'react';

type Props = { onSignup: () => void };

export function Header({ onSignup }: Props) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const handleSignup = (e: React.MouseEvent) => {
    e.preventDefault();
    close();
    onSignup();
  };

  return (
    <header id="header">
      <nav className="nav">
        <a href="#" className="logo">
          <img src="/logo.png" alt="Weboptos Logo" className="logo-img" />
        </a>

        <div className="nav-desktop">
          <ul className="nav-links">
            <li><a href="#features">Funcionalidades</a></li>
            <li><a href="#sistema">O sistema</a></li>
            <li><a href="#pricing">Preço</a></li>
            <li><a href="#diferenciais">Diferenciais</a></li>
            <li><a href="#contact">Contato</a></li>
          </ul>
          <div className="nav-actions">
            <a href="#cadastro" className="btn-primary" data-open-signup onClick={handleSignup}>
              Começar Grátis
            </a>
          </div>
        </div>

        <button
          className="hamburger"
          id="hamburger"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span style={open ? { transform: 'translateY(9px) rotate(45deg)' } : {}} />
          <span style={open ? { opacity: 0 } : {}} />
          <span style={open ? { transform: 'translateY(-9px) rotate(-45deg)' } : {}} />
        </button>
      </nav>

      <div className={`mobile-menu${open ? ' open' : ''}`} id="mobile-menu">
        <ul>
          <li><a href="#features" onClick={close}>Funcionalidades</a></li>
          <li><a href="#sistema" onClick={close}>O sistema</a></li>
          <li><a href="#pricing" onClick={close}>Preço</a></li>
          <li><a href="#diferenciais" onClick={close}>Diferenciais</a></li>
          <li><a href="#contact" onClick={close}>Contato</a></li>
          <li><a href="#cadastro" className="btn-primary" data-open-signup onClick={handleSignup}>Começar Grátis</a></li>
        </ul>
      </div>
    </header>
  );
}
