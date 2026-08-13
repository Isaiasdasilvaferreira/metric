import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import LogoMark from '../ui/LogoMark.jsx';
import { useHeaderScroll } from '../../hooks/useHeaderScroll.js';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useHeaderScroll();
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
      <a href="#inicio" className="brand-link" onClick={closeMenu}>
        <LogoMark small />
      </a>

      <nav className={menuOpen ? 'nav nav--open' : 'nav'}>
        <a href="#inicio" onClick={closeMenu}>Início</a>
        <a href="#sobre" onClick={closeMenu}>A Metric</a>
        <a href="#recursos" onClick={closeMenu}>Recursos</a>
        <a href="#como-funciona" onClick={closeMenu}>Como funciona</a>
        <a href="#professores" onClick={closeMenu}>Perfis</a>
        <a href="#download" onClick={closeMenu}>Baixar app</a>
      </nav>

      <button
        className="menu-button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X /> : <Menu />}
      </button>
    </header>
  );
}

export default Header;
