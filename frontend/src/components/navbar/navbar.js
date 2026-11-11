'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './navbar.css';
import logo from '../../assets/logo.png';
import { getUser, clearAuth } from '../../lib/auth';

const Navbar = () => {
  const navRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user from localStorage (client-side only)
    setUser(getUser());
  }, [pathname]); // Re-check on route change so navbar updates after login/logout

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

  const handleCollapseClose = () => {
    const collapse = document.getElementById('navbarSupportedContent');
    if (window.innerWidth <= 768) collapse.style.display = 'none';
  };

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    router.push('/');
  };

  const isMentee = user?.role === 'mentee';
  const isMentor = user?.role === 'mentor';
  const isAdmin = user?.role === 'admin';

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

          {/* Always visible: Home */}
          <li className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
            <Link className="nav-link" href="/" onClick={handleCollapseClose}>
              <i className="fas fa-home"></i> Home
            </Link>
          </li>

          {/* Always visible: Cohorts */}
          <li className={`nav-item ${pathname === '/cohorts' ? 'active' : ''}`}>
            <Link className="nav-link" href="/cohorts" onClick={handleCollapseClose}>
              <i className="fas fa-layer-group"></i> Cohorts
            </Link>
          </li>

          {/* Always visible: Techboard */}
          <li className={`nav-item ${pathname === '/techboard' ? 'active' : ''}`}>
            <Link className="nav-link" href="/techboard" onClick={handleCollapseClose}>
              <i className="fas fa-microchip"></i> Techboard
            </Link>
          </li>

          {/* Always visible: Leaderboard */}
          <li className={`nav-item ${pathname === '/leaderboard' ? 'active' : ''}`}>
            <Link className="nav-link" href="/leaderboard" onClick={handleCollapseClose}>
              <i className="fa-solid fa-ranking-star"></i> Leaderboard
            </Link>
          </li>

          {/* Always visible: FAQs */}
          <li className={`nav-item ${pathname === '/faq' ? 'active' : ''}`}>
            <Link className="nav-link" href="/faq" onClick={handleCollapseClose}>
              <i className="fas fa-question-circle"></i> FAQs
            </Link>
          </li>

          {/* Mentee only: Dashboard, Profile */}
          {isMentee && (
            <>
              <li className={`nav-item ${pathname === '/dashboard' ? 'active' : ''}`}>
                <Link className="nav-link" href="/dashboard" onClick={handleCollapseClose}>
                  <i className="fas fa-th-large"></i> Dashboard
                </Link>
              </li>
              <li className={`nav-item ${pathname === '/profile' ? 'active' : ''}`}>
                <Link className="nav-link" href="/profile" onClick={handleCollapseClose}>
                  <i className="fas fa-user-circle"></i> Profile
                </Link>
              </li>
            </>
          )}

          {/* Mentor only: Mentor Panel */}
          {isMentor && (
            <li className={`nav-item ${pathname === '/mentor' ? 'active' : ''}`}>
              <Link className="nav-link" href="/mentor" onClick={handleCollapseClose}>
                <i className="fas fa-chalkboard-teacher"></i> Mentor Panel
              </Link>
            </li>
          )}

          {/* Admin only: Admin Panel */}
          {isAdmin && (
            <li className={`nav-item ${pathname === '/admin' ? 'active' : ''}`}>
              <Link className="nav-link" href="/admin" onClick={handleCollapseClose}>
                <i className="fas fa-tachometer-alt"></i> Admin Panel
              </Link>
            </li>
          )}

          {/* Auth section */}
          {user ? (
            <>
              <li className="nav-item d-flex align-items-center px-3" style={{ gap: '8px' }}>
                <span style={{ color: 'rgba(137,178,203,0.9)', fontSize: '0.9rem', fontWeight: 600 }}>
                  <i className="fas fa-user-circle me-1"></i>
                  {user.name}
                </span>
                <span
                  style={{
                    background: isAdmin ? '#e67e22' : isMentor ? '#167F92' : '#296c9e',
                    color: '#fff',
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    textTransform: 'capitalize',
                    fontWeight: 700,
                  }}
                >
                  {user.role}
                </span>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(137,178,203,0.7)', fontWeight: 600 }}
                  onClick={handleLogout}
                >
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </li>
            </>
          ) : (
            <li className={`nav-item ${pathname === '/login' ? 'active' : ''}`}>
              <Link className="nav-link" href="/login" onClick={handleCollapseClose}>
                <i className="fas fa-user"></i> Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
