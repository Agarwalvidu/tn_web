'use client';
import { useEffect, useRef } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './navbar.css'; // Import the global CSS

const Navbar = () => {
  const navRef = useRef(null);

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
    // Initial animation
    animateSelector();

    // Animate on window resize
    const handleResize = () => setTimeout(animateSelector, 500);
    window.addEventListener('resize', handleResize);

    // Animate on route change or click
    const nav = navRef.current;
    const items = nav.querySelectorAll('li');

    const handleClick = (e) => {
      items.forEach((li) => li.classList.remove('active'));
      e.currentTarget.classList.add('active');
      animateSelector();
    };

    items.forEach((item) => item.addEventListener('click', handleClick));

    // Highlight correct item based on URL
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const links = nav.querySelectorAll('a');
    links.forEach((link) => {
      if (link.getAttribute('href') === currentPath) {
        link.parentElement.classList.add('active');
        animateSelector();
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      items.forEach((item) => item.removeEventListener('click', handleClick));
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-custom navbar-mainbg">
      <a className="navbar-brand navbar-logo" href="#">Navbar</a>
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
          <div className="hori-selector"><div className="left"></div><div className="right"></div></div>
          <li className="nav-item active">
            <a className="nav-link" href="#"><i className="fas fa-tachometer-alt"></i>Dashboard</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#"><i className="far fa-address-book"></i>Address Book</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#"><i className="far fa-clone"></i>Components</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#"><i className="far fa-calendar-alt"></i>Calendar</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#"><i className="far fa-chart-bar"></i>Charts</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#"><i className="far fa-copy"></i>Documents</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
