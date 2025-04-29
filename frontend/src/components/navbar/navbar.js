'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './navbar.css';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const navRef = useRef(null);
  const pathname = usePathname();

  const animateSelector = () => {
    const nav = navRef.current;
    const activeItem = nav.querySelector('li.active');
    const selector = nav.querySelector('.hori-selector');

    if (activeItem && selector) {
      const { offsetTop, offsetLeft, offsetHeight, offsetWidth } = activeItem;
      selector.style.top = `${offsetTop}px`;
      selector.style.left = `${offsetLeft}px`;
      selector.style.height = `${offsetHeight}px`;
      selector.style.width = `${offsetWidth}px`;
    }
  };

  useEffect(() => {
    const nav = navRef.current;
    const items = nav.querySelectorAll('li');

    // Remove old active classes
    items.forEach((li) => li.classList.remove('active'));

    // Add active class to current route
    items.forEach((li) => {
      const link = li.querySelector('a');
      if (link && link.getAttribute('href') === pathname) {
        li.classList.add('active');
      }
    });

    animateSelector();

    // Animate on resize
    const handleResize = () => setTimeout(animateSelector, 500);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [pathname]);

  return (
    <nav className="navbar navbar-expand-custom navbar-mainbg">
      <div className="logo">
        <Image src={logo} alt="Logo" width={80} height={80} />
      </div>

      <button
        className="navbar-toggler"
        type="button"
        onClick={() => {
          const collapse = document.getElementById('navbarSupportedContent');
          collapse.style.display = collapse.style.display === 'block' ? 'none' : 'block';
          setTimeout(animateSelector, 300);
        }}
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <i className="fas fa-bars text-white"></i>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent" ref={navRef}>
        <ul className="navbar-nav ml-auto">
          <div className="hori-selector">
            <div className="left"></div>
            <div className="right"></div>
          </div>

          <li className={`nav-item ${pathname === '/home' ? 'active' : ''}`}>
            <Link className="nav-link" href="/" onClick={() => {
    const collapse = document.getElementById('navbarSupportedContent');
    if (window.innerWidth <= 768) collapse.style.display = 'none';
  }}
> 
              <i className="fas fa-home"></i> Home
            </Link>
          </li>

          <li className={`nav-item ${pathname === '/techboard' ? 'active' : ''}`}>
            <Link className="nav-link" href="/techboard" onClick={() => {
    const collapse = document.getElementById('navbarSupportedContent');
    if (window.innerWidth <= 768) collapse.style.display = 'none';
  }}
>
              <i className="fas fa-microchip"></i> Techboard
            </Link>
          </li>

          <li className={`nav-item ${pathname === '/team' ? 'active' : ''}`}>
            <Link className="nav-link" href="/team" onClick={() => {
    const collapse = document.getElementById('navbarSupportedContent');
    if (window.innerWidth <= 768) collapse.style.display = 'none';
  }}
>
              <i className="fas fa-users"></i> Team
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" href="/eventspage" onClick={() => {
    const collapse = document.getElementById('navbarSupportedContent');
    if (window.innerWidth <= 768) collapse.style.display = 'none';
  }}
>
              <i className="fas fa-calendar-check"></i> Events
            </Link>
          </li>

          <li className={`nav-item ${pathname === '/faq' ? 'active' : ''}`}>
            <Link className="nav-link" href="/faq" onClick={() => {
    const collapse = document.getElementById('navbarSupportedContent');
    if (window.innerWidth <= 768) collapse.style.display = 'none';
  }}
>
              <i className="fas fa-question-circle"></i> FAQs
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" href="/profile" onClick={() => {
    const collapse = document.getElementById('navbarSupportedContent');
    if (window.innerWidth <= 768) collapse.style.display = 'none';
  }}
>
              <i className="fas fa-user-circle"></i> Profile
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
