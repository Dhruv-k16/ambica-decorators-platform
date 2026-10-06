'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type NavbarProps = {
  onEnquire: () => void;
};

export default function Navbar({ onEnquire }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const closeMenu = () => setOpen(false);

  const isPortfolio = pathname === '/portfolio';

  const goToSection = (section: string) => {
    closeMenu();

    if (isPortfolio) {
      router.push(`/#${section}`);
      return;
    }

    const element = document.getElementById(section);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const goHome = () => {
    closeMenu();

    if (pathname === '/') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      return;
    }

    router.push('/');
  };

  const goToPortfolio = () => {
    closeMenu();
    router.push('/portfolio');
  };

  return (
    <header className={`nav-wrap ${open ? 'nav-open' : ''}`}>
      <button
        className="brand"
        type="button"
        onClick={goHome}
        aria-label="Ambica Decorators home"
      >
        <img
          src="/assets/logo-purple.png"
          alt="Ambica Decorators"
        />

        <span>
          <b>AMBICA</b>
          <small>DECORATORS</small>
        </span>
      </button>

      <nav id="mainNav">
        <button type="button" onClick={goHome}>
          Home
        </button>

        <button
          type="button"
          onClick={() => goToSection('about')}
        >
          About
        </button>

        <button
          type="button"
          onClick={() => goToSection('services')}
        >
          Services
        </button>

        <button
          type="button"
          onClick={goToPortfolio}
        >
          Our Work
        </button>

        <button
          type="button"
          onClick={() => goToSection('reviews')}
        >
          Reviews
        </button>

        <button
          type="button"
          onClick={() => goToSection('locations')}
        >
          Locations
        </button>

        <button
          type="button"
          onClick={() => goToSection('contact')}
        >
          Contact
        </button>
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