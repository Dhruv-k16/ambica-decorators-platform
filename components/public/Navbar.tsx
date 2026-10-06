'use client';

import { useState } from 'react';

type NavbarProps = {
  onEnquire: () => void;
};

export default function Navbar({ onEnquire }: NavbarProps) {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <header className={`nav-wrap ${open ? 'nav-open' : ''}`}>
      <a className="brand" href="#home" onClick={closeMenu}>
        <img src="/assets/logo-purple.png" alt="Ambica Decorators" />
        <span>
          <b>AMBICA</b>
          <small>DECORATORS</small>
        </span>
      </a>

      <nav id="mainNav">
        <a href="#home" onClick={closeMenu}>Home</a>
        <a href="#about" onClick={closeMenu}>About</a>
        <a href="#services" onClick={closeMenu}>Services</a>
        <a href="#work" onClick={closeMenu}>Our Work</a>
        <a href="#reviews" onClick={closeMenu}>Reviews</a>
        <a href="#locations" onClick={closeMenu}>Locations</a>
        <a href="#contact" onClick={closeMenu}>Contact</a>
      </nav>

      <button
        className="nav-cta"
        type="button"
        onClick={() => {
          closeMenu();
          onEnquire();
        }}
      >
        Enquire Now <span>↗</span>
      </button>

      <button
        className="hamburger"
        type="button"
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? '×' : '☰'}
      </button>
    </header>
  );
}
